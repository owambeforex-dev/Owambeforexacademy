import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ArrowRight, CheckCircle2, Calculator, Target, Activity, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import StickyHeader from '../components/StickyHeader';
import ContactSupportCTA from '../components/ContactSupportCTA';

const STEPS = [
  { title: 'Submit Account', description: 'Provide your prop firm challenge credentials securely.' },
  { title: 'Team Trades', description: 'Our expert team begins trading your account using proven strategies.' },
  { title: 'Pass Phase 1', description: 'We hit the initial profit target while managing risk strictly.' },
  { title: 'Pass Phase 2', description: 'We complete the verification phase to get you funded.' },
];

export default function EvaluationAccounts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'Service' | 'Tracker'>('Service');
  const [phaseType, setPhaseType] = useState<1 | 2 | null>(null);
  const [accountSize, setAccountSize] = useState<number | ''>('');
  const [challenges, setChallenges] = useState<any[]>([]);
  
  const feePercentage = phaseType === 1 ? 0.005 : phaseType === 2 ? 0.007 : 0;
  const fee = typeof accountSize === 'number' ? accountSize * feePercentage : 0;

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'challenges'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const challengeData: any[] = [];
        querySnapshot.forEach((doc) => {
          challengeData.push({ id: doc.id, ...doc.data() });
        });
        setChallenges(challengeData);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    if (activeTab === 'Tracker') {
      fetchChallenges();
    }
  }, [currentUser, activeTab]);

  const handleProceed = () => {
    if (!phaseType || typeof accountSize !== 'number' || accountSize <= 0) return;
    navigate('/checkout', { 
      state: { 
        propFirmService: {
          title: 'Prop Firm Evaluation Passing',
          evaluationType: `${phaseType} Phase`,
          accountSize: accountSize,
          price: fee
        }
      } 
    });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Evaluation Passing" />
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-primary rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-left mb-8">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-text-primary mb-3">Evaluation <span className="text-brand-primary">Accounts</span></h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed">
            Struggling to pass your prop firm challenge? Let our professional traders pass it for you. We guarantee Phase 1 and Phase 2 completion.
          </p>
        </div>

        {currentUser && (
          <div className="flex justify-center mb-8">
            <div className="glass-dark rounded-full p-1 border border-border-base inline-flex">
              <button
                onClick={() => setActiveTab('Service')}
                className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${activeTab === 'Service' ? 'bg-brand-primary text-bg-primary shadow-[0_0_15px_rgba(255,162,0,0.2)]' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Start Evaluation
              </button>
              <button
                onClick={() => setActiveTab('Tracker')}
                className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${activeTab === 'Tracker' ? 'bg-brand-primary text-bg-primary shadow-[0_0_15px_rgba(255,162,0,0.2)]' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Challenge Tracker
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Service' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left Column: Steps */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">How It Works</h2>
              <div className="grid grid-cols-1 gap-4">
                {STEPS.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-base p-5 flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 hover:border-brand-primary transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-base shrink-0 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-text-primary mb-1 group-hover:text-brand-primary transition-colors">{step.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Pricing Calculator */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-dark rounded-2xl p-6 md:p-8 border border-brand-primary/20 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl"></div>
                
                <div className="flex items-center gap-2 mb-6 relative z-10">
                  <Calculator size={24} className="text-brand-primary" />
                  <h2 className="text-base md:text-xl font-bold">Pricing Calculator</h2>
                </div>

                <div className="space-y-4 mb-6 relative z-10">
                  <div className="space-y-2">
                    <label className="block text-[10px] md:text-xs font-medium text-text-secondary uppercase tracking-wider">Evaluation Type</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${phaseType === 1 ? 'border-brand-primary bg-brand-primary/10' : 'border-border-base bg-bg-secondary hover:border-brand-primary/30'}`}>
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={phaseType === 1}
                            onChange={() => setPhaseType(1)}
                            className="peer appearance-none w-4 h-4 rounded border border-border-base bg-bg-primary checked:bg-brand-primary checked:border-brand-primary transition-colors cursor-pointer"
                          />
                          <CheckCircle2 size={12} className="absolute text-bg-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <span className="text-xs md:text-sm text-text-primary font-medium">1 Phase Evaluation</span>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${phaseType === 2 ? 'border-brand-primary bg-brand-primary/10' : 'border-border-base bg-bg-secondary hover:border-brand-primary/30'}`}>
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={phaseType === 2}
                            onChange={() => setPhaseType(2)}
                            className="peer appearance-none w-4 h-4 rounded border border-border-base bg-bg-primary checked:bg-brand-primary checked:border-brand-primary transition-colors cursor-pointer"
                          />
                          <CheckCircle2 size={12} className="absolute text-bg-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <span className="text-xs md:text-sm text-text-primary font-medium">2 Phase Evaluation</span>
                      </label>
                    </div>
                  </div>

                  <AnimatePresence>
                    {phaseType && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-[10px] md:text-xs font-medium text-text-secondary mb-1 uppercase tracking-wider">Account Size ($)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">$</span>
                            <input
                              type="number"
                              value={accountSize}
                              onChange={(e) => setAccountSize(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full bg-bg-secondary border border-border-base rounded-lg py-2.5 pl-8 pr-3 text-text-primary font-mono text-base focus:outline-none focus:border-brand-primary transition-colors"
                              min="1000"
                              step="1000"
                              placeholder="e.g. 50000"
                            />
                          </div>
                        </div>

                        <div className="bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/20 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-text-secondary font-medium">Service Fee:</span>
                            {typeof accountSize === 'number' && accountSize > 0 && (
                              <span className="text-[8px] md:text-[10px] text-brand-primary/80">
                                ({phaseType === 1 ? '0.5%' : '0.7%'} of ${accountSize.toLocaleString()})
                              </span>
                            )}
                          </div>
                          <span className="text-2xl md:text-3xl font-mono font-bold text-brand-primary">
                            ${fee.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
                  <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><CheckCircle2 size={12} className="text-brand-primary" /> Guaranteed passing</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><CheckCircle2 size={12} className="text-brand-primary" /> Risk management</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><CheckCircle2 size={12} className="text-brand-primary" /> Fast completion</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><CheckCircle2 size={12} className="text-brand-primary" /> 24/7 Support</div>
                </div>

                <button 
                  onClick={handleProceed}
                  disabled={!phaseType || typeof accountSize !== 'number' || accountSize <= 0}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-secondary text-bg-primary text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                >
                  Start Service <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {challenges.length > 0 ? (
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="glass-dark rounded-2xl p-5 md:p-6 border border-border-base relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm md:text-xl font-bold text-text-primary">{challenge.firm}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold ${challenge.status === 'In Progress' ? 'bg-brand-primary/10 text-brand-primary' : challenge.status === 'Passed' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                            {challenge.status}
                          </span>
                        </div>
                        <div className="text-[10px] md:text-xs text-text-secondary flex items-center gap-3">
                          <span>{challenge.phase}</span>
                          <span className="w-1 h-1 rounded-full bg-border-base"></span>
                          <span className="font-mono">${challenge.accountSize.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 text-left md:text-right">
                        <div className="text-[10px] text-text-muted mb-0.5">Started</div>
                        <div className="text-text-primary text-xs font-medium flex items-center md:justify-end gap-1.5">
                          <Clock size={14} className="text-brand-primary" />
                          {new Date(challenge.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 relative z-10">
                      {/* Profit Target */}
                      <div className="bg-bg-secondary rounded-xl p-4 border border-border-base shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                            <Target size={14} className="text-green-600 dark:text-green-400" />
                            <span>Target</span>
                          </div>
                          <span className="text-[10px] font-mono text-text-muted">${challenge.profitTarget.toLocaleString()}</span>
                        </div>
                        <div className="text-lg md:text-xl font-bold font-mono text-text-primary mb-2">
                          ${challenge.currentProfit.toLocaleString()}
                        </div>
                        <div className="w-full bg-bg-primary rounded-full h-1.5 overflow-hidden border border-border-base">
                          <div 
                            className="bg-green-500 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (challenge.currentProfit / challenge.profitTarget) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1.5 text-[8px] md:text-[10px]">
                          <span className="text-text-muted">0%</span>
                          <span className="text-green-600 dark:text-green-400 font-bold">{((challenge.currentProfit / challenge.profitTarget) * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Max Loss */}
                      <div className="bg-bg-secondary rounded-xl p-4 border border-border-base shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                            <ShieldCheck size={14} className="text-red-600 dark:text-red-400" />
                            <span>Max Loss</span>
                          </div>
                          <span className="text-[10px] font-mono text-text-muted">-${challenge.maxLoss.toLocaleString()}</span>
                        </div>
                        <div className="text-lg md:text-xl font-bold font-mono text-text-primary mb-2">
                          -${challenge.currentLoss.toLocaleString()}
                        </div>
                        <div className="w-full bg-bg-primary rounded-full h-1.5 overflow-hidden flex justify-end border border-border-base">
                          <div 
                            className="bg-red-500 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (challenge.currentLoss / challenge.maxLoss) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1.5 text-[8px] md:text-[10px]">
                          <span className="text-red-600 dark:text-red-400 font-bold">{((challenge.currentLoss / challenge.maxLoss) * 100).toFixed(1)}%</span>
                          <span className="text-text-muted">100%</span>
                        </div>
                      </div>

                      {/* Daily Loss */}
                      <div className="bg-bg-secondary rounded-xl p-4 border border-border-base col-span-2 md:col-span-1 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                            <Activity size={14} className="text-yellow-600 dark:text-yellow-400" />
                            <span>Daily Loss</span>
                          </div>
                          <span className="text-[10px] font-mono text-text-muted">-${challenge.dailyLossLimit.toLocaleString()}</span>
                        </div>
                        <div className="text-lg md:text-xl font-bold font-mono text-text-primary mb-2">
                          -${challenge.currentDailyLoss.toLocaleString()}
                        </div>
                        <div className="w-full bg-bg-primary rounded-full h-1.5 overflow-hidden flex justify-end border border-border-base">
                          <div 
                            className="bg-yellow-500 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (challenge.currentDailyLoss / challenge.dailyLossLimit) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1.5 text-[8px] md:text-[10px]">
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold">{((challenge.currentDailyLoss / challenge.dailyLossLimit) * 100).toFixed(1)}%</span>
                          <span className="text-text-muted">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-dark rounded-2xl border border-border-base">
                <Award size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2">No Active Challenges</h3>
                <p className="text-xs md:text-sm text-text-secondary max-w-sm mx-auto mb-6">
                  You don't have any prop firm challenges currently being managed by our team.
                </p>
                <button
                  onClick={() => setActiveTab('Service')}
                  className="px-6 py-2.5 bg-brand-primary text-bg-primary rounded-lg text-sm font-bold hover:shadow-[0_0_15px_rgba(255,162,0,0.3)] transition-all"
                >
                  Start an Evaluation
                </button>
              </div>
            )}
          </div>
        )}

        <ContactSupportCTA 
          title="Questions about prop firm passing?"
          description="We understand the complexities of prop firm evaluations. Our support team can clarify our process and risk management strategies."
        />
      </div>
    </div>
  );
}
