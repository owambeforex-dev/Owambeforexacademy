import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Activity, Briefcase, TrendingUp, Award } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

const SERVICES = [
  {
    title: 'Forex Mentorship',
    description: 'One-on-one guidance and group mentorship programs tailored to all skill levels. Learn institutional strategies and risk management.',
    icon: BookOpen,
    path: '/services/mentorship'
  },
  {
    title: 'Signal Services',
    description: 'Accurate and timely market signals to help you make informed trading decisions with exact entry, stop loss, and take profit levels.',
    icon: Activity,
    path: '/services/signals'
  },
  {
    title: 'Account Management',
    description: 'Professional management services to help you grow your capital while minimizing risk. 50/50 profit split.',
    icon: Briefcase,
    path: '/services/account-management'
  },
  {
    title: 'Investment',
    description: 'Enjoy up to 35% annual ROI. Our investment packages are designed for individuals who want to benefit from the forex market passively.',
    icon: TrendingUp,
    path: '/services/investment'
  },
  {
    title: 'Evaluation Accounts',
    description: 'We pass your prop firm challenge. Submit your challenge account and our team trades it to pass Phase 1 and Phase 2.',
    icon: Award,
    path: '/services/evaluation'
  }
];

export default function AllServices() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Our Services" />
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-xl md:hero-headline mb-6">All <span className="text-brand-primary">Services</span></h1>
          <p className="text-[10px] md:hero-subtext text-text-secondary max-w-2xl mx-auto leading-tight">
            Comprehensive solutions designed to accelerate your growth as a trader and maximize your financial potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SERVICES.map((service, index) => (
            <Link key={index} to={service.path} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="service-card glass rounded-3xl p-8 h-full border border-border-base group"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 transition-colors duration-300">
                  <service.icon size={32} className="text-text-secondary group-hover:text-brand-primary transition-colors duration-300" />
                </div>
                <h3 className="text-sm md:card-title md:text-2xl mb-4 text-text-primary group-hover:text-brand-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-[10px] md:card-desc text-text-secondary leading-tight">
                  {service.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
