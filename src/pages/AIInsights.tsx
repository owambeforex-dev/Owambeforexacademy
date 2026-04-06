import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, TrendingUp, TrendingDown, Activity, Zap, BarChart2, AlertTriangle, Calendar, Globe, Target, ShieldAlert, Flame, ArrowRight, Clock, Bell } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

// Mock Data
const SMART_ALERTS = [
  "EURUSD approaching major resistance at 1.0950.",
  "Bitcoin breakout probability increasing above 90%.",
  "Nasdaq momentum accelerating, tech sector leading.",
  "Gold volatility risk rising ahead of NFP data."
];

const MARKET_INSIGHTS = [
  {
    asset: 'EURUSD',
    trend: 'Bullish',
    momentum: 'Strong',
    sentimentText: 'Buyers in control',
    bullishPercent: 68,
    bearishPercent: 32,
  },
  {
    asset: 'BTCUSD',
    trend: 'Bearish',
    momentum: 'Weak',
    sentimentText: 'Sellers dominating',
    bullishPercent: 25,
    bearishPercent: 75,
  },
  {
    asset: 'XAUUSD (Gold)',
    trend: 'Accumulation',
    momentum: 'Neutral',
    sentimentText: 'Market undecided',
    bullishPercent: 52,
    bearishPercent: 48,
  }
];

const TRADE_SETUPS = [
  {
    pair: 'GBPUSD',
    setup: 'Breakout',
    entry: '1.2750',
    tp: '1.2830',
    sl: '1.2700',
    confidence: 91,
    type: 'BUY'
  },
  {
    pair: 'USDJPY',
    setup: 'Reversal',
    entry: '149.80',
    tp: '148.50',
    sl: '150.50',
    confidence: 84,
    type: 'SELL'
  },
  {
    pair: 'ETHUSD',
    setup: 'Trend Continuation',
    entry: '3200.00',
    tp: '3450.00',
    sl: '3100.00',
    confidence: 88,
    type: 'BUY'
  }
];

const VOLATILITY_ALERTS = [
  { asset: 'BTCUSD', message: 'High Volatility Detected', expectedMove: '3.2%', type: 'high' },
  { asset: 'Gold', message: 'High Impact News Expected', expectedMove: '1.5%', type: 'news' },
  { asset: 'GBPUSD', message: 'Abnormal Volume Spike', expectedMove: '0.8%', type: 'volume' }
];

const ECONOMIC_EVENTS = [
  { time: '14:30', currency: 'USD', event: 'Core PCE Price Index m/m', impact: 'High', volatility: 'High' },
  { time: '14:30', currency: 'USD', event: 'Unemployment Claims', impact: 'High', volatility: 'High' },
  { time: '15:00', currency: 'EUR', event: 'ECB President Lagarde Speaks', impact: 'Medium', volatility: 'Medium' },
  { time: '18:00', currency: 'GBP', event: 'BOE Gov Bailey Speaks', impact: 'Medium', volatility: 'Medium' },
];

const CURRENCY_STRENGTH = [
  { currency: 'USD', strength: 85 },
  { currency: 'JPY', strength: 72 },
  { currency: 'EUR', strength: 45 },
  { currency: 'GBP', strength: 38 },
  { currency: 'AUD', strength: 25 },
  { currency: 'NZD', strength: 15 },
];

export default function AIInsights() {
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % SMART_ALERTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-brand-dark">
      <StickyHeader title="AI Insights" />
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-8 gap-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-4xl font-heading font-bold flex items-center gap-3"
            >
              <Brain className="text-brand-primary w-6 h-6 md:w-9 md:h-9" />
              AI Market <span className="text-brand-primary">Intelligence</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[10px] md:text-base text-gray-400 mt-2 leading-tight max-w-[280px] md:max-w-none"
            >
              Professional market analysis powered by proprietary machine learning models.
            </motion.p>
          </div>
          
          {/* Smart Alert Ticker */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark border border-brand-primary/30 rounded-full py-1.5 md:py-2 px-4 flex items-center gap-3 max-w-md w-full justify-center md:justify-start"
          >
            <Bell className="text-brand-primary animate-pulse w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
            <div className="text-[10px] md:text-sm font-mono text-gray-300 truncate">
              {SMART_ALERTS[activeAlertIndex]}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Market Insights Panel */}
            <div className="glass-dark rounded-2xl border border-white/5 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2 justify-center md:justify-start">
                <Activity className="text-brand-primary w-4.5 h-4.5 md:w-5 md:h-5" /> Market Insights & Sentiment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MARKET_INSIGHTS.map((insight, i) => (
                  <motion.div 
                    key={insight.asset}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/5 hover:border-brand-primary/20 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm md:text-lg">{insight.asset}</h3>
                      {insight.trend === 'Bullish' ? <TrendingUp className="text-green-400 w-4 h-4 md:w-5 md:h-5" /> : 
                       insight.trend === 'Bearish' ? <TrendingDown className="text-red-400 w-4 h-4 md:w-5 md:h-5" /> : 
                       <Activity className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    
                    <div className="space-y-2 md:space-y-3 mb-4">
                      <div className="flex justify-between text-[10px] md:text-sm">
                        <span className="text-gray-400">Trend:</span>
                        <span className={`font-bold ${insight.trend === 'Bullish' ? 'text-green-400' : insight.trend === 'Bearish' ? 'text-red-400' : 'text-yellow-400'}`}>{insight.trend}</span>
                      </div>
                      <div className="flex justify-between text-[10px] md:text-sm">
                        <span className="text-gray-400">Momentum:</span>
                        <span className="font-bold text-white">{insight.momentum}</span>
                      </div>
                      <div className="flex justify-between text-[10px] md:text-sm">
                        <span className="text-gray-400">Sentiment:</span>
                        <span className="font-bold text-brand-primary">{insight.sentimentText}</span>
                      </div>
                    </div>

                    {/* Sentiment Meter */}
                    <div>
                      <div className="flex justify-between text-[8px] md:text-xs mb-1 font-mono">
                        <span className="text-green-400">Bullish {insight.bullishPercent}%</span>
                        <span className="text-red-400">{insight.bearishPercent}% Bearish</span>
                      </div>
                      <div className="h-1.5 md:h-2 w-full bg-red-500/20 rounded-full overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: `${insight.bullishPercent}%` }}></div>
                        <div className="h-full bg-red-500" style={{ width: `${insight.bearishPercent}%` }}></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Trade Setup Detection */}
            <div className="glass-dark rounded-2xl border border-white/5 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2 justify-center md:justify-start">
                <Target className="text-brand-primary w-4.5 h-4.5 md:w-5 md:h-5" /> AI Trade Setup Detection
              </h2>
              <div className="space-y-4">
                {TRADE_SETUPS.map((setup, i) => (
                  <motion.div 
                    key={setup.pair}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg ${setup.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {setup.type}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm md:text-lg">{setup.pair}</h3>
                        <p className="text-[10px] md:text-sm text-gray-400">Setup: <span className="text-white">{setup.setup}</span></p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-4 text-center md:text-left">
                      <div>
                        <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Entry Zone</p>
                        <p className="font-mono font-bold text-white text-[10px] md:text-base">{setup.entry}</p>
                      </div>
                      <div>
                        <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Take Profit</p>
                        <p className="font-mono font-bold text-green-400 text-[10px] md:text-base">{setup.tp}</p>
                      </div>
                      <div>
                        <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Stop Loss</p>
                        <p className="font-mono font-bold text-red-400 text-[10px] md:text-base">{setup.sl}</p>
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider mb-1">Confidence</p>
                      <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-primary text-brand-primary font-bold font-mono text-xs md:text-base">
                        {setup.confidence}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Sidebars) */}
          <div className="space-y-6">
            
            {/* AI Market Heatmap */}
            <div className="glass-dark rounded-2xl border border-white/5 p-4 md:p-6">
              <h2 className="text-sm md:text-lg font-bold mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Flame className="text-brand-primary w-4 h-4 md:w-5 md:h-5" /> Currency Strength
              </h2>
              <div className="space-y-3">
                {CURRENCY_STRENGTH.map((item, i) => (
                  <div key={item.currency} className="flex items-center gap-3">
                    <span className="w-4 text-[8px] md:text-xs text-gray-500 font-mono">{i + 1}.</span>
                    <span className="w-8 font-bold text-[10px] md:text-sm">{item.currency}</span>
                    <div className="flex-1 h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.strength}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${i < 2 ? 'bg-green-500' : i > 3 ? 'bg-red-500' : 'bg-yellow-500'}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Volatility Detector */}
            <div className="glass-dark rounded-2xl border border-white/5 p-4 md:p-6">
              <h2 className="text-sm md:text-lg font-bold mb-4 flex items-center gap-2 justify-center md:justify-start">
                <ShieldAlert className="text-brand-primary w-4 h-4 md:w-5 md:h-5" /> Volatility Alerts
              </h2>
              <div className="space-y-3">
                {VOLATILITY_ALERTS.map((alert, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 border-l-2 border-l-brand-primary">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[10px] md:text-sm">{alert.asset}</span>
                      <span className="text-[8px] md:text-xs font-mono text-brand-primary">Exp. Move: {alert.expectedMove}</span>
                    </div>
                    <p className="text-[8px] md:text-xs text-gray-400">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Economic Event Monitor */}
            <div className="glass-dark rounded-2xl border border-white/5 p-4 md:p-6">
              <h2 className="text-sm md:text-lg font-bold mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Calendar className="text-brand-primary w-4 h-4 md:w-5 md:h-5" /> Economic Calendar
              </h2>
              <div className="space-y-4">
                {ECONOMIC_EVENTS.map((event, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="text-[8px] md:text-xs font-mono text-gray-500 pt-1">{event.time}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] md:text-[10px] px-1.5 py-0.5 rounded font-bold ${event.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {event.impact}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-white">{event.currency}</span>
                      </div>
                      <p className="text-[10px] md:text-sm text-gray-300 leading-tight">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
