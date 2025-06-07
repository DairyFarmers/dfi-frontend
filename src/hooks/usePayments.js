import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';

export function usePayments(
  saleId,
  {
    currentPage = 1,
    pageSize = 10,
  } = {}
) {
  // Fetch payments for a sale
  const {
    data: payments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payments', saleId, { currentPage, pageSize }],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/payments/', {
          params: { 
            sale_id: saleId,
            page: currentPage,
            size: pageSize
          }
        });

        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch payments');
      }
    },
    enabled: !!saleId
  });

  // Add new payment
  const addPayment = useMutation({
    mutationFn: async (paymentData) => {
      try {
        console.log("Adding payment data:", paymentData);
        const response = await api.post('/api/v1/payments/', paymentData);

        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response.data;
      } catch (error) {
        throw new Error(error?.response?.message || 'Failed to add payment');
      }
    },
    onSuccess: () => {
      // Invalidate both payments and sales queries to update status
      queryClient.invalidateQueries(['payments', saleId]);
      queryClient.invalidateQueries(['sales']);
    }
  });

  // Void payment
  const voidPayment = useMutation({
    mutationFn: async (paymentId) => {
      const response = await api.post(`/api/v1/payments/${paymentId}/void/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments', saleId]);
      queryClient.invalidateQueries(['sales']);
    }
  });

  const totalPaid = payments?.results?.reduce((sum, payment) => 
    sum + Number(payment.amount), 0
  );

  return {
    payments: {
      results: payments?.results || [],
      count: payments?.count || 0,
      num_pages: payments?.num_pages || 1,
      next: payments?.next,
      previous: payments?.previous

    },
    isLoading,
    error,
    refetch,
    addPayment,
    voidPayment,
    stats: {
      totalPaid,
      paymentCount: payments.length,
      lastPaymentDate: payments[0]?.payment_date
    }
  };
}