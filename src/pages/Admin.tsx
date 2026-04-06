import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Upload, Download, TrendingUp, Activity, Settings, DollarSign, Check, X, 
  Search, Filter, MoreVertical, Shield, AlertTriangle, RefreshCcw, Ticket, Briefcase, 
  ChevronRight, MessageSquare, ExternalLink, UserCheck, UserX, Clock, Trash2
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const ADMIN_TABS = ['Dashboard', 'Users', 'Tickets', 'Deposits', 'Withdrawals', 'Investments', 'Account Management'];

export default function Admin() {
  const { currentUser, userData, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    totalUsers: 1240,
    totalDeposits: 450000,
    totalWithdrawals: 120000,
    pendingDeposits: 5,
    pendingWithdrawals: 3,
    totalProfit: 85000,
    activeInvestments: 42,
    pendingTickets: 8
  });

  const [users, setUsers] = useState<any[]>([
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', country: 'USA', createdAt: new Date().toISOString(), status: 'Active', balance: 12500 },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', country: 'UK', createdAt: new Date().toISOString(), status: 'Active', balance: 5400 },
    { id: '3', firstName: 'Michael', lastName: 'Okonkwo', email: 'michael@owambe.com', country: 'Nigeria', createdAt: new Date().toISOString(), status: 'Pending', balance: 0 },
  ]);

  const [deposits, setDeposits] = useState<any[]>([
    { id: 'd1', userId: '1', userName: 'John Doe', amount: 1000, method: 'USDT TRC20', transactionHash: '0x123...', status: 'Pending', createdAt: new Date().toISOString() },
    { id: 'd2', userId: '2', userName: 'Jane Smith', amount: 500, method: 'USDT TRC20', transactionHash: '0x456...', status: 'Approved', createdAt: new Date().toISOString() },
  ]);

  const [withdrawals, setWithdrawals] = useState<any[]>([
    { id: 'w1', userId: '1', userName: 'John Doe', amount: 200, walletAddress: 'TXYZ...', status: 'Pending', createdAt: new Date().toISOString() },
  ]);

  const [investments, setInvestments] = useState<any[]>([
    { id: 'i1', userName: 'John Doe', plan: 'Gold Plan', amount: 5000, createdAt: new Date().toISOString(), status: 'Active', expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'i2', userName: 'Jane Smith', plan: 'Silver Plan', amount: 2000, createdAt: new Date().toISOString(), status: 'Pending' },
  ]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [accountManagementApps, setAccountManagementApps] = useState<any[]>([
    { id: 'a1', fullName: 'John Doe', username: 'johndoe', phone: '+123456789', broker: 'IC Markets', accountSize: 10000, platform: 'MT4', status: 'Pending', createdAt: { toDate: () => new Date() } },
  ]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    const savedTickets = localStorage.getItem('owambe_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      const initialTickets = [
        { id: 't1', subject: 'Deposit not reflecting', category: 'Transaction', status: 'Pending', message: 'I deposited 500 USDT but it is not showing.', createdAt: new Date().toISOString() },
        { id: 't2', subject: 'How to join mentorship?', category: 'Service', status: 'Resolved', message: 'I want to join the advanced mentorship.', createdAt: new Date().toISOString() }
      ];
      setTickets(initialTickets);
      localStorage.setItem('owambe_tickets', JSON.stringify(initialTickets));
    }
  }, []);

  const handleApproveTicket = (ticketId: string) => {
    const updated = tickets.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t);
    setTickets(updated);
    localStorage.setItem('owambe_tickets', JSON.stringify(updated));
    alert('Ticket marked as resolved.');
  };

  const handleSystemReset = () => {
    if (window.confirm('CRITICAL WARNING: Are you sure you want to reset the entire system? This will clear all balances, transactions, and tickets for all users. This action cannot be undone.')) {
      localStorage.removeItem('owambe_tickets');
      localStorage.removeItem('owambe_notifications');
      alert('System has been reset successfully (Mock).');
      window.location.reload();
    }
  };

  const handleApproveDeposit = (depositId: string) => {
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'Approved' } : d));
    alert('Deposit approved successfully.');
  };

  const handleRejectDeposit = (depositId: string) => {
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'Rejected' } : d));
    alert('Deposit rejected.');
  };

  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'Approved' } : w));
    alert('Withdrawal approved successfully.');
  };

  const handleRejectWithdrawal = (withdrawalId: string) => {
    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'Rejected' } : w));
    alert('Withdrawal rejected.');
  };

  const handleApproveInvestment = (investmentId: string) => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        return { ...inv, status: 'Active', expiryDate: expiryDate.toISOString() };
      }
      return inv;
    }));
    alert('Investment approved and activated.');
  };

  const handleRejectInvestment = (investmentId: string) => {
    setInvestments(prev => prev.map(inv => inv.id === investmentId ? { ...inv, status: 'Rejected' } : inv));
    alert('Investment rejected.');
  };

  const handleGenerateTicket = (type: 'Service' | 'Transaction') => {
    const subject = window.prompt(`Enter ${type} Ticket Subject:`);
    const message = window.prompt(`Enter ${type} Ticket Message:`);
    if (subject && message) {
      const newTicket = {
        id: Math.random().toString(36).substring(2, 9),
        subject,
        category: type,
        status: 'Pending',
        message,
        createdAt: new Date().toISOString()
      };
      const updated = [newTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem('owambe_tickets', JSON.stringify(updated));
      alert(`${type} ticket generated successfully.`);
    }
  };

  const handleUpdateAmStatus = (appId: string, status: string) => {
    setAccountManagementApps(prev => prev.map(app => app.id === appId ? { ...app, status } : app));
    setSelectedApp(prev => prev ? { ...prev, status } : null);
    alert(`Application status updated to ${status}.`);
  };

  const handleAssignManager = (appId: string) => {
    if (!managerName.trim()) {
      alert('Please enter a manager name.');
      return;
    }
    setAccountManagementApps(prev => prev.map(app => app.id === appId ? { ...app, manager: managerName } : app));
    setSelectedApp(prev => prev ? { ...prev, manager: managerName } : null);
    setManagerName('');
    alert(`Manager assigned successfully.`);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied successfully');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || !userData || userData.role !== 'admin') {
    return (
      <div className="pt-32 pb-12 min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-brand-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">You do not have permission to access the Admin Panel.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Admin <span className="text-brand-primary">Control Panel</span></h1>
            <p className="text-gray-400 text-sm mt-1">Manage users, transactions, and system settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary w-64"
              />
            </div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-white/5 pb-4">
          {ADMIN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-brand-primary text-brand-dark shadow-lg shadow-brand-primary/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {activeTab === 'Dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-dark rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Users size={20} />
                    </div>
                    <span className="text-xs text-green-400 font-medium">+12%</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">{stats.totalUsers}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Users</div>
                </div>
                
                <div className="glass-dark rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center text-green-400">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs text-yellow-500 font-medium">{stats.pendingDeposits} Pending</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">${stats.totalDeposits.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Deposits</div>
                </div>

                <div className="glass-dark rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center text-red-400">
                      <Download size={20} />
                    </div>
                    <span className="text-xs text-yellow-500 font-medium">{stats.pendingWithdrawals} Pending</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">${stats.totalWithdrawals.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Withdrawals</div>
                </div>

                <div className="glass-dark rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
                      <TrendingUp size={20} />
                    </div>
                    <span className="text-xs text-green-400 font-medium">+8%</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">${stats.totalProfit.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Profit</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-dark rounded-2xl p-8 border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-brand-primary" />
                    Recent Activity
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">New user registration: John Doe</p>
                          <p className="text-[10px] text-gray-500">2 minutes ago</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-dark rounded-2xl p-8 border border-red-500/20 bg-red-500/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-red-400" />
                    System Management
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Perform a complete system reset. This action is <strong className="text-red-400">irreversible</strong> and will set all user balances to zero, clear all transaction histories, and reset all tickets.
                  </p>
                  <button 
                    onClick={handleSystemReset}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={20} />
                    Reset Entire System
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Users Management</h3>
                <button className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all">+ Add User</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Country</th>
                      <th className="p-4 font-bold">Balance</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Joined</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{user.firstName} {user.lastName}</div>
                              <div className="text-[10px] text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">{user.country}</td>
                        <td className="p-4 text-white font-mono font-bold text-sm">${user.balance.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><Settings size={16} /></button>
                            <button className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"><X size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <Users size={48} className="text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">No users found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Tickets' && (
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Tickets Management</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage support and transaction queries.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleGenerateTicket('Service')} className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all flex items-center gap-2">
                    <Ticket size={14} />
                    Service Ticket
                  </button>
                  <button onClick={() => handleGenerateTicket('Transaction')} className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all flex items-center gap-2">
                    <DollarSign size={14} />
                    Transaction Ticket
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Subject</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="text-sm font-bold text-white">{ticket.subject}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[200px]">{ticket.message}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            ticket.category === 'Transaction' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                          }`}>
                            {ticket.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-xs">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          {ticket.status === 'Pending' && (
                            <button 
                              onClick={() => handleApproveTicket(ticket.id)}
                              className="px-4 py-2 bg-brand-primary text-brand-dark rounded-xl text-xs font-bold hover:bg-brand-secondary transition-all"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {tickets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <Ticket size={48} className="text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">No tickets found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Deposits' && (
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Deposit Approvals</h3>
                <p className="text-xs text-gray-500 mt-1">Review and approve user deposit requests.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Method</th>
                      <th className="p-4 font-bold">Tx Hash</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {deposits.map(dep => (
                      <tr key={dep.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="text-sm font-bold text-white">{dep.userName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">ID: {dep.userId}</div>
                        </td>
                        <td className="p-4 text-white font-mono font-bold text-sm">${dep.amount.toLocaleString()}</td>
                        <td className="p-4 text-gray-400 text-sm">{dep.method}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono">
                            {dep.transactionHash.substring(0, 10)}...
                            <button 
                              onClick={() => handleCopy(dep.transactionHash, `dep-${dep.id}`)}
                              className="p-1 hover:text-brand-primary transition-colors"
                              title="Copy Hash"
                            >
                              {copiedId === `dep-${dep.id}` ? <Check size={12} className="text-brand-primary" /> : <ExternalLink size={12} />}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            dep.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                            dep.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {dep.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {dep.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveDeposit(dep.id)} className="p-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors"><Check size={18} /></button>
                              <button onClick={() => handleRejectDeposit(dep.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"><X size={18} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {deposits.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <Upload size={48} className="text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">No deposits found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Withdrawals' && (
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Withdrawal Approvals</h3>
                <p className="text-xs text-gray-500 mt-1">Review and approve user withdrawal requests.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Wallet Address</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {withdrawals.map(withd => (
                      <tr key={withd.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="text-sm font-bold text-white">{withd.userName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">ID: {withd.userId}</div>
                        </td>
                        <td className="p-4 text-white font-mono font-bold text-sm">${withd.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono">
                            {withd.walletAddress.substring(0, 12)}...
                            <button 
                              onClick={() => handleCopy(withd.walletAddress, `withd-${withd.id}`)}
                              className="p-1 hover:text-brand-primary transition-colors"
                              title="Copy Address"
                            >
                              {copiedId === `withd-${withd.id}` ? <Check size={12} className="text-brand-primary" /> : <ExternalLink size={12} />}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            withd.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                            withd.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {withd.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {withd.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveWithdrawal(withd.id)} className="p-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors"><Check size={18} /></button>
                              <button onClick={() => handleRejectWithdrawal(withd.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"><X size={18} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <Download size={48} className="text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">No withdrawals found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Investments' && (
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Investment Management</h3>
                <p className="text-xs text-gray-500 mt-1">Approve or reject investment applications.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Plan</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Expiry</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {investments.map(inv => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-bold text-sm">{inv.userName}</td>
                        <td className="p-4">
                          <span className="text-xs text-brand-primary font-bold uppercase tracking-wider">{inv.plan}</span>
                        </td>
                        <td className="p-4 text-white font-mono font-bold text-sm">${inv.amount.toLocaleString()}</td>
                        <td className="p-4 text-gray-500 text-xs">{inv.expiryDate ? new Date(inv.expiryDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            inv.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                            inv.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                            inv.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {inv.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveInvestment(inv.id)} className="p-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors"><Check size={18} /></button>
                              <button onClick={() => handleRejectInvestment(inv.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"><X size={18} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {investments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <TrendingUp size={48} className="text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">No investments found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Account Management' && (
            <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Account Management Applications</h3>
                <p className="text-xs text-gray-500 mt-1">Manage applications for account management services.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Applicant</th>
                      <th className="p-4 font-bold">Broker</th>
                      <th className="p-4 font-bold">Size</th>
                      <th className="p-4 font-bold">Manager</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {accountManagementApps.map(app => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="text-sm font-bold text-white">{app.fullName}</div>
                          <div className="text-[10px] text-gray-500">@{app.username}</div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">{app.broker}</td>
                        <td className="p-4 text-white font-mono font-bold text-sm">${app.accountSize?.toLocaleString()}</td>
                        <td className="p-4 text-gray-400 text-sm">{app.manager || 'Unassigned'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                            app.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                            app.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {accountManagementApps.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <Briefcase size={48} className="text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">No applications found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark rounded-3xl border border-white/10 p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                <Briefcase className="text-brand-primary" />
                Application Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-brand-primary font-bold mb-4 uppercase text-[10px] tracking-widest">Personal Info</h4>
                    <div className="space-y-4">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Full Name</span>
                        <span className="text-white font-medium">{selectedApp.fullName}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Username</span>
                        <span className="text-white font-medium">@{selectedApp.username}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Phone</span>
                        <span className="text-white font-medium">{selectedApp.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-brand-primary font-bold mb-4 uppercase text-[10px] tracking-widest">Trading Account</h4>
                    <div className="space-y-4">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Broker / Platform</span>
                        <span className="text-white font-medium">{selectedApp.broker} ({selectedApp.platform})</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Account Size</span>
                        <span className="text-brand-primary font-mono font-bold">${selectedApp.accountSize?.toLocaleString()}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Login ID</span>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-mono">{selectedApp.login}</span>
                          <button 
                            onClick={() => handleCopy(selectedApp.login, `app-login-${selectedApp.id}`)}
                            className="text-brand-primary hover:text-brand-secondary transition-colors"
                          >
                            {copiedId === `app-login-${selectedApp.id}` ? <Check size={14} /> : <ExternalLink size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-brand-primary/5 rounded-2xl p-6 border border-brand-primary/20 mb-8">
                <h4 className="text-brand-primary font-bold mb-4 uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <UserCheck size={14} />
                  Assign Manager
                </h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Manager Name"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    onClick={() => handleAssignManager(selectedApp.id)}
                    className="px-6 py-3 bg-brand-primary text-brand-dark hover:bg-brand-secondary rounded-xl font-bold transition-all"
                  >
                    Assign
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <button 
                  onClick={() => handleUpdateAmStatus(selectedApp.id, 'Approved')}
                  className="flex-1 min-w-[140px] py-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Approve
                </button>
                <button 
                  onClick={() => handleUpdateAmStatus(selectedApp.id, 'In Progress')}
                  className="flex-1 min-w-[140px] py-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} />
                  In Progress
                </button>
                <button 
                  onClick={() => handleUpdateAmStatus(selectedApp.id, 'Rejected')}
                  className="flex-1 min-w-[140px] py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Reject
                </button>
              </div>

              <a 
                href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} className="text-brand-primary" />
                Contact Client on WhatsApp
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
