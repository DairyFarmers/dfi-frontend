import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  AlertCircle, 
  RefreshCcw, 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isValid } from "date-fns";
import { PermissionGuard } from "@/components/common/PermissionGuard";
import { useOrderDetails } from "@/hooks/useOrder";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

export function OrderDetailsDialog({ 
    isOpen, 
    onClose, 
    order,
    onUpdateStatus,
    onCancelOrder 
  }) {
    const { 
        data, 
        isLoading, 
        error,
        refetch
    } = useOrderDetails(order?.id);

    const getOrderStatusColor = (status) => {
        const colors = {
          draft: 'secondary',
          pending: 'warning',
          confirmed: 'primary',
          processing: 'info',
          shipped: 'info',
          delivered: 'success',
          cancelled: 'destructive',
          returned: 'destructive'
        };
        return colors[status?.toLowerCase()] || 'default';
    };
    
    const getPaymentStatusColor = (status) => {
    const colors = {
        paid: 'success',
        pending: 'warning',
        failed: 'destructive',
        refunded: 'secondary',
        partially_paid: 'info',
      };
      return colors[status?.toLowerCase()] || 'default';
    };

    const getPriorityColor = (priority) => {
      console.log('Priority:', priority);
        const colors = {
        urgent: 'destructive',
        high: 'warning',
        medium: 'default',
        low: 'secondary'
      };
      return colors[priority?.toLowerCase()] || 'default';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return isValid(date) ? format(date, 'PPP') : 'Invalid date';
    };

    useEffect(() => {
        if (order?.id) {
            refetch();
        }
    }, [order?.id, refetch]);

    const handleStatusUpdate = () => {
        onUpdateStatus(data);
    };

    const handleClose = () => {
        onClose();
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
              <DialogHeader>
                <DialogTitle>Error</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error loading orders</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to fetch order details</span>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        className="ml-4"
                        >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Retry
                        </Button>
                    </AlertDescription>
                </Alert>
               </div>
            </DialogContent>
          </Dialog>
        );
    }

    const canUpdateStatus = data?.status !== 'cancelled' && data?.status !== 'returned';
    const canCancel = data?.status === 'pending';
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl">
            <DialogHeader className="pr-8">
              <DialogTitle className="flex justify-between items-center">
                <span>Order #{data?.order_number}</span>
                <div className="flex gap-2">
                    { canUpdateStatus && (
                        <Badge variant={getPaymentStatusColor(data?.payment_status)}>
                            {data?.payment_status?.charAt(0).toUpperCase() + data?.payment_status?.slice(1)}
                      </Badge>
                    )}
                  <Badge variant={getPriorityColor(data?.priority)}>
                    {data?.priority?.charAt(0).toUpperCase() + data?.priority?.slice(1)}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
      
            <div className="space-y-6">
              {/* Customer and Shipping Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {data?.customer_name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {data?.customer_email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {data?.customer_phone}</p>
                  </div>
                </div>
      
                <div>
                  <h3 className="font-semibold mb-2">Shipping Details</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Address:</span> {data?.shipping_address}</p>
                    <p>
                      <span className="text-muted-foreground">Expected Delivery:</span>{' '}
                      {formatDate(data?.expected_delivery_date)}
                    </p>
                  </div>
                </div>
              </div>
      
              {/* Order Items Table */}
              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Batch Number</TableHead>
                      <TableHead className="w-[40%]">Item</TableHead>
                      <TableHead className="text-center w-[15%]">Quantity</TableHead>
                      <TableHead className="text-right w-[15%]">Unit Price</TableHead>
                      <TableHead className="text-right w-[15%]">Discount</TableHead>
                      <TableHead className="text-right w-[15%]">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.inventory_item.batch_number || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{item.inventory_item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          LKR {Number(item.unit_price).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          - LKR {Number(item.discount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          LKR {(item.quantity * item.unit_price - item.discount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
      
                    {/* Summary Rows */}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-semibold">
                        Subtotal:
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        LKR {Number(data?.total_amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right text-destructive">
                        Shipping Cost:
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        LKR {Number(data?.shipping_cost).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-bold">
                        Total Amount:
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        LKR {(Number(data?.total_amount) + Number(data?.shipping_cost)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
      
            <DialogFooter className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <Badge variant={getOrderStatusColor(data?.status)}>
                    {data?.status?.charAt(0).toUpperCase() + data?.status?.slice(1)}
                </Badge>
                {canUpdateStatus && (
                    <PermissionGuard permissions="can_manage_orders">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleStatusUpdate}
                        >
                            Update Status
                        </Button>
                    </PermissionGuard>
                )}
              </div>
              <div className="flex gap-2">
                {canCancel && (
                  <PermissionGuard permissions="can_manage_orders">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancelOrder(data)}
                    >
                      Cancel Order
                    </Button>
                  </PermissionGuard>
                )}
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
  }