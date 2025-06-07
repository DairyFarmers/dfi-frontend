import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

export function useRoles() {
    const {
      data = [],
      isLoading,
      error,
      refetch
    } = useQuery({
      queryKey: ['roles'],
      queryFn: async () => {
        try {
          const response = await api.get(`/api/v1/users/roles/`);

          if (!response?.status) {
            throw new Error('Invalid response from server');
          }

          return response?.data;
        } catch (error) {
          throw new Error('Failed to fetch order details');
        }
      },
    });

    return {
      data,
      isLoading,
      error,
      refetch
    };
}