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
export const token_verification_path = '/users/token/verification';
export const logout_path = '/users/logout';
export const profile_path = '/users/profile';
