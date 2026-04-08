import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Upload, Download, TrendingUp, Activity, Settings, DollarSign, Check, X, 
  Search, Filter, MoreVertical, Shield, AlertTriangle, RefreshCcw, Ticket, Briefcase, 
  ChevronRight, MessageSquare, ExternalLink, UserCheck, UserX, Clock, Trash2,
  Bell, Lock, Unlock, CreditCard, PieChart, BarChart3, Globe, Zap
} from 'lucide-react';
import { db, auth } from '../firebase/firebase';
import { 
  collection, getDocs, query, orderBy, doc, updateDoc, 
  increment, getDoc, onSnapshot, where, limit, setDoc 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: PieChart },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: DollarSign },
  { id: 'subscriptions', label: 'Subscriptions', icon: Zap },
  { id: 'logs', label: 'Audit Logs', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const { currentUser, userData, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeServices: 0,
    pendingTransactions: 0
  });

  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Data
  useEffect(() => {
    if (!currentUser || !userData) return;

    const unsubStats = onSnapshot(collection(db, 'users'), (snap) => {
      setStats(prev => ({ ...prev, totalUsers: snap.size }));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users'));

    const unsubUsers = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50)), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users'));

    const unsubTx = onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50)), (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStats(prev => ({ ...prev, pendingTransactions: snap.docs.filter(d => d.data().status === 'pending').length }));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'transactions'));

    const unsubSubs = onSnapshot(query(collection(db, 'subscriptions'), orderBy('createdAt', 'desc'), limit(50)), (snap) => {
      setSubscriptions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'subscriptions'));

    const unsubLogs = onSnapshot(query(collection(db, 'adminLogs'), orderBy('timestamp', 'desc'), limit(50)), (snap) => {
      setAdminLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'adminLogs'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) setSystemSettings(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/global'));

    return () => {
      unsubStats();
      unsubUsers();
      unsubTx();
      unsubSubs();
      unsubLogs();
      unsubSettings();
    };
  }, [currentUser, userData]);

  const callAdminApi = async (path: string, method: string = 'GET', body?: any) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API call failed');
      return data;
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const handleUserAction = async (uid: string, action: string, value?: any) => {
    try {
      await callAdminApi(`/api/admin/user/${uid}/action`, 'POST', { action, value });
      showToast(`User ${action} successful`);
    } catch (err) {}
  };

  const handleTxAction = async (txId: string, action: 'approve' | 'reject') => {
    try {
      await callAdminApi(`/api/admin/transaction/${txId}/${action}`, 'POST');
      showToast(`Transaction ${action}d`);
    } catch (err) {}
  };

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...newSettings,
        updatedBy: currentUser?.uid,
        updatedAt: new Date().toISOString()
      });
      showToast('Settings updated');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    }
  };

  if (loading) return null;

  return (
    <div className="pt-24 pb-12 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-text-primary flex items-center gap-3">
              <Shield className="text-brand-primary" size={32} />
              Admin <span className="text-brand-primary">Panel</span>
            </h1>
            <p className="text-text-secondary text-sm mt-1">Enterprise-grade system management & oversight.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search users, tx, logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface border border-border-base rounded-2xl pl-12 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary w-full md:w-80 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsRefreshing(true)}
              className="p-3 bg-surface border border-border-base rounded-2xl text-text-muted hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm"
            >
              <RefreshCcw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 bg-surface p-1.5 rounded-2xl border border-border-base shadow-sm">
          {ADMIN_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-bg-primary shadow-lg shadow-brand-primary/20' 
                  : 'text-text-muted hover:bg-bg-secondary hover:text-text-primary'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'transactions' && stats.pendingTransactions > 0 && (
                <span className="bg-error text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                  {stats.pendingTransactions}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'brand' },
                    { label: 'Total Deposits', value: `$${stats.totalDeposits.toLocaleString()}`, icon: Upload, color: 'success' },
                    { label: 'Total Withdrawals', value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: Download, color: 'error' },
                    { label: 'Active Services', value: stats.activeServices, icon: Zap, color: 'warning' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface rounded-3xl p-6 border border-border-base shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-${item.color}-primary/10 flex items-center justify-center text-${item.color}-primary group-hover:scale-110 transition-transform`}>
                          <item.icon size={24} />
                        </div>
                        <BarChart3 size={20} className="text-text-muted opacity-20" />
                      </div>
                      <div className="text-3xl font-mono font-bold text-text-primary mb-1">{item.value}</div>
                      <div className="text-xs text-text-muted uppercase tracking-widest font-bold">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-surface rounded-3xl p-8 border border-border-base shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                        <Activity size={22} className="text-brand-primary" />
                        System Activity
                      </h3>
                      <button className="text-brand-primary text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                      {adminLogs.slice(0, 6).map((log, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-bg-secondary transition-colors border border-transparent hover:border-border-base">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            log.action.includes('approve') ? 'bg-success/10 text-success' : 
                            log.action.includes('reject') ? 'bg-error/10 text-error' : 'bg-brand-primary/10 text-brand-primary'
                          }`}>
                            {log.action.includes('user') ? <UserCheck size={18} /> : <DollarSign size={18} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-text-primary font-bold">
                              <span className="text-brand-primary">{log.adminEmail}</span> {log.action.replace('_', ' ')}
                            </p>
                            <p className="text-[10px] text-text-muted mt-1 flex items-center gap-2">
                              <Clock size={12} />
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-[10px] font-mono text-text-muted bg-bg-primary px-2 py-1 rounded-lg">
                            {log.targetUserId?.substring(0, 8)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions / Alerts */}
                  <div className="space-y-8">
                    <div className="bg-surface rounded-3xl p-8 border border-border-base shadow-sm">
                      <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                        <Bell size={20} className="text-warning" />
                        Attention Required
                      </h3>
                      <div className="space-y-4">
                        {stats.pendingTransactions > 0 && (
                          <div className="p-4 bg-warning/5 border border-warning/20 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                              <DollarSign size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{stats.pendingTransactions} Pending Transactions</p>
                              <button onClick={() => setActiveTab('transactions')} className="text-[10px] text-warning font-bold hover:underline">Review Now</button>
                            </div>
                          </div>
                        )}
                        <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Zap size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">New Service Requests</p>
                            <button onClick={() => setActiveTab('subscriptions')} className="text-[10px] text-brand-primary font-bold hover:underline">View Requests</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-error/5 rounded-3xl p-8 border border-error/20 shadow-sm">
                      <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-error" />
                        Danger Zone
                      </h3>
                      <p className="text-text-secondary text-xs mb-6 leading-relaxed">
                        Triggering daily tasks manually will distribute profits and check for subscription expiries immediately.
                      </p>
                      <button 
                        onClick={() => callAdminApi('/api/admin/trigger-tasks', 'POST')}
                        className="w-full py-4 bg-error text-white font-bold rounded-2xl hover:bg-error/90 transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2"
                      >
                        <RefreshCcw size={18} />
                        Trigger Daily Automation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-surface rounded-3xl border border-border-base shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border-base flex items-center justify-between bg-bg-secondary/30">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">User Directory</h3>
                    <p className="text-xs text-text-muted mt-1">Manage accounts, balances, and permissions.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-brand-primary text-bg-primary rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">
                      Export CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-secondary/50 text-text-muted text-[10px] uppercase tracking-widest font-extrabold">
                        <th className="p-6">User Identity</th>
                        <th className="p-6">Role</th>
                        <th className="p-6">Financials</th>
                        <th className="p-6">Account Status</th>
                        <th className="p-6">Joined</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base">
                      {users.filter(u => u.email.includes(searchQuery) || u.firstName?.includes(searchQuery)).map(user => (
                        <tr key={user.id} className="hover:bg-bg-secondary/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg shadow-sm">
                                {user.firstName?.[0] || 'U'}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">{user.firstName} {user.lastName}</div>
                                <div className="text-[10px] text-text-muted font-mono">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              user.role.includes('admin') ? 'bg-brand-primary/10 text-brand-primary' : 'bg-bg-primary text-text-muted'
                            }`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="text-sm font-mono font-bold text-text-primary">${user.availableBalance?.toLocaleString() || 0}</div>
                            <div className="text-[10px] text-success font-bold mt-0.5">Profit: ${user.totalProfit?.toLocaleString() || 0}</div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              {user.isBanned ? (
                                <span className="flex items-center gap-1.5 text-error text-[10px] font-bold uppercase bg-error/10 px-2 py-1 rounded-lg">
                                  <Lock size={12} /> Banned
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-success text-[10px] font-bold uppercase bg-success/10 px-2 py-1 rounded-lg">
                                  <Unlock size={12} /> Active
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-6 text-text-muted text-xs font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  const amount = prompt('Enter amount to add (use negative to deduct):');
                                  if (amount) handleUserAction(user.id, 'adjust_balance', parseFloat(amount));
                                }}
                                className="p-2.5 bg-surface border border-border-base rounded-xl text-text-muted hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm"
                                title="Adjust Balance"
                              >
                                <DollarSign size={16} />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user.id, user.isBanned ? 'unban' : 'ban')}
                                className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                                  user.isBanned 
                                    ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' 
                                    : 'bg-error/10 text-error border-error/20 hover:bg-error/20'
                                }`}
                                title={user.isBanned ? 'Unban User' : 'Ban User'}
                              >
                                {user.isBanned ? <Unlock size={16} /> : <UserX size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="bg-surface rounded-3xl border border-border-base shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border-base flex items-center justify-between bg-bg-secondary/30">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Transaction Ledger</h3>
                    <p className="text-xs text-text-muted mt-1">Audit and process all financial movements.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-secondary/50 text-text-muted text-[10px] uppercase tracking-widest font-extrabold">
                        <th className="p-6">Type</th>
                        <th className="p-6">Amount</th>
                        <th className="p-6">User ID</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Date</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-bg-secondary/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                tx.type === 'deposit' ? 'bg-success/10 text-success' : 
                                tx.type === 'withdrawal' ? 'bg-error/10 text-error' : 'bg-brand-primary/10 text-brand-primary'
                              }`}>
                                {tx.type === 'deposit' ? <Upload size={18} /> : tx.type === 'withdrawal' ? <Download size={18} /> : <TrendingUp size={18} />}
                              </div>
                              <span className="text-sm font-bold text-text-primary uppercase tracking-wider">{tx.type}</span>
                            </div>
                          </td>
                          <td className="p-6 text-sm font-mono font-bold text-text-primary">${tx.amount?.toLocaleString()}</td>
                          <td className="p-6 text-text-muted text-xs font-mono">{tx.userId?.substring(0, 12)}...</td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              tx.status === 'completed' ? 'bg-success/10 text-success' :
                              tx.status === 'rejected' ? 'bg-error/10 text-error' :
                              'bg-warning/10 text-warning animate-pulse'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-6 text-text-muted text-xs font-medium">{new Date(tx.createdAt).toLocaleString()}</td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-2">
                              {tx.status === 'pending' && (
                                <>
                                  <button onClick={() => handleTxAction(tx.id, 'approve')} className="p-2.5 bg-success/10 text-success border border-success/20 rounded-xl hover:bg-success/20 transition-all shadow-sm">
                                    <Check size={18} />
                                  </button>
                                  <button onClick={() => handleTxAction(tx.id, 'reject')} className="p-2.5 bg-error/10 text-error border border-error/20 rounded-xl hover:bg-error/20 transition-all shadow-sm">
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              {tx.proofUrl && (
                                <a href={tx.proofUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-surface border border-border-base rounded-xl text-text-muted hover:text-brand-primary transition-all shadow-sm">
                                  <ExternalLink size={18} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="bg-surface rounded-3xl border border-border-base shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border-base flex items-center justify-between bg-bg-secondary/30">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Service Subscriptions</h3>
                    <p className="text-xs text-text-muted mt-1">Manage mentorship, signals, and account management requests.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-secondary/50 text-text-muted text-[10px] uppercase tracking-widest font-extrabold">
                        <th className="p-6">Service</th>
                        <th className="p-6">User</th>
                        <th className="p-6">Plan</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Expiry</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base">
                      {subscriptions.map(sub => (
                        <tr key={sub.id} className="hover:bg-bg-secondary/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Zap size={18} />
                              </div>
                              <span className="text-sm font-bold text-text-primary uppercase tracking-wider">{sub.serviceType}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm font-bold text-text-primary">{sub.userEmail}</div>
                            <div className="text-[10px] text-text-muted font-mono">{sub.userId?.substring(0, 8)}</div>
                          </td>
                          <td className="p-6">
                            <span className="text-xs text-brand-primary font-bold uppercase tracking-wider">{sub.planName}</span>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              sub.status === 'active' ? 'bg-success/10 text-success' :
                              sub.status === 'expired' ? 'bg-error/10 text-error' :
                              'bg-warning/10 text-warning animate-pulse'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-6 text-text-muted text-xs font-medium">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-2">
                              {sub.status === 'pending' && (
                                <>
                                  <button onClick={() => handleTxAction(sub.id, 'approve')} className="p-2.5 bg-success/10 text-success border border-success/20 rounded-xl hover:bg-success/20 transition-all shadow-sm">
                                    <Check size={18} />
                                  </button>
                                  <button onClick={() => handleTxAction(sub.id, 'reject')} className="p-2.5 bg-error/10 text-error border border-error/20 rounded-xl hover:bg-error/20 transition-all shadow-sm">
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="bg-surface rounded-3xl border border-border-base shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border-base flex items-center justify-between bg-bg-secondary/30">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Audit Logs</h3>
                    <p className="text-xs text-text-muted mt-1">Track all administrative actions and system changes.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-secondary/50 text-text-muted text-[10px] uppercase tracking-widest font-extrabold">
                        <th className="p-6">Admin</th>
                        <th className="p-6">Action</th>
                        <th className="p-6">Target</th>
                        <th className="p-6">Details</th>
                        <th className="p-6">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-base">
                      {adminLogs.map(log => (
                        <tr key={log.id} className="hover:bg-bg-secondary/30 transition-colors">
                          <td className="p-6">
                            <div className="text-sm font-bold text-text-primary">{log.adminEmail}</div>
                            <div className="text-[10px] text-text-muted font-mono">{log.adminId?.substring(0, 8)}</div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              {log.action.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-6 text-text-muted text-xs font-mono">{log.targetUserId?.substring(0, 12)}...</td>
                          <td className="p-6">
                            <div className="text-[10px] text-text-muted max-w-[200px] truncate">
                              {JSON.stringify(log.details)}
                            </div>
                          </td>
                          <td className="p-6 text-text-muted text-xs font-medium">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && systemSettings && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface rounded-3xl p-8 border border-border-base shadow-sm">
                  <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
                    <TrendingUp size={22} className="text-brand-primary" />
                    Investment ROI Configuration
                  </h3>
                  <div className="space-y-6">
                    {['bronze', 'silver', 'gold'].map(plan => (
                      <div key={plan} className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{plan} Plan Annual ROI (%)</label>
                        <div className="relative">
                          <PieChart className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                          <input 
                            type="number" 
                            value={systemSettings.roi[plan]}
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              roi: { ...systemSettings.roi, [plan]: parseFloat(e.target.value) }
                            })}
                            className="w-full bg-bg-primary border border-border-base rounded-2xl py-4 pl-12 pr-4 text-text-primary focus:border-brand-primary outline-none transition-all font-mono font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => handleUpdateSettings(systemSettings)}
                      className="w-full py-4 bg-brand-primary text-bg-primary font-bold rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all mt-4"
                    >
                      Save ROI Settings
                    </button>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-8 border border-border-base shadow-sm">
                  <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
                    <Zap size={22} className="text-warning" />
                    Feature Kill Switches
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(systemSettings.features).map(([key, enabled]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const updated = { ...systemSettings, features: { ...systemSettings.features, [key]: !enabled } };
                          setSystemSettings(updated);
                          handleUpdateSettings(updated);
                        }}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 text-center ${
                          enabled 
                            ? 'bg-success/5 border-success/20 text-success hover:bg-success/10' 
                            : 'bg-error/5 border-error/20 text-error hover:bg-error/10'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${enabled ? 'bg-success/10' : 'bg-error/10'}`}>
                          {enabled ? <Unlock size={24} /> : <Lock size={24} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1">{key.replace('Enabled', '').replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-[10px] opacity-60 font-bold">{enabled ? 'SYSTEM ACTIVE' : 'SYSTEM DISABLED'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
