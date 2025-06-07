import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { current } from '@reduxjs/toolkit';

export function useInventory({ 
  currentPage = 1, 
  pageSize = 10, 
  fetchAll = false 
} = {}
) {
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [
      'inventory', 
      'items', 
      fetchAll ? 'all': {currentPage, pageSize}
    ],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/inventory/items/', {
          params: {
            ...(fetchAll ? { all: true } : { page: currentPage, size: pageSize })
          }
        });

        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response?.data;
      } catch (error) {
        throw new Error(`Failed to fetch inventory items`);
      }
    }
  });

  const addItem = useMutation({
    mutationFn: async (newItem) => {
      try {
        const response = await api.post('/api/v1/inventory/items/', newItem);
        return response.data;
      } catch (error) {
        throw new Error('Failed to add inventory item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', 'items']);
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/v1/inventory/items/${id}`, data);

      if (!response?.status) {
        throw new Error('Failed to update inventory item');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', 'items']);
    }
  });

  const deleteItem = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await api.delete(`/api/v1/inventory/items/${id}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to delete inventory item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', 'items']);
    }
  });

  const items = data?.results || [];
  const lowStockItems = items.filter(item => item.quantity <= 10 && item.quantity > 0);
  const outOfStockItems = items.filter(item => item.quantity === 0);

  return {
    inventory: fetchAll ? {
      results: items,
      count: items.length
    } : {
      results: items,
      count: data?.count || 0,
      num_pages: data?.num_pages || 1,
      next: data?.next,
      previous: data?.previous
    },
    isLoading,
    error,
    refetch,
    addItem,
    updateItem,
    deleteItem,
    stats: {
      total: fetchAll ? items.length : data?.count || 0,
      lowStock: lowStockItems.length,
      outOfStock: outOfStockItems.length
    }
  };
}

export function useInventoryItem(itemId) {
  return useQuery({
    queryKey: ['inventory', 'item', itemId],
    queryFn: async () => {
      if (!itemId) return null;

      const response = await api.get(`/api/v1/inventory/items/${itemId}`);
      
      if (!response?.status) {
        throw new Error('Failed to fetch inventory item');
      }

      return response?.data;
    },
    enabled: !!itemId
  });
}