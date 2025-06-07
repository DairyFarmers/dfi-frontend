import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import TopNavbar from '@/components/layout/top-navbar';
import { PermissionGuard } from '@/components/common/PermissionGuard';
import { Button } from "@/components/ui/button";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  RefreshCcw, 
  Eye 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useOrder } from '@/hooks/useOrder';
import { toast } from 'sonner';
import { AddOrderForm } from '@/components/orders/AddOrderForm.jsx';
import { OrderDetailsDialog } from '@/components/orders/OrderDetails.jsx';
import { UpdateStatusDialog } from '@/components/orders/UpdateStatus.jsx';
import { CancelOrderDialog } from '@/components/orders/CancelOrder.jsx';
import { get } from 'react-hook-form';

export default function Orders() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    orders: { 
      results: orders = [], 
      count = 0,
      next,
      previous,
      num_pages = 1
    },
    isLoading,
    error,
    refetch,
    stats,
    addOrder,
    updateOrder,
    deleteOrder,
  } = useOrder({ currentPage, pageSize });

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
    const colors = {
      urgent: 'destructive',
      high: 'warning',
      medium: 'default',
      low: 'secondary'
    };
    return colors[priority?.toLowerCase()] || 'default';
  };

  const handleNextPage = () => {
    if (next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previous) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= num_pages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
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
    return colors[status] || 'default';
  };

  const handleAddOrder = async (formData) => {
    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      const orderData = {
        ...formData,
        order_number: orderNumber,
        order_date: new Date().toISOString(),
        status: 'pending',
        payment_status: 'pending',
        subtotal: formData.items.reduce((sum, item) =>
          sum + ((item.quantity * item.unit_price) - item.discount), 0
        ),
      };

      orderData.total_amount = orderData.subtotal + (orderData.shipping_cost || 0);
      await addOrder.mutateAsync(orderData);
      toast.success('Order placed successfully');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create order');
    }
  };

  const handleUpdateOrder = async (formData) => {
    try {
      const sanitizedData = {
        customer_name: formData.customer_name,
        items: formData.items,
        shipping_cost: Number(formData.shipping_cost),
        status: formData.status,
        payment_status: formData.payment_status,
        priority: formData.priority,
        // Recalculate totals if needed
        subtotal: formData.items.reduce((sum, item) =>
          sum + ((item.quantity * item.unit_price) - item.discount), 0),
      };
      sanitizedData.total_amount = sanitizedData.subtotal + (sanitizedData.shipping_cost || 0);
      await updateOrder.mutateAsync({ id: selectedOrder.id, data: sanitizedData });
      toast.success('Order updated successfully');
      setEditDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error?.response?.message || 'Failed to update order');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleStatusUpdateConfirm = async (newStatus) => {
    try {
        await updateOrder.mutateAsync({
            id: selectedOrder.id,
            status: newStatus
        });
        toast.success('Order status updated successfully');
        setStatusDialogOpen(false);
        await refetch();
    } catch (error) {
        toast.error('Failed to update order status');
    }
  };

  const handleCancelConfirm = async () => {
    try {
      if (!orderToCancel) return;
      
      await updateOrder.mutateAsync({
        id: orderToCancel.id,
        status: 'cancelled'
      });
      
      toast.success('Order cancelled successfully');
      setCancelDialogOpen(false);
      setDetailsDialogOpen(false);
      setOrderToCancel(null);
      await refetch(); // Refresh the orders list
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar />
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar />
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading orders</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{error.message}</span>
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage customer orders and track their status
                </p>
              </div>
              <PermissionGuard permissions="can_manage_orders">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Order
                </Button>
              </PermissionGuard>

              <AddOrderForm
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSubmit={handleAddOrder}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats?.pending || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.completed || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${(stats?.totalRevenue || 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Orders List</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, count)} of {count} orders
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order?.id}>
                        <TableCell>{order?.order_number}</TableCell>
                        <TableCell>{order?.customer_name}</TableCell>
                        <TableCell>{new Date(order?.order_date).toLocaleDateString()}</TableCell>
                        <TableCell>LKR {(Number(order?.total_amount) || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getOrderStatusColor(order?.status)}>
                            {order?.status?.charAt(0).toUpperCase() + order?.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentStatusColor(order?.payment_status)}>
                            {order?.payment_status?.charAt(0).toUpperCase() + order?.payment_status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(order?.priority)}>
                            {order?.priority?.charAt(0).toUpperCase() + order?.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <PermissionGuard permissions="can_manage_orders">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(order)}
                              className="hover:bg-accent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {num_pages > 1 && (
                  <div className="mt-4 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={handlePreviousPage}
                            disabled={!previous}
                          />
                        </PaginationItem>

                        {[...Array(num_pages)].map((_, index) => {
                          const pageNumber = index + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === num_pages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <Button
                                  variant={currentPage === pageNumber ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => handlePageChange(pageNumber)}
                                >
                                  {pageNumber}
                                </Button>
                              </PaginationItem>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <Button variant="outline" size="icon" disabled>
                                  ...
                                </Button>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={handleNextPage}
                            disabled={!next}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <OrderDetailsDialog
        isOpen={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
        }}
        order={selectedOrder}
        onUpdateStatus={(order) => {
          setSelectedOrder(order);
          setStatusDialogOpen(true);
        }}
        onCancelOrder={handleCancelOrder}
      />

      <UpdateStatusDialog
        isOpen={statusDialogOpen}
        onConfirm={handleStatusUpdateConfirm}
        onCancel={() => {
          setStatusDialogOpen(false);
        }}
        order={selectedOrder}
      />

      <CancelOrderDialog
        isOpen={cancelDialogOpen}
        onConfirm={handleCancelConfirm}
        onCancel={() => {
          setCancelDialogOpen(false);
          setOrderToCancel(null);
        }}
        order={orderToCancel}
      />
    </div>
  );
}