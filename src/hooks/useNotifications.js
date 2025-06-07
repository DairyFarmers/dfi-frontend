import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

export function useNotifications({ 
  currentPage = 1, 
  pageSize = 10, 
  fetchAll = false 
} = {}) {
  // Main notifications query
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', fetchAll ? 'all' : { currentPage, pageSize }],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/notifications/', {
          params: {
            ...(fetchAll ? { all: true } : { page: currentPage, size: pageSize })
          }
        });

        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch notifications');
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    keepPreviousData: true,
  });

  // Mark multiple notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      try {
        const response = await api.post('/api/v1/notifications/mark-all/');

        if (!response?.status) {
          throw new Error('Failed to mark notifications as read');
        }

        return response.data;
      } catch (error) {
        throw new Error('Failed to mark notifications as read');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  // Delete notification mutation
  const deleteNotification = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await api.delete(`/api/v1/notifications/${id}/delete`);
        
        if (!response?.status) {
          throw new Error('Failed to delete notification');
        }

        queryClient.invalidateQueries(['notifications']);
        toast.success('Notification deleted successfully');
        return id;
      } catch (error) {
        throw new Error('Failed to delete notification');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const handleNotificationClick = async (id) => {
    try {
      const response = await api.get(`/api/v1/notifications/${id}`);
      
      if (!response?.status) {
        throw new Error('Failed to process notification');
      }

      console.log('Notification response:', response.data);

      const { redirect_url } = response.data;
      queryClient.invalidateQueries(['notifications']);
      return redirect_url;
    } catch (error) {
      throw new Error('Failed to process notification');
    }
  };

  const notifications = data?.notifications?.results || [];
  const stats = {
    total: fetchAll ? notifications.length : data?.count || 0,
    unread: notifications.filter(n => !n.read).length,
    read: notifications.filter(n => n.read).length,
    urgent: notifications.filter(n => n.priority === 'urgent').length
  };

  return {
    notifications: fetchAll ? {
      results: notifications,
      count: data?.notifications?.count || 0,
    } : {
      results: notifications,
      count: data?.notifications?.count || 0,
      num_pages: data?.notifications?.num_pages || 1,
      next: data?.notifications?.next,
      previous: data?.notifications?.previous
    },
    stats: {
        total: stats.total,
        unread: stats.unread,
        read: stats.read,
        urgent: stats.urgent
    },
    isLoading,
    error,
    refetch,
    deleteNotification,
    markAllAsRead,
    handleNotificationClick
  };
}