import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SearchInput from '../SearchInput';

export default function Hero() {
  return (
    <section className="hidden md:block relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Search Bar Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 relative z-50">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block text-xl md:text-3xl font-serif font-bold mb-6"
          >
            The End Of Your Search Is Here
          </motion.h2>
          
          <div className="max-w-2xl mx-auto">
            <SearchInput placeholder="Ask Owambe Forex Academy" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[10px] md:text-sm text-text-secondary mb-10 max-w-2xl mx-auto italic leading-tight"
          >
            "It’s not whether you’re right or wrong, but how much money you make when you’re right and how much you lose when you’re wrong. &gt;George Soros&lt;"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3 md:py-4 bg-brand-primary hover:bg-brand-secondary text-brand-dark font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Join Owambe Forex Academy <ArrowRight size={20} />
            </Link>
            <Link
              to="/services/investment"
              className="w-full sm:w-auto px-8 py-3 md:py-4 bg-surface text-brand-primary font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base border border-border-base hover:bg-surface-hover"
            >
              Start your investment journey
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
