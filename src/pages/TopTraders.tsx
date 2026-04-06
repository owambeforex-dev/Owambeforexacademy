import React from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Award, DollarSign } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

const LEADERBOARD = [
  { rank: 1, name: 'JoshuaFX', roi: '324%', winRate: '91%', profit: '$1.2M', avatar: 'J' },
  { rank: 2, name: 'Trader Alpha', roi: '218%', winRate: '85%', profit: '$850K', avatar: 'A' },
  { rank: 3, name: 'FX Master', roi: '176%', winRate: '78%', profit: '$620K', avatar: 'F' },
  { rank: 4, name: 'QuantBot v2', roi: '412%', winRate: '94%', profit: '$2.5M', avatar: 'Q' },
  { rank: 5, name: 'Crypto Whale', roi: '150%', winRate: '72%', profit: '$450K', avatar: 'W' },
  { rank: 6, name: 'Steady Growth', roi: '85%', winRate: '98%', profit: '$310K', avatar: 'S' },
  { rank: 7, name: 'Pips Hunter', roi: '120%', winRate: '82%', profit: '$500K', avatar: 'P' },
  { rank: 8, name: 'Sniper FX', roi: '205%', winRate: '88%', profit: '$780K', avatar: 'S' },
  { rank: 9, name: 'Gold Digger', roi: '190%', winRate: '80%', profit: '$690K', avatar: 'G' },
  { rank: 10, name: 'Daily Profit', roi: '110%', winRate: '86%', profit: '$420K', avatar: 'D' },
];

export default function TopTraders() {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-brand-dark">
      <StickyHeader title="Top Traders" />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-heading font-bold mb-4"
          >
            Top <span className="text-brand-primary">Traders</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] md:text-xl text-gray-400 leading-tight"
          >
            Global leaderboard of our most profitable institutional traders.
          </motion.p>
        </div>

        <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-brand-primary" /> Leaderboard Ranking
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-[10px] md:text-sm uppercase tracking-wider">
                  <th className="p-6 font-medium whitespace-nowrap">Rank</th>
                  <th className="p-6 font-medium whitespace-nowrap">Trader</th>
                  <th className="p-6 font-medium whitespace-nowrap">Monthly ROI</th>
                  <th className="p-6 font-medium whitespace-nowrap">Win Rate</th>
                  <th className="p-6 font-medium whitespace-nowrap">Profit Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LEADERBOARD.map((trader, i) => (
                  <motion.tr 
                    key={trader.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 whitespace-nowrap">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-lg ${
                        trader.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' :
                        trader.rank === 2 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50 shadow-[0_0_15px_rgba(209,213,219,0.3)]' :
                        trader.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.3)]' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {trader.rank}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-yellow-600 flex items-center justify-center text-brand-dark font-bold text-base md:text-xl shadow-lg shadow-brand-primary/20 shrink-0">
                          {trader.avatar}
                        </div>
                        <span className="font-bold text-white text-sm md:text-lg group-hover:text-brand-primary transition-colors">{trader.name}</span>
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-green-400 font-mono font-bold text-sm md:text-lg">
                        <TrendingUp size={18} /> {trader.roi}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-brand-primary font-mono font-bold text-sm md:text-lg">
                        <Award size={18} /> {trader.winRate}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-white font-mono font-bold text-sm md:text-lg">
                        <DollarSign size={18} className="text-gray-400" /> {trader.profit}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
