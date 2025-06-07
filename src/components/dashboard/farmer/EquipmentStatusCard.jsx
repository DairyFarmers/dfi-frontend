import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EquipmentStatusCard({ data }) {
    const { operational = 0, maintenance_needed = 0 } = data || {};
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Operational</p>
                <p className="text-2xl font-bold text-green-600">{operational}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Maintenance</p>
                <p className="text-2xl font-bold text-red-600">{maintenance_needed}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }