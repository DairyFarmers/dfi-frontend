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
  import { Badge } from "@/components/ui/badge";
  
  export function CancelOrderDialog({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    order 
  }) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
              
              <div className="mt-4 p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Order Number:</span>
                  <span>{order?.order_number}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Customer:</span>
                  <span>{order?.customer_name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span>LKR {(Number(order?.total_amount) || 0).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Status:</span>
                  <Badge variant="warning">{order?.status}</Badge>
                </div>
              </div>
  
              <div className="mt-4 text-destructive text-sm">
                Note: Cancelling this order will update its status to 'cancelled' 
                and cannot be reversed.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }