import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Repeat,
  Wallet,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StickyHeader from '../components/StickyHeader';

interface Recipient {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

type TransferStep = 'recipient' | 'confirm' | 'amount' | 'pin' | 'success';

export default function Transfer() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { showToast } = useToast();
  
  const [step, setStep] = useState<TransferStep>('recipient');
  const [recipientId, setRecipientId] = useState('');
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableBalance = userData?.availableBalance || 0;

  useEffect(() => {
    if (userData && !userData.transferPin) {
      showToast('Please set your transfer PIN first');
      navigate('/set-transfer-pin');
    }
  }, [userData, navigate, showToast]);

  const handleFetchRecipient = async () => {
    if (!recipientId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/user/${recipientId}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setRecipient(data);
      setStep('confirm');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessTransfer = async () => {
    if (!currentUser || !recipient || !amount || !pin) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.uid,
          receiverId: recipient.uid,
          amount: Number(amount),
          pin
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message);
      if (err.message === 'Incorrect Transfer PIN') {
        setPin('');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRecipientStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-4">
          <Search size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Find Recipient</h2>
        <p className="text-sm text-text-secondary max-w-[240px] mx-auto leading-relaxed">
          Enter the User ID of the person <br className="sm:hidden" /> you want to transfer to
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Recipient User ID</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full bg-surface border border-border-base rounded-xl py-4 pl-12 pr-4 text-text-primary font-medium focus:border-brand-primary outline-none transition-all"
            />
          </div>
          {error && <p className="text-xs text-error mt-2 font-medium flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
        </div>

        <button 
          onClick={handleFetchRecipient}
          disabled={loading || !recipientId}
          className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Searching...' : 'Continue'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-text-primary">Confirm Recipient</h2>
        <p className="text-sm text-text-secondary">Please verify the recipient details</p>
      </div>

      <div className="bg-bg-secondary border border-border-base rounded-3xl p-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-brand-primary/10 border-4 border-bg-primary flex items-center justify-center text-brand-primary mb-4 overflow-hidden shadow-xl">
          {recipient?.profileImage ? (
            <img src={recipient.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={48} />
          )}
        </div>
        <h3 className="text-lg font-bold text-text-primary">{recipient?.firstName} {recipient?.lastName}</h3>
        <p className="text-sm text-text-secondary mb-2">{recipient?.email}</p>
        <div className="px-3 py-1 bg-brand-primary/10 rounded-full">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Verified User</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setStep('recipient')}
          className="py-4 bg-bg-secondary text-text-primary rounded-xl font-bold border border-border-base hover:bg-surface-hover transition-all"
        >
          Change
        </button>
        <button 
          onClick={() => setStep('amount')}
          className="py-4 bg-brand-primary text-bg-primary rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  );

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-text-primary">Enter Amount</h2>
        <p className="text-sm text-text-secondary">How much would you like to transfer?</p>
      </div>

      <div className="bg-bg-secondary border border-border-base rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Amount to Send</label>
          <div className="text-[10px] font-bold text-text-secondary">
            Available: <span className="text-text-primary">${availableBalance.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xl">$</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full bg-bg-primary border rounded-xl py-5 pl-10 pr-4 text-2xl text-text-primary font-bold outline-none transition-all ${Number(amount) > availableBalance ? 'border-error' : 'border-border-base focus:border-brand-primary'}`}
          />
        </div>

        {Number(amount) > availableBalance && (
          <p className="text-xs text-error mt-3 font-medium flex items-center gap-1">
            <AlertCircle size={14} /> Insufficient funds
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setStep('pin')}
          disabled={!amount || Number(amount) <= 0 || Number(amount) > availableBalance}
          className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
        >
          Continue
        </button>
        <button 
          onClick={() => setStep('confirm')}
          className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderPinStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-4">
          <Lock size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Enter Transfer PIN</h2>
        <p className="text-sm text-text-secondary">Enter your 4-digit security PIN to authorize</p>
      </div>

      <div className="max-w-[240px] mx-auto">
        <input 
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="w-full bg-bg-secondary border border-border-base rounded-2xl py-5 text-center text-3xl tracking-[1em] font-bold text-text-primary focus:border-brand-primary outline-none transition-all"
          autoFocus
        />
        {error && <p className="text-xs text-error mt-4 text-center font-medium">{error}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={handleProcessTransfer}
          disabled={loading || pin.length < 4}
          className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
        >
          {loading ? 'Processing...' : 'Authorize Transfer'}
        </button>
        <button 
          onClick={() => setStep('amount')}
          className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-8 relative">
        <CheckCircle2 size={56} />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-success text-bg-primary rounded-full flex items-center justify-center border-4 border-bg-primary"
        >
          <Repeat size={16} />
        </motion.div>
      </div>
      
      <h2 className="text-2xl font-bold text-text-primary mb-2">Transfer Successful!</h2>
      <p className="text-text-secondary text-sm max-w-[280px] mb-8">
        You have successfully transferred <span className="font-bold text-text-primary">${Number(amount).toLocaleString()}</span> to <span className="font-bold text-text-primary">{recipient?.firstName}</span>.
      </p>

      <div className="w-full bg-bg-secondary border border-border-base rounded-2xl p-4 mb-8 space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-text-muted">Recipient</span>
          <span className="text-text-primary">{recipient?.firstName} {recipient?.lastName}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-text-muted">Amount</span>
          <span className="text-text-primary">${Number(amount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-text-muted">Transaction ID</span>
          <span className="text-text-primary">TRF-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </div>
      </div>

      <Link 
        to="/transactions"
        className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all"
      >
        View Transactions
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4">
      <StickyHeader title="Transfer Funds" />
      
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2 text-text-muted">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Transfer</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'recipient' && renderRecipientStep()}
            {step === 'confirm' && renderConfirmStep()}
            {step === 'amount' && renderAmountStep()}
            {step === 'pin' && renderPinStep()}
            {step === 'success' && renderSuccess()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
