import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StickyHeader from '../components/StickyHeader';
import ContactSupportCTA from '../components/ContactSupportCTA';

const FAQS = [
  {
    question: 'What about Owambe Forex Academy?',
    answer: 'Owambe Forex Academy is a forex education and mentorship platform offering forex courses, one-on-one mentorship, signals, account management, and investment opportunities to help traders succeed.'
  },
  {
    question: 'Do I need prior experience to join?',
    answer: 'No, our programs are designed for both beginners and experienced traders. We train you from the basics to advanced strategies.'
  },
  {
    question: 'How can I join the mentorship program?',
    answer: 'You can join the mentorship program through the mentorship page and select your preferred plan.'
  },
  {
    question: 'Do you provide free forex signals?',
    answer: 'Yes, we have a free Telegram channel for traders who may be financially limited or want a glimpse of our premium services.\n\nHowever, for consistent results we recommend joining our Premium VIP Signals.'
  },
  {
    question: 'What does the premium signal service include?',
    answer: 'Real-time signals with entry, stop loss and take profit.\n\nCoverage of forex pairs, indices, metals and commodities.\n\nTrade management tips and higher accuracy.\n\nPriority mentorship and customer support.'
  },
  {
    question: 'How can I access your forex courses?',
    answer: 'Our forex courses are currently free and selected lessons are available in the Resources section of our website.'
  },
  {
    question: 'What is account management?',
    answer: 'Account management means our professional trading team trades on your behalf using tested strategies.\n\nYou fund your account and we trade it for you on a profit-sharing basis.'
  },
  {
    question: 'Do you offer investment opportunities?',
    answer: 'Yes. We offer investment plans where investors can enjoy up to 35% annual ROI.\n\nOur investment packages are designed for individuals who may not have the time or skill to trade themselves but still want to benefit from the forex market.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-dark relative overflow-hidden">
      <StickyHeader title="FAQ" />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-xl md:hero-headline mb-6">Frequently Asked <span className="text-brand-primary">Questions</span></h1>
          <p className="text-[10px] md:hero-subtext text-gray-400 max-w-2xl mx-auto leading-tight">
            Find answers to common questions about our services, mentorship programs, and trading strategies.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-dark rounded-2xl border transition-all duration-300 ${openIndex === index ? 'border-brand-primary shadow-[0_0_20px_rgba(255,162,0,0.15)]' : 'border-white/10 hover:border-white/30'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`text-sm md:faq-question transition-colors font-bold ${openIndex === index ? 'text-brand-primary' : 'text-white'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-brand-primary' : 'text-gray-400'}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="text-[10px] md:faq-answer px-6 pb-5 text-gray-400 whitespace-pre-line leading-tight">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <ContactSupportCTA 
          title="Need more information?"
          description="Our support team is always ready to assist you with any inquiries about our services or trading programs."
        />
      </div>
    </div>
  );
}
