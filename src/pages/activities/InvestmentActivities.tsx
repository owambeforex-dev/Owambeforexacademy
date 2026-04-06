import React from 'react';
import ActivityPageTemplate from '../../components/ActivityPageTemplate';
import { Coins } from 'lucide-react';
import InvestmentTrackingCard from '../../components/InvestmentTrackingCard';

export default function InvestmentActivities() {
  return (
    <ActivityPageTemplate 
      title="Investment Activities"
      serviceType="Investment"
      emptyMessage="No active investments yet"
      icon={Coins}
      header={<InvestmentTrackingCard />}
    />
  );
}
