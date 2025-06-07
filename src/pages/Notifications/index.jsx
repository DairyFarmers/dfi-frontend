import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/sidebar';
import TopNavbar from '@/components/layout/top-navbar';
import { PermissionGuard } from '@/components/common/PermissionGuard';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw, Bell, CheckCircle2, Clock, XCircle, CheckSquare2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function Notifications() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { user } = useSelector((state) => state.user);
  const {
    notifications: {
      results: notifications = [],
      count = 0,
      num_pages = 1,
      next,
      previous
    },
    stats = {
      total: 0,
      unread: 0,
      read: 0,
      urgent: 0
    },
    isLoading,
    error,
    refetch,
    deleteNotification,
    markAllAsRead,
    handleNotificationClick
  } = useNotifications({ currentPage, pageSize });

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

  const handleLoadMore = () => {
    if (next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleNotificationSelected = async (id) => {
    try {
      const redirectUrl = await handleNotificationClick(id);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (error) {
      toast.error('Failed to process notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleClick = async () => {
    try {
      const redirectUrl = await onNotificationClick(notifications);
      
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    } catch (error) {
      toast.error(error.message);
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
              <AlertTitle>Error loading notifications</AlertTitle>
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
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Stats Section */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground mt-1">
                  You have {stats.unread} unread notifications
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total: {stats.total}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Unread: {stats.unread}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Urgent: {stats.urgent}</span>
                </div>
                {stats.unread > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="flex items-center space-x-2 hover:bg-success/10 hover:text-success"
                    disabled={markAllAsRead.isLoading}
                  >
                    <CheckSquare2 className="h-4 w-4" />
                    <span>Mark All Read</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      !notification.read && "bg-muted/20"
                    )}
                    onClick={() => handleNotificationSelected(notification.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={notification.priority === 'urgent' ? 'destructive' : 'outline'}>
                              {notification.notification_type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(notification.created_at).toLocaleDateString()}
                              {'  •  '} 
                              {new Date(notification.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <h3 className="font-semibold">{notification.notification_title}</h3>
                          <p className="text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              deleteNotification.mutate(notification.id);
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {next && (
                  <div className="pt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="w-full"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}