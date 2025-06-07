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
  Pencil, 
  Trash2, 
  RefreshCcw 
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
import { useInventory } from '@/hooks/useInventory';
import { AddItemForm } from '@/components/inventory/AddItemForm.jsx';
import { EditItemForm } from '@/components/inventory/EditItemForm';
import { DeleteItemDialog } from '@/components/inventory/DeleteItemDialog';
import { toast } from 'sonner';

export default function Inventory() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const {
    inventory: {
      results: inventory = [],
      count = 0,
      num_pages = 1,
      next,
      previous
    },
    isLoading,
    error,
    refetch,
    stats,
    addItem,
    updateItem,
    deleteItem
  } = useInventory({ currentPage, pageSize });

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

  const handleItemUpdate = (itemId) => {
    setSelectedItemId(itemId);
    setEditDialogOpen(true);
  };

  const handleItemUpdateConfirm = async (formData) => {
    try {
      console.log("Updating item with data:", formData);
      await updateItem.mutateAsync({ 
        id: selectedItemId, 
        data: formData 
      });
      setEditDialogOpen(false);
      setSelectedItem(null);
      toast.success('Item updated successfully');
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleAddItem = async (formData) => {
    try {
      await addItem.mutateAsync(formData);
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteItem.mutate(itemToDelete.id);
      toast.success(`${itemToDelete.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
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
              <AlertTitle>Error loading inventory</AlertTitle>
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
                <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your inventory items and stock levels
                </p>
              </div>
              <PermissionGuard permissions="can_manage_inventory">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Item
                </Button>
              </PermissionGuard>

              <AddItemForm
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSubmit={handleAddItem}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats?.lowStock}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {stats?.outOfStock}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Items</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, count)} of {count} orders
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory?.map((item) => (
                      <TableRow key={item?.id}>
                        <TableCell>{item?.batch_number}</TableCell>
                        <TableCell>{item?.name}</TableCell>
                        <TableCell>{item?.description}</TableCell>
                        <TableCell>{item?.dairy_type}</TableCell>
                        <TableCell>
                          <span className={
                            item?.quantity === 0 ? 'text-red-600 font-bold'
                              : item?.quantity <= 10 ? 'text-yellow-600 font-medium'
                                : ''
                          }>
                            {Number(item?.quantity)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {item?.unit === 'kg' ? 'Kilograms' :
                            item?.unit === 'l' ? 'Liters' :
                            item?.unit === 'pcs' ? 'Pieces' : item?.unit}
                        </TableCell>
                        <TableCell>LKR {item?.price}</TableCell>
                        <TableCell>
                          <Badge variant={item?.is_active ? "default" : "secondary"}>
                            {item?.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item?.expiry_date ? 
                            new Date(item?.expiry_date).toLocaleDateString() 
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <PermissionGuard permissions="can_manage_inventory">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mr-2"
                              onClick={() => {handleItemUpdate(item.id)}}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(item)}
                            >
                              <Trash2 className="h-4 w-4" />
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

      <EditItemForm
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedItemId(null);
        }}
        onSubmit={handleItemUpdateConfirm}
        itemId={selectedItemId}
      />

      <DeleteItemDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
          onConfirm={handleDeleteConfirm}
          itemName={itemToDelete?.name}
        />
    </div>
  );
}