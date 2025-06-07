// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/users/login',
  LOGOUT: '/api/v1/users/logout',
  VERIFY_TOKEN: '/api/v1/users/token/verification',
  REFRESH_TOKEN: '/api/v1/users/token/refresh',
  FORGOT_PASSWORD_REQUEST: '/api/v1/users/password-reset-request',
  RESET_PASSWORD: '/api/v1/users/password-reset',
  CHANGE_PASSWORD: '/api/v1/users/change-password',
  SEND_OTP: '/api/v1/users/send-otp',
  VERIFY_EMAIL: '/api/v1/users/verify-email',
};

// User management endpoints
export const USER_ENDPOINTS = {
  LIST: '/api/v1/users/',
  DETAIL: (id) => `/api/v1/users/${id}/`,
  CREATE: '/api/v1/users/',
  UPDATE: (id) => `/api/v1/users/${id}/`,
  DELETE: (id) => `/api/v1/users/${id}/`,
  PROFILE: '/api/v1/users/profile/',
};

// Inventory endpoints
export const INVENTORY_ENDPOINTS = {
  LIST: '/api/v1/inventory/',
  DETAIL: (id) => `/api/v1/inventory/${id}/`,
  CREATE: '/api/v1/inventory/',
  UPDATE: (id) => `/api/v1/inventory/${id}/`,
  DELETE: (id) => `/api/v1/inventory/${id}/`,
  STOCK_LEVELS: '/api/v1/inventory/stock-levels/',
  LOW_STOCK: '/api/v1/inventory/low-stock/',
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  LIST: '/api/v1/orders/',
  DETAIL: (id) => `/api/v1/orders/${id}/`,
  CREATE: '/api/v1/orders/',
  UPDATE: (id) => `/api/v1/orders/${id}/`,
  DELETE: (id) => `/api/v1/orders/${id}/`,
  STATUS: (id) => `/api/v1/orders/${id}/status/`,
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  SUMMARY: '/api/v1/dashboard/summary/',
  STATS: '/api/v1/dashboard/stats/',
  RECENT_ACTIVITY: '/api/v1/dashboard/recent-activity/',
  INVENTORY_STATS: '/api/v1/dashboard/inventory-stats/',
  ORDER_STATS: '/api/v1/dashboard/order-stats/',
};

// Activity log endpoints
export const ACTIVITY_ENDPOINTS = {
  LIST: '/api/v1/activity-logs/',
  DETAIL: (id) => `/api/v1/activity-logs/${id}/`,
};

// Settings endpoints
export const SETTINGS_ENDPOINTS = {
  GENERAL: '/api/v1/settings/general/',
  NOTIFICATIONS: '/api/v1/settings/notifications/',
  PREFERENCES: '/api/v1/settings/preferences/',
}; 