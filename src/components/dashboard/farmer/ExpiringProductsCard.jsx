import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ExpiringProductsCard({ data }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-amber-500">{data}L</div>
            <p className="text-sm text-muted-foreground">
              Products requiring immediate attention
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }