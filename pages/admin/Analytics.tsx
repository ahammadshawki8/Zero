import React from 'react';
import { Card } from '../../components/ui';
import { BarChart3 } from 'lucide-react';

export const AdminAnalytics = () => {
  return (
    <Card title="Analytics & Reports">
       <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <BarChart3 size={64} className="mb-4 text-slate-300" />
          <h3 className="text-xl font-medium text-slate-700">Analytics Dashboard</h3>
          <p>Detailed system reporting and AI insights coming soon.</p>
       </div>
    </Card>
  );
};