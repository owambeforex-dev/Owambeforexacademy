import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StickyHeader from '../components/StickyHeader';

export default function SetTransferPin() {
  const navigate = useNavigate();
  const { currentUser, userData, refreshUserData } = useAuth();
  const { showToast } = useToast();
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || pin.length < 4 || confirmPin.length < 4) return;
    
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/set-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          pin
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set PIN');
      }

      await refreshUserData();
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/transfer');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">PIN Set Successfully!</h2>
          <p className="text-text-secondary text-sm">Redirecting you back to transfer...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4">
      <StickyHeader title="Set Transfer PIN" />
      
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Security Setup</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Create Transfer PIN</h2>
          <p className="text-sm text-text-secondary">Set a 4-digit PIN for authorizing transfers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3 text-center">Enter 4-Digit PIN</label>
              <div className="max-w-[200px] mx-auto">
                <input 
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-bg-secondary border border-border-base rounded-2xl py-4 text-center text-2xl tracking-[1em] font-bold text-text-primary focus:border-brand-primary outline-none transition-all"
                  placeholder="****"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3 text-center">Confirm PIN</label>
              <div className="max-w-[200px] mx-auto">
                <input 
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-bg-secondary border border-border-base rounded-2xl py-4 text-center text-2xl tracking-[1em] font-bold text-text-primary focus:border-brand-primary outline-none transition-all"
                  placeholder="****"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-error">
              <AlertCircle size={18} />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || pin.length < 4 || confirmPin.length < 4}
            className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Setting PIN...' : 'Save PIN'}
          </button>
        </form>

        <div className="mt-12 p-5 bg-bg-secondary rounded-2xl border border-border-base flex gap-4">
          <ShieldCheck size={24} className="text-brand-primary shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-text-primary">Why do I need a PIN?</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Your Transfer PIN is a security measure to ensure that only you can authorize fund transfers from your account. Never share your PIN with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
