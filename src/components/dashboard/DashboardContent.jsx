import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import StatsCards from './StatsCards';
import ChartSection from './ChartSection';
import ActivitySection from './ActivitySection';

export default function DashboardContent({ 
  data, 
  timeRange, 
  user, 
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!data) return null;

  const {
    system_metrics = {},
    financial_metrics = {},
    inventory_metrics = {},
    order_metrics = {},
    last_login,
    notifications = [],
    recent_activities = []
  } = data;

  const metrics = {
    system: system_metrics,
    financial: financial_metrics,
    inventory: inventory_metrics,
    orders: order_metrics
  };

  return (
    <div className="space-y-6">
      <StatsCards metrics={metrics} />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSection 
            metrics={metrics} 
            timeRange={timeRange}
            role={user?.role?.name}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ActivitySection 
            lastLogin={last_login}
            notifications={notifications}
            activities={recent_activities}
          />
        </div>
      </div>
    </div>
  );
}

DashboardContent.defaultProps = {
  isLoading: false,
  data: null,
  timeRange: 'week',
  user: null
};