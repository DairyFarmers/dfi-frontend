import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import TopNavbar from '@/components/layout/top-navbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Pencil, Trash2, RefreshCcw } from "lucide-react";
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unauthorized Access</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>You don't have permissions to access this page</span>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 