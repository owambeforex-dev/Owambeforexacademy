import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Headset, ArrowRight } from 'lucide-react';

interface ContactSupportCTAProps {
  className?: string;
  title?: string;
  description?: string;
}

export default function ContactSupportCTA({ 
  className = "", 
  title = "Still have questions?", 
  description = "Our support team is available 24/7 to assist you with any inquiries or issues you may have."
}: ContactSupportCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`max-w-4xl mx-auto mt-20 glass-dark rounded-2xl p-8 md:p-12 border border-brand-primary/20 text-center relative overflow-hidden group hover:shadow-[0_0_40px_rgba(255,162,0,0.15)] transition-all duration-500 ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-brand-primary/10 transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -ml-32 -mb-32 group-hover:bg-brand-primary/10 transition-colors duration-500"></div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
          <Headset size={32} className="text-brand-primary" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-white">{title}</h2>
        <p className="text-sm md:text-base text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        
        <Link 
          to="/support"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-brand-dark font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 active:scale-95"
        >
          Contact Support <ArrowRight size={20} />
        </Link>
      </div>
    </motion.div>
  );
}
