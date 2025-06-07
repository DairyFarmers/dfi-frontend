import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const RecentOrders = () => {
  const orders = [
    {
      id: "ORD001",
      customer: "John Smith",
      product: "Raw Materials",
      status: "processing",
      amount: "$1,234.00",
      date: "2024-03-15",
    },
    {
      id: "ORD002",
      customer: "Alice Johnson",
      product: "Finished Goods",
      status: "completed",
      amount: "$2,567.00",
      date: "2024-03-14",
    },
    {
      id: "ORD003",
      customer: "Bob Wilson",
      product: "Equipment",
      status: "pending",
      amount: "$890.00",
      date: "2024-03-14",
    },
    {
      id: "ORD004",
      customer: "Sarah Davis",
      product: "Supplies",
      status: "completed",
      amount: "$432.00",
      date: "2024-03-13",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "processing":
        return "bg-blue-500/10 text-blue-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Overview of the latest orders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)} variant="secondary">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders; 