import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { DairyProductionChart } from './DairyProductionChart';
import { InventoryStatusCard } from './InventoryStatusCard';
import { QualityMetricsCard } from './QualityMetricsCard';
import { MarketInsightsCard } from './MarketInsightsCard';
import { FinancialSummaryCard } from './FinancialSummaryCard';
import {
    StorageUtilizationCard
} from './StorageUtilizationCard';
import {
    ExpiringProductsCard
} from './ExpiringProductsCard';
import {
    EquipmentStatusCard
} from './EquipmentStatusCard';
import {
    MaintenanceScheduleCard
} from './MaintenanceScheduleCard'; 

export default function FarmerDashboardContent({ 
  data, 
  timeRange, 
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!data) return null;

  console.log("FarmerDashboardContent data:", data);

  const {
    production_metrics = {},
    inventory_metrics = {},
    market_metrics = {},
    financial_metrics = {},
  } = data;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Production Overview */}
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-4">
            <Card className="h-[400px]">
            <CardHeader className="h-[60px]">
                <CardTitle>Daily Production</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                <DairyProductionChart 
                data={production_metrics?.dairy?.chart_data} 
                timeRange={timeRange}
                />
            </CardContent>
            </Card>
        </div>
        
        <div className="md:col-span-6 lg:col-span-4">
            <Card className="h-[400px]">
            <CardHeader className="h-[60px]">
                <CardTitle>Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] overflow-auto">
                <QualityMetricsCard 
                metrics={production_metrics?.dairy?.quality_metrics} 
                />
            </CardContent>
            </Card>
        </div>

        <div className="md:col-span-12 lg:col-span-4">
            <Card className="h-[400px]">
            <CardHeader className="h-[60px]">
                <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] overflow-auto">
                <InventoryStatusCard 
                inventory={inventory_metrics} 
                />
            </CardContent>
            </Card>
        </div>
      </div>

      {/* Market & Financial Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <MarketInsightsCard 
          marketData={market_metrics}
        />
        <FinancialSummaryCard 
          financialData={financial_metrics}
          timeRange={timeRange}
        />
      </div>

      {/* Storage & Equipment Status */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StorageUtilizationCard data={inventory_metrics?.storage_utilization} />
        <ExpiringProductsCard data={inventory_metrics?.expiring_soon} />
        <EquipmentStatusCard data={production_metrics?.equipment_status} />
        <MaintenanceScheduleCard data={production_metrics?.maintenance_schedule} />
        </div>
    </div>
  );
}

FarmerDashboardContent.defaultProps = {
  isLoading: false,
  data: null,
  timeRange: 'week'
};