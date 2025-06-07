import React from 'react';
import { useSelector } from 'react-redux';

export const PermissionGuard = ({
  permissions,
  children,
  fallback = null,
  requireAll = true,
}) => {
  const { permissions: userPermissions, loading } = useSelector((state) => state.user);
  
  if (loading || !userPermissions) {
    return null;
  }

  const hasPermission = () => {
    // Handle single permission
    if (typeof permissions === 'string') {
      return userPermissions[permissions] === true;
    }

    // Handle array of permissions
    if (Array.isArray(permissions)) {
      if (requireAll) {
        return permissions.every(permission => userPermissions[permission] === true);
      } else {
        return permissions.some(permission => userPermissions[permission] === true);
      }
    }

    return false;
  };

  if (!hasPermission()) {
    return fallback;
  }

  return children;
};