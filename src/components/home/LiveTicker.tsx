import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PAIRS = [
  { symbol: 'BTC/USD', price: 64230.50, change: 2.4 },
  { symbol: 'ETH/USD', price: 3450.20, change: 1.8 },
  { symbol: 'EUR/USD', price: 1.0845, change: -0.2 },
  { symbol: 'GBP/USD', price: 1.2650, change: 0.1 },
  { symbol: 'XAU/USD', price: 2340.80, change: 0.5 },
  { symbol: 'US30', price: 39100.00, change: -0.4 },
  { symbol: 'NAS100', price: 18200.50, change: 1.2 },
  { symbol: 'SOL/USD', price: 145.20, change: 5.6 },
];

export default function LiveTicker() {
  const [tickerData, setTickerData] = useState(PAIRS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => {
        const volatility = item.price * 0.001; // 0.1% volatility
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = item.price + change;
        const newChangePercent = item.change + (change / item.price) * 100;
        
        return {
          ...item,
          price: newPrice,
          change: newChangePercent
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-bg-secondary border-b border-border-base overflow-hidden py-2 relative z-40 pt-16 md:pt-20">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Duplicate the list for seamless scrolling */}
        {[...tickerData, ...tickerData].map((item, index) => {
          const isPositive = item.change >= 0;
          return (
            <div key={`${item.symbol}-${index}`} className="inline-flex items-center gap-3 px-8 border-r border-border-base last:border-none">
              <span className="text-text-secondary font-medium text-sm">{item.symbol}</span>
              <span className="text-text-primary font-mono text-sm">
                {item.price < 10 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-success' : 'text-error'}`}>
                {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {Math.abs(item.change).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
