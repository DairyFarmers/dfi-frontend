import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '@/redux/slices/userSlice';
import { Loader2 } from "lucide-react";

export const AuthWrapper = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false 
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { 
    isLoggedIn,
    is_verified,
    permissions = {},
    initialized 
  } = useSelector((state) => state.user);

  console.log('permissions', permissions);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!initialized) {
        try {
          await dispatch(verifyToken()).unwrap();
        } catch (error) {
          console.error(
            'Auth initialization failed:', 
            error
        );
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch, initialized]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!is_verified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => permissions[permission])
      : requiredPermissions.some(permission => permissions[permission]);

    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};