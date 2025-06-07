import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UserManagement from '@/pages/UserManagement';
import Inventory from '@/pages/Inventory';
import Unauthorized from '@/pages/Unauthorized';
import Suppliers from '@/pages/Suppliers';
import Orders from '@/pages/Orders';
import Sales from '@/pages/Sales';
import Reports from '@/pages/reports';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import VerifyEmail from '@/pages/VerifyEmail';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ErrorPage from '@/pages/ErrorPage';
import { AuthWrapper } from '@/utils/AuthWrapper';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path='/reset-password/:uid/:token' element={<ResetPassword />} />
      <Route path="/error" element={<ErrorPage />} />
      
      <Route path="/" element={
        <AuthWrapper>
          <Dashboard />
        </AuthWrapper>
      } />

      <Route path="/users" element={
        <AuthWrapper
          requiredPermissions={['can_manage_users', 'can_view_users']}
          requireAll={false}
        >
          <UserManagement />
        </AuthWrapper>
      } />

      <Route path="/inventory" element={
        <AuthWrapper
          requiredPermissions={['can_manage_inventory', 'can_view_inventory']}
          requireAll={false}
        >
          <Inventory />
        </AuthWrapper>
      } />

      <Route path="/suppliers" element={
        <AuthWrapper
          requiredPermissions={['can_manage_suppliers', 'can_view_suppliers']}
          requireAll={false}
        >
          <Suppliers />
        </AuthWrapper>
      } />

      <Route path="/orders" element={
        <AuthWrapper
          requiredPermissions={['can_manage_orders', 'can_view_orders']}
          requireAll={false}
        >
          <Orders />
        </AuthWrapper>
      } />

      <Route path="/sales" element={
        <AuthWrapper
          requiredPermissions={['can_manage_sales', 'can_view_sales']}
          requireAll={false}
        >
          <Sales />
        </AuthWrapper>
      } />

      <Route path="/reports" element={
        <AuthWrapper
          requiredPermissions={['can_view_reports']}
          requireAll={false}
        >
          <Reports />
        </AuthWrapper>
      } />
      <Route path='/notifications' element={
        <AuthWrapper
          requiredPermissions={['can_view_notifications']}
          requireAll={false}
        >
          <Notifications />
        </AuthWrapper>
      } />

      <Route path="/settings"
        element={
          <AuthWrapper
            requiredPermissions={['can_manage_settings']}
            requireAll={false}
          >
            <Settings />
          </AuthWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 