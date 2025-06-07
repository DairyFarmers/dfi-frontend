import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInventory } from '@/hooks/useInventory';
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
import { Plus, Trash2 } from 'lucide-react';
import { OrderConfirmationDialog } from './ConfirmOrder';
import { toast } from 'sonner';

const orderFormSchema = z.object({
  // Customer Information
  customer_name: z.string().min(2, 'Customer name is required'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
  shipping_address: z.string().min(5, 'Shipping address is required'),
  billing_address: z.string().min(5, 'Billing address is required'),

  // Order Details
  expected_delivery_date: z.string().min(1, 'Expected delivery date is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Priority is required',
  }),

  // Order Items
  items: z.array(z.object({
    inventory_item: z.string().uuid('Invalid item selected'),
    quantity: z.number().positive('Quantity must be positive'),
    unit_price: z.number().positive('Unit price must be positive'),
    discount: z.number().min(0, 'Discount cannot be negative'),
  })).min(1, 'At least one item is required'),

  // Additional Information
  notes: z.string().optional(),
  shipping_cost: z.number().min(0, 'Shipping cost cannot be negative'),
});

export function AddOrderForm({ isOpen, onClose, onSubmit }) {
  const { inventory } = useInventory({ fetchAll: true });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const form = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      shipping_address: '',
      billing_address: '',
      expected_delivery_date: '',
      priority: 'medium',
      items: [{ inventory_item: '', quantity: 1, unit_price: 0, discount: 0 }],
      notes: '',
      shipping_cost: 0,
    },
  });

  const addItem = () => {
    const values = form.getValues();
    form.setValue('items', [...values.items, { 
      inventory_item: '', 
      quantity: 1, 
      unit_price: 0, 
      discount: 0 
    }]);
  };

  const removeItem = (index) => {
    const values = form.getValues();
    const newItems = values.items.filter((_, i) => i !== index);
    form.setValue('items', newItems);
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unit_price) || 0;
    const discount = parseFloat(item.discount) || 0;
    
    // Calculate totals using numeric operations
    const itemTotal = parseFloat((quantity * unitPrice).toFixed(2));
    const discountedTotal = parseFloat((itemTotal - discount).toFixed(2));
    
    return parseFloat((sum + discountedTotal).toFixed(2));
    }, 0);
  };

  const handleSubmit = async (data) => {
      const subtotal = parseFloat(calculateSubtotal(data.items).toFixed(2));
      const shippingCost = parseFloat(data.shipping_cost) || 0;
      const total = parseFloat((subtotal + shippingCost).toFixed(2));
      
      const formattedData = {
        ...data,
        subtotal,
        shipping_cost: shippingCost,
        total_amount: total,
        status: 'pending',
        payment_status: 'pending',
      };
      setFormData(formattedData);
      setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(formData);
      setShowConfirmation(false);
      form.reset();
      onClose();
    } catch (error) {
      toast.error('Failed to place an order. Please try again.');
    }
  };

  return (
    <>
  <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Enter order details and add items to the order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="shipping_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address *</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address *</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button type="button" onClick={addItem} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {form.watch('items').map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-end border p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name={`items.${index}.inventory_item`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item *</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inventory?.results?.map((item) => (
                              <SelectItem 
                                key={item.id} 
                                value={item.id}
                              >
                                {item.name} (LKR {item.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
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
                    name={`items.${index}.unit_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="1"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.discount`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
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

                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mb-2"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expected_delivery_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Delivery Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
              <Button type="submit">Create Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

      <OrderConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        orderData={formData}
      />        
    </>
  );
}