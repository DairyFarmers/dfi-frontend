import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

export function useUserSettings() {
  const {
    data: settings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/users/settings/');
        
        if (!response?.status) {
          throw new Error(response?.data?.message || 'Failed to fetch settings');
        }

        return response.data;
      } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to fetch settings';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    staleTime: 300000, // 5 minutes
  });

  const updateSettings = useMutation({
    mutationFn: async (data) => {
      const validPreferenceTypes = [
        'privacy_settings'
      ];

      // Validate preference types
      const invalidTypes = Object.keys(data).filter(
        key => !validPreferenceTypes.includes(key)
      );
      
      if (invalidTypes.length > 0) {
        throw new Error(`Invalid preference types: ${invalidTypes.join(', ')}`);
      }

      const response = await api.put('/api/v1/users/settings/', data);
      
      if (!response?.status) {
        throw new Error(response?.message || 'Failed to update settings');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.message || error.message || 'Failed to update settings';
      toast.error(errorMessage);
    }
  });

  const updateSpecificPreference = async (preferenceType, preferenceData) => {
    try {
      await updateSettings.mutateAsync({
        [preferenceType]: preferenceData
      });
    } catch (error) {
      // Error handling is done in mutation's onError
      throw error;
    }
  };

  // Update user profile
  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/api/v1/users/detail', data);

      if (!response?.status) {
        throw new Error(response?.data?.message || 'Failed to update profile');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  });

  // Change password
  const changePassword = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/v1/users/change-password', data);

      if (!response?.status) {
        throw new Error('Failed to change password');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error('Failed to change password');
    }
  });

  // Request password reset
  const requestPasswordReset = useMutation({
    mutationFn: async (email) => {
      const response = await api.post('/api/v1/users/password-reset-request', { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset instructions sent to your email');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to request password reset');
    }
  });

  // Update contact information
  const updateContact = useMutation({
    mutationFn: async (data) => {
      const response = await api.patch('/api/v1/users/contact/', data);
      
      if (!response?.status) {
        throw new Error(response?.data?.message || 'Failed to update contact information');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Contact information updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update contact information');
    }
  });

  // Update location information
  const updateLocation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/api/v1/users/locations/', data);
      
      if (!response?.status) {
        throw new Error(response?.data?.message || 'Failed to update location information');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Location information updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update location information');
    }
  });

  // Add new location
  const addLocation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/v1/users/locations/', data);
      
      if (!response?.status) {
        throw new Error(response?.data?.message || 'Failed to add new location');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('New location added successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add new location');
    }
  });

  // Set primary location
  const setPrimaryLocation = useMutation({
    mutationFn: async (locationId) => {
      const response = await api.put(`/api/v1/users/locations/`, {
        locationId,
        is_primary: true
      });
      
      if (!response?.status) {
        throw new Error(response?.data?.message || 'Failed to set primary location');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Primary location set successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to set primary location');
    }
  });

  // Delete location
  const deleteLocation = useMutation({
    mutationFn: async (locationId) => {
      const response = await api.delete(`/api/v1/users/locations/${locationId}`);
      
      if (!response?.status) {
        throw new Error(response?.data?.message || 'Failed to delete location');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-settings']);
      toast.success('Location deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete location');
    }
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateSpecificPreference,
    refetch,
    updateProfile: updateProfile.mutate,
    changePassword: changePassword.mutate,
    requestPasswordReset: requestPasswordReset.mutate,
    updateContact: updateContact.mutate,
    updateLocation: updateLocation.mutate,
    addLocation: addLocation.mutate,
    setPrimaryLocation: setPrimaryLocation.mutate,
    deleteLocation: deleteLocation.mutate
  };
}