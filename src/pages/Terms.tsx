import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ChevronDown } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

const TERMS = [
  {
    title: 'Account Management Terms',
    content: `**Profit Sharing & Withdrawals:**
Profits are shared 50/50 between the account owner and manager.
Withdrawals can be made Bi-weekly or Bi-monthly, depending on agreement.

**Important Notes:**
The account manager is not responsible for any trading losses.
Proper risk management will always be applied.
The manager may stop managing the account at any time based on their discretion.`
  },
  {
    title: 'General Terms of Service',
    content: `By accessing and using Owambe Forex Academy's services, you agree to comply with all applicable laws and regulations. Our educational content and signals are for informational purposes only and do not constitute financial advice. Trading forex involves significant risk and may not be suitable for all investors.`
  },
  {
    title: 'Refund Policy',
    content: `All sales for digital products, mentorship programs, and signal services are final. We do not offer refunds once access to the service or content has been granted. Please ensure you fully understand the service before making a purchase.`
  }
];

export default function Terms() {
  const [openTerm, setOpenTerm] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Terms & Conditions" />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Shield size={48} className="text-brand-primary mx-auto mb-6" />
          <h1 className="text-xl md:hero-headline text-text-primary mb-6">Terms & <span className="text-brand-primary">Policies</span></h1>
          <p className="text-[10px] md:hero-subtext text-text-secondary max-w-2xl mx-auto leading-tight">
            Please read our terms and policies carefully before using our services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {TERMS.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-dark rounded-2xl border transition-all duration-300 ${openTerm === index ? 'border-brand-primary shadow-[0_0_20px_rgba(255,162,0,0.15)]' : 'border-white/10 hover:border-white/30'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenTerm(openTerm === index ? null : index)}
              >
                <span className={`font-heading font-bold text-sm md:text-lg transition-colors ${openTerm === index ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary'}`}>
                  {term.title}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 ${openTerm === index ? 'rotate-180 text-brand-primary' : 'text-text-secondary'}`} 
                />
              </button>
              <AnimatePresence>
                {openTerm === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-[10px] md:text-base text-text-secondary font-sans leading-tight whitespace-pre-line">
                      {term.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i} className="text-text-primary block mt-4 mb-2 text-xs md:text-base">{part}</strong> : part
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-dark rounded-3xl p-8 border border-border-base text-center"
        >
          <p className="text-text-secondary font-sans italic">
            "By using the Account Management service, the client agrees to these terms and policies."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
