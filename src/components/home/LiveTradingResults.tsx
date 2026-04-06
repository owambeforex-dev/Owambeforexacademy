import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_TRADERS = [
  { name: 'Alex M.', country: '🇺🇸', pair: 'XAUUSD' },
  { name: 'Sarah K.', country: '🇬🇧', pair: 'EURUSD' },
  { name: 'David O.', country: '🇳🇬', pair: 'BTCUSDT' },
  { name: 'Yuki T.', country: '🇯🇵', pair: 'USDJPY' },
  { name: 'Maria G.', country: '🇪🇸', pair: 'GBPUSD' },
];

export default function LiveTradingResults() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const generateResult = () => {
      const trader = MOCK_TRADERS[Math.floor(Math.random() * MOCK_TRADERS.length)];
      const amount = Math.floor(Math.random() * (2000 - 50 + 1)) + 50;
      const isProfit = Math.random() > 0.3; // 70% chance of profit
      const timestamp = new Date().toLocaleTimeString();

      return {
        id: Math.random().toString(36).substr(2, 9),
        ...trader,
        amount: isProfit ? amount : -amount,
        timestamp,
      };
    };

    // Initial load
    setResults(Array.from({ length: 4 }, generateResult));

    const interval = setInterval(() => {
      setResults((prev) => {
        const newResults = [generateResult(), ...prev];
        return newResults.slice(0, 4);
      });
    }, 12000); // 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-5xl font-serif font-bold mb-4 text-text-primary">Live Trading Results</h2>
          <p className="text-[10px] md:text-base text-text-secondary max-w-2xl mx-auto leading-tight">Real-time performance from our community of professional traders.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {results.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-base relative overflow-hidden group w-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                      {result.country}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-text-primary text-[10px] md:text-base truncate">{result.name}</h4>
                      <p className="text-[8px] md:text-xs text-text-muted truncate">{result.timestamp}</p>
                    </div>
                  </div>
                  <div className="px-2 sm:px-3 py-1 rounded-full bg-bg-secondary text-[8px] md:text-xs font-mono text-text-secondary flex-shrink-0">
                    {result.pair}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <p className="text-[10px] md:text-sm text-text-secondary mb-1">Closed PnL</p>
                  <div className={`text-lg md:text-3xl font-mono font-bold break-all ${result.amount > 0 ? 'text-success' : 'text-error'}`}>
                    {result.amount > 0 ? '+' : ''}${Math.abs(result.amount).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
