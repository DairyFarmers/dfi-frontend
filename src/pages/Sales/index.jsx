import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '@/components/layout/sidebar';
import TopNavbar from '@/components/layout/top-navbar';
import { PermissionGuard } from '@/components/common/PermissionGuard';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Pencil, Trash2, RefreshCcw, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useSales } from '@/hooks/useSales';
import { SaleDetailDialog } from '@/components/sales/SaleDetailDialog';
import { AddSaleForm } from '@/components/sales/AddSaleForm';

export default function Sales() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { user } = useSelector((state) => state.user);
  const { 
    sales: {
      results: sales = [],
      count = 0,
      num_pages = 1,
      next,
      previous
    },
    stats = {
      total: 0,
      totalAmount: 0,
      pending: 0,
      completed: 0
    },
    refetch, 
    addSale,
    isLoading, 
    error,
    deleteSale 
  } = useSales({ currentPage, pageSize });

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

  const handleAddSale = async (formData) => {
    try {
      await addSale.mutateAsync(formData);
      toast.success('Sale added successfully');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add sale:', error);
      toast.error(error?.response?.data?.message || 'Failed to add sale');
    }
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
              <AlertTitle>Error loading sales</AlertTitle>
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
                <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage your sales transactions
                </p>
              </div>
              <PermissionGuard permissions="can_manage_sales">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
              </PermissionGuard>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    LKR {stats.totalAmount.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.completed}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, count)} of {count} orders
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales?.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.id.slice(0, 6)}</TableCell>
                        <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.seller.email || '-'}</TableCell>
                        <TableCell>{(sale.order.items.length || []).length} items</TableCell>
                        <TableCell>LKR {stats.totalAmount || 0}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sale.order.status === 'completed' ? 'default' :
                            sale.status === 'pending' ? 'warning' :
                            'secondary'
                          }>
                            {(sale.order.status || 'pending').charAt(0).toUpperCase() + (sale.order.status || 'pending').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sale.payment_status === 'paid' ? 'success' : 'warning'}>
                            {sale.payment_status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <PermissionGuard permissions="can_manage_sales">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="mr-2"
                              onClick={() => setSelectedSale(sale)}
                            >
                              <Eye className="h-4 w-4 text-blue-500" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this sale record and associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => deleteSale.mutate(sale.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

        <AddSaleForm 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddSale}
          isLoading={addSale.isLoading}
        />
      </div>

      <SaleDetailDialog 
        open={!!selectedSale} 
        onClose={() => setSelectedSale(null)}
        sale={selectedSale}
        stats={stats}
      />
    </div>
  );
}