import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Coins, TrendingUp, Briefcase } from 'lucide-react';

const HomeIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 1000 1000" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Black background/shadow diamond */}
    <rect 
      x="240" y="240" width="620" height="620" 
      rx="40" 
      transform="rotate(45 550 550)" 
      fill="black" 
    />
    {/* Main orange diamond */}
    <rect 
      x="140" y="140" width="620" height="620" 
      rx="40" 
      transform="rotate(45 450 450)" 
      fill="#FF9900" 
    />
    {/* Center black diamond */}
    <rect 
      x="325" y="325" width="250" height="250" 
      rx="20" 
      transform="rotate(45 450 450)" 
      fill="black" 
    />
  </svg>
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
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? 'text-brand-primary' : 'text-text-secondary'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
