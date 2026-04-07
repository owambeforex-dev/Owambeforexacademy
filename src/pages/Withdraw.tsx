import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Bitcoin, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock, 
  X, 
  User, 
  ChevronLeft,
  ArrowLeft,
  Wallet,
  ArrowRight,
  Info,
  Search,
  ArrowLeftRight,
  Banknote
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StickyHeader from '../components/StickyHeader';
import { db } from '../firebase/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';

const BANK_LIST = [
  "Opay", "Kuda Bank", "Moniepoint MFB", "PalmPay", "Carbon", "FairMoney Microfinance Bank", 
  "VFD Microfinance Bank (VBank)", "Sparkle Microfinance Bank", "Eyowo", "Access Bank", 
  "Zenith Bank", "Guaranty Trust Bank (GTBank)", "First Bank of Nigeria", 
  "United Bank for Africa (UBA)", "Fidelity Bank", "Wema Bank", "Ecobank Nigeria", 
  "First City Monument Bank (FCMB)", "Sterling Bank", "Polaris Bank", "Union Bank of Nigeria", 
  "Keystone Bank", "Unity Bank", "Stanbic IBTC Bank", "Standard Chartered Bank Nigeria", 
  "Citibank Nigeria", "Titan Trust Bank", "Providus Bank", "Parallex Bank", "Globus Bank", 
  "Premium Trust Bank", "Optimus Bank", "SunTrust Bank Nigeria", "Signature Bank", 
  "Nova Commercial Bank", "Jaiz Bank", "Taj Bank", "Lotus Bank", "Rand Merchant Bank Nigeria", 
  "FSDH Merchant Bank", "Coronation Merchant Bank", "Greenwich Merchant Bank", 
  "Nova Merchant Bank", "LAPO Microfinance Bank", "AB Microfinance Bank Nigeria", 
  "Accion Microfinance Bank", "Addosser Microfinance Bank", "Bosak Microfinance Bank", 
  "CEMCS Microfinance Bank", "Daylight Microfinance Bank", "Ekondo Microfinance Bank", 
  "Fina Trust Microfinance Bank", "Fortis Microfinance Bank", "Grooming Microfinance Bank", 
  "Hasal Microfinance Bank", "Infinity Microfinance Bank", "Mainstreet Microfinance Bank", 
  "Mutual Trust Microfinance Bank", "NPF Microfinance Bank", "Peace Microfinance Bank", 
  "Pennywise Microfinance Bank", "Rephidim Microfinance Bank", "Royal Exchange Microfinance Bank", 
  "Safe Haven Microfinance Bank", "Shepherd Trust Microfinance Bank", "Solid Rock Microfinance Bank", 
  "Trustbond Microfinance Bank", "Unical Microfinance Bank", "Verite Microfinance Bank", 
  "Visa Microfinance Bank", "Xpress Microfinance Bank"
];

type WithdrawalMethod = 'naira-bank' | 'dollar-bank' | 'crypto' | null;

export default function Withdraw() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  
  // Bank Search Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountName: userData?.withdrawalDetails?.bank?.accountName || '',
    accountNumber: userData?.withdrawalDetails?.bank?.accountNumber || '',
    bankName: userData?.withdrawalDetails?.bank?.bankName || '',
    currency: userData?.withdrawalDetails?.bank?.currency || 'NGN'
  });

  // Crypto details state
  const [cryptoDetails, setCryptoDetails] = useState({
    walletAddress: userData?.withdrawalDetails?.crypto?.walletAddress || '',
    network: userData?.withdrawalDetails?.crypto?.network || 'TRC20'
  });

  const isDetailsLocked = !!userData?.withdrawalDetails;
  const availableBalance = userData?.availableBalance || 0;
  const isInsufficientFunds = Number(amount) > availableBalance;

  const filteredBanks = useMemo(() => {
    return BANK_LIST.filter(bank => 
      bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
    );
  }, [bankSearchQuery]);

  const handleSaveDetails = async () => {
    if (!currentUser) return;
    
    const confirmSave = window.confirm("You will NOT be able to edit this withdrawal account after saving. Do you want to proceed?");
    if (!confirmSave) return;

    setIsSavingDetails(true);
    try {
      const details = (selectedMethod === 'naira-bank' || selectedMethod === 'dollar-bank') 
        ? { bank: { ...bankDetails, currency: selectedMethod === 'naira-bank' ? 'NGN' : 'USD' } } 
        : { crypto: cryptoDetails };
        
      await updateDoc(doc(db, 'users', currentUser.uid), {
        withdrawalDetails: details
      });
      showToast('Withdrawal details saved and locked.');
    } catch (error) {
      console.error('Error saving withdrawal details:', error);
      showToast('Failed to save details. Please try again.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedMethod || !amount) return;
    if (isInsufficientFunds) return;
    if (!isDetailsLocked) {
      showToast('Please save your withdrawal details first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const withdrawalData = {
        userId: currentUser.uid,
        amount: Number(amount),
        method: selectedMethod,
        details: (selectedMethod === 'naira-bank' || selectedMethod === 'dollar-bank') 
          ? userData.withdrawalDetails.bank 
          : userData.withdrawalDetails.crypto,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(collection(db, 'withdrawals')), withdrawalData);
      
      // Deduct from availableBalance
      await updateDoc(doc(db, 'users', currentUser.uid), {
        availableBalance: availableBalance - Number(amount),
        totalWithdrawal: (userData?.totalWithdrawal || 0) + Number(amount)
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/transactions');
      }, 3000);
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      showToast('Failed to submit withdrawal request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBankModal = () => (
    <AnimatePresence>
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBankModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-lg bg-bg-primary rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-border-base flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">Select Bank</h3>
              <button onClick={() => setIsBankModalOpen(false)} className="p-2 hover:bg-bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="text"
                  placeholder="Search bank name..."
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-base rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:border-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => {
                      setBankDetails({ ...bankDetails, bankName: bank });
                      setIsBankModalOpen(false);
                      setBankSearchQuery('');
                    }}
                    className="w-full text-left p-4 hover:bg-bg-secondary rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium text-text-primary">{bank}</span>
                    <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-text-muted">
                  <p className="text-sm">No banks found matching "{bankSearchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 text-text-muted">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Withdrawal</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-2">Withdraw Funds</h2>
        <p className="text-sm text-text-secondary">Choose your preferred withdrawal method</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setSelectedMethod('naira-bank')}
          className="bg-surface border border-border-base rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-brand-primary transition-all group shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 size={28} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Naira Transfer</h3>
            <p className="text-[10px] text-text-muted mt-1">Direct to your NGN account</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedMethod('dollar-bank')}
          className="bg-surface border border-border-base rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-brand-primary transition-all group shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Banknote size={28} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Dollar Transfer</h3>
            <p className="text-[10px] text-text-muted mt-1">Direct to your USD account</p>
          </div>
        </button>
      </div>

      <button 
        onClick={() => setSelectedMethod('crypto')}
        className="w-full bg-surface border border-border-base rounded-2xl p-6 flex items-center gap-4 hover:border-brand-primary transition-all group shadow-sm hover:shadow-md"
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Bitcoin size={28} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-text-primary">Crypto Transfer</h3>
          <p className="text-[10px] text-text-muted mt-1">USDT (TRC20), BTC, ETH</p>
        </div>
        <ChevronRight size={20} className="text-text-muted" />
      </button>

      <div className="mt-8 p-5 bg-bg-secondary rounded-2xl border border-border-base flex gap-4">
        <ShieldCheck size={24} className="text-brand-primary shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-text-primary">Secure Processing</h4>
          <p className="text-[10px] text-text-secondary leading-relaxed">
            Withdrawals are processed INSTANTLY. Ensure your details are correct as they cannot be changed once saved.
          </p>
        </div>
      </div>
    </div>
  );

  const renderWithdrawalForm = () => (
    <div className="space-y-6">
      {/* Header with Back and Switch */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setSelectedMethod(null)}
          className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-brand-primary transition-colors"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {(selectedMethod === 'naira-bank' || selectedMethod === 'dollar-bank') && (
          <button 
            onClick={() => setSelectedMethod(selectedMethod === 'naira-bank' ? 'dollar-bank' : 'naira-bank')}
            className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-base rounded-xl text-xs font-bold text-text-primary hover:border-brand-primary transition-all"
          >
            <ArrowLeftRight size={14} />
            Switch to {selectedMethod === 'naira-bank' ? 'Dollar' : 'Naira'}
          </button>
        )}
      </div>

      {/* Account Details Section */}
      <div className="bg-bg-secondary border border-border-base rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            {selectedMethod === 'crypto' ? 'Crypto Wallet Details' : `${selectedMethod === 'naira-bank' ? 'Naira' : 'Dollar'} Bank Details`}
          </h3>
          {isDetailsLocked && (
            <div className="flex items-center gap-1 text-[10px] text-success font-bold">
              <Lock size={10} />
              <span>LOCKED</span>
            </div>
          )}
        </div>

        {!isDetailsLocked && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
            <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-orange-500 leading-tight font-medium">
              Warning: You will NOT be able to edit these details after saving. Please double-check everything.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {(selectedMethod === 'naira-bank' || selectedMethod === 'dollar-bank') ? (
            <>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Account Name</label>
                <input 
                  type="text"
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                  disabled={isDetailsLocked}
                  placeholder="Enter account name"
                  className="w-full bg-bg-primary border border-border-base rounded-lg p-3 text-sm text-text-primary focus:border-brand-primary outline-none disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Account Number</label>
                <input 
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  disabled={isDetailsLocked}
                  placeholder="Enter account number"
                  className="w-full bg-bg-primary border border-border-base rounded-lg p-3 text-sm text-text-primary focus:border-brand-primary outline-none disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Bank Name</label>
                <button 
                  type="button"
                  onClick={() => !isDetailsLocked && setIsBankModalOpen(true)}
                  disabled={isDetailsLocked}
                  className="w-full bg-bg-primary border border-border-base rounded-lg p-3 text-sm text-text-primary flex items-center justify-between focus:border-brand-primary outline-none disabled:opacity-70"
                >
                  <span className={bankDetails.bankName ? 'text-text-primary' : 'text-text-muted'}>
                    {bankDetails.bankName || 'Select bank'}
                  </span>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Currency</label>
                <div className="w-full bg-bg-primary border border-border-base rounded-lg p-3 text-sm text-text-primary opacity-70">
                  {selectedMethod === 'naira-bank' ? 'NGN (Naira)' : 'USD (Dollar)'}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Wallet Address</label>
                <input 
                  type="text"
                  value={cryptoDetails.walletAddress}
                  onChange={(e) => setCryptoDetails({...cryptoDetails, walletAddress: e.target.value})}
                  disabled={isDetailsLocked}
                  placeholder="Enter wallet address"
                  className="w-full bg-bg-primary border border-border-base rounded-lg p-3 text-sm text-text-primary focus:border-brand-primary outline-none disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Network</label>
                <select 
                  value={cryptoDetails.network}
                  onChange={(e) => setCryptoDetails({...cryptoDetails, network: e.target.value})}
                  disabled={isDetailsLocked}
                  className="w-full bg-bg-primary border border-border-base rounded-lg p-3 text-sm text-text-primary focus:border-brand-primary outline-none disabled:opacity-70"
                >
                  <option value="TRC20">USDT (TRC20)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ERC20)</option>
                </select>
              </div>
            </>
          )}

          {!isDetailsLocked && (
            <button 
              onClick={handleSaveDetails}
              disabled={isSavingDetails || ((selectedMethod === 'naira-bank' || selectedMethod === 'dollar-bank') ? !bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName : !cryptoDetails.walletAddress)}
              className="w-full bg-brand-primary text-bg-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
            >
              {isSavingDetails ? 'Saving...' : 'Save & Lock Details'}
            </button>
          )}
        </div>
      </div>

      {/* Withdrawal Amount Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-bg-secondary border border-border-base rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Withdrawal Amount</label>
            <div className="text-[10px] font-bold text-text-secondary">
              Available: <span className="text-text-primary">${availableBalance.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="50"
              required
              className={`w-full bg-bg-primary border rounded-xl py-4 pl-8 pr-4 text-text-primary font-bold outline-none transition-all ${isInsufficientFunds ? 'border-red-500 focus:border-red-500' : 'border-border-base focus:border-brand-primary'}`}
            />
          </div>

          {isInsufficientFunds && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle size={16} />
                  <span className="text-xs font-bold">Insufficient funds</span>
                </div>
                <Link 
                  to="/deposit-funds"
                  className="flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:underline"
                >
                  Add Funds <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting || !amount || isInsufficientFunds || !isDetailsLocked}
          className="w-full bg-brand-primary text-bg-primary py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:shadow-none transition-all mt-4"
        >
          {isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
        </button>
      </form>

      <div className="flex items-center gap-2 justify-center text-text-muted">
        <ShieldCheck size={14} />
        <span className="text-[10px]">Secure 256-bit SSL Encrypted Withdrawal</span>
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
      <h2 className="text-2xl font-bold text-text-primary mb-2">Withdrawal Requested!</h2>
      <p className="text-text-secondary text-sm max-w-[240px]">
        Your withdrawal request has been submitted and is pending approval.
      </p>
      <p className="text-text-muted text-xs mt-8">Redirecting to transactions...</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4">
      <StickyHeader title="Withdraw Funds" />
      <div className="max-w-3xl mx-auto mt-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            renderSuccess()
          ) : (
            <motion.div
              key={selectedMethod ? 'form' : 'selection'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedMethod ? renderWithdrawalForm() : renderMethodSelection()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {renderBankModal()}
    </div>
  );
}
