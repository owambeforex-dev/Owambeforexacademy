import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES: {
  title: string;
  description: string;
  icon: string;
  price?: string;
  example?: string;
  features: string[];
  featured: boolean;
  plans?: { name: string; price: string }[];
}[] = [
  {
    title: 'Prop Firm Evaluation Passing',
    description: 'We pass your prop firm challenges so you can get funded faster.',
    icon: '🏆',
    price: '10% of account size',
    example: '$2000 account → $200 fee',
    features: ['Phase 1 pass', 'Phase 2 pass', 'Risk-free guarantee', 'Fast turnaround'],
    featured: true,
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-bg-secondary relative overflow-hidden" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-text-primary">Premium Services</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Elevate your trading journey with our comprehensive suite of professional services.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`card-base p-8 relative overflow-hidden group ${service.featured ? 'border-brand-primary/50 glow-box' : 'card-hover'}`}
            >
              {service.featured && (
                <div className="absolute top-0 right-0 bg-brand-primary text-bg-primary text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
                  MOST POPULAR
                </div>
              )}
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-text-primary">{service.title}</h3>
              <p className="text-text-secondary mb-6">{service.description}</p>

              {service.plans && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {service.plans.map((plan, i) => (
                    <div key={i} className="bg-bg-secondary rounded-xl p-3 text-center border border-border-base hover:border-brand-primary/30 transition-colors shadow-sm">
                      <div className="text-xs text-text-secondary mb-1">{plan.name}</div>
                      <div className="font-bold text-brand-primary">{plan.price}</div>
                    </div>
                  ))}
                </div>
              )}

              {service.price && (
                <div className="bg-brand-primary/10 rounded-xl p-4 mb-6 border border-brand-primary/20">
                  <div className="font-bold text-brand-primary text-lg">{service.price}</div>
                  {service.example && <div className="text-sm text-text-muted mt-1">{service.example}</div>}
                </div>
              )}

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                    <CheckCircle2 size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  service.featured
                    ? 'bg-brand-primary hover:bg-brand-secondary text-bg-primary'
                    : 'bg-bg-secondary hover:bg-surface-hover text-text-primary border border-border-base'
                }`}
              >
                Get Started <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
