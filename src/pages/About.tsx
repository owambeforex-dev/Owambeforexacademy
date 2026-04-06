import React from 'react';
import { motion } from 'motion/react';
import { Target, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-dark relative overflow-hidden">
      <StickyHeader title="About Us" />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-xl md:hero-headline mb-6">About <span className="text-brand-primary">Us</span></h1>
          <p className="text-[10px] md:hero-subtext text-gray-400 max-w-3xl mx-auto leading-tight">
            Founded in 2019, Owambe Forex Academy has grown into a trusted hub for both aspiring and experienced forex traders across the globe. Under the leadership of our CEO, we have built a thriving community that empowers individuals to navigate the forex market with confidence, discipline, and skill.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-lg md:section-title mb-8 text-center font-bold">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-6 border border-border-base hover:border-brand-primary transition-colors group"
            >
              <TrendingUp size={32} className="text-brand-primary mb-4" />
              <h3 className="text-sm md:card-title mb-2 group-hover:text-brand-primary transition-colors font-bold">Forex Signals</h3>
              <p className="text-[10px] md:card-desc text-gray-400 leading-tight">Accurate and timely market signals to help you make informed trading decisions.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-2xl p-6 border border-border-base hover:border-brand-primary transition-colors group"
            >
              <Users size={32} className="text-brand-primary mb-4" />
              <h3 className="text-sm md:card-title mb-2 group-hover:text-brand-primary transition-colors font-bold">Forex Mentorship</h3>
              <p className="text-[10px] md:card-desc text-gray-400 leading-tight">One-on-one guidance and group mentorship programs tailored to all skill levels.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-dark rounded-2xl p-6 border border-border-base hover:border-brand-primary transition-colors group"
            >
              <Target size={32} className="text-brand-primary mb-4" />
              <h3 className="text-sm md:card-title mb-2 group-hover:text-brand-primary transition-colors font-bold">Forex Courses</h3>
              <p className="text-[10px] md:card-desc text-gray-400 leading-tight">Comprehensive training covering the fundamentals, strategies, and advanced techniques of forex trading.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-2xl p-6 border border-border-base hover:border-brand-primary transition-colors group"
            >
              <ShieldCheck size={32} className="text-brand-primary mb-4" />
              <h3 className="text-sm md:card-title mb-2 group-hover:text-brand-primary transition-colors font-bold">Fund & Account Management</h3>
              <p className="text-[10px] md:card-desc text-gray-400 leading-tight">Professional management services to help you grow your capital while minimizing risk.</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-dark rounded-3xl p-8 md:p-12 border border-brand-primary/30 text-center relative overflow-hidden group hover:shadow-[0_0_40px_rgba(255,162,0,0.3)] transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-lg md:section-title mb-6 text-brand-primary font-bold">Our Mission</h2>
          <p className="text-[10px] md:section-desc text-text-secondary mb-8 leading-tight">
            Is to transform ordinary individuals into consistently profitable traders by equipping them with practical knowledge, real-world strategies, and ongoing support.
          </p>
          <p className="text-[10px] md:section-desc text-text-secondary mb-8 leading-tight">
            We are committed to integrity, transparency, and excellence — values that have earned us the trust of our clients and the respect of our peers in the industry.
          </p>
          <p className="text-sm md:text-xl font-heading font-bold text-text-primary italic">
            "Join us and take your first step toward financial freedom through the world of forex."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
