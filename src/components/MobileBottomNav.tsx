import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Coins, TrendingUp, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <img 
    src="https://i.imgur.com/569BqEK.png" 
    alt="Home"
    className={`w-5 h-5 object-contain transition-all duration-300 ${!isActive ? 'grayscale opacity-70' : 'grayscale-0 opacity-100'}`}
    referrerPolicy="no-referrer"
  />
);

const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Learn', path: '/services/mentorship', icon: GraduationCap },
  { name: 'Invest', path: '/services/investment', icon: Coins },
  { name: 'Signal', path: '/services/signals', icon: TrendingUp },
  { name: 'Overview', path: '/assets', icon: Briefcase },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border-base px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className="w-full h-full"
            >
              <motion.div
                whileTap={{ y: 4, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                  isActive ? 'text-brand-primary' : 'text-text-secondary'
                }`}
              >
                {item.name === 'Home' ? (
                  <HomeIcon isActive={isActive} />
                ) : (
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                )}
                <span className="text-[10px] font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
