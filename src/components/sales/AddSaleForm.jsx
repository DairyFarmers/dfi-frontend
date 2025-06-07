import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOrder } from '@/hooks/useOrder';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const saleFormSchema = z.object({
  order_id: z.string().min(1, "Order is required"),
  payment_status: z.enum(['pending', 'partial', 'paid'], {
    required_error: 'Payment status is required',
  }),
  payment_due_date: z.string().min(1, "Payment due date is required"),
  tax_amount: z.number().min(0, 'Tax amount cannot be negative'),
  discount_amount: z.number().min(0, 'Discount cannot be negative'),
  shipping_cost: z.number().min(0, 'Shipping cost cannot be negative'),
  notes: z.string().optional(),
});

export function AddSaleForm({ isOpen, onClose, onSubmit, isLoading }) {
  const { orders } = useOrder();

  const form = useForm({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      order_id: '',
      payment_status: 'pending',
      payment_due_date: '',
      tax_amount: 0,
      discount_amount: 0,
      shipping_cost: 0,
      notes: '',
    },
  });

  const handleSubmit = async (data) => {
    try {
      console.log("Submitting Sale Data:", data);
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to create sale. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
          <DialogDescription>
            Create a sale from an existing order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Order Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Order Information</h3>
              <FormField
                control={form.control}
                name="order_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Order *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orders?.results?.map((order) => (
                          <SelectItem key={order.id} value={order.id.toString()}>
                            Order #{order.order_number} - {order.customer_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Due Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Amounts */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Charges</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tax_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="1"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="1"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="1"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Sale"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}