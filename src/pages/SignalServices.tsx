import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Activity, Target, ShieldAlert, TrendingUp, Clock, BarChart2 } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import ContactSupportCTA from '../components/ContactSupportCTA';

const PLANS = [
  { title: '1 Month', price: '$49' },
  { title: '3 Months', price: '$99' },
  { title: '6 Months', price: '$149' },
  { title: '1 Year', price: '$299' },
  { title: 'Lifetime', price: '$699' },
];

const FEATURES = [
  'Real-time forex signals',
  'Entry price',
  'Stop loss',
  'Take profit',
  'Trade management updates'
];

const ACTIVE_SIGNALS = [
  { id: 1, pair: 'EUR/USD', type: 'BUY', entry: '1.09250', tp: '1.10000', sl: '1.08800', confidence: 92, risk: 'Low', time: '10 mins ago', status: 'Active' },
  { id: 2, pair: 'GBP/JPY', type: 'SELL', entry: '190.500', tp: '189.000', sl: '191.200', confidence: 85, risk: 'Medium', time: '1 hour ago', status: 'Active' },
  { id: 3, pair: 'XAU/USD', type: 'BUY', entry: '2345.50', tp: '2360.00', sl: '2335.00', confidence: 88, risk: 'High', time: '2 hours ago', status: 'Active' },
];

const SIGNAL_HISTORY = [
  { id: 4, pair: 'USD/JPY', type: 'BUY', entry: '150.200', result: '+45 Pips', status: 'Won', date: 'Today' },
  { id: 5, pair: 'AUD/USD', type: 'SELL', entry: '0.65400', result: '-15 Pips', status: 'Lost', date: 'Yesterday' },
  { id: 6, pair: 'EUR/GBP', type: 'BUY', entry: '0.85600', result: '+30 Pips', status: 'Won', date: 'Yesterday' },
  { id: 7, pair: 'BTC/USD', type: 'BUY', entry: '64500', result: '+1200 Pips', status: 'Won', date: '2 days ago' },
];

export default function SignalServices() {
  const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');

  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Signal Services" />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-left mb-10">
          <h2 className="text-xl md:text-3xl font-bold text-text-primary mb-4">Choose Your Access Level</h2>
          <p className="text-xs md:text-sm text-text-secondary max-w-xl leading-relaxed">Unlock full access to our institutional-grade signals, real-time alerts, and dedicated support.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto mb-16">
          {PLANS.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-base p-4 md:p-6 h-full transition-all duration-300 hover:border-brand-primary hover:shadow-[0_0_30px_rgba(255,162,0,0.2)] flex flex-col group"
            >
              <h3 className="text-sm md:text-lg font-bold mb-1 text-text-primary group-hover:text-brand-primary transition-colors duration-300 truncate">
                {plan.title}
              </h3>
              <div className="text-xl md:text-2xl font-bold text-brand-primary mb-4">
                {plan.price}
              </div>
              
              <ul className="space-y-2 mb-6 flex-1">
                {FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-secondary">
                    <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-[10px] md:text-xs leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/checkout"
                className="w-full py-2.5 md:py-3 bg-surface-hover hover:bg-brand-primary text-text-primary hover:text-brand-dark text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 border border-border-base hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(255,162,0,0.4)]"
              >
                Subscribe <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Signal Intelligence Section */}
        <div className="text-left mb-10">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-text-primary mb-4">Signal <span className="text-brand-primary">Intelligence</span></h1>
          <p className="text-sm md:text-base text-text-secondary max-w-xl leading-relaxed">
            Institutional-grade trade signals with advanced analytics, real-time tracking, and verified performance history.
          </p>
        </div>

        {/* Signal Intelligence Dashboard */}
        <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-base p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Target size={20} />
              </div>
              <div>
                <div className="text-[10px] text-text-secondary">Win Rate</div>
                <div className="text-lg font-bold text-text-primary">82.5%</div>
              </div>
            </div>
            <div className="card-base p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-[10px] text-text-secondary">Total Pips</div>
                <div className="text-lg font-bold text-text-primary">+4,250</div>
              </div>
            </div>
            <div className="card-base p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <div className="text-[10px] text-text-secondary">Active</div>
                <div className="text-lg font-bold text-text-primary">3</div>
              </div>
            </div>
            <div className="card-base p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <BarChart2 size={20} />
              </div>
              <div>
                <div className="text-[10px] text-text-secondary">Avg. R/R</div>
                <div className="text-lg font-bold text-text-primary">1:3.5</div>
              </div>
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="flex border-b border-border-base">
              <button
                onClick={() => setActiveTab('Active')}
                className={`flex-1 py-3 text-center text-xs font-bold transition-colors ${activeTab === 'Active' ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-primary/5' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              >
                Live Signals
              </button>
              <button
                onClick={() => setActiveTab('History')}
                className={`flex-1 py-3 text-center text-xs font-bold transition-colors ${activeTab === 'History' ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-primary/5' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              >
                Verified History
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'Active' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-text-secondary text-[10px] border-b border-border-base uppercase tracking-wider">
                        <th className="pb-3 font-bold whitespace-nowrap">Pair</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Type</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Entry</th>
                        <th className="pb-3 font-bold whitespace-nowrap">TP</th>
                        <th className="pb-3 font-bold whitespace-nowrap">SL</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Confidence</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Risk</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ACTIVE_SIGNALS.map((signal) => (
                        <tr key={signal.id} className="border-b border-border-base hover:bg-surface-hover transition-colors">
                          <td className="py-3 font-bold text-text-primary text-xs whitespace-nowrap">{signal.pair}</td>
                          <td className="py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                              {signal.type}
                            </span>
                          </td>
                          <td className="py-3 text-text-secondary font-mono text-xs whitespace-nowrap">{signal.entry}</td>
                          <td className="py-3 text-green-600 dark:text-green-400 font-mono text-xs whitespace-nowrap">{signal.tp}</td>
                          <td className="py-3 text-red-600 dark:text-red-400 font-mono text-xs whitespace-nowrap">{signal.sl}</td>
                          <td className="py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2 min-w-[80px]">
                              <div className="w-12 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-brand-primary" style={{ width: `${signal.confidence}%` }}></div>
                              </div>
                              <span className="text-[10px] text-text-secondary">{signal.confidence}%</span>
                            </div>
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            <span className={`flex items-center gap-1 text-[10px] font-bold ${signal.risk === 'Low' ? 'text-green-600 dark:text-green-400' : signal.risk === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                              <ShieldAlert size={12} /> {signal.risk}
                            </span>
                          </td>
                          <td className="py-3 text-text-secondary text-[10px] flex items-center gap-1 whitespace-nowrap">
                            <Clock size={12} /> {signal.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-text-secondary text-[10px] border-b border-border-base uppercase tracking-wider">
                        <th className="pb-3 font-bold whitespace-nowrap">Pair</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Type</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Entry</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Result</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Status</th>
                        <th className="pb-3 font-bold whitespace-nowrap">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIGNAL_HISTORY.map((signal) => (
                        <tr key={signal.id} className="border-b border-border-base hover:bg-surface-hover transition-colors">
                          <td className="py-3 font-bold text-text-primary text-xs whitespace-nowrap">{signal.pair}</td>
                          <td className="py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                              {signal.type}
                            </span>
                          </td>
                          <td className="py-3 text-text-secondary font-mono text-xs whitespace-nowrap">{signal.entry}</td>
                          <td className={`py-3 font-bold text-xs whitespace-nowrap ${signal.result.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{signal.result}</td>
                          <td className="py-3 whitespace-nowrap">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${signal.status === 'Won' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                              {signal.status}
                            </span>
                          </td>
                          <td className="py-3 text-text-secondary text-[10px] whitespace-nowrap">{signal.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <ContactSupportCTA 
          title="Questions about our signals?"
          description="Our expert trading team is available to help you understand our signal methodology and how to get the most out of our premium alerts."
        />
      </div>
    </div>
  );
}
