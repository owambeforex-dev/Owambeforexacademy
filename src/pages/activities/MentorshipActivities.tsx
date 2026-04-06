import React from 'react';
import ActivityPageTemplate from '../../components/ActivityPageTemplate';
import { GraduationCap } from 'lucide-react';

export default function MentorshipActivities() {
  return (
    <ActivityPageTemplate 
      title="Mentorship Activities"
      serviceType="Mentorship"
      emptyMessage="No active mentorship subscription yet"
      icon={GraduationCap}
    />
  );
}
