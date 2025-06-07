import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon } from "lucide-react";

const LowStockAlerts = () => {
  const alerts = [
    {
      id: 1,
      item: "Raw Material A",
      currentStock: 50,
      threshold: 100,
      unit: "kg",
      priority: "high",
    },
    {
      id: 2,
      item: "Component B",
      currentStock: 75,
      threshold: 150,
      unit: "pcs",
      priority: "medium",
    },
    {
      id: 3,
      item: "Packaging Material",
      currentStock: 200,
      threshold: 500,
      unit: "pcs",
      priority: "low",
    },
    {
      id: 4,
      item: "Chemical X",
      currentStock: 5,
      threshold: 20,
      unit: "L",
      priority: "high",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertOctagon className="h-5 w-5 text-red-500" />
          <CardTitle>Low Stock Alerts</CardTitle>
        </div>
        <CardDescription>
          Items that need immediate reordering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="font-semibold">{alert.item}</h4>
                <p className="text-sm text-muted-foreground">
                  Current: {alert.currentStock} {alert.unit}
                </p>
                <p className="text-sm text-muted-foreground">
                  Threshold: {alert.threshold} {alert.unit}
                </p>
              </div>
              <Badge className={getPriorityColor(alert.priority)} variant="secondary">
                {alert.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts; 