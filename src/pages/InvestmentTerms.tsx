import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, AlertTriangle, Scale, Clock, Wallet, CheckCircle2 } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

export default function InvestmentTerms() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title="Investment Terms" />
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Investment <span className="text-brand-primary">Terms of Service</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Please review our comprehensive investment policies and legal framework before committing capital.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1: Risk Disclosure */}
          <section className="glass-dark rounded-3xl p-6 md:p-10 border border-border-base">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">1. Risk Disclosure</h2>
            </div>
            <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
              <p>
                Trading and investing in financial markets involve substantial risk of loss and is not suitable for every investor. The valuation of financial instruments may fluctuate, and as a result, clients may lose more than their original investment.
              </p>
              <p>
                Past performance is not indicative of future results. Any ROI figures mentioned are projections based on historical data and current market analysis but are not guaranteed.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Market volatility can impact account performance significantly.</li>
                <li>System failures or connectivity issues may affect trade execution.</li>
                <li>Geopolitical events can cause unpredictable market movements.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Investment Management */}
          <section className="glass-dark rounded-3xl p-6 md:p-10 border border-border-base">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Shield size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">2. Investment Management</h2>
            </div>
            <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
              <p>
                By enrolling in our Investment Program, you authorize our professional trading team to manage your capital according to the selected plan's strategy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-bg-secondary rounded-2xl border border-border-base">
                  <h3 className="text-text-primary font-bold mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-brand-primary" /> Duration
                  </h3>
                  <p className="text-xs">All investment plans have a standard duration of 360 days. Early withdrawals are subject to administrative review and potential penalties.</p>
                </div>
                <div className="p-4 bg-bg-secondary rounded-2xl border border-border-base">
                  <h3 className="text-text-primary font-bold mb-2 flex items-center gap-2">
                    <Wallet size={16} className="text-brand-primary" /> Capital Security
                  </h3>
                  <p className="text-xs">We employ institutional-grade risk management protocols to preserve capital and minimize drawdown during adverse market conditions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Profit Sharing & Withdrawals */}
          <section className="glass-dark rounded-3xl p-6 md:p-10 border border-border-base">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Scale size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">3. Profit Sharing & Withdrawals</h2>
            </div>
            <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
              <p>
                Our success is directly tied to yours. We operate on a transparent performance-based model.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-primary mt-1 shrink-0" />
                  <span><strong className="text-text-primary">Profit Split:</strong> Profits generated are shared according to the specific plan agreement (typically 50/50 for managed accounts).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-primary mt-1 shrink-0" />
                  <span><strong className="text-text-primary">Withdrawal Schedule:</strong> ROI can be withdrawn bi-weekly or monthly, depending on the plan's specific liquidity terms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-primary mt-1 shrink-0" />
                  <span><strong className="text-text-primary">Processing Time:</strong> Withdrawal requests are processed within 24-72 business hours to ensure security and compliance.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Compliance & AML */}
          <section className="glass-dark rounded-3xl p-6 md:p-10 border border-border-base">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">4. Compliance & AML</h2>
            </div>
            <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
              <p>
                Owambe Traders Global adheres to strict Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations.
              </p>
              <p>
                Clients must ensure that all funds invested are from legitimate sources. We reserve the right to request documentation to verify the source of funds and identity of the investor at any time.
              </p>
            </div>
          </section>

          <div className="text-center pt-8">
            <p className="text-text-muted text-xs">
              Last Updated: April 2026 | Owambe Traders Global Legal Department
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
