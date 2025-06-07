import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
  import { useUserDetails } from '@/hooks/useUsers';
  import { Badge } from "@/components/ui/badge";
  import { Shield } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { AlertDialogBox } from '@/components/shared/AlertDialogBox';
  
  export function UserDetailsDialog({ 
    isOpen, 
    onClose, 
    userId ,
    onStatusChange
}) {
    const { 
        data: user, 
        isLoading, 
        error 
    } = useUserDetails(userId);

    const [showStatusConfirm, setShowStatusConfirm] = useState(false);

    const handleStatusClick = () => {
        setShowStatusConfirm(true);
    };
  
    if (isLoading) {
      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <div className="flex items-center justify-center p-4">
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
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                Failed to load item details
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries(['inventory', 'item', itemId])}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </DialogContent>
        </Dialog>
      );
    }
  
    return (
      <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Account Information</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{`${user?.first_name} ${user?.last_name}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role_name}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={user?.is_active ? "success" : "warning"}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStatusClick}
                    >
                        {user?.is_active ? 'Disable' : 'Enable'} Account
                   </Button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Activity Information</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{new Date(user?.last_login).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Joined:</span>
                  <span>{new Date(user?.date_joined).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialogBox
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={() => {
          onStatusChange(user);
          setShowStatusConfirm(false);
        }}
        title={`${user?.is_active ? 'Disable' : 'Enable'} User Account`}
        description={
          <div className="space-y-2">
            <p>{`Are you sure you want to ${user?.is_active ? 'disable' : 'enable'} this user account?`}</p>
            <p className="text-sm text-muted-foreground">
              {user?.is_active
                ? 'This will prevent the user from accessing the system.'
                : 'This will restore the user\'s access to the system.'}
            </p>
          </div>
        }
      />
      </>  
    );
  }