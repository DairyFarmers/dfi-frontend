import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StorageUtilizationCard({ data }) {
    const utilization = parseInt(data) || 0;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={utilization} className="w-full h-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Used Space</span>
              <span className="text-lg font-bold">{utilization}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }