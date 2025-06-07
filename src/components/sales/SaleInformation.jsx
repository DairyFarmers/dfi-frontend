import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SaleInformation({ sale }) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-medium">{sale?.order?.order_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Invoice Number</p>
            <p className="font-medium">{sale?.invoice_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{sale?.order?.customer_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sale Date</p>
            <p className="font-medium">
              {new Date(sale?.sale_date).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={
              sale?.payment_status === 'paid' ? 'success' : 
              sale?.payment_status === 'partial' ? 'warning' : 
              'secondary'
            }>
              {sale?.payment_status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium">LKR {sale?.total_amount}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="font-medium">{sale?.notes || 'No notes'}</p>
        </div>
      </CardContent>
    </Card>
  );
}