import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, ArrowRight, ShieldCheck, TrendingUp, DollarSign, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import ContactSupportCTA from '../components/ContactSupportCTA';

const STEPS = [
  { title: 'Apply', description: 'Submit your application and connect your trading account securely.', icon: Briefcase },
  { title: 'Trade', description: 'Our professional team trades your account using tested strategies tools.', icon: TrendingUp },
  { title: 'Profit', description: 'Enjoy consistent returns with our transparent 50/50 profit split.', icon: DollarSign },
];

const POLICIES = [
  {
    title: 'Profit Sharing',
    content: 'Profits are shared on a 50/50 basis between the account owner and the account manager.'
  },
  {
    title: 'Withdrawals',
    content: 'Withdrawals can be made **Bi-weekly or Bi-monthly**.\nThe withdrawal schedule depends on the agreement between the account manager and the account owner.'
  }
];

export default function AccountManagement() {
  const [openPolicy, setOpenPolicy] = useState<number | null>(0);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Account Management" />
      
      {/* How It Works Modal */}
      <AnimatePresence>
        {isHowItWorksOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHowItWorksOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-bg-primary border-t md:border border-border-base rounded-t-[2rem] md:rounded-2xl p-6 md:p-8 overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setIsHowItWorksOpen(false)}
                  className="p-2 -ml-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-text-primary">How It Works</h2>
              </div>

              <div className="space-y-8">
                {STEPS.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <step.icon size={20} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary mb-1">{index + 1}. {step.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsHowItWorksOpen(false)}
                className="w-full mt-10 py-4 bg-brand-primary text-brand-dark font-bold rounded-xl shadow-lg shadow-brand-primary/10"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-primary rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-left mb-10">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-3 text-text-primary">Account <span className="text-brand-primary">Management</span></h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed">
            Let our professional trading team manage your capital. We utilize institutional-grade strategies to generate consistent returns while minimizing risk.
          </p>
        </div>

        {/* Mobile How It Works Trigger */}
        <div className="md:hidden mb-8">
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="w-full glass-dark rounded-2xl p-5 flex items-center justify-between border border-border-base active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Briefcase size={20} className="text-brand-primary" />
              </div>
              <span className="text-sm font-bold text-text-primary">See how it works</span>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Desktop Steps Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-dark rounded-2xl p-6 text-center border border-border-base transition-all duration-300 hover:border-brand-primary group"
            >
              <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-primary/20 transition-colors">
                <step.icon size={24} className="text-brand-primary" />
              </div>
              <h3 className="text-base font-bold mb-1 text-text-primary group-hover:text-brand-primary transition-colors">
                {index + 1}. {step.title}
              </h3>
              <p className="text-xs text-text-secondary leading-tight">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto glass-dark rounded-2xl p-6 md:p-10 border border-brand-primary/20 text-center relative overflow-hidden group mb-12"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl"></div>
          
          <ShieldCheck size={32} className="text-brand-primary mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-primary">Transparent Profit Sharing</h2>
          <p className="text-[10px] md:text-xs text-text-secondary mb-6 max-w-lg mx-auto leading-relaxed">
            We believe in aligning our success with yours.<br className="hidden md:block" /> That's why we operate on a strict profit-sharing model.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-mono font-bold text-brand-primary">50%</div>
              <div className="text-[10px] md:text-xs text-text-secondary font-medium uppercase tracking-widest">Client</div>
            </div>

            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255,162,0,0)",
                  "0 0 20px rgba(255,162,0,0.3)",
                  "0 0 0px rgba(255,162,0,0)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <Link 
                to="/account-management-application"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-secondary text-bg-primary text-sm font-bold rounded-lg transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
              >
                Apply Now <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-mono font-bold text-text-primary">50%</div>
              <div className="text-[10px] md:text-xs text-text-secondary font-medium uppercase tracking-widest">Institution</div>
            </div>
          </div>
        </motion.div>

        {/* Policies Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-brand-primary mb-6 text-center">Policies & Terms</h2>
          
          <div className="space-y-3 mb-8">
            {POLICIES.map((policy, index) => (
              <div 
                key={index}
                className={`glass-dark rounded-xl border transition-all duration-300 ${openPolicy === index ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-border-base hover:border-white/20'}`}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none group"
                  onClick={() => setOpenPolicy(openPolicy === index ? null : index)}
                >
                  <span className={`font-bold text-sm md:text-base transition-colors ${openPolicy === index ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary'}`}>
                    {policy.title}
                  </span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-300 ${openPolicy === index ? 'rotate-180 text-brand-primary' : 'text-text-secondary'}`} 
                  />
                </button>
                <AnimatePresence>
                  {openPolicy === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-xs md:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                        {policy.content.split('**').map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="text-text-primary">{part}</strong> : part
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div 
              className={`glass-dark rounded-xl border transition-all duration-300 ${openPolicy === 2 ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-border-base hover:border-white/20'}`}
            >
              <button
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenPolicy(openPolicy === 2 ? null : 2)}
              >
                <span className={`font-bold text-sm md:text-base transition-colors ${openPolicy === 2 ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary'}`}>
                  Important Notes
                </span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${openPolicy === 2 ? 'rotate-180 text-brand-primary' : 'text-text-secondary'}`} 
                />
              </button>
              <AnimatePresence>
                {openPolicy === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <ul className="space-y-2 text-xs md:text-sm text-text-secondary">
                        <li className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 shrink-0"></div>
                          <p>The manager is <strong className="text-text-primary">not responsible for any losses</strong> incurred during trading.</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 shrink-0"></div>
                          <p>We apply <strong className="text-text-primary">proper risk management</strong> to keep accounts safe.</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 shrink-0"></div>
                          <p>The manager <strong className="text-text-primary">reserves the right to stop management</strong> at any time.</p>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <ContactSupportCTA 
          title="Interested in Account Management?"
          description="If you have specific requirements or want to discuss our trading strategies in detail, our institutional support team is ready to help."
        />
      </div>
    </div>
  );
}
