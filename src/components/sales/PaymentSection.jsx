import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { usePayments } from '@/hooks/usePayments';
import { AddPaymentForm } from './AddPaymentForm';

export function PaymentSection({ saleId, totalAmount }) {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { 
    payments: {
      results: payments = [],
      count = 0,
      num_pages = 1,
      next,
      previous
    },
    refetch,
    error,
    isLoading, 
    addPayment,
    voidPayment,
    stats 
  } = usePayments(saleId, { currentPage, pageSize });

  console.log("Payments Data:", payments);
  console.log("Stats Data:", stats);

  const remainingAmount = totalAmount - stats.totalPaid;

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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Payment Summary</span>
            <Badge variant={remainingAmount <= 0 ? "success" : "warning"}>
              {remainingAmount <= 0 ? "Paid" : "Pending"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">LKR {totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">
                LKR {stats.totalPaid?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-yellow-600">
                LKR {remainingAmount?.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Payment History</span>
            <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, count)} of {count} orders
            </div>
            {remainingAmount > 0 && (
              <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
                <DialogTrigger asChild>
                  <Button>Add Payment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Payment</DialogTitle>
                  </DialogHeader>
                  <AddPaymentForm
                    saleId={saleId}
                    remainingAmount={remainingAmount}
                    onSuccess={() => setShowAddPayment(false)}
                    onSubmit={addPayment.mutate}
                  />
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{payment.payment_method_display}</TableCell>
                  <TableCell>{payment.reference_number || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={payment.is_active ? "success" : "destructive"}>
                      {payment.is_active ? "Active" : "Voided"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.is_active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => voidPayment.mutate(payment.id)}
                      >
                        Void
                      </Button>
                    )}
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
  );
}