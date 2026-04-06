import React from 'react';
import ActivityPageTemplate from '../../components/ActivityPageTemplate';
import { Briefcase } from 'lucide-react';

export default function AccountManagementActivities() {
  return (
    <ActivityPageTemplate 
      title="Account Management Activities"
      serviceType="Account Management"
      emptyMessage="No account management yet"
      icon={Briefcase}
    />
  );
}
