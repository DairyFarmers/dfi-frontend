import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '@/components/layout/sidebar';
import TopNavbar from '@/components/layout/top-navbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardContent from '@/components/dashboard/DashboardContent';
import FarmerDashboardContent from '@/components/dashboard/farmer/FarmerDashboardContent';
import { useDashboard } from '@/hooks/useDashboard';

const TIME_RANGES = [
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'year', label: 'Last year' },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const { user } = useSelector((state) => state.user);
  const { data, isLoading, error, refetch } = useDashboard(timeRange);

  const getDashboardComponent = () => {
    switch (user?.role?.name) {
      case 'admin':
        return DashboardContent;
      case 'farmer':
        return FarmerDashboardContent;
      default:
        return DashboardContent;
    }
  };

  const DashboardComponent = getDashboardComponent();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar />
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar />
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading dashboard</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{error.message}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="ml-4"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user?.full_name || user?.email}! Here's what's happening with your inventory.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_RANGES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => refetch()}
                  className="shrink-0"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DashboardComponent 
              data={data}
              timeRange={timeRange}
              user={user}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}