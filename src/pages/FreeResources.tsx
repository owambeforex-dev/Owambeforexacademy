import React from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Video, BookOpen } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

const RESOURCES = [
  {
    title: 'Beginner Forex Trading Guide',
    description: 'A comprehensive PDF guide covering the basics of forex trading, terminology, and market structure.',
    type: 'PDF',
    icon: <FileText size={24} />,
    size: '2.4 MB'
  },
  {
    title: 'Risk Management Calculator',
    description: 'An Excel spreadsheet to help you calculate position sizes and manage your risk per trade.',
    type: 'Excel',
    icon: <BookOpen size={24} />,
    size: '1.1 MB'
  },
  {
    title: 'Top 5 Price Action Strategies',
    description: 'A video tutorial explaining our most profitable price action trading strategies.',
    type: 'Video',
    icon: <Video size={24} />,
    size: '145 MB'
  },
  {
    title: 'Weekly Market Analysis Template',
    description: 'The exact template our professional traders use to prepare for the trading week.',
    type: 'PDF',
    icon: <FileText size={24} />,
    size: '0.8 MB'
  }
];

export default function FreeResources() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-primary">
      <StickyHeader title="Free Resources" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-5xl font-serif font-bold mb-6 text-text-primary"
          >
            Free Forex <span className="text-brand-primary">Resources</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] md:text-lg text-text-secondary leading-tight"
          >
            Download our curated collection of educational materials to accelerate your trading journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {RESOURCES.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="glass rounded-2xl p-6 border border-border-base hover:border-brand-primary/30 transition-colors flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                  {resource.icon}
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-bold text-text-primary mb-1">{resource.title}</h3>
                  <span className="inline-block px-2 py-1 bg-surface rounded text-[8px] md:text-xs text-text-muted font-medium">
                    {resource.type} • {resource.size}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary text-[10px] md:text-sm mb-6 flex-1 leading-tight">{resource.description}</p>
              <button className="w-full py-3 bg-surface hover:bg-surface-hover text-text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Download size={18} /> Download Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
