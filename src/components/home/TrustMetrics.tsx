import React from 'react';
import { motion } from 'motion/react';
import { Users, Activity, ShieldCheck, Globe2 } from 'lucide-react';

const METRICS = [
  {
    icon: Users,
    value: '50K+',
    label: 'Active Traders',
    description: 'Trusting our platform globally'
  },
  {
    icon: Activity,
    value: '$2.5B+',
    label: 'Trading Volume',
    description: 'Processed monthly'
  },
  {
    icon: ShieldCheck,
    value: '99.9%',
    label: 'Uptime',
    description: 'Bank-grade reliability'
  },
  {
    icon: Globe2,
    value: '150+',
    label: 'Countries',
    description: 'Supported worldwide'
  }
];

export default function TrustMetrics() {
  return (
    <section className="py-24 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary rounded-full mix-blend-screen filter blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-3xl font-bold mb-4 text-text-primary">Institutional-Grade <span className="text-brand-primary">Trust</span></h2>
          <p className="text-[10px] md:text-base text-text-secondary max-w-2xl mx-auto leading-tight">
            Built for professional traders, backed by industry-leading security and performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-2xl p-6 sm:p-8 border border-border-base text-center hover:border-brand-primary/50 transition-colors group w-full overflow-hidden"
              >
                <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={32} className="text-brand-primary" />
                </div>
                <div className="text-2xl md:text-4xl font-bold font-mono text-text-primary mb-2 truncate">{metric.value}</div>
                <div className="text-sm md:text-lg font-semibold text-text-secondary mb-2 truncate">{metric.label}</div>
                <p className="text-[10px] md:text-sm text-text-muted break-words leading-tight">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
