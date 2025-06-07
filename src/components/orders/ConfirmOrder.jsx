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
  
  export function OrderConfirmationDialog({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    orderData 
  }) {
    const total = (
      orderData?.subtotal + 
      (Number(orderData?.shipping_cost) || 0)
    ).toFixed(2);
  
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order Placement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place this order?
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{orderData?.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{orderData?.items?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">LKR {orderData?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Shipping Cost:</span>
                  <span>- LKR {orderData?.shipping_cost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total Amount:</span>
                  <span>LKR {total}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Place Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }