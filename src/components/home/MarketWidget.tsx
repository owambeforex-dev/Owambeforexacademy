import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'EURUSD', 'GBPUSD', 'XAUUSD'];

export default function MarketWidget() {
  const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({});

  useEffect(() => {
    // Simulate live prices
    const initialPrices = PAIRS.reduce((acc, pair) => {
      acc[pair] = {
        price: Math.random() * 50000 + 1,
        change: (Math.random() - 0.5) * 5,
      };
      return acc;
    }, {} as Record<string, { price: number; change: number }>);

    setPrices(initialPrices);

    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        PAIRS.forEach((pair) => {
          const change = (Math.random() - 0.5) * 2;
          next[pair] = {
            price: next[pair].price * (1 + change / 100),
            change: next[pair].change + change,
          };
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 -mt-12 relative z-20">
      <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-base shadow-2xl w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {PAIRS.map((pair) => {
            const data = prices[pair] || { price: 0, change: 0 };
            const isPositive = data.change >= 0;
 
            return (
              <motion.div
                key={pair}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl bg-bg-secondary hover:bg-surface-hover transition-colors cursor-pointer w-full overflow-hidden"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-text-secondary text-xs sm:text-base truncate">{pair}</span>
                  <span className={`text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                  </span>
                </div>
                <div className="text-base sm:text-2xl font-mono font-semibold break-all text-text-primary">
                  ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                </div>
                {/* Mini chart placeholder */}
                <div className="h-6 sm:h-8 mt-1 sm:mt-2 w-full flex items-end gap-1 opacity-50">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-full rounded-t-sm ${isPositive ? 'bg-success' : 'bg-error'}`}
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
