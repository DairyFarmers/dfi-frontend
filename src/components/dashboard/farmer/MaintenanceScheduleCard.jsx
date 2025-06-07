import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function MaintenanceScheduleCard({ data }) {
    const nextMaintenance = data?.next_maintenance 
      ? new Date(data.next_maintenance).toLocaleDateString()
      : 'No scheduled maintenance';
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Next Scheduled</p>
            <p className="text-lg font-bold">{nextMaintenance}</p>
          </div>
        </CardContent>
      </Card>
    );
  }