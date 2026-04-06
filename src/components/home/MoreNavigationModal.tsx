import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  GraduationCap, 
  Zap, 
  Users, 
  TrendingUp, 
  ClipboardCheck, 
  Calculator, 
  Newspaper, 
  BarChart2, 
  Brain, 
  Repeat, 
  Globe, 
  Layers, 
  HelpCircle,
  Info,
  FileText,
  BookOpen,
  Briefcase,
  MessageCircle
} from 'lucide-react';

interface MoreNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { name: 'Mentorship', path: '/services/mentorship', icon: GraduationCap },
  { name: 'Signal Services', path: '/services/signals', icon: Zap },
  { name: 'Account Management', path: '/services/account-management', icon: Users },
  { name: 'Investment', path: '/services/investment', icon: TrendingUp },
  { name: 'Evaluation', path: '/services/evaluation', icon: ClipboardCheck },
  { name: 'Risk Calculator', path: '/trading-tools', icon: Calculator },
  { name: 'Market News', path: '/market-news', icon: Newspaper },
  { name: 'Top Traders', path: '/top-traders', icon: BarChart2 },
  { name: 'AI Insights', path: '/ai-insights', icon: Brain },
  { name: 'Trade', path: '/trade', icon: Repeat },
  { name: 'Markets', path: '/markets', icon: Globe },
  { name: 'Copy Trading', path: '/copy-trading', icon: Layers },
  { name: 'FAQ', path: '/faq', icon: HelpCircle },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Terms', path: '/terms', icon: FileText },
  { name: 'Free Resources', path: '/free-resources', icon: BookOpen },
  { name: 'Assets', path: '/assets', icon: Briefcase },
  { name: 'Support', path: '/support', icon: MessageCircle },
];

export default function MoreNavigationModal({ isOpen, onClose }: MoreNavigationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-bg-primary flex flex-col"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border-base">
            <h2 className="text-xl font-bold text-text-primary">More Services</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-text-primary hover:bg-bg-secondary rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="grid grid-cols-3 gap-y-10 gap-x-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => {
                    if (item.path.startsWith('#')) {
                      e.preventDefault();
                      onClose();
                      const element = document.getElementById(item.path.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }
                    } else {
                      onClose();
                    }
                  }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 bg-surface border border-border-base rounded-2xl flex items-center justify-center text-brand-primary group-hover:border-brand-primary transition-all shadow-sm">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] text-text-secondary font-medium text-center leading-tight group-hover:text-text-primary transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Footer / Extra Info */}
            <div className="mt-16 p-6 bg-surface border border-border-base rounded-3xl">
              <h3 className="text-sm font-bold text-text-primary mb-4">Support & Community</h3>
              <div className="space-y-4">
                <Link to="/support" onClick={onClose} className="flex items-center justify-between text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  <span>Support Center</span>
                  <HelpCircle size={18} />
                </Link>
                <Link to="/faq" onClick={onClose} className="flex items-center justify-between text-sm text-text-secondary hover:text-brand-primary transition-colors">
                  <span>FAQ</span>
                  <Info size={18} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
