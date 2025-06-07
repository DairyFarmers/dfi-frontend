import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentSection } from './PaymentSection';
import { SaleInformation } from './SaleInformation';
import { OrderItems } from './OrderItems';

export function SaleDetailDialog({ open, onClose, sale }) {
  console.log(sale)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Sale Details - {sale?.invoice_number}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Sale Details</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="items">Order Items</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <SaleInformation sale={sale} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentSection saleId={sale?.id} totalAmount={sale?.total_amount} />
          </TabsContent>

          <TabsContent value="items">
            <OrderItems items={sale?.order?.items} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}