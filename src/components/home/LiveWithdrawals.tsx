import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, DollarSign, Clock } from 'lucide-react';

const MOCK_NAMES = ['Alex J.', 'Sarah M.', 'David K.', 'Elena R.', 'Michael T.', 'Jessica L.', 'James B.', 'Sophia W.'];
const MOCK_METHODS = ['Bitcoin', 'Ethereum', 'Bank Transfer', 'USDT (TRC20)'];

export default function LiveWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    // Initial mock data
    const initial = Array.from({ length: 5 }).map((_, i) => ({
      id: `w-${Date.now()}-${i}`,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      amount: Math.floor(Math.random() * 10000) + 500,
      method: MOCK_METHODS[Math.floor(Math.random() * MOCK_METHODS.length)],
      time: new Date(Date.now() - i * 60000).toISOString(),
    }));
    setWithdrawals(initial);

    // Simulate live updates
    const interval = setInterval(() => {
      setWithdrawals(prev => {
        const newWithdrawal = {
          id: `w-${Date.now()}`,
          name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
          amount: Math.floor(Math.random() * 15000) + 500,
          method: MOCK_METHODS[Math.floor(Math.random() * MOCK_METHODS.length)],
          time: new Date().toISOString(),
        };
        return [newWithdrawal, ...prev.slice(0, 4)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-4 flex items-center gap-3 text-text-primary">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
              </span>
              Live <span className="text-brand-primary">Withdrawals</span>
            </h2>
            <p className="text-[10px] md:text-base text-text-secondary max-w-xl leading-tight">
              Real-time feed of successful payouts to our traders globally.
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <div className="text-[10px] md:text-sm text-text-secondary mb-1">Total Paid Out (24h)</div>
            <div className="text-xl md:text-3xl font-bold font-mono text-success">$1,245,890.00</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-surface rounded-3xl border border-border-base overflow-hidden w-full">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-6 border-b border-border-base text-[10px] md:text-sm font-medium text-text-secondary uppercase tracking-wider">
              <div>Trader</div>
              <div>Amount</div>
              <div className="hidden md:block">Method</div>
              <div className="text-right">Time</div>
            </div>
            
            <div className="relative">
              <AnimatePresence initial={false}>
                {withdrawals.map((w, index) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(255, 162, 0, 0.1)' }}
                    animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-6 border-b border-border-base last:border-none items-center hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold flex-shrink-0 text-xs md:text-base">
                        {w.name.charAt(0)}
                      </div>
                      <span className="font-medium text-text-primary text-[10px] md:text-base truncate">{w.name}</span>
                    </div>
                    <div className="font-mono text-success font-bold flex items-center gap-1 text-[10px] md:text-base break-all">
                      <DollarSign size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      {w.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-text-secondary">
                      <span className="px-3 py-1 rounded-full bg-bg-secondary text-xs border border-border-base truncate">
                        {w.method}
                      </span>
                    </div>
                    <div className="text-right text-text-muted text-[8px] md:text-sm flex items-center justify-end gap-1 sm:gap-2">
                      <Clock size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="whitespace-nowrap">Just now</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
