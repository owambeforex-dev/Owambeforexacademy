import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings, Copy, ShieldAlert, Bell, Headset, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import SearchInput from './SearchInput';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useToast } from '../contexts/ToastContext';
import { CheckCircle2 } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { 
    name: 'All Services', 
    path: '/services',
    dropdown: [
      { name: 'Mentorship', path: '/services/mentorship' },
      { name: 'Signal Services', path: '/services/signals' },
      { name: 'Account Management', path: '/services/account-management' },
      { name: 'Investment', path: '/services/investment' },
      { name: 'Prop Firm Evaluation Passing', path: '/services/evaluation' },
    ]
  },
  { 
    name: 'Trading Tools', 
    path: '/trading-tools',
    dropdown: [
      { name: 'Risk Calculator', path: '/trading-tools' },
      { name: 'Market News', path: '/market-news' },
    ]
  },
  { name: 'Top Traders', path: '/top-traders' },
  { name: 'AI Insights', path: '/ai-insights' },
  { name: 'Assets', path: '/assets' },
  { 
    name: 'More', 
    path: '#',
    dropdown: [
      { name: 'Trade', path: '/trade' },
      { name: 'Markets', path: '/markets' },
      { name: 'Copy Trading', path: '/copy-trading' },
      { name: 'Support', path: '/support' },
    ]
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'Exchange' | 'Wallet'>('Exchange');
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const { currentUser, userData, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { showToast } = useToast();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyUid = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const uid = currentUser?.uid || 'owambe-trader-12345';
    navigator.clipboard.writeText(uid);
    setCopied(true);
    showToast('Copied successfully');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    console.log('Logout disabled');
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-base h-16 md:h-20 flex items-center">
      <div className="container mx-auto px-4">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-20 w-full gap-4 lg:gap-8">
          
          {/* Left Side: User Profile */}
          <div className="flex items-center shrink-0">
            <div className="relative group">
              <Link to="/profile" className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-bg-primary transition-colors">
                <User size={20} />
              </Link>
              
              <div className="absolute top-full left-0 mt-2 w-72 bg-surface border border-border-base rounded-xl overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4 border-b border-border-base">
                  <div className="flex items-center gap-3 mb-3">
                    <Link to="/profile" className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 hover:bg-brand-primary hover:text-brand-dark transition-colors">
                      <User size={24} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to="/profile" className="text-base font-semibold text-text-primary hover:text-brand-primary transition-colors truncate block">
                        {userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'Trader'}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-secondary">UID: {currentUser?.uid?.substring(0, 8)}...</span>
                        <button 
                          onClick={handleCopyUid}
                          className="relative text-text-secondary hover:text-brand-primary transition-colors"
                        >
                          {copied ? <CheckCircle2 size={12} className="text-brand-primary" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-bg-secondary rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} className="text-error" />
                      <span className="text-xs font-medium text-text-secondary">Identity Verification</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-error/10 text-error">
                      {userData?.identityVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-primary hover:bg-surface-hover rounded-lg transition-colors">
                    <User size={16} /> My Info
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-brand-primary hover:bg-surface-hover rounded-lg transition-colors">
                    <Settings size={16} /> Security Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Navigation Links and Actions */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0 ml-auto">
            {/* Desktop Nav */}
            <div className="flex items-center gap-4 lg:gap-8">
              {NAV_LINKS.map((link) => (
                <div 
                  key={link.name} 
                  className="h-20 flex items-center"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={`nav-link capitalize flex items-center gap-1 h-full ${
                      location.pathname === link.path || (link.dropdown && link.dropdown.some(item => location.pathname.startsWith(item.path))) ? 'text-brand-primary' : 'text-text-secondary'
                    }`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                  </Link>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 border-l border-border-base pl-8">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Mobile Navbar Header */}
        <div className="flex md:hidden items-center gap-2 h-16 w-full px-2">
          <Link to="/profile" className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 border border-brand-primary/20">
            <User size={20} />
          </Link>

          <div className="flex-1 min-w-0">
            <SearchInput 
              isMobile={true}
            />
          </div>

          <div className="flex items-center gap-0 shrink-0">
            <Link to="/notifications" className="relative p-1.5">
              <Bell size={20} className="text-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-error text-bg-primary text-[7px] font-bold rounded-full border border-bg-primary flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/support" className="p-1.5">
              <Headset size={20} className="text-text-secondary" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={() => setActiveDropdown(null)}
            className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-border-base shadow-2xl py-12 hidden md:block z-40"
          >
            <div className="w-full px-8 lg:px-16">
              <div className="flex flex-wrap items-start justify-center gap-8 lg:gap-12">
                {NAV_LINKS.find(l => l.name === activeDropdown)?.dropdown?.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="min-w-[200px] max-w-[280px]"
                  >
                    <Link
                      to={item.path}
                      className={`group flex flex-col gap-2 p-4 rounded-2xl transition-all duration-300 hover:bg-brand-primary/5 border border-transparent hover:border-brand-primary/10 ${
                        location.pathname === item.path ? 'bg-brand-primary/5 border-brand-primary/10' : ''
                      }`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold transition-colors duration-300 ${
                          location.pathname === item.path ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary'
                        }`}>
                          {item.name}
                        </span>
                        <ArrowRight size={14} className="text-brand-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                        Professional {item.name.toLowerCase()} services tailored for your trading success.
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
