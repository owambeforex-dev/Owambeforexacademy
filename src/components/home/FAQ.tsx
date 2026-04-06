import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import ContactSupportCTA from '../ContactSupportCTA';

const FAQS = [
  {
    question: 'What is forex trading?',
    answer: 'Forex (foreign exchange) trading is the process of buying and selling currencies to make a profit. It is the largest financial market in the world, operating 24 hours a day, 5 days a week.',
  },
  {
    question: 'How do signals work?',
    answer: 'Our premium signals provide you with exact entry prices, stop-loss levels, and take-profit targets. You simply copy these parameters into your trading platform (like MT4 or MT5) when you receive the notification.',
  },
  {
    question: 'How do I join the mentorship program?',
    answer: 'You can join by selecting a plan from our Services section and completing the payment. Once registered, you will receive access to our private community, live class schedule, and educational resources.',
  },
  {
    question: 'What is the minimum investment for account management?',
    answer: 'The minimum capital required for our account management service is $1,000. We operate on a strict 50/50 profit split model, and you retain full control over your funds at all times.',
  },
  {
    question: 'How do withdrawals work for the investment program?',
    answer: 'Withdrawals can be requested through your user dashboard. For the fixed ROI investment program, payouts are processed monthly or annually depending on your selected plan, directly to your preferred payment method.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-bg-secondary relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-text-primary">Frequently Asked Questions</h2>
          <p className="text-text-secondary">Everything you need to know about Owambe Forex Academy.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface rounded-xl border border-border-base overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-surface-hover transition-colors"
              >
                <span className="font-semibold text-lg text-text-primary">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-brand-primary"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 text-text-secondary leading-relaxed border-t border-border-base pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <ContactSupportCTA 
          className="mt-16"
          title="Still have questions?"
          description="Our support team is available 24/7 to assist you with any inquiries or issues you may have."
        />
      </div>
    </section>
  );
}
