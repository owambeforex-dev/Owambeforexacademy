import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Search, ChevronDown, Info } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', popular: true, rateToUSD: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', popular: true, rateToUSD: 1 / 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', popular: true, rateToUSD: 1 / 0.78 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', popular: true, rateToUSD: 1 / 1500 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', popular: false, rateToUSD: 0.65 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', popular: false, rateToUSD: 0.74 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', popular: false, rateToUSD: 1.13 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', popular: false, rateToUSD: 0.0067 },
];

const PAIRS = [
  { pair: 'EURUSD', pipValue: 10 },
  { pair: 'GBPUSD', pipValue: 10 },
  { pair: 'USDJPY', pipValue: 9.1 },
  { pair: 'XAUUSD', pipValue: 1 },
  { pair: 'BTCUSD', pipValue: 0.01 },
];

export default function TradingTools() {
  // State
  const [balance, setBalance] = useState<string>('10000');
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('tradingToolsCurrency');
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLoss, setStopLoss] = useState<string>('50');
  const [pair, setPair] = useState(PAIRS[0]);

  // Dropdown states
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [isPairDropdownOpen, setIsPairDropdownOpen] = useState(false);

  // Save currency to localStorage
  useEffect(() => {
    localStorage.setItem('tradingToolsCurrency', JSON.stringify(currency));
  }, [currency]);

  // Calculations
  const calculations = useMemo(() => {
    const numBalance = parseFloat(balance) || 0;
    const numRisk = parseFloat(riskPercent) || 0;
    const numStopLoss = parseFloat(stopLoss) || 0;

    if (numBalance <= 0 || numRisk <= 0 || numStopLoss <= 0) {
      return { riskAmount: 0, lotSize: 0, usdEquivalent: 0 };
    }

    const riskAmount = numBalance * (numRisk / 100);
    const usdEquivalent = riskAmount * currency.rateToUSD;
    
    let lotSize = 0;
    if (pair.pipValue > 0) {
      lotSize = usdEquivalent / (numStopLoss * pair.pipValue);
    }

    return {
      riskAmount,
      lotSize,
      usdEquivalent
    };
  }, [balance, riskPercent, stopLoss, pair, currency]);

  const filteredCurrencies = CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) || 
    c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const popularCurrencies = filteredCurrencies.filter(c => c.popular);
  const otherCurrencies = filteredCurrencies.filter(c => !c.popular);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-bg-primary flex">
      <StickyHeader title="Trading Tools" />
      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl font-heading font-bold mb-2 flex items-center gap-3">
            <Calculator className="text-brand-primary" size={32} />
            Risk Calculator
          </h1>
          <p className="text-[10px] md:text-base text-gray-400 leading-tight">Professional tools to manage your trades and risk efficiently.</p>
        </div>

        {/* Calculator Card */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[500px] card-base p-6 sm:p-8 relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-base md:text-xl font-bold mb-6 flex items-center gap-2">
              Forex Risk Calculator
            </h2>

            <div className="space-y-5 relative z-10">
              
              {/* Account Balance & Currency */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Account Balance</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">{currency.symbol}</span>
                    <input 
                      type="number" 
                      min="0"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-surface border border-border-base rounded-xl py-3 pl-10 pr-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                    />
                  </div>
                  {currency.code !== 'USD' && (
                    <div className="text-xs text-gray-500 mt-1 ml-1">
                      ≈ ${(parseFloat(balance || '0') * currency.rateToUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                    </div>
                  )}
                </div>

                <div className="w-32 relative">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                  <button 
                    onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                    className="w-full bg-surface border border-border-base rounded-xl py-3 px-4 text-text-primary font-mono flex items-center justify-between hover:bg-surface-hover transition-colors"
                  >
                    <span className="flex items-center gap-2">{currency.flag} {currency.code}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {/* Currency Dropdown */}
                  {isCurrencyDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-surface border border-border-base rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-2 border-b border-border-base">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search..." 
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            className="w-full bg-surface border border-border-base rounded-lg py-1.5 pl-8 pr-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary/50"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                        {popularCurrencies.length > 0 && (
                          <div className="mb-2">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">Popular</div>
                            {popularCurrencies.map(c => (
                              <button 
                                key={c.code}
                                onClick={() => { setCurrency(c); setIsCurrencyDropdownOpen(false); setCurrencySearch(''); }}
                                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-hover flex items-center gap-2 text-sm transition-colors"
                              >
                                <span>{c.flag}</span>
                                <span className="font-bold text-text-primary">{c.code}</span>
                                <span className="text-gray-500 text-xs ml-auto">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {otherCurrencies.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">All Currencies</div>
                            {otherCurrencies.map(c => (
                              <button 
                                key={c.code}
                                onClick={() => { setCurrency(c); setIsCurrencyDropdownOpen(false); setCurrencySearch(''); }}
                                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-hover flex items-center gap-2 text-sm transition-colors"
                              >
                                <span>{c.flag}</span>
                                <span className="font-bold text-text-primary">{c.code}</span>
                                <span className="text-gray-500 text-xs ml-auto">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Percentage & Stop Loss */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Risk (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0.1"
                      step="0.1"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(e.target.value)}
                      className="w-full bg-surface border border-border-base rounded-xl py-3 px-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stop Loss (Pips)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="50"
                    className="w-full bg-surface border border-border-base rounded-xl py-3 px-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Currency Pair */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currency Pair</label>
                <button 
                  onClick={() => setIsPairDropdownOpen(!isPairDropdownOpen)}
                  className="w-full bg-surface border border-border-base rounded-xl py-3 px-4 text-text-primary font-mono flex items-center justify-between hover:bg-surface-hover transition-colors"
                >
                  <span>{pair.pair}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                
                {isPairDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-base rounded-xl shadow-xl z-40 overflow-hidden">
                    {PAIRS.map(p => (
                      <button 
                        key={p.pair}
                        onClick={() => { setPair(p); setIsPairDropdownOpen(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-surface-hover font-mono text-text-primary transition-colors border-b border-border-base last:border-0"
                      >
                        {p.pair}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="mt-8 pt-6 border-t border-border-base">
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <div className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                        Recommended Lot Size
                        <div className="group relative">
                          <Info size={14} className="text-brand-primary/70 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-surface border border-border-base text-text-secondary text-xs p-2 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            The suggested position size to meet your exact risk parameters.
                          </div>
                        </div>
                      </div>
                      <motion.div 
                        key={calculations.lotSize}
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl sm:text-5xl font-mono font-bold text-text-primary"
                      >
                        {calculations.lotSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm relative z-10 pt-4 border-t border-brand-primary/10">
                    <span className="text-gray-400">Amount at Risk:</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-text-primary">
                        {currency.symbol}{calculations.riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {currency.code !== 'USD' && (
                        <span className="text-xs text-gray-500 ml-2 font-mono">
                          (≈ ${calculations.usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Future Tools Placeholder */}
          <div className="w-full max-w-[500px] mt-8">
            <h3 className="text-sm md:text-lg font-bold mb-4 text-text-secondary">More tools coming soon...</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Position Size Calculator', 'Profit Calculator', 'Drawdown Simulator'].map((tool, i) => (
                <div key={i} className="glass-dark rounded-xl p-4 border border-border-base opacity-50 flex flex-col items-center justify-center text-center gap-2">
                  <Calculator size={20} className="text-gray-500" />
                  <span className="text-xs font-bold text-gray-400">{tool}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
