import React from 'react';
import LiveTicker from '../components/home/LiveTicker';
import Hero from '../components/home/Hero';
import MarketWidget from '../components/home/MarketWidget';
import TrustMetrics from '../components/home/TrustMetrics';
import LiveTradingResults from '../components/home/LiveTradingResults';
import LiveWithdrawals from '../components/home/LiveWithdrawals';
import GlobalReviews from '../components/home/GlobalReviews';
import MobileHome from '../components/home/MobileHome';
import FAQ from '../components/home/FAQ';
import SmartScarcity from '../components/home/SmartScarcity';
import Services from '../components/home/Services';

export default function Home() {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileHome />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col gap-0 pb-0">
        <LiveTicker />
        <Hero />
        <MarketWidget />
        <TrustMetrics />
        <SmartScarcity />
        <Services />
        <LiveTradingResults />
        <LiveWithdrawals />
        <GlobalReviews />
        <FAQ />
      </div>
    </>
  );
}
