import React from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  PieChart,
  GraduationCap,
  Award,
  Zap,
  Briefcase,
  Coins,
  ClipboardCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StickyHeader from '../components/StickyHeader';

const MOCK_SERVICES = [
  { name: 'Investment', status: 'Active', detail: 'Growth Pack', icon: Coins, color: 'text-green-500', path: '/activities/investment' },
  { name: 'Mentorship', status: 'Active', detail: '3 Month Program', icon: GraduationCap, color: 'text-blue-500', path: '/activities/mentorship' },
  { name: 'Signal Services', status: 'Active', detail: 'Premium VIP', icon: Zap, color: 'text-yellow-500', path: '/activities/signals' },
  { name: 'Evaluation', status: 'Inactive', detail: 'No active challenge', icon: Award, color: 'text-purple-500', path: '/activities/evaluation' },
  { name: 'Account Management', status: 'Expired', detail: 'Last: $5,000 account', icon: Briefcase, color: 'text-orange-500', path: '/activities/account-management' },
];

export default function Assets() {
  const [transactions, setTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('owambe_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved).slice(0, 5)); // Show only first 5
      } catch (e) {
        setTransactions([]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pb-24 pt-16">
      <StickyHeader title="Assets overview" />
      
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Balance Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-6 mb-6"
        >
          <div className="flex items-center gap-2 text-text-secondary mb-2">
            <Wallet size={16} />
            <span className="text-xs font-medium">Total Balance</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-6">$0.00</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-secondary/50 rounded-2xl p-4 border border-border-base/50">
              <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Available</p>
              <p className="text-sm font-bold text-text-primary">$0.00</p>
            </div>
            <div className="bg-bg-secondary/50 rounded-2xl p-4 border border-border-base/50">
              <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Locked</p>
              <p className="text-sm font-bold text-text-primary">$0.00</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Link to="/deposit-funds" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-bg-primary transition-all">
              <ArrowUpRight size={24} />
            </div>
            <span className="text-[10px] font-bold text-text-secondary">Add Funds</span>
          </Link>
          <Link to="/withdraw" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
              <ArrowDownLeft size={24} />
            </div>
            <span className="text-[10px] font-bold text-text-secondary">Withdraw</span>
          </Link>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
              <Repeat size={24} />
            </div>
            <span className="text-[10px] font-bold text-text-secondary">Transfer</span>
          </button>
        </div>

        {/* Active Services */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-text-primary mb-4 px-1">Active Services</h2>
          <div className="space-y-3">
            {MOCK_SERVICES.map((service, idx) => (
              <Link key={idx} to={service.path} className="card-base p-4 flex items-center justify-between card-hover block">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center ${service.color}`}>
                    <service.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{service.name}</p>
                    <p className="text-[10px] text-text-muted">{service.detail}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    service.status === 'Active' ? 'bg-success/10 text-success' : 
                    service.status === 'Expired' ? 'bg-error/10 text-error' : 'bg-bg-secondary text-text-muted'
                  }`}>
                    {service.status}
                  </span>
                  <ChevronRight size={14} className="text-text-muted" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm font-bold text-text-primary">Transaction History</h2>
            <Link to="/transactions" className="text-[10px] font-bold text-brand-primary">View All</Link>
          </div>
          <div className="card-base overflow-hidden">
            {transactions.length > 0 ? (
              transactions.map((tx, idx) => (
                <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-border-base' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'Deposit' ? 'bg-success/10 text-success' : 
                      tx.type === 'Subscription' ? 'bg-error/10 text-error' : 'bg-brand-primary/10 text-brand-primary'
                    }`}>
                      {tx.type === 'Deposit' ? <ArrowDownLeft size={16} /> : 
                       tx.type === 'Subscription' ? <ArrowUpRight size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{tx.type} - {tx.serviceName || ''}</p>
                      <p className="text-[10px] text-text-muted">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${tx.amount.startsWith('+') ? 'text-success' : 'text-error'}`}>{tx.amount}</p>
                    <p className="text-[10px] text-text-muted">{tx.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Clock size={32} className="text-text-muted mx-auto mb-2" />
                <p className="text-xs text-text-muted">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
