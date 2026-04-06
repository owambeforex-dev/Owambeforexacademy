import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import StickyHeader from '../components/StickyHeader';

const generateData = (start: number, volatility: number) => {
  let current = start;
  return Array.from({ length: 20 }).map((_, i) => {
    current += (Math.random() - 0.5) * volatility;
    return { value: current };
  });
};

const MARKETS = {
  forex: [
    { pair: 'EUR/USD', price: '1.0850', change: '+0.24%', trend: 'up', data: generateData(1.08, 0.005) },
    { pair: 'GBP/USD', price: '1.2640', change: '-0.12%', trend: 'down', data: generateData(1.26, 0.008) },
    { pair: 'USD/JPY', price: '150.20', change: '+0.45%', trend: 'up', data: generateData(150, 0.5) },
    { pair: 'AUD/USD', price: '0.6520', change: '-0.31%', trend: 'down', data: generateData(0.65, 0.004) },
    { pair: 'USD/CAD', price: '1.3510', change: '+0.15%', trend: 'up', data: generateData(1.35, 0.006) },
  ],
  crypto: [
    { pair: 'BTC/USD', price: '64,230.50', change: '+2.45%', trend: 'up', data: generateData(62000, 1000) },
    { pair: 'ETH/USD', price: '3,450.20', change: '+1.80%', trend: 'up', data: generateData(3400, 50) },
    { pair: 'SOL/USD', price: '145.60', change: '-0.50%', trend: 'down', data: generateData(146, 5) },
    { pair: 'BNB/USD', price: '412.30', change: '+0.90%', trend: 'up', data: generateData(410, 10) },
    { pair: 'XRP/USD', price: '0.6240', change: '-1.20%', trend: 'down', data: generateData(0.63, 0.02) },
  ],
  commodities: [
    { pair: 'XAU/USD (Gold)', price: '2,045.80', change: '+0.65%', trend: 'up', data: generateData(2030, 15) },
    { pair: 'XAG/USD (Silver)', price: '22.40', change: '-0.25%', trend: 'down', data: generateData(22.5, 0.3) },
    { pair: 'USOIL (WTI)', price: '78.50', change: '+1.10%', trend: 'up', data: generateData(77, 1) },
  ]
};

export default function Markets() {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-brand-dark">
      <StickyHeader title="Markets" />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-heading font-bold mb-4"
          >
            Live <span className="text-brand-primary">Markets</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] md:text-xl text-gray-400 leading-tight"
          >
            Real-time institutional-grade market data and analytics.
          </motion.p>
        </div>

        {Object.entries(MARKETS).map(([category, assets], idx) => (
          <div key={category} className="mb-12">
            <h2 className="text-lg md:text-2xl font-heading font-bold mb-6 capitalize flex items-center gap-2">
              <Activity className="text-brand-primary" /> {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {assets.map((asset, i) => (
                <motion.div
                  key={asset.pair}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-dark rounded-2xl p-5 border border-white/5 hover:border-brand-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-white">{asset.pair}</h3>
                      <p className="text-lg md:text-2xl font-mono font-bold mt-1">{asset.price}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] md:text-sm font-medium ${
                      asset.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {asset.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {asset.change}
                    </div>
                  </div>
                  <div className="h-16 w-full opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={asset.data}>
                        <defs>
                          <linearGradient id={`gradient-${asset.pair}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={asset.trend === 'up' ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={asset.trend === 'up' ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={asset.trend === 'up' ? '#22c55e' : '#ef4444'} 
                          fillOpacity={1} 
                          fill={`url(#gradient-${asset.pair})`} 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
