import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  Bitcoin, 
  ChevronRight, 
  Copy, 
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
  Lock, X, User, CircleDollarSign, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StickyHeader from '../components/StickyHeader';

type PaymentMethod = 'card' | 'bank' | 'crypto' | null;

const DEPOSIT_METHODS = [
  { id: 'bank', name: 'Bank Transfer', icon: Building2, description: 'Direct bank wire transfer' },
  { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin, description: 'USDT, BTC, ETH, SOL' },
  { id: 'card', name: 'Card Payment', icon: CreditCard, description: 'Visa, Mastercard, Maestro' },
  { id: 'paypal', name: 'paypal', icon: CircleDollarSign, description: 'Fast and secure checkout' },
];

export default function DepositFunds() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bankTab, setBankTab] = useState<'NGN' | 'USD'>('NGN');

  const handleCopy = (text: string, id: string = 'default') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied successfully');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !amount) return;

    setIsSubmitting(true);
    try {
      // Mock deposit submission
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
        setTimeout(() => {
          navigate('/profile?tab=Transactions');
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('Failed to submit deposit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-text-primary mb-6">Select Payment Method</h2>
      
      <button 
        onClick={() => setSelectedMethod('card')}
        className="w-full bg-surface border border-border-base rounded-2xl p-5 flex items-center gap-4 hover:border-brand-primary transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CreditCard size={24} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-text-primary">Card Transfer</h3>
          <p className="text-[10px] text-text-muted">Visa, Mastercard, Maestro</p>
        </div>
        <ChevronRight size={20} className="text-text-muted" />
      </button>

      <button 
        onClick={() => setSelectedMethod('bank')}
        className="w-full bg-surface border border-border-base rounded-2xl p-5 flex items-center gap-4 hover:border-brand-primary transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Building2 size={24} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-text-primary">Bank Transfer</h3>
          <p className="text-[10px] text-text-muted">Direct bank wire transfer</p>
        </div>
        <ChevronRight size={20} className="text-text-muted" />
      </button>

      <button 
        onClick={() => setSelectedMethod('crypto')}
        className="w-full bg-surface border border-border-base rounded-2xl p-5 flex items-center gap-4 hover:border-brand-primary transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Bitcoin size={24} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-text-primary">Crypto Deposit</h3>
          <p className="text-[10px] text-text-muted">USDT (TRC20), BTC, ETH</p>
        </div>
        <ChevronRight size={20} className="text-text-muted" />
      </button>

      <div className="mt-8 p-4 bg-bg-secondary rounded-xl border border-border-base">
        <div className="flex gap-3">
          <ShieldCheck size={20} className="text-brand-primary shrink-0" />
          <p className="text-xs text-text-secondary leading-relaxed">
            All transactions are secured and encrypted. Deposits are typically processed within 10-30 minutes after confirmation.
          </p>
        </div>
      </div>
    </div>
  );

  const renderDepositForm = () => (
    <div className="space-y-6">
      {selectedMethod === 'crypto' && (
        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">USDT (TRC20) Address</span>
            <div className="flex items-center gap-1 text-[10px] text-brand-primary/60">
              <Info size={10} />
              <span>TRON Network Only</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-bg-primary/50 p-3 rounded-xl border border-brand-primary/10">
            <code className="flex-1 text-xs font-mono text-text-primary break-all">
              TXYZ1234567890abcdefghijklmnopqrstuvwxyz
            </code>
            <button 
              onClick={() => handleCopy('TXYZ1234567890abcdefghijklmnopqrstuvwxyz', 'crypto-addr')}
              className="p-2 bg-brand-primary text-bg-primary rounded-lg shadow-sm"
            >
              {copiedId === 'crypto-addr' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-3 text-center">
            Minimum deposit: $10. Sending other assets will result in permanent loss.
          </p>
        </div>
      )}

      {selectedMethod === 'bank' && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 mb-6">
          <div className="flex p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setBankTab('NGN')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${bankTab === 'NGN' ? 'bg-brand-primary text-brand-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              NGN Transfer
            </button>
            <button
              onClick={() => setBankTab('USD')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${bankTab === 'USD' ? 'bg-brand-primary text-brand-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              USD Transfer
            </button>
          </div>

          <div className="space-y-4">
            {bankTab === 'NGN' ? (
              <div className="space-y-3">
                {[
                  { label: 'Account Name', value: 'Owambe Traders Global' },
                  { label: 'Account Number', value: '6112121724' },
                  { label: 'Bank Name', value: 'Opay (Paycom)' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-orange-500/10 last:border-0">
                    <span className="text-[10px] text-text-muted uppercase font-bold">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">{item.value}</span>
                      <button onClick={() => handleCopy(item.value, `bank-${item.label}`)} className="text-orange-500">
                        {copiedId === `bank-${item.label}` ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Account Name', value: 'Joshua Jerome Isaac' },
                  { label: 'Bank Name', value: 'Lead Bank' },
                  { label: 'Account Number', value: '217575484680' },
                  { label: 'Routing Number', value: '101019644' },
                  { label: 'Account Type', value: 'Personal Checking' },
                  { label: 'Bank Address', value: '9450 Southwest Gemini Drive, Beaverton, OR, 97008, USA' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col py-2 border-b border-orange-500/10 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-text-muted uppercase font-bold">{item.label}</span>
                      <button onClick={() => handleCopy(item.value, `bank-usd-${item.label}`)} className="text-orange-500">
                        {copiedId === `bank-usd-${item.label}` ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <span className="text-xs font-bold text-text-primary break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 text-blue-500 mb-4">
            <AlertCircle size={20} />
            <p className="text-xs font-medium">Card payments are processed via our secure partner gateway.</p>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Please enter the amount below. On the next step, you will be redirected to our secure payment processor to complete your transaction.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Deposit Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="10"
              required
              className="w-full bg-surface border border-border-base rounded-xl py-4 pl-8 pr-4 text-text-primary font-bold focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </div>

        {selectedMethod !== 'card' && (
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Transaction Reference / Hash</label>
            <input 
              type="text" 
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter reference or hash"
              required
              className="w-full bg-surface border border-border-base rounded-xl py-4 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all"
            />
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting || !amount}
          className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:shadow-none transition-all mt-4"
        >
          {isSubmitting ? 'Processing...' : 'Confirm Deposit'}
        </button>
      </form>

      <div className="flex items-center gap-2 justify-center text-text-muted">
        <ShieldCheck size={14} />
        <span className="text-[10px]">Secure 256-bit SSL Encrypted Payment</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Deposit Submitted!</h2>
      <p className="text-text-secondary text-sm max-w-[240px]">
        Your deposit request is being processed. You will be notified once it's approved.
      </p>
      <p className="text-text-muted text-xs mt-8">Redirecting to transactions...</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4">
      <StickyHeader title="Deposit Funds" />
      <div className="max-w-5xl mx-auto mt-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            renderSuccess()
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Selector (Desktop) / List (Mobile) */}
              <div className={`w-full md:w-64 shrink-0 space-y-2 ${selectedMethod && 'hidden md:block'}`}>
                <h3 className="hidden md:block text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-6 px-2">Pay With</h3>
                <div className="space-y-1 md:space-y-2">
                  {DEPOSIT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all relative group ${
                        selectedMethod === method.id 
                          ? 'bg-brand-primary text-bg-primary font-bold shadow-lg shadow-brand-primary/20' 
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`}
                    >
                      <method.icon size={20} className={selectedMethod === method.id ? 'text-bg-primary' : 'text-text-muted group-hover:text-brand-primary'} />
                      <span className="flex-1 text-left text-sm">{method.name}</span>
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
                <div className="md:hidden pt-12 space-y-4">
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-full py-4 flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary transition-colors border border-border-base rounded-xl"
                  >
                    <X size={18} /> Cancel Payment
                  </button>
                  <div className="flex items-center justify-center gap-2 text-text-muted text-xs py-4">
                    <Lock size={14} /> Secured Payment
                  </div>
                </div>
              </div>

              {/* Right Column: Content Panel */}
              <div className={`flex-1 min-h-[400px] ${!selectedMethod && 'hidden md:flex items-center justify-center bg-bg-secondary rounded-3xl border border-border-base border-dashed'}`}>
                <AnimatePresence mode="wait">
                  {selectedMethod ? (
                    <motion.div
                      key={selectedMethod}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-bg-secondary border border-border-base rounded-3xl p-6 md:p-8 relative overflow-hidden"
                    >
                      {/* Header for content area */}
                      <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
                          <User size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">Choose Your Secure Payment Method</h3>
                        
                        {/* Mobile Back Button */}
                        <button 
                          onClick={() => setSelectedMethod(null)}
                          className="md:hidden mt-4 text-sm text-brand-primary flex items-center gap-1"
                        >
                          <ChevronLeft size={16} /> Back to methods
                        </button>
                      </div>

                      {/* Dynamic Content */}
                      {renderDepositForm()}

                      {/* Secured Footer */}
                      <div className="mt-12 pt-6 border-t border-border-base flex items-center justify-center gap-2 text-text-muted text-[10px] uppercase tracking-widest font-bold">
                        <Lock size={12} /> Secured 256-bit SSL Encrypted Payment
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-muted mx-auto border border-border-base">
                        <ShieldCheck size={32} />
                      </div>
                      <p className="text-text-secondary text-sm">Please select a payment method to continue</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
