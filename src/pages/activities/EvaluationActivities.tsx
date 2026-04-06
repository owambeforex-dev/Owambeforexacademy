import React from 'react';
import ActivityPageTemplate from '../../components/ActivityPageTemplate';
import { Award } from 'lucide-react';

export default function EvaluationActivities() {
  return (
    <ActivityPageTemplate 
      title="Evaluation Activities"
      serviceType="Evaluation"
      emptyMessage="No evaluation yet"
      icon={Award}
    />
  );
}
