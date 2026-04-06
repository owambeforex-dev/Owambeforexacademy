import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TrendingUp, ArrowRight, Calculator, PieChart, Activity, Clock, Wallet, CheckCircle2, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { countries } from 'countries-list';
import { useAuth } from '../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StickyHeader from '../components/StickyHeader';
import ContactSupportCTA from '../components/ContactSupportCTA';

const PLANS = [
  {
    title: 'Bronze Plan',
    roi: '23% Annual ROI',
    dailyPercent: 0.063, // Approx 23% annual
    min: 1000,
    max: 49000,
    duration: '360 Days',
  },
  {
    title: 'Silver Plan',
    roi: '27% Annual ROI',
    dailyPercent: 0.074, // Approx 27% annual
    min: 50000,
    max: 999000,
    duration: '360 Days',
  },
  {
    title: 'Gold Plan',
    roi: '30% Annual ROI',
    dailyPercent: 0.082, // Approx 30% annual
    min: 1000000,
    max: 10000000,
    duration: '360 Days',
  }
];

export default function Investment() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'Plans' | 'Portfolio'>('Plans');
  const [amounts, setAmounts] = useState<{ [key: number]: number | '' }>({});
  const [localCurrency, setLocalCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [investments, setInvestments] = useState<any[]>([]);
  const [portfolioStats, setPortfolioStats] = useState({ totalInvested: 0, totalProfit: 0, activePlans: 0, dailyProfit: 0, totalROI: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [showStatsModal, setShowStatsModal] = useState(false);

  useEffect(() => {
    const fetchLocationAndRate = async () => {
      try {
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const geoData = await geoRes.json();
        const countryCode = geoData.country;
        
        const countryData = (countries as any)[countryCode];
        const currency = countryData?.currency;
        const currencyCode = Array.isArray(currency) ? currency[0] : (currency || 'USD');
        
        setLocalCurrency(currencyCode);

        const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await rateRes.json();
        if (rateData && rateData.rates && rateData.rates[currencyCode]) {
          setExchangeRate(rateData.rates[currencyCode]);
        }
      } catch (error) {
        console.error('Error fetching location or exchange rate:', error);
      }
    };
    fetchLocationAndRate();
  }, []);

  useEffect(() => {
    if (!currentUser || activeTab !== 'Portfolio') return;

    // Portfolio Data reset to zero
    const mockInvestments: any[] = [];

    const totalInv = 0;
    const totalProf = 0;
    const activeCount = 0;
    const dailyProf = 0;
    const totalROI = 0;

    const generatedChartData = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      generatedChartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Invested: 0,
        Profit: 0,
        Total: 0
      });
    }

    setInvestments(mockInvestments);
    setChartData(generatedChartData);
    setPortfolioStats({ 
      totalInvested: totalInv, 
      totalProfit: totalProf, 
      activePlans: activeCount,
      dailyProfit: dailyProf,
      totalROI: totalROI
    });

    return () => {};
  }, [currentUser, activeTab]);

  const handleAmountChange = (index: number, value: string) => {
    setAmounts({
      ...amounts,
      [index]: value === '' ? '' : Number(value)
    });
  };

  const [successData, setSuccessData] = useState<any>(null);

  const handleStartInvestment = (plan: typeof PLANS[0], index: number) => {
    const amount = amounts[index];
    if (typeof amount !== 'number') return;
    
    if (amount < plan.min || amount > plan.max) {
      alert("Investment amount must be within the plan limits.");
      return;
    }

    // Navigate to checkout with investment details
    navigate('/checkout', {
      state: {
        investmentService: {
          title: plan.title,
          amount: amount,
          duration: plan.duration,
          roi: plan.roi,
          date: new Date().toLocaleDateString()
        }
      }
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Investment" />
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-left mb-8">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-3 text-text-primary">Investment <span className="text-brand-primary">Program</span></h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed">
            Build your wealth effortlessly with our professionally managed investment program. Earn up to 30% annual returns while our experienced trading team handles your capital for you.
          </p>
        </div>

        {currentUser && (
          <div className="flex justify-center mb-8">
            <div className="glass-dark rounded-full p-1 border border-border-base inline-flex">
              <button
                onClick={() => setActiveTab('Plans')}
                className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${activeTab === 'Plans' ? 'bg-brand-primary text-bg-primary shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Investment Plans
              </button>
              <button
                onClick={() => setActiveTab('Portfolio')}
                className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${activeTab === 'Portfolio' ? 'bg-brand-primary text-bg-primary shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
              >
                My Portfolio
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, index) => {
              const amount = amounts[index];
              const isValid = typeof amount === 'number' && amount >= plan.min && amount <= plan.max;
              const localAmount = typeof amount === 'number' ? amount * exchangeRate : 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-base p-5 md:p-6 h-full transition-all duration-300 hover:border-brand-primary flex flex-col group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors border border-border-base">
                    <TrendingUp size={20} className="text-text-secondary group-hover:text-brand-primary transition-colors md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 text-text-primary group-hover:text-brand-primary transition-colors">
                    {plan.title}
                  </h3>
                  <div className="text-base md:text-xl font-bold text-brand-primary mb-3">
                    {plan.roi}
                  </div>
                  
                  <div className="mb-4 pb-4 border-b border-border-base space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-[10px] md:text-xs">Range</span>
                      <span className="text-text-primary font-mono text-[10px] md:text-xs">
                        ${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary text-[10px] md:text-xs">Duration</span>
                      <span className="text-text-primary font-medium text-[10px] md:text-xs">{plan.duration}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 mb-6">
                    <div>
                      <label className="block text-[10px] font-medium text-text-secondary mb-1 uppercase tracking-wider">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">$</span>
                        <input
                          type="number"
                          value={amount === undefined ? '' : amount}
                          onChange={(e) => handleAmountChange(index, e.target.value)}
                          className="w-full bg-bg-secondary border border-border-base rounded-lg py-2 pl-8 pr-3 text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary transition-colors"
                          min={plan.min}
                          max={plan.max}
                          placeholder={`Min $${plan.min.toLocaleString()}`}
                        />
                      </div>
                    </div>

                    {typeof amount === 'number' && amount !== 0 && !isValid && (
                      <div className="text-red-500 text-[10px] mt-1">
                        Amount must fall within range.
                      </div>
                    )}

                    {typeof amount === 'number' && amount > 0 && localCurrency !== 'USD' && isValid && (
                      <div className="bg-brand-primary/5 rounded-lg p-2.5 border border-brand-primary/10 flex items-center gap-2">
                        <Calculator size={14} className="text-brand-primary shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-400 uppercase">Local Equivalent</span>
                          <span className="text-[10px] font-mono font-bold text-brand-primary">
                            ≈ {formatCurrency(localAmount, localCurrency)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleStartInvestment(plan, index)}
                    disabled={!isValid}
                    className="w-full py-3 bg-brand-primary text-bg-primary hover:bg-brand-secondary text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select Plan <ArrowRight size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Mobile Investment Summary Card */}
            <div className="md:hidden mb-6">
              <button 
                onClick={() => setShowStatsModal(true)}
                className="w-full card-base p-4 flex items-center justify-between group active:scale-[0.98] transition-all border border-brand-primary/20 bg-brand-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <PieChart size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-text-primary">Investment Summary</h3>
                    <p className="text-[10px] text-text-secondary">View your portfolio performance</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-text-secondary group-hover:text-brand-primary transition-colors" />
              </button>
            </div>

            {/* Desktop Portfolio Stats */}
            <div className="hidden md:grid grid-cols-4 gap-4 mb-8">
              <div className="card-base p-4 flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Wallet size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-text-secondary truncate uppercase tracking-wider">Invested</div>
                  <div className="text-sm md:text-base font-bold text-text-primary font-mono truncate">${portfolioStats.totalInvested.toLocaleString()}</div>
                </div>
              </div>
              <div className="card-base p-4 flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-text-secondary truncate uppercase tracking-wider">Profit</div>
                  <div className="text-sm md:text-base font-bold text-text-primary font-mono truncate">${portfolioStats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
              <div className="card-base p-4 flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Activity size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-text-secondary truncate uppercase tracking-wider">Daily</div>
                  <div className="text-sm md:text-base font-bold text-text-primary font-mono truncate">${portfolioStats.dailyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
              <div className="card-base p-4 flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <PieChart size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-text-secondary truncate uppercase tracking-wider">ROI</div>
                  <div className="text-sm md:text-base font-bold text-text-primary font-mono truncate">{portfolioStats.totalROI.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="card-base p-5 mb-8">
              <h3 className="text-sm md:text-lg font-bold text-text-primary mb-4">Performance (30D)</h3>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-base" vertical={false} />
                    <XAxis dataKey="name" stroke="currentColor" className="text-text-muted" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis stroke="currentColor" className="text-text-muted" tick={{fontSize: 10}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}
                      itemStyle={{ color: 'var(--brand-primary)' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                    />
                    <Area type="monotone" dataKey="Total" stroke="#eab308" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Investments List */}
            <h3 className="text-sm md:text-lg font-bold text-text-primary mb-4">Your Investments</h3>
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((inv) => (
                  <div key={inv.id} className="card-base p-4 w-full overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-full pr-4">
                        <h4 className="text-sm md:text-base font-bold text-text-primary truncate">{inv.plan}</h4>
                        <div className="text-[10px] text-text-secondary truncate">{new Date(inv.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold flex-shrink-0 ${
                        inv.status === 'Active' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 
                        inv.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' : 
                        inv.status === 'Rejected' ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 
                        'bg-gray-500/10 text-text-secondary'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-text-secondary truncate uppercase">Invested</div>
                        <div className="text-xs md:text-sm font-bold text-text-primary font-mono truncate">${inv.amount.toLocaleString()}</div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-text-secondary truncate uppercase">Profit</div>
                        <div className="text-xs md:text-sm font-bold text-green-600 dark:text-green-400 font-mono truncate">+${(inv.totalProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-text-secondary truncate uppercase">Daily</div>
                        <div className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 font-mono truncate">+${(inv.amount * ((inv.dailyPercent || 0) / 100)).toFixed(2)}</div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-text-secondary truncate uppercase">ROI</div>
                        <div className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 font-mono truncate">{((inv.totalProfit || 0) / inv.amount * 100).toFixed(2)}%</div>
                      </div>
                    </div>
                    {inv.status === 'Active' && (
                      <>
                        <div className="w-full bg-bg-primary rounded-full h-1 overflow-hidden border border-border-base">
                          <div className="bg-brand-primary h-full" style={{ width: `${Math.min(((inv.totalProfit || 0) / inv.amount) * 100, 100)}%` }}></div>
                        </div>
                        <div className="text-[8px] text-text-secondary mt-1.5 text-right uppercase tracking-wider">{(((inv.totalProfit || 0) / inv.amount) * 100).toFixed(2)}% ROI</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 card-base">
                <PieChart size={32} className="text-gray-600 mx-auto mb-3" />
                <h3 className="text-base md:text-lg font-bold text-text-primary mb-1">No Active Investments</h3>
                <p className="text-xs text-gray-500 mb-6">You don't have any active investment plans yet.</p>
                <button
                  onClick={() => setActiveTab('Plans')}
                  className="px-6 py-2 bg-brand-primary text-brand-dark rounded-lg text-sm font-bold hover:shadow-[0_0_15px_rgba(255,162,0,0.3)] transition-all"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>
        )}

        <ContactSupportCTA 
          title="Questions about our investment program?"
          description="Our wealth management team can explain our risk mitigation strategies and how we generate consistent returns for our investors."
        />
      </div>

      {/* Stats Modal for Mobile */}
      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-bg-primary border-t sm:border border-border-base rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowStatsModal(false)}
                      className="p-2 hover:bg-surface-hover rounded-full transition-colors"
                    >
                      <ArrowLeft size={20} className="text-text-secondary" />
                    </button>
                    <h2 className="text-xl font-bold text-text-primary">Investment Summary</h2>
                  </div>
                  <button 
                    onClick={() => setShowStatsModal(false)}
                    className="p-2 hover:bg-surface-hover rounded-full transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="card-base p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Total Invested</div>
                      <div className="text-2xl font-bold text-text-primary font-mono">${portfolioStats.totalInvested.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="card-base p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Total Profit</div>
                      <div className="text-2xl font-bold text-text-primary font-mono">${portfolioStats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </div>

                  <div className="card-base p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Activity size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Daily Profit</div>
                      <div className="text-2xl font-bold text-text-primary font-mono">${portfolioStats.dailyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </div>

                  <div className="card-base p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <PieChart size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Overall ROI</div>
                      <div className="text-2xl font-bold text-text-primary font-mono">{portfolioStats.totalROI.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowStatsModal(false)}
                  className="w-full py-4 bg-brand-primary text-bg-primary font-bold rounded-xl shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all"
                >
                  Close Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
