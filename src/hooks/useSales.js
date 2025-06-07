import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';

export function useSales({ 
  currentPage = 1, 
  pageSize = 10, 
  filters = {}, 
  fetchAll = false } = {}
) {
  // Fetch sales with pagination
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sales',  fetchAll ? 'all': {currentPage, pageSize, ...filters}],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/sales/', {
          params: {
            ...(fetchAll ? { all: true } : { page: currentPage, size: pageSize })
          }
        });
        
        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch sales');
      }
    },
    keepPreviousData: true
  });

  // Create sale from order
  const addSale = useMutation({
    mutationFn: async (saleData) => {
      try {
        const response = await api.post('/api/v1/sales/', saleData);

        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response.data;
      } catch (error) {
        throw new Error('Failed to create sale');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
    }
  });

  // Update sale
  const updateSale = useMutation({
    mutationFn: async ({ id, data: updateData }) => {
      try {
        const response = await api.patch(`/api/v1/sales/${id}/`, updateData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to update sale');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
    }
  });

  // Delete sale
  const deleteSale = useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`/api/v1/sales/${id}/`);
        return id;
      } catch (error) {
        throw new Error('Failed to delete sale');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
    }
  });

  // Calculate stats
  const sales = data?.results || [];
  const totalSales = data?.count || 0;
  const pendingPayments = sales.filter(sale => 
    ['pending', 'partial'].includes(sale.payment_status)
  ).length;
  const completedSales = sales.filter(sale => 
    sale.payment_status === 'paid'
  ).length;
  const totalRevenue = sales.reduce((sum, sale) => 
    sum + Number(sale.total_amount), 0
  );

  return {
    sales: fetchAll ? {
      results: sales,
      count: totalSales
    } : {
      results: sales,
      count: data?.count || 0,
      num_pages: data?.num_pages || 1,
      next: data?.next,
      previous: data?.previous
    },
    isLoading,
    error,
    refetch,
    addSale,
    updateSale,
    deleteSale,
    stats: {
      total: totalSales,
      totalAmount: totalRevenue,
      pending: pendingPayments,
      completed: completedSales
    }
  };
}