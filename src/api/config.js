const env = process.env.APP_ENV;

const config = {
  dev: {
    APP_API_URL: process.env.REACT_APP_API_URL,
  },
  stage: {
    APP_API_URL: process.env.REACT_APP_API_URL,
  },
  prod: {
    APP_API_URL: process.env.REACT_APP_API_URL,
  },
};

export const { APP_API_URL } = config[env] || config.dev;

export const login_path = '/users/login';
export const verification_code_path = '/users/otp';
export const email_verification_path = '/users/verification';
export const token_verification_path = '/users/token/verification';
export const logout_path = '/users/logout';
export const profile_path = '/users/profile';
export const forgot_password_path = '/users/password-reset-request';
export const change_password_path = '/users/password-reset';

export const dashboard_summary_path = '/dashboard/summary';
export const orders_overview_path = '/dashboard/orders-overview';
export const sales_graph_path = '/dashboard/sales-graph';
export const activity_log_path = '/users/activity-logs';

