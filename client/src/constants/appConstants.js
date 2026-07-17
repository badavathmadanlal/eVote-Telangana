export const APP_NAME = 'Remote Voting System';
export const APP_VERSION = '1.0.0';

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ELECTIONS: '/elections',
  VOTE: '/vote',
  RESULTS: '/results',
  PROFILE: '/profile',
  ADMIN: '/admin',
  NOT_FOUND: '*',
});

export const API_ENDPOINTS = Object.freeze({
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    ME: '/v1/auth/me',
  },
  ELECTIONS: {
    BASE: '/v1/elections',
    BY_ID: (id) => `/v1/elections/${id}`,
  },
  VOTES: {
    BASE: '/v1/votes',
    CAST: (electionId) => `/v1/votes/${electionId}`,
  },
});
