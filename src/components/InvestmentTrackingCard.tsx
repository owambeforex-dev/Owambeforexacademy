import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InvestmentData {
  id: string;
  plan: string;
  amount: number;
  createdAt: string;
  status: string;
  serviceType: string;
}

export default function InvestmentTrackingCard() {
  const [activeInvestment, setActiveInvestment] = useState<InvestmentData | null>(null);
  const [stats, setStats] = useState({
    dailyROI: 0,
    totalROI: 0,
    progress: 0,
    daysRemaining: 365
  });

  useEffect(() => {
    const saved = localStorage.getItem('owambe_tickets');
    if (saved) {
      try {
        const allTickets = JSON.parse(saved);
        // Find the most recent active investment
        const investment = allTickets
          .filter((t: any) => t.serviceType === 'Investment' && t.status === 'Resolved')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        
        if (investment) {
          setActiveInvestment(investment);
          calculateStats(investment);
        }
      } catch (e) {
        console.error('Error parsing tickets', e);
      }
    }
  }, []);

  const calculateStats = (investment: InvestmentData) => {
    const startDate = new Date(investment.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Plan ROI percentages
    const planROI: { [key: string]: number } = {
      'Bronze Plan': 23,
      'Silver Plan': 27,
      'Gold Plan': 30
    };

    const annualROI = planROI[investment.plan] || 25; // Default to 25% if plan not found
    const dailyROIPercent = annualROI / 365;
    const dailyROIValue = (dailyROIPercent / 100) * investment.amount;
    const totalROIValue = dailyROIValue * diffDays;
    const progress = (diffDays / 365) * 100;

    setStats({
      dailyROI: dailyROIValue,
      totalROI: totalROIValue,
      progress: Math.min(progress, 100),
      daysRemaining: Math.max(365 - diffDays, 0)
    });
  };

  if (!activeInvestment) {
    return (
      <div className="bg-surface rounded-3xl border border-border-base p-6 mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mx-auto mb-3">
          <TrendingUp size={24} />
        </div>
        <h3 className="text-sm font-bold text-text-primary mb-1">No Active Investments</h3>
        <p className="text-[10px] text-text-secondary">Your investment tracking will appear here once you have an active plan.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-3xl border border-border-base p-6 mb-8 shadow-sm relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Investment Tracking</h3>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{activeInvestment.plan}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-success/10 text-success flex items-center gap-1">
              <CheckCircle2 size={8} /> Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-1">
            <p className="text-[10px] text-text-muted uppercase font-bold">Total Locked</p>
            <p className="text-xl font-bold text-text-primary font-mono">${activeInvestment.amount.toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] text-text-muted uppercase font-bold">Daily ROI</p>
            <p className="text-xl font-bold text-success font-mono">+${stats.dailyROI.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-bg-secondary/50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-border-base/30">
          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Total ROI Earned</p>
            <p className="text-lg font-bold text-text-primary font-mono">${stats.totalROI.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Days Remaining</p>
            <p className="text-lg font-bold text-text-primary font-mono">{stats.daysRemaining} <span className="text-[10px] text-text-muted font-normal">Days</span></p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] text-text-muted uppercase font-bold">Investment Progress</p>
            <p className="text-[10px] font-bold text-brand-primary">{stats.progress.toFixed(1)}%</p>
          </div>
          <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden flex">
            {/* Progress Bar with Green fill, Red indicator, Grey remaining */}
            <div 
              className="h-full bg-success transition-all duration-1000" 
              style={{ width: `${stats.progress}%` }}
            ></div>
            <div className="w-1 h-full bg-error shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
            <div className="flex-1 h-full bg-bg-secondary"></div>
          </div>
          <div className="flex justify-between text-[8px] text-text-muted uppercase font-bold tracking-tighter">
            <span>Start Date: {new Date(activeInvestment.createdAt).toLocaleDateString()}</span>
            <span>Duration: 365 Days</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
