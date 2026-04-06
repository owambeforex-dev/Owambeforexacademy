import React from 'react';
import ActivityPageTemplate from '../../components/ActivityPageTemplate';
import { Zap } from 'lucide-react';

export default function SignalActivities() {
  return (
    <ActivityPageTemplate 
      title="Signal Activities"
      serviceType="Signal Services"
      emptyMessage="No active signal service subscription yet"
      icon={Zap}
    />
  );
}
