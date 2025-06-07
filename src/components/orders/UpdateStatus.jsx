import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { useState } from "react";
  import { Badge } from "@/components/ui/badge";
  
  const statusFlow = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'returned'],
    delivered: ['returned'],
    cancelled: [],
    returned: []
  };
  
  export function UpdateStatusDialog({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    order 
  }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const availableStatuses = statusFlow[order?.status] || [];
  
    const handleConfirm = () => {
      onConfirm(selectedStatus);
      setSelectedStatus('');
    };
  
    const handleCancel = () => {
      setSelectedStatus('');
      onCancel();
    };
  
    const getStatusColor = (status) => {
      const colors = {
        pending: 'warning',
        confirmed: 'primary',
        processing: 'info',
        shipped: 'info',
        delivered: 'success',
        cancelled: 'destructive',
        returned: 'destructive'
      };
      return colors[status] || 'default';
    };
  
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Order #{order?.order_number}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current Status:</span>
                    <Badge variant={getStatusColor(order?.status)}>
                      {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    New Status
                  </label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(status)}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={!selectedStatus}
            >
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }