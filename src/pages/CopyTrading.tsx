import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, ShieldCheck, Copy, Award, Star } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

const TRADERS = [
  { name: 'CipherFX', roi: '324%', followers: '2,103', winRate: '91%', risk: 'Low', avatar: 'C' },
  { name: 'Trader Alpha', roi: '218%', followers: '1,450', winRate: '85%', risk: 'Medium', avatar: 'A' },
  { name: 'FX Master', roi: '176%', followers: '890', winRate: '78%', risk: 'High', avatar: 'F' },
  { name: 'QuantBot v2', roi: '412%', followers: '3,200', winRate: '94%', risk: 'Low', avatar: 'Q' },
  { name: 'Crypto Whale', roi: '150%', followers: '600', winRate: '72%', risk: 'High', avatar: 'W' },
  { name: 'Steady Growth', roi: '85%', followers: '4,500', winRate: '98%', risk: 'Low', avatar: 'S' },
];

export default function CopyTrading() {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-brand-dark">
      <StickyHeader title="Copy Trading" />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-heading font-bold mb-4"
          >
            Institutional <span className="text-brand-primary">Copy Trading</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] md:text-xl text-gray-400 leading-tight"
          >
            Mirror the trades of our top-performing hedge fund managers and algorithmic bots automatically.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRADERS.map((trader, i) => (
            <motion.div
              key={trader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-3xl p-8 border border-white/5 hover:border-brand-primary/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-colors"></div>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-yellow-600 flex items-center justify-center text-brand-dark font-bold text-2xl shadow-lg shadow-brand-primary/20">
                  {trader.avatar}
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
                    {trader.name} <ShieldCheck size={16} className="text-brand-primary" />
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] md:text-sm text-gray-400">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] md:text-sm text-gray-400 mb-1 flex items-center gap-2"><TrendingUp size={14} className="text-brand-primary" /> ROI</p>
                  <p className="text-lg md:text-2xl font-mono font-bold text-white">{trader.roi}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] md:text-sm text-gray-400 mb-1 flex items-center gap-2"><Award size={14} className="text-brand-primary" /> Win Rate</p>
                  <p className="text-lg md:text-2xl font-mono font-bold text-white">{trader.winRate}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] md:text-sm text-gray-400 mb-1 flex items-center gap-2"><Users size={14} className="text-brand-primary" /> Followers</p>
                  <p className="text-base md:text-xl font-mono font-bold text-white">{trader.followers}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] md:text-sm text-gray-400 mb-1 flex items-center gap-2"><ShieldCheck size={14} className="text-brand-primary" /> Risk</p>
                  <p className={`text-base md:text-xl font-bold ${trader.risk === 'Low' ? 'text-green-400' : trader.risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{trader.risk}</p>
                </div>
              </div>

              <button className="w-full py-4 bg-brand-primary hover:bg-brand-secondary text-brand-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 relative z-10">
                <Copy size={20} /> Copy Trade
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
