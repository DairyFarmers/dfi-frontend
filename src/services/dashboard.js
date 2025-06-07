import { api } from './api';

export const dashboardService = {
  getSummary: () => api.get('/api/v1/dashboard/summary'),
  getStockSummary: () => api.get('/api/v1/dashboard/stock-summary'),
  getOrdersOverview: () => api.get('/api/v1/dashboard/orders-overview'),
  getExpiringStock: () => api.get('/api/v1/dashboard/expiring-stock'),
  getSalesGraph: () => api.get('/api/v1/dashboard/sales-graph'),
}; 