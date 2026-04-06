import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Zap, 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  Brain, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpRight,
  Users as UsersIcon,
  Search as SearchIcon
} from 'lucide-react';
import SearchInput from '../SearchInput';
import MoreNavigationModal from './MoreNavigationModal';
import LiveTicker from './LiveTicker';
import TrustMetrics from './TrustMetrics';
import LiveTradingResults from './LiveTradingResults';
import LiveWithdrawals from './LiveWithdrawals';
import GlobalReviews from './GlobalReviews';
import SmartScarcity from './SmartScarcity';
import FAQ from './FAQ';
import Services from './Services';

const MoreIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="45" className={className}>
    {/* Top Left Square */}
    <rect x="50" y="50" width="175" height="175" rx="50" />
    {/* Top Right Square */}
    <rect x="287" y="50" width="175" height="175" rx="50" />
    {/* Bottom Left Square */}
    <rect x="50" y="287" width="175" height="175" rx="50" />
    {/* Bottom Right Search Icon */}
    <circle cx="365" cy="365" r="85" />
    <line x1="425" y1="425" x2="475" y2="475" strokeLinecap="round" />
  </svg>
);

const QUICK_ACTIONS = [
  { name: 'Mentorship', icon: GraduationCap, path: '/services/mentorship' },
  { name: 'Signal Services', icon: Zap, path: '/services/signals' },
  { name: 'Account Management', icon: Users, path: '/services/account-management' },
  { name: 'Evaluation', icon: ClipboardCheck, path: '/services/evaluation' },
  { name: 'Investment', icon: TrendingUp, path: '/services/investment' },
  { name: 'AI Insights', icon: Brain, path: '/ai-insights' },
  { name: 'More', icon: MoreIcon, path: '#' },
];

export default function MobileHome() {
  const navigate = useNavigate();
  const [isMoreModalOpen, setIsMoreModalOpen] = React.useState(false);

  return (
    <div className="md:hidden bg-bg-primary min-h-screen pb-20">
      <LiveTicker />
      <MoreNavigationModal 
        isOpen={isMoreModalOpen} 
        onClose={() => setIsMoreModalOpen(false)} 
      />

      {/* Balance Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <span>Est. Total Value(USD)</span>
            <ChevronUp size={14} />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary">$0.00</h1>
          <Link 
            to="/deposit-funds"
            className="bg-brand-primary text-bg-primary px-6 py-2.5 rounded-lg font-bold text-[10px] shadow-lg shadow-brand-primary/10"
          >
            Add Funds
          </Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-text-muted mt-4">
          <span>Expand asset trend chart --</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 py-4 grid grid-cols-4 gap-y-6">
        {QUICK_ACTIONS.map((action) => (
          <button 
            key={action.name} 
            onClick={() => {
              if (action.name === 'More') {
                setIsMoreModalOpen(true);
              } else {
                navigate(action.path);
              }
            }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-surface border border-border-base rounded-xl flex items-center justify-center text-brand-primary">
              <action.icon size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] text-text-secondary font-medium">{action.name}</span>
          </button>
        ))}
      </div>

      {/* Promotion Banner */}
      <div className="px-4 py-4">
        <div className="bg-surface border border-border-base rounded-2xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary font-medium">Owambe April Challenge</span>
              <button className="text-text-muted">
                <MoreIcon size={14} className="rotate-45" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-primary">100,000 USDC Awaits You</h3>
              <button className="bg-bg-secondary text-text-primary px-4 py-1.5 rounded-lg text-[10px] font-bold">
                Join
              </button>
            </div>
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
      </div>

      {/* Market Widgets */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3">
        {/* BNB Card */}
        <div className="bg-surface border border-border-base rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-[10px] font-bold text-bg-primary">
              B
            </div>
            <span className="text-xs font-bold text-text-secondary">BNB</span>
          </div>
          <div className="mb-2">
            <div className="text-base font-bold text-text-primary">587.27</div>
            <div className="text-[10px] text-success flex items-center gap-0.5">
              <ArrowUpRight size={10} />
              2.31%
            </div>
          </div>
          {/* Sparkline */}
          <div className="h-12 w-full mt-2">
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <path
                d="M0 35 Q 20 35, 40 25 T 80 15 T 100 5"
                fill="none"
                stroke="#02c076"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* P2P Card */}
        <div className="bg-surface border border-border-base rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-text-secondary">P2P Orders</span>
              <ChevronUp size={14} className="rotate-90 text-text-muted" />
            </div>
            <p className="text-[10px] text-text-muted leading-tight">
              Buy/Sell Crypto with USD
            </p>
          </div>
          
          <div className="flex items-center justify-around mt-4">
            <div className="flex flex-col items-center gap-1">
              <Users size={20} className="text-text-secondary" />
              <span className="text-[10px] text-text-muted">P2P</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <SearchIcon size={20} className="text-text-secondary" />
              <span className="text-[10px] text-text-muted">Find Offer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-border-base">
          {['Discover', 'Following', 'Campaign', 'Hot'].map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 text-xs font-bold whitespace-nowrap relative ${
                i === 0 ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              {tab}
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"></div>
              )}
            </button>
          ))}
          <div className="ml-auto pb-3">
            <ChevronUp size={16} className="text-text-muted" />
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="space-y-8 pb-12">
        <TrustMetrics />
        <SmartScarcity />
        <Services />
        <LiveTradingResults />
        <LiveWithdrawals />
        <GlobalReviews />
        <FAQ />
      </div>
    </div>
  );
}
