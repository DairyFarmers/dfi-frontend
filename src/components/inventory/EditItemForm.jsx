import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  AlertCircle, 
  RefreshCcw, 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInventoryItem } from '@/hooks/useInventory';
import { useSupplier } from '@/hooks/useSupplier';
import { AlertDialogBox } from '@/components/shared/AlertDialogBox';
import { toast } from 'sonner';

const createFormSchema = (suppliers = []) => {
  return z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    dairy_type: z.enum(['milk', 'cheese', 'butter', 'yogurt', 'cream', 'other'], {
      required_error: 'Category is required',
    }),
    batch_number: z.string().min(1, 'Batch number is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unit: z.enum(['kg', 'l', 'pcs'], {
      required_error: 'Unit is required',
    }),
    price: z.number().positive('Price must be positive'),
    storage_condition: z.enum(['refrigerated', 'frozen', 'room_temp'], {
      required_error: 'Storage condition is required',
    }),
    optimal_temperature_min: z.number()
      .min(-30, 'Minimum temperature cannot be below -30°C')
      .max(30, 'Maximum temperature cannot exceed 30°C'),
    optimal_temperature_max: z.number()
      .min(-30, 'Minimum temperature cannot be below -30°C')
      .max(30, 'Maximum temperature cannot exceed 30°C'),
    manufacturing_date: z.string().min(1, 'Manufacturing date is required'),
    expiry_date: z.string().min(1, 'Expiry date is required'),
    supplier: z.string()
      .min(1, 'Supplier is required')
      .refine((val) => suppliers.some(s => s.id.toString() === val), {
        message: 'Please select a valid supplier'
    }),
    reorder_point: z.number().min(0, 'Reorder point must be non-negative'),
    minimum_order_quantity: z.number().positive('Minimum order quantity must be positive'),
  }).refine(data => {
    return new Date(data.manufacturing_date) <= new Date(data.expiry_date);
  }, {
    message: "Manufacturing date must be before expiry date",
    path: ["manufacturing_date"],
  });
};

export function EditItemForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  itemId
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const { 
    suppliers: { results: suppliers = []} ,
    isLoading: suppliersLoading,
    error: suppliersError
  } = useSupplier({ 
      fetchAll: true 
  })

  const { 
    data: item, 
    isLoading: itemLoading, 
    error: itemError 
  } = useInventoryItem(itemId);

  const isLoading = suppliersLoading || itemLoading;
  const error = suppliersError || itemError;
  
  const formSchema = createFormSchema(suppliers || []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dairy_type: '',
      batch_number: '',
      quantity: 0,
      unit: '',
      price: 0,
      storage_condition: '',
      optimal_temperature_min: 2,
      optimal_temperature_max: 8,
      manufacturing_date: new Date().toISOString().split('T')[0], // Today's date
      expiry_date: '',
      supplier: '',
      reorder_point: 0,
      minimum_order_quantity: 1,
      is_active: true,
    },
  });

  // Update form when item data is fetched
  useEffect(() => {
    if (isOpen && item) {
      form.reset({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        optimal_temperature_min: Number(item.optimal_temperature_min),
        optimal_temperature_max: Number(item.optimal_temperature_max),
        reorder_point: Number(item.reorder_point),
        minimum_order_quantity: Number(item.minimum_order_quantity),
        supplier: item?.supplier,
        manufacturing_date: item.manufacturing_date?.split('T')[0],
        expiry_date: item.expiry_date?.split('T')[0],
      });
    }
  }, [isOpen, item, form]);

  const handleSubmit = async (data) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(pendingData);
      setIsConfirmOpen(false);
      form.reset();
      onClose();
    } catch (error) {
      toast.error('Failed to update item. Please try again.');
    } finally {
      setPendingData(null);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              Failed to load item details
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries(['inventory', 'item', itemId])}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the edit item. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Basic Information */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dairy_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="milk">Milk</SelectItem>
                        <SelectItem value="cheese">Cheese</SelectItem>
                        <SelectItem value="butter">Butter</SelectItem>
                        <SelectItem value="yogurt">Yogurt</SelectItem>
                        <SelectItem value="cream">Cream</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity and Price */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="l">Liters</SelectItem>
                        <SelectItem value="pcs">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (LKR) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="1" 
                        {...field} 
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Storage Conditions */}
              <FormField
                control={form.control}
                name="storage_condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Condition *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Storage Condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="frozen">Frozen</SelectItem>
                        <SelectItem value="room_temperature">Room Temperature</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optimal_temperature_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optimal_temperature_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates */}
              <FormField
                control={form.control}
                name="manufacturing_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturing Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        required
                        {...field}
                        value={field.value || new Date().toISOString().split('T')[0]}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supplier and Reorder Info */}
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem 
                            key={supplier.id} 
                            value={supplier.id.toString()}
                          >
                            {supplier.name} ({supplier.contact_person})
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
                name="reorder_point"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reorder Point *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimum_order_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
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
              <Button type="submit">Edit Item</Button>
            </DialogFooter>
          </form>
        </Form>
        </DialogContent>
      </Dialog>

      <AlertDialogBox
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPendingData(null);
        }}
        onConfirm={handleConfirm}
        title="Confirm Edit"
        description={
          <div className="space-y-2">
            <p>Are you sure you want to save these changes?</p>
            <p className="text-sm text-muted-foreground">
              This will update the inventory item details. This action cannot be undone.
            </p>
          </div>
        }
      />
    </>    
  );
}