import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBox, FaShoppingCart, FaUsers, FaMoneyBillWave } from "react-icons/fa";

export default function StatsCards({ metrics }) {
  const { system, financial, inventory, orders } = metrics;

  const stats = [
    {
      title: "Total Stock",
      value: inventory?.total_items?.count || 0,
      description: `${inventory?.low_stock_items?.length || 0} items low in stock`,
      icon: FaBox,
      secondaryValue: `$${inventory?.stock_value?.toLocaleString() || 0}`,
    },
    {
      title: "Total Orders",
      value: orders?.total_orders || 0,
      description: `${orders?.pending_orders || 0} orders pending`,
      icon: FaShoppingCart,
      secondaryValue: orders?.order_status_distribution?.[0]?.count || 0,
    },
    {
      title: "Total Users",
      value: system?.total_users || 0,
      description: `${system?.active_users || 0} active users`,
      icon: FaUsers,
      secondaryValue: system?.system_health?.system_status || 'N/A',
    },
    {
      title: "Revenue",
      value: financial?.total_revenue || 0,
      description: "Total revenue",
      icon: FaMoneyBillWave,
      prefix: "$",
      secondaryValue: financial?.revenue_trends?.length > 0 
        ? `${financial.revenue_trends[0]?.value || 0}%`
        : '0%',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.prefix}{stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.secondaryValue}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Add prop validation
StatsCards.defaultProps = {
  metrics: {
    system_metrics: {},
    financial_metrics: {},
    inventory_metrics: {},
    order_metrics: {}
  }
};