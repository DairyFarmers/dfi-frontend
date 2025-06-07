import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

export function useReports({ currentPage = 1, pageSize = 10 } = {}) {
  // Fetch reports
  const { 
    data: reports = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['reports', { currentPage, pageSize }],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/reports/list', {
          params: { page: currentPage, size: pageSize }
        });

        if (!response?.status) {
          throw new Error('Invalid response from server');
        }

        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch reports`);
      }
    }
  });

  // Generate report mutation
  const generateReport = useMutation({
    mutationFn: async (reportData) => {
      const response = await api.post('/api/v1/reports/generate', reportData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      toast.success('Report generated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    }
  });

  // Download report mutation
  const downloadReport = useMutation({
    mutationFn: async (reportId) => {
      const response = await api.get(`/api/v1/reports/${reportId}/download`, {
        responseType: 'blob'
      });
      return response;
    }
  });

  // Delete report mutation
  const deleteReport = useMutation({
    mutationFn: async (reportId) => {
      await api.delete(`/api/v1/reports/${reportId}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      toast.success('Report deleted successfully');
    }
  });

  const stats = {
    total: reports?.results?.length || 0,
    today: reports?.results?.filter(report => 
      new Date(report.generated_at).toDateString() === new Date().toDateString()
    ).length || 0,
    thisMonth: reports?.results?.filter(report => 
      new Date(report.generated_at).getMonth() === new Date().getMonth()
    ).length || 0
  };

  return {
    reports: {
      results: reports?.results || [],
      count: reports?.count || 0,
      num_pages: reports?.num_pages || 1,
      next: reports?.next,
      previous: reports?.previous
    },
    isLoading,
    error,
    refetch,
    stats,
    generateReport,
    downloadReport,
    deleteReport
  };
}