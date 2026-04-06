import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Loader2, ChevronRight, ChevronLeft, 
  Wallet, Building2, Bitcoin, CreditCard, CircleDollarSign, 
  Lock, X, User, ShieldCheck, Copy, Upload, Search, Maximize2, ChevronDown,
  MapPin, Landmark, Hash, UserCircle
} from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import { QRCodeSVG } from 'qrcode.react';

import { useNotifications } from '../contexts/NotificationContext';
import { useToast } from '../contexts/ToastContext';

const CRYPTO_METHODS = [
  { id: 'btc', name: 'BTC (BTC)', address: '1E9udYaT8fcZT1645APAS5swjhE4mAV7d4' },
  { id: 'eth', name: 'ETH (ERC20)', address: '0x77738150ee3729ec4c24cfe12b1ab4d7aed09cdd' },
  { id: 'usdt-trc20', name: 'USDT (TRC20)', address: 'TLYeM2xrG92fs15Hx7tujj56Fgq2i5g9sZ' },
  { id: 'usdt-erc20', name: 'USDT (ERC20)', address: '0x77738150ee3729ec4c24cfe12b1ab4d7aed09cdd' },
  { id: 'sol', name: 'SOL (SOL)', address: 'GthGimGtZdH6JiwFGKoERW9NgFRLcXxFBiC9qg8bvo6S' },
];

const PAYMENT_METHODS = [
  { id: 'wallet', name: 'Wallet Balance', icon: Wallet, tag: 'NEW', description: 'Pay using your account balance' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, description: 'Direct bank wire transfer' },
  { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin, description: 'USDT, BTC, ETH, SOL' },
  { id: 'card', name: 'Card Payment', icon: CreditCard, description: 'Visa, Mastercard, Maestro' },
  { id: 'paypal', name: 'paypal', icon: CircleDollarSign, description: 'Fast and secure checkout' },
];

const COUNTDOWN_KEY = 'payment_countdown_end';
const COUNTDOWN_DURATION = 45 * 60; // 45 minutes in seconds
const EXCHANGE_RATE = 1500; // 1 USD = 1500 NGN (Black market rate)

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { title, priceValue } = location.state || { title: 'Investment', priceValue: 0 };

  const { addNotification } = useNotifications();
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [bankTab, setBankTab] = useState<'NGN' | 'USD'>('NGN');
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_METHODS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isQREnlarged, setIsQREnlarged] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    billing: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for responsive font sizing and formatting
  const formatAmount = (amount: number, currency: 'USD' | 'NGN') => {
    const symbol = currency === 'USD' ? '$' : '₦';
    if (amount >= 10000000) { // 10M+
      return `${symbol}${(amount / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getResponsiveFontSize = (amount: number, isPrimary: boolean = true) => {
    const str = amount.toLocaleString();
    const len = str.length;
    
    if (isPrimary) {
      if (len > 12) return 'text-xl md:text-2xl';
      if (len > 9) return 'text-2xl md:text-3xl';
      return 'text-3xl md:text-4xl';
    } else {
      if (len > 14) return 'text-sm md:text-base';
      if (len > 11) return 'text-base md:text-lg';
      return 'text-lg md:text-xl';
    }
  };

  // Countdown Timer Logic
  useEffect(() => {
    // Reset payment flow on mount (refresh)
    localStorage.removeItem(COUNTDOWN_KEY);
    setIsProcessing(false);
    setIsSuccess(false);
    setTimeLeft(null);
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) {
        setIsProcessing(false);
        localStorage.removeItem(COUNTDOWN_KEY);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setIsProcessing(false);
          localStorage.removeItem(COUNTDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, id: string = 'default') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied successfully');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
      setProofUploaded(true);
    }
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeLeft(COUNTDOWN_DURATION);

    // Generate Tickets and Notifications
    const serviceInfo = location.state?.investmentService || 
                        location.state?.mentorshipService || 
                        location.state?.signalService || 
                        location.state?.evaluationService || 
                        location.state?.accountManagementService;
    
    if (serviceInfo) {
      const serviceName = serviceInfo.title || serviceInfo.name || 'Service';
      const amount = serviceInfo.amount || serviceInfo.price || priceValue || 0;
      const plan = serviceInfo.title || serviceInfo.name || 'Standard Plan';
      
      // Add Notifications
      addNotification(`Subscription successful: ${serviceName}`);
      
      // Save Ticket to localStorage
      const existingTickets = JSON.parse(localStorage.getItem('owambe_tickets') || '[]');
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // Default 30 days

      const serviceTicket = {
        id: Math.random().toString(36).substring(2, 9),
        subject: `Service Activation: ${serviceName}`,
        category: 'Service',
        status: 'Pending',
        message: `Subscription for ${serviceName} (${plan}) is awaiting activation.`,
        createdAt: new Date().toISOString(),
        serviceType: serviceName,
        plan: plan,
        amount: amount,
        expiryDate: expiryDate.toISOString()
      };

      localStorage.setItem('owambe_tickets', JSON.stringify([serviceTicket, ...existingTickets]));
      
      // Save Transaction to localStorage
      const existingTransactions = JSON.parse(localStorage.getItem('owambe_transactions') || '[]');
      const newTransaction = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'Subscription',
        serviceName: serviceName,
        amount: `-$${amount}`,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('owambe_transactions', JSON.stringify([newTransaction, ...existingTransactions]));

      // Simulate processing for a few seconds then show success
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 3000);
    } else {
      // Fallback if no service info
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 3000);
    }
  };

  const getDashboardRedirect = () => {
    if (location.state?.investmentService) return '/activities/investment';
    if (location.state?.mentorshipService) return '/activities/mentorship';
    if (location.state?.signalService) return '/activities/signals';
    if (location.state?.evaluationService) return '/activities/evaluation';
    if (location.state?.accountManagementService) return '/activities/account-management';
    return '/assets';
  };

  const renderUploadProof = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Proof of Payment</label>
        {proofUploaded && (
          <span className="text-[10px] font-bold text-success flex items-center gap-1">
            <CheckCircle2 size={12} /> Uploaded
          </span>
        )}
      </div>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center gap-3 ${
          proofUploaded ? 'border-success/30 bg-success/5' : 'border-white/10 hover:border-brand-primary/30 hover:bg-white/5'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          proofUploaded ? 'bg-success/20 text-success' : 'bg-white/5 text-gray-500 group-hover:text-brand-primary'
        }`}>
          <Upload size={24} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white mb-1">
            {proofFile ? proofFile.name : 'Click to upload screenshot'}
          </p>
          <p className="text-xs text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
        </div>
      </div>

      <button
        onClick={handleCompletePayment}
        disabled={!proofUploaded}
        className="w-full py-4 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,162,0,0.3)]"
      >
        Submit Payment Proof <ChevronRight size={18} />
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-success/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center relative z-10">
          <CheckCircle2 size={56} />
        </div>
      </div>
      <h2 className="text-3xl font-serif font-bold text-white mb-4">Payment Submitted!</h2>
      <p className="text-gray-400 max-w-xs mx-auto mb-10">
        Your payment request is being processed. You will be notified once it's approved.
      </p>
      <button
        onClick={() => navigate(getDashboardRedirect())}
        className="px-10 py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold transition-all border border-brand-primary/20 shadow-lg shadow-brand-primary/20"
      >
        View Your Dashboard
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-bg-secondary border border-border-base rounded-[40px] p-8 md:p-12 max-w-md w-full text-center space-y-8 shadow-2xl"
      >
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-full h-full bg-bg-primary border-2 border-brand-primary rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(255,162,0,0.3)]">
            <Loader2 size={48} className="text-brand-primary animate-spin" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-serif font-bold text-text-primary">Processing Payment...</h3>
          <div className="text-4xl font-mono font-bold text-brand-primary tracking-tighter">
            {timeLeft !== null ? formatTime(timeLeft) : '44:59'}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Please wait while we verify your payment. This usually takes 10-45 minutes.
          </p>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
            <p className="text-yellow-500 text-xs font-bold">
              Do not close this page or refresh.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(getDashboardRedirect())}
          className="w-full py-4 bg-brand-primary text-bg-primary rounded-2xl font-bold transition-all border border-brand-primary/20 text-sm shadow-lg shadow-brand-primary/20"
        >
          View Your Dashboard
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center py-8 px-4 md:pt-24 md:pb-12">
      <div className="hidden md:block">
        <StickyHeader title="Choose Your Secure Payment Method" />
      </div>
      
      <div className="max-w-6xl w-full mx-auto">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-text-primary text-center mb-8">Choose Your Secure Payment Method</h2>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              {renderSuccess()}
            </motion.div>
          ) : (
            <>
              {isProcessing && renderProcessing()}
              
              {/* Payment Summary Card */}
              <div className="w-full max-w-xl mx-auto mb-6">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg-secondary border border-border-base rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wallet size={80} className="text-text-primary" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] mb-1">Total to Pay</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`font-mono font-black text-text-primary ${getResponsiveFontSize(priceValue)}`}>
                          {formatAmount(priceValue, 'USD')}
                        </span>
                        <span className="text-text-muted text-xs font-bold">USD</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] mb-1">Service</p>
                      <p className="text-xs font-medium text-text-secondary max-w-[150px] truncate">{title}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                {/* Left Column: Payment Methods */}
                <div className={`w-full md:w-80 shrink-0 space-y-3 ${selectedMethod && 'hidden md:block'}`}>
                  <h3 className="hidden md:block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-2">Select Method</h3>
                  <div className="space-y-2 px-2 md:px-0">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl transition-all relative group border ${
                          selectedMethod === method.id 
                            ? 'bg-brand-primary border-brand-primary text-bg-primary font-bold shadow-lg shadow-brand-primary/20' 
                            : 'bg-bg-secondary border-border-base text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedMethod === method.id ? 'bg-bg-primary/10 text-bg-primary' : 'bg-bg-primary text-brand-primary group-hover:text-brand-primary'
                        }`}>
                          <method.icon size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{method.name}</span>
                            {method.tag && (
                              <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                                selectedMethod === method.id ? 'bg-bg-primary/20 text-bg-primary' : 'bg-brand-primary/10 text-brand-primary'
                              }`}>
                                {method.tag}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] ${selectedMethod === method.id ? 'text-bg-primary/60' : 'text-text-muted'}`}>
                            {method.description}
                          </p>
                        </div>
                        {selectedMethod === method.id && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 w-1 h-6 bg-bg-primary rounded-r-full"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Bottom Buttons */}
                  <div className="md:hidden pt-6 pb-4 space-y-3 px-2 flex flex-col items-center">
                    <button 
                      onClick={() => navigate(-1)}
                      className="w-full max-w-xs py-3 flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary transition-colors border border-border-base rounded-2xl font-bold text-sm"
                    >
                      <X size={18} /> Cancel Payment
                    </button>
                    <div className="flex items-center justify-center gap-2 text-brand-primary text-[10px] uppercase tracking-widest font-bold py-2">
                      <Lock size={14} /> Secured Payment
                    </div>
                  </div>
                </div>

                {/* Right Column: Content Area */}
                <div className={`flex-1 w-full flex justify-center px-2 md:px-0 ${!selectedMethod && 'hidden md:flex'}`}>
                  <div className="w-full max-w-xl">
                    <AnimatePresence mode="wait">
                      {selectedMethod ? (
                        <motion.div
                          key={selectedMethod}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-bg-secondary border border-border-base rounded-[32px] p-6 md:p-10 relative overflow-hidden shadow-2xl"
                        >
                          {/* Mobile Back Button */}
                          <button 
                            onClick={() => setSelectedMethod(null)}
                            className="md:hidden mb-6 text-sm text-brand-primary flex items-center gap-1 font-bold"
                          >
                            <ChevronLeft size={16} /> Back to methods
                          </button>

                          <div className="space-y-8">
                            {/* 1. WALLET BALANCE */}
                            {selectedMethod === 'wallet' && (
                              <div className="space-y-8 py-4 text-center">
                                <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Wallet size={40} />
                                </div>
                                <div className="space-y-2">
                                  <p className="text-text-muted text-xs uppercase tracking-widest font-bold">Available Balance</p>
                                  <h4 className="text-4xl font-serif font-bold text-text-primary">$0.00</h4>
                                </div>
                                <div className="bg-bg-primary rounded-2xl p-6 border border-border-base">
                                  <p className="text-text-secondary text-sm">Insufficient balance to complete this transaction.</p>
                                  <button 
                                    onClick={() => navigate('/deposit-funds')}
                                    className="mt-4 text-brand-primary font-bold text-sm hover:underline"
                                  >
                                    Deposit Funds First
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 2. BANK TRANSFER */}
                            {selectedMethod === 'bank' && (
                              <div className="space-y-6">
                                <div className="flex p-1 bg-bg-primary rounded-xl mb-6">
                                  <button
                                    onClick={() => setBankTab('NGN')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${bankTab === 'NGN' ? 'bg-brand-primary text-bg-primary shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                                  >
                                    NGN Transfer
                                  </button>
                                  <button
                                    onClick={() => setBankTab('USD')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${bankTab === 'USD' ? 'bg-brand-primary text-bg-primary shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                                  >
                                    USD Transfer
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {bankTab === 'NGN' ? (
                                    <div className="bg-bg-primary border border-border-base rounded-3xl p-6 shadow-sm space-y-4">
                                      <div className="py-3 px-1 border-b border-border-base mb-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                          <div className="flex items-baseline gap-1.5">
                                            <span className={`font-mono font-semibold text-text-primary transition-all duration-300 ${getResponsiveFontSize(priceValue, true)}`}>
                                              {formatAmount(priceValue, 'USD')}
                                            </span>
                                            <span className="text-[9px] text-text-muted font-bold uppercase">USD</span>
                                          </div>
                                          <span className="text-text-muted hidden sm:block text-sm">/</span>
                                          <div className="flex items-baseline gap-1.5">
                                            <span className={`font-mono font-medium text-brand-primary/80 transition-all duration-300 ${getResponsiveFontSize(priceValue * EXCHANGE_RATE, false)}`}>
                                              {formatAmount(priceValue * EXCHANGE_RATE, 'NGN')}
                                            </span>
                                            <span className="text-[9px] text-brand-primary/40 font-bold uppercase">NGN</span>
                                          </div>
                                        </div>
                                        <p className="text-[8px] text-text-muted mt-2 text-center italic">Rate: 1 USD = ₦{EXCHANGE_RATE.toLocaleString()}</p>
                                      </div>
                                      <div className="flex justify-between items-center border-b border-border-base pb-4">
                                        <div>
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Account Name</p>
                                          <p className="text-text-primary font-bold">Owambe Traders Global</p>
                                        </div>
                                        <UserCircle size={20} className="text-brand-primary" />
                                      </div>
                                      <div className="flex justify-between items-center border-b border-border-base pb-4">
                                        <div className="flex-1">
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Account Number</p>
                                          <p className="text-text-primary font-mono font-bold text-xl tracking-tight">6112121724</p>
                                        </div>
                                        <button onClick={() => handleCopy('6112121724', 'ngn-acc')} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                                          {copiedId === 'ngn-acc' ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
                                        </button>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Bank Name</p>
                                          <p className="text-text-primary font-bold">Opay (Paycom)</p>
                                        </div>
                                        <Landmark size={20} className="text-brand-primary" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-bg-primary border border-border-base rounded-3xl p-6 shadow-sm space-y-4">
                                      <div className="py-2 px-1 border-b border-border-base mb-2 flex items-center justify-between flex-wrap gap-2">
                                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Amount Due</p>
                                        <div className="flex items-baseline gap-1.5">
                                          <span className={`font-mono font-semibold text-text-primary transition-all duration-300 ${getResponsiveFontSize(priceValue, false)}`}>
                                            {formatAmount(priceValue, 'USD')}
                                          </span>
                                          <span className="text-[9px] text-text-muted font-bold uppercase">USD</span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center border-b border-border-base pb-4">
                                        <div>
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Account Name</p>
                                          <p className="text-text-primary font-bold">Joshua Jerome Isaac</p>
                                        </div>
                                        <UserCircle size={20} className="text-brand-primary" />
                                      </div>
                                      <div className="flex justify-between items-center border-b border-border-base pb-4">
                                        <div className="flex-1">
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Account Number</p>
                                          <p className="text-text-primary font-mono font-bold text-xl tracking-tight">217575484680</p>
                                        </div>
                                        <button onClick={() => handleCopy('217575484680', 'usd-acc')} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                                          {copiedId === 'usd-acc' ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
                                        </button>
                                      </div>
                                      <div className="flex justify-between items-center border-b border-border-base pb-4">
                                        <div className="flex-1">
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Routing Number</p>
                                          <p className="text-text-primary font-mono font-bold text-xl tracking-tight">101019644</p>
                                        </div>
                                        <button onClick={() => handleCopy('101019644', 'usd-routing')} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                                          {copiedId === 'usd-routing' ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 border-b border-border-base pb-4">
                                        <div>
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Bank Name</p>
                                          <p className="text-text-primary font-bold text-sm">Lead Bank</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Account Type</p>
                                          <p className="text-text-primary font-bold text-sm">Personal Checking</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Bank Address</p>
                                        <p className="text-text-primary text-[11px] leading-relaxed">9450 Southwest Gemini Drive, Beaverton, OR, 97008, USA</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {renderUploadProof()}
                              </div>
                            )}

                          {/* 3. CRYPTO */}
                          {selectedMethod === 'crypto' && (
                            <div className="space-y-6">
                              <div className="py-2 px-1 border-b border-border-base mb-2 flex items-center justify-between flex-wrap gap-2">
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Amount Due</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className={`font-mono font-semibold text-text-primary transition-all duration-300 ${getResponsiveFontSize(priceValue, false)}`}>
                                    {formatAmount(priceValue, 'USD')}
                                  </span>
                                  <span className="text-[9px] text-text-muted font-bold uppercase">USD</span>
                                </div>
                              </div>
                              <div className="relative">
                                <select
                                  value={selectedCrypto.id}
                                  onChange={(e) => setSelectedCrypto(CRYPTO_METHODS.find(m => m.id === e.target.value)!)}
                                  className="w-full bg-bg-primary border border-border-base rounded-2xl px-4 py-4 text-text-primary appearance-none focus:outline-none focus:border-brand-primary font-bold text-sm"
                                >
                                  {CRYPTO_METHODS.map(m => (
                                    <option key={m.id} value={m.id} className="bg-bg-primary">{m.name}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={20} />
                              </div>

                              <div className="flex flex-col items-center gap-6 p-6 bg-bg-primary rounded-3xl border border-border-base">
                                <div 
                                  className="p-4 bg-white rounded-2xl shadow-xl cursor-pointer relative group"
                                  onClick={() => setIsQREnlarged(true)}
                                >
                                  <QRCodeSVG value={selectedCrypto.address} size={160} />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                    <Maximize2 className="text-white" size={32} />
                                  </div>
                                </div>
                                
                                <div className="w-full space-y-2">
                                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">Wallet Address</p>
                                  <div className="flex items-center gap-2 bg-bg-secondary rounded-xl p-2 border border-border-base">
                                    <input 
                                      readOnly 
                                      value={selectedCrypto.address} 
                                      className="flex-1 bg-transparent border-none text-text-secondary font-mono text-[10px] focus:outline-none px-2"
                                    />
                                    <button
                                      onClick={() => handleCopy(selectedCrypto.address, 'crypto-addr')}
                                      className="p-3 rounded-lg bg-brand-primary text-bg-primary hover:bg-brand-secondary transition-colors"
                                    >
                                      {copiedId === 'crypto-addr' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {renderUploadProof()}
                            </div>
                          )}

                          {/* 4. CARD PAYMENT */}
                          {selectedMethod === 'card' && (
                            <div className="space-y-6">
                              <div className="py-2 px-1 border-b border-border-base mb-2 flex items-center justify-between flex-wrap gap-2">
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Amount Due</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className={`font-mono font-semibold text-text-primary transition-all duration-300 ${getResponsiveFontSize(priceValue, false)}`}>
                                    {formatAmount(priceValue, 'USD')}
                                  </span>
                                  <span className="text-[9px] text-text-muted font-bold uppercase">USD</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Card Number</label>
                                <div className="relative">
                                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                  <input
                                    placeholder="0000 0000 0000 0000"
                                    value={cardData.number}
                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                                    className="w-full bg-bg-primary border border-border-base rounded-2xl pl-12 pr-4 py-4 text-text-primary focus:outline-none focus:border-brand-primary font-mono transition-colors"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expiry Date</label>
                                  <input
                                    placeholder="MM/YY"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                    className="w-full bg-bg-primary border border-border-base rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-brand-primary font-mono transition-colors"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">CVV</label>
                                  <input
                                    placeholder="123"
                                    type="password"
                                    maxLength={4}
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                    className="w-full bg-bg-primary border border-border-base rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-brand-primary font-mono transition-colors"
                                  />
                                </div>
                              </div>
                              
                              <button
                                onClick={handleCompletePayment}
                                className="w-full py-4 mt-4 bg-brand-primary text-bg-primary font-bold rounded-2xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                              >
                                Pay Securely <ChevronRight size={18} />
                              </button>
                            </div>
                          )}

                          {/* 5. PAYPAL */}
                          {selectedMethod === 'paypal' && (
                            <div className="space-y-8 py-8 text-center">
                              <div className="py-2 px-1 border-b border-border-base mb-4 flex items-center justify-between flex-wrap gap-2">
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Amount Due</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className={`font-mono font-semibold text-text-primary transition-all duration-300 ${getResponsiveFontSize(priceValue, false)}`}>
                                    {formatAmount(priceValue, 'USD')}
                                  </span>
                                  <span className="text-[9px] text-text-muted font-bold uppercase">USD</span>
                                </div>
                              </div>
                              <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CircleDollarSign size={48} />
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-2xl font-bold text-text-primary">PayPal Checkout</h4>
                                <p className="text-text-secondary text-sm max-w-xs mx-auto">You will be redirected to PayPal to complete your purchase securely.</p>
                              </div>
                              <button
                                onClick={handleCompletePayment}
                                className="w-full py-4 bg-[#0070ba] text-white font-bold rounded-2xl hover:bg-[#003087] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                              >
                                Continue with PayPal <ChevronRight size={18} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Secured Footer */}
                        <div className="mt-12 pt-6 border-t border-border-base flex items-center justify-center gap-2 text-brand-primary text-[10px] uppercase tracking-widest font-bold">
                          <Lock size={12} /> Secured 256-bit SSL Encrypted Payment
                        </div>
                      </motion.div>
                    ) : (
                      <div className="hidden md:flex flex-col items-center justify-center h-[500px] bg-bg-secondary border border-border-base border-dashed rounded-[32px] text-center p-10">
                        <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center text-brand-primary mb-6">
                          <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Secure Checkout</h3>
                        <p className="text-text-muted text-sm max-w-xs">Please select a payment method from the list to proceed with your transaction.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>

      {/* QR Code Lightbox */}
      <AnimatePresence>
        {isQREnlarged && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQREnlarged(false)}
              className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-bg-secondary p-8 rounded-[40px] shadow-2xl max-w-sm w-full flex flex-col items-center gap-6 border border-border-base"
            >
              <button 
                onClick={() => setIsQREnlarged(false)}
                className="absolute -top-12 right-0 text-text-primary hover:text-brand-primary transition-colors"
              >
                <X size={32} />
              </button>
              <div className="p-4 bg-white rounded-2xl">
                <QRCodeSVG value={selectedCrypto.address} size={280} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-brand-primary font-black uppercase tracking-widest text-xs">Scan to Pay</p>
                <p className="text-text-muted text-[10px] font-mono break-all px-4">{selectedCrypto.address}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
