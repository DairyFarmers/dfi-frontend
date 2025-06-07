import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

export function useUsers({
  currentPage = 1,
  pageSize = 10,
  fetchAll = false
}) {
  // Fetch users
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['users', fetchAll ? 'all' : { currentPage, pageSize }],
    queryFn: async () => {
      const response = await api.get('/api/v1/users/list', {
        ...(fetchAll ? { all: true } : { page: currentPage, size: pageSize })
      });
      
      if (!response?.status) {
        throw new Error('Failed to fetch users');
      }
      
      return response.data;
    }
  });

  // Fetch roles
  const { data: roles = [] } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const response = await api.get('/api/v1/users/roles/');

      if (!response?.status) {
        throw new Error('Failed to fetch user roles');
      }

      return response.data;
    }
  });

  // Add user mutation
  const addUser = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post('/api/v1/users/registration', userData);
      
      if (!response?.status) {
        throw new Error('Failed to add user');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({ userId, data }) => {
      try {
        const response = await api.patch(`/api/v1/users/${userId}/`, data);
        console.log('Update response:', response);
        if (!response?.status) {
          throw new Error('Failed to update user');
        }
        
        return response;
      } catch (error) {
        const errorMessage = error.response?.message || 'Failed to update user';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated successfully');
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`/api/v1/users/${id}/`);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete user';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    }
  });

  const stats = {
    total: users.results?.length || 0,
    active: users.results?.filter(user => user.is_active).length || 0,
    inactive: users.results?.filter(user => !user.is_active).length || 0
  };

  return {
    users: fetchAll ? {
      results: users?.results || [],
      count: users.count || 0,
    } : {
      results: users?.results || [],
      count: users?.count || 0,
      num_pages: users?.num_pages || 1,
      next: users?.next,
      previous: users?.previous
    },
    roles: {
      results: roles?.results || [],
      count: roles?.count || 0
    },
    isLoading,
    error,
    refetch,
    stats,
    addUser,
    updateUser,
    deleteUser
  };
}

export function useUserDetails(userId) {
  return useQuery({
    queryKey: ['users', 'details', userId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/v1/users/${userId}/`);
      
        if (!response?.status) {
          throw new Error('Failed to fetch user details');
        }

        return response.data;
      } catch (error) {
        const errorMessage = 'Failed to fetch user details';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    enabled: !!userId
  });
}
