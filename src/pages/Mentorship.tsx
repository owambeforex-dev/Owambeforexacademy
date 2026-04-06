import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Globe, MousePointerClick, CreditCard, FileText, GraduationCap } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import ContactSupportCTA from '../components/ContactSupportCTA';

const PLANS = [
  { title: '1 Month Mentorship', price: '$199', duration: '1 Month' },
  { title: '3 Month Mentorship', price: '$499', duration: '3 Months' },
  { title: '6 Month Mentorship', price: '$999', duration: '6 Months' },
  { title: '1 Year Mentorship', price: '$1499', duration: '1 Year' },
];

const FEATURES = [
  '2–3 signals daily',
  'Breakdown on every signal shared',
  'Screenshots of every signal shared for reference',
  'Stop loss and take profit on every signal'
];

export default function Mentorship() {
  const navigate = useNavigate();

  const handleEnroll = (plan: { title: string; price: string; duration: string }) => {
    navigate('/checkout', { state: { plan } });
  };
  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Mentorship" />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-left mb-10">
          <h1 className="text-2xl md:text-4xl font-heading font-extrabold text-text-primary mb-4">Learn and Earn <span className="text-brand-primary">with Us</span></h1>
          <p className="text-xs md:text-base text-text-secondary max-w-xl leading-relaxed">
            Your journey to becoming a successful, profitable trader begins here.
          </p>
        </div>

        {/* Plan Selection Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mr-auto mb-10 glass-dark rounded-xl p-4 md:p-6 border border-brand-primary/50 text-left relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 via-brand-primary/5 to-brand-primary/0 animate-pulse"></div>
          <h2 className="text-sm md:text-xl font-serif font-bold text-text-primary relative z-10">
            Choose from our amazing mentorship plan
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 max-w-6xl mx-auto group/cards">
          {PLANS.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark rounded-xl p-2.5 md:p-6 h-full border border-border-base transition-all duration-500 hover:border-brand-primary hover:shadow-[0_0_30px_rgba(255,162,0,0.3)] hover:-translate-y-1 group-hover/cards:opacity-85 hover:!opacity-100 flex flex-col group"
            >
              <h3 className="text-[10px] md:text-lg font-bold mb-1 text-text-primary group-hover:text-brand-primary transition-colors duration-300 truncate">
                {plan.title}
              </h3>
              <div className="text-base md:text-2xl font-bold text-brand-primary mb-2 md:mb-4">
                {plan.price}
              </div>
              
              <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6 flex-1">
                {FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-1.5 md:gap-2 text-text-secondary">
                    <CheckCircle2 size={10} className="text-brand-primary shrink-0 mt-0.5 md:w-3.5 md:h-3.5" />
                    <span className="text-[8px] md:text-xs leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleEnroll(plan)}
                className="w-full py-2 md:py-3 bg-brand-primary text-bg-primary hover:bg-brand-secondary text-[10px] md:text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1 md:gap-1.5 shadow-md shadow-brand-primary/10"
              >
                Enroll <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* How Our Mentorship Program Works */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="text-left mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">How Our Mentorship Program <span className="text-brand-primary">Works</span></h2>
            <p className="text-sm md:text-base text-text-secondary max-w-2xl">
              Joining our mentorship program is simple and flexible. We have four different mentorship plans tailored to meet your learning goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-xl p-4 md:p-6 border border-border-base hover:border-brand-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-brand-primary font-bold text-sm md:text-base">1M</span>
                </div>
                <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">1-Month</h3>
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Ideal for beginners who want a quick introduction to forex trading.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-xl p-4 md:p-6 border border-border-base hover:border-brand-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-brand-primary font-bold text-sm md:text-base">3M</span>
                </div>
                <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">3-Month</h3>
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Best for traders seeking deeper knowledge and consistent practice.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-dark rounded-xl p-4 md:p-6 border border-border-base hover:border-brand-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-brand-primary font-bold text-sm md:text-base">6M</span>
                </div>
                <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">6-Month</h3>
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Perfect for those who want long-term mentorship and advanced strategies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-xl p-4 md:p-6 border border-border-base hover:border-brand-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-brand-primary font-bold text-sm md:text-base">1Y</span>
                </div>
                <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">1-Year</h3>
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Designed for serious traders who want to master forex with full support.
              </p>
            </motion.div>
          </div>

          {/* Steps to Join */}
          <div className="text-left mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Steps to <span className="text-brand-primary">Join</span></h3>
            <div className="w-16 h-0.5 bg-brand-primary/30 rounded-full mb-10"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
              {/* Connecting Line for Desktop */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-border-base z-0"></div>

              {[
                { icon: Globe, title: 'Visit', desc: 'Visit our website and go to Mentorship.' },
                { icon: MousePointerClick, title: 'Choose', desc: 'Choose your preferred plan.' },
                { icon: CreditCard, title: 'Pay', desc: 'Make payment securely.' },
                { icon: FileText, title: 'Register', desc: 'Complete registration form.' },
                { icon: GraduationCap, title: 'Learn', desc: 'Start learning with our team.' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative z-10 glass-dark rounded-xl p-4 border border-border-base hover:border-brand-primary transition-all duration-300 group text-center flex flex-col items-center ${index === 4 && 'col-span-2 md:col-span-1'}`}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-bg-primary border border-brand-primary/30 group-hover:border-brand-primary flex items-center justify-center mb-3 transition-colors relative">
                    <step.icon size={20} className="text-brand-primary md:w-8 md:h-8" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-brand-primary text-bg-primary font-bold flex items-center justify-center text-[10px] md:text-xs shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-text-primary mb-1">{step.title}</h4>
                  <p className="text-[10px] md:text-xs text-text-secondary leading-tight">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-16 glass-dark rounded-2xl p-6 md:p-10 border border-brand-primary/30 text-center relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,162,0,0.2)] transition-all duration-500"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xs md:text-sm text-text-secondary mb-6 max-w-xl mx-auto">
            Join thousands of successful traders who have transformed their financial future with our mentorship programs.
          </p>
          <button 
            onClick={() => handleEnroll(PLANS[0])}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-bg-primary text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-brand-primary/20"
          >
            Enroll Now <ArrowRight size={18} />
          </button>
        </motion.div>

        <ContactSupportCTA 
          title="Need help choosing a plan?"
          description="Our mentorship advisors can help you select the right program based on your current experience level and trading goals."
        />
      </div>
    </div>
  );
}
