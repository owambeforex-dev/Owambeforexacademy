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
import { useAuth } from '../contexts/AuthContext';

const SERVICES_CONFIG = [
  { id: 'investment', name: 'Investment', icon: Coins, color: 'text-green-500', path: '/activities/investment', inactiveText: 'No active investment' },
  { id: 'mentorship', name: 'Mentorship', icon: GraduationCap, color: 'text-blue-500', path: '/activities/mentorship', inactiveText: 'No active mentorship program' },
  { id: 'signals', name: 'Signal Service', icon: Zap, color: 'text-yellow-500', path: '/activities/signals', inactiveText: 'No active signal service' },
  { id: 'evaluation', name: 'Evaluation', icon: Award, color: 'text-purple-500', path: '/activities/evaluation', inactiveText: 'No active evaluation' },
  { id: 'accountManagement', name: 'Account Management', icon: Briefcase, color: 'text-orange-500', path: '/activities/account-management', inactiveText: 'No account management service' },
];

export default function Assets() {
  const { userData } = useAuth();
  const [transactions, setTransactions] = React.useState<any[]>([]);

  const getServiceStatus = (serviceId: string) => {
    const serviceData = userData?.services?.[serviceId];
    const config = SERVICES_CONFIG.find(s => s.id === serviceId);
    
    if (serviceData) {
      return {
        status: 'Active',
        detail: serviceData.planName || 'Active Plan',
        isActive: true
      };
    }
    return {
      status: 'Inactive',
      detail: config?.inactiveText || 'No active service',
      isActive: false
    };
  };

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
          <h1 className="text-3xl font-bold text-text-primary mb-6">${(userData?.availableBalance || 0).toLocaleString()}</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-secondary/50 rounded-2xl p-4 border border-border-base/50">
              <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Available</p>
              <p className="text-sm font-bold text-text-primary">${(userData?.availableBalance || 0).toLocaleString()}</p>
            </div>
            <div className="bg-bg-secondary/50 rounded-2xl p-4 border border-border-base/50">
              <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Locked</p>
              <p className="text-sm font-bold text-text-primary">${(userData?.lockedBalance || 0).toLocaleString()}</p>
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
          <Link to="/transfer" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
              <Repeat size={24} />
            </div>
            <span className="text-[10px] font-bold text-text-secondary">Transfer</span>
          </Link>
        </div>

        {/* Active Services */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-text-primary mb-4 px-1">Active Services</h2>
          <div className="space-y-3">
            {SERVICES_CONFIG.map((service) => {
              const { status, detail, isActive } = getServiceStatus(service.id);
              return (
                <Link 
                  key={service.id} 
                  to={service.path} 
                  className="card-base p-4 flex items-center justify-between card-hover block"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center ${service.color}`}>
                      <service.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{service.name}</p>
                      <p className="text-[10px] text-text-muted">{detail}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-success/10 text-success' : 'bg-bg-secondary text-text-muted'
                    }`}>
                      {status}
                    </span>
                    <ChevronRight size={14} className="text-text-muted" />
                  </div>
                </Link>
              );
            })}
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
