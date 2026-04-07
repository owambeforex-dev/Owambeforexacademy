import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, Clock, CheckCircle2, AlertCircle, Download, Upload, ShieldCheck, Bell, ArrowRight, Copy, Activity, PieChart, Users, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, setDoc, onSnapshot } from 'firebase/firestore';
import { Link, Navigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import StickyHeader from '../components/StickyHeader';

const TABS = ['Overview', 'Deposit', 'Investment Plans', 'Transactions', 'Referral Program'];

const SMART_ALERTS = [
  "EURUSD approaching major resistance at 1.0950.",
  "Bitcoin breakout probability increasing above 90%.",
  "Nasdaq momentum accelerating, tech sector leading.",
  "Gold volatility risk rising ahead of NFP data."
];

interface Transaction {
  id: string;
  userId: string;
  type?: string;
  planName?: string;
  evaluationType?: string;
  accountSize?: number;
  paymentMethod?: string;
  amount: number | string;
  proofOfPayment?: string;
  timestamp: string;
  createdAt?: string;
  status: string;
  method?: string;
}

export default function Dashboard({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { currentUser, userData, loading } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<any>({ balance: 0, totalDeposit: 0, totalWithdraw: 0, totalProfit: 0 });
  const [investments, setInvestments] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % SMART_ALERTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('Dashboard in open access mode');
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied successfully');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyReferral = () => {
    if (userData?.myReferralCode) {
      handleCopy(`https://owambeforex.com/signup?ref=${userData.myReferralCode}`, 'referral');
    }
  };

  return (
    <div className={isEmbedded ? "" : "pt-24 pb-12 min-h-screen bg-bg-primary"}>
      {!isEmbedded && <StickyHeader title="Dashboard" />}
      <div className={isEmbedded ? "" : "container mx-auto px-4"}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-heading font-bold mb-1 text-text-primary">Welcome back, {userData?.firstName || 'User'}</h1>
            <p className="text-[10px] md:text-base text-text-secondary leading-tight">Manage your account and active programs.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-bg-primary"></span>
            </button>
            <Link to="/profile" className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center text-brand-primary font-bold uppercase overflow-hidden">
              {userData?.profileImage ? (
                <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>{userData?.firstName?.charAt(0) || 'U'}{userData?.lastName?.charAt(0) || ''}</>
              )}
            </Link>
          </div>
        </div>

        {/* Smart Alert Ticker */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-brand-primary/30 rounded-xl py-3 px-4 flex items-center gap-3 mb-8"
        >
          <Bell className="text-brand-primary animate-pulse" size={18} />
          <div className="text-sm font-mono text-text-secondary">
            <span className="font-bold text-brand-primary mr-2">AI Alert:</span>
            {SMART_ALERTS[activeAlertIndex]}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-border-base pb-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-brand-primary text-brand-dark shadow-lg shadow-brand-primary/20' 
                  : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {activeTab === 'Overview' && (
              <>
                {/* Mobile Investment Summary Card */}
                <div className="sm:hidden mb-6">
                  <button 
                    onClick={() => setShowStatsModal(true)}
                    className="w-full glass-dark p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all border border-brand-primary/20 bg-brand-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <PieChart size={20} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-white">Investment Summary</h3>
                        <p className="text-[10px] text-gray-400">View your portfolio performance</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-500 group-hover:text-brand-primary transition-colors" />
                  </button>
                </div>

                {/* Stats Grid (Hidden on mobile, shown on sm+) */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-dark rounded-2xl p-4 sm:p-6 border border-brand-primary/20 relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400 mb-2 sm:mb-4">
                      <Wallet size={18} className="text-brand-primary flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-medium text-xs sm:text-base truncate">Total Portfolio</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-mono font-bold text-text-primary mb-2 truncate">
                      ${(wallet.balance + wallet.totalProfit + investments.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">0% today</span>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-4 sm:p-6 border border-white/5 overflow-hidden w-full">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400 mb-2 sm:mb-4">
                      <TrendingUp size={18} className="text-green-400 flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-medium text-xs sm:text-base truncate">Total Profit/Loss</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-mono font-bold text-white mb-2 truncate">
                      ${wallet.totalProfit.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="truncate">All time</span>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-4 sm:p-6 border border-white/5 overflow-hidden w-full">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400 mb-2 sm:mb-4">
                      <Activity size={18} className="text-blue-400 flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-medium text-xs sm:text-base truncate">Active Trades</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-mono font-bold text-white mb-2 truncate">
                      0
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="truncate">No active trades</span>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-4 sm:p-6 border border-white/5 overflow-hidden w-full">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400 mb-2 sm:mb-4">
                      <PieChart size={18} className="text-purple-400 flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-medium text-xs sm:text-base truncate">Investment Balance</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-mono font-bold text-white mb-2 truncate">
                      ${investments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="truncate">In {investments.length} active plans</span>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="glass-dark rounded-2xl p-6 border border-white/5">
                    <h3 className="text-sm md:dashboard-title mb-6">Monthly Growth</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', value: 0 },
                          { name: 'Feb', value: 0 },
                          { name: 'Mar', value: 0 },
                          { name: 'Apr', value: 0 },
                          { name: 'May', value: 0 },
                          { name: 'Jun', value: 0 },
                        ]}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff50" tick={{fill: '#ffffff50'}} axisLine={false} tickLine={false} />
                          <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '8px' }}
                            itemStyle={{ color: '#eab308' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#eab308" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-6 border border-white/5">
                    <h3 className="text-sm md:dashboard-title mb-6">Portfolio Allocation</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Forex', value: 0 },
                              { name: 'Crypto', value: 0 },
                              { name: 'Commodities', value: 0 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#eab308" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#8b5cf6" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => `${value}%`}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-dark rounded-2xl p-6 border border-white/5 mt-6">
                  <h3 className="text-sm md:dashboard-title mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button onClick={() => setActiveTab('Deposit')} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex flex-col items-center justify-center gap-3 group">
                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Deposit</span>
                    </button>
                    <Link to="/withdraw" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex flex-col items-center justify-center gap-3 group">
                      <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Download size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Withdraw</span>
                    </Link>
                    <Link to="/services/signals" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex flex-col items-center justify-center gap-3 group">
                      <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Signals</span>
                    </Link>
                    <Link to="/services/mentorship" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex flex-col items-center justify-center gap-3 group">
                      <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Mentorship</span>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Deposit' && (
              <div className="glass-dark rounded-2xl p-4 sm:p-6 border border-white/5 w-full overflow-hidden">
                <h3 className="dashboard-title mb-4 sm:mb-6">Make a Deposit</h3>
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 sm:p-6 mb-6">
                  <p className="text-gray-300 mb-2 text-sm sm:text-base">Please send your deposit to the following USDT (TRC20) address:</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                    <code className="bg-black/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-brand-primary font-mono text-xs sm:text-lg flex-1 break-all text-center sm:text-left">
                      TXYZ1234567890abcdefghijklmnopqrstuvwxyz
                    </code>
                    <button onClick={() => handleCopy('TXYZ1234567890abcdefghijklmnopqrstuvwxyz', 'deposit-addr')} className="p-3 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                      {copiedId === 'deposit-addr' ? <CheckCircle2 size={20} className="text-brand-primary" /> : <Copy size={20} className="text-white" />}
                      <span className="sm:hidden text-white text-sm font-medium">Copy Address</span>
                    </button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const amount = form.amount.value;
                  const txHash = form.txHash.value;
                  
                  try {
                    await setDoc(doc(collection(db, 'deposits')), {
                      userId: currentUser.uid,
                      amount: Number(amount),
                      method: 'USDT TRC20',
                      transactionHash: txHash,
                      status: 'Pending',
                      createdAt: new Date().toISOString()
                    });
                    alert('Deposit request submitted successfully. Please wait for admin approval.');
                    form.reset();
                    setActiveTab('Transactions');
                  } catch (err) {
                    console.error('Error submitting deposit:', err);
                    alert('Failed to submit deposit request.');
                  }
                }}>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                    <input type="number" name="amount" min="10" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" placeholder="Enter amount" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Transaction Hash</label>
                    <input type="text" name="txHash" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" placeholder="Enter transaction hash" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-xl">Submit Deposit Request</button>
                </form>
              </div>
            )}

            {activeTab === 'Investment Plans' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="dashboard-title">My Investments</h3>
                  <Link to="/services/investment" className="text-brand-primary hover:text-brand-secondary text-sm font-medium flex items-center gap-1">
                    New Investment <ArrowRight size={16} />
                  </Link>
                </div>
                {investments.length > 0 ? investments.map(inv => (
                  <div key={inv.id} className="glass-dark rounded-2xl p-4 sm:p-6 border border-white/10 relative overflow-hidden w-full">
                    <div className={`absolute top-0 right-0 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-bl-lg ${
                      inv.status === 'Active' ? 'bg-green-500 text-white' :
                      inv.status === 'Pending' ? 'bg-yellow-500 text-white' :
                      inv.status === 'Rejected' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {inv.status.toUpperCase()}
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-full pr-16">
                        <div className="text-[10px] sm:text-xs text-brand-primary mb-1 font-mono truncate">{inv.investmentId || inv.id}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-white truncate">{inv.plan}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-white/5 rounded-lg p-2 sm:p-3 overflow-hidden">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">Amount Invested</p>
                        <p className="font-medium text-white font-mono text-sm sm:text-base truncate">${inv.amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 sm:p-3 overflow-hidden">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">Expected Return</p>
                        <p className="font-medium text-brand-primary text-sm sm:text-base truncate">{inv.expectedReturn || `${inv.dailyPercent}% Daily`}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 sm:p-3 overflow-hidden">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">Submission Date</p>
                        <p className="font-medium text-white text-sm sm:text-base truncate">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 sm:p-3 overflow-hidden">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">Total Profit</p>
                        <p className="font-medium text-green-400 font-mono text-sm sm:text-base truncate">+${(inv.totalProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {inv.status === 'Active' && (
                      <>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-2">
                          <div className="bg-brand-primary h-full" style={{ width: `${Math.min(((inv.totalProfit || 0) / inv.amount) * 100, 100)}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>ROI: {(((inv.totalProfit || 0) / inv.amount) * 100).toFixed(2)}%</span>
                        </div>
                      </>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12 glass-dark rounded-2xl border border-white/5">
                    <PieChart size={48} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No active investments yet</h3>
                    <p className="text-gray-400 mb-6">Get started to begin.</p>
                    <Link to="/services/investment" className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-brand-secondary transition-colors">
                      Start Investing
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Transactions' && (
              <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="dashboard-title">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 text-sm">
                        <th className="p-4 font-medium whitespace-nowrap">Type</th>
                        <th className="p-4 font-medium whitespace-nowrap">Amount</th>
                        <th className="p-4 font-medium whitespace-nowrap">Date</th>
                        <th className="p-4 font-medium whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0">
                                <Wallet size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-white">{tx.type || tx.planName}</span>
                                {tx.method && <span className="text-xs text-gray-400">{tx.method}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-white whitespace-nowrap">${Number(tx.amount).toLocaleString()}</td>
                          <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{new Date(tx.createdAt || tx.timestamp).toLocaleDateString()}</td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status.toLowerCase() === 'approved' || tx.status.toLowerCase() === 'success' ? 'bg-green-500/20 text-green-400' :
                              tx.status.toLowerCase() === 'rejected' || tx.status.toLowerCase() === 'declined' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500">
                            No transactions yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Referral Program' && (
              <div className="glass-dark rounded-2xl p-6 border border-white/5">
                <h3 className="dashboard-title mb-6">Referral Program</h3>
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 sm:p-6 mb-6 text-center w-full overflow-hidden">
                  <p className="text-gray-400 mb-2 text-sm sm:text-base">Your Referral Link</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4">
                    <code className="bg-black/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-brand-primary font-mono text-xs sm:text-lg break-all flex-1 text-center sm:text-left">
                      https://owambeforex.com/signup?ref={userData?.myReferralCode}
                    </code>
                    <button onClick={copyReferral} className="p-3 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                      {copiedId === 'referral' ? <CheckCircle2 size={20} className="text-brand-primary" /> : <Copy size={20} className="text-white" />}
                      <span className="sm:hidden text-white text-sm font-medium">Copy Link</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-4">Earn 10% commission on your referrals' first deposit.</p>
                </div>

                <h4 className="font-medium text-white mb-4">Your Referrals ({referrals.length})</h4>
                <div className="space-y-3">
                  {referrals.map(ref => (
                    <div key={ref.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-gray-300">{ref.firstName} {ref.lastName}</span>
                      <span className="text-sm text-gray-500">Joined: {new Date(ref.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                    <p className="text-gray-500 text-center py-4">You haven't referred anyone yet.</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Membership Status */}
            <div className="glass-dark rounded-2xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Account Status</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <StarIcon />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-2xl text-gray-500">Inactive</h4>
                  <p className="text-xs text-gray-500">No Active Plan</p>
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="glass-dark rounded-2xl p-6 border border-white/5">
              <h3 className="dashboard-title mb-4 flex items-center gap-2">
                <Bell size={18} className="text-brand-primary" />
                Recent Alerts
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-600 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-400">Welcome to Owambe Forex!</p>
                    <p className="text-xs text-gray-600 mt-0.5">Account Created</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stats Modal for Mobile */}
      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-bg-primary border-t sm:border border-border-base rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowStatsModal(false)}
                      className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
                    >
                      <ArrowLeft size={20} className="text-text-secondary" />
                    </button>
                    <h2 className="text-xl font-bold text-text-primary">Investment Summary</h2>
                  </div>
                  <button 
                    onClick={() => setShowStatsModal(false)}
                    className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="glass-dark rounded-2xl p-5 flex items-center gap-4 border border-brand-primary/20">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Portfolio</div>
                      <div className="text-2xl font-bold text-white font-mono">
                        ${(wallet.balance + wallet.totalProfit + investments.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-5 flex items-center gap-4 border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Profit/Loss</div>
                      <div className="text-2xl font-bold text-white font-mono">${wallet.totalProfit.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-5 flex items-center gap-4 border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <Activity size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Active Trades</div>
                      <div className="text-2xl font-bold text-white font-mono">0</div>
                    </div>
                  </div>

                  <div className="glass-dark rounded-2xl p-5 flex items-center gap-4 border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                      <PieChart size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Investment Balance</div>
                      <div className="text-2xl font-bold text-white font-mono">
                        ${investments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowStatsModal(false)}
                  className="w-full py-4 bg-brand-primary text-brand-dark font-bold rounded-xl shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all"
                >
                  Close Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}
