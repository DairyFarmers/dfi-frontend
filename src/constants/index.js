// Re-export all endpoints
export * from './endpoints';

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Time Ranges
export const TIME_RANGES = {
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year'
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    SHOP_OWNER: 'shop_owner',
    INVENTORY_MANAGER: 'inventory_manager',
    SALES_REP: 'sales_rep',
    FARMER: 'farmer'
};

// Status Types
export const STATUS_TYPES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Error Messages
export const ERROR_MESSAGES = {
    FETCH_FAILED: 'Failed to fetch data. Please try again later.',
    INVALID_RESPONSE: 'Invalid response from server',
    SERVER_ERROR: 'Internal server error. Please contact support.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SESSION_EXPIRED: 'Your session has expired. Please login again'
};

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
    DASHBOARD: 5 * 60 * 1000, // 5 minutes
    USER_DATA: 30 * 60 * 1000, // 30 minutes
    INVENTORY: 10 * 60 * 1000 // 10 minutes
}; 