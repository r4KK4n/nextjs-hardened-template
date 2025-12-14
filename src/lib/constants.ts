export const APP_NAME = 'PROJECT_NAME';
export const APP_DESCRIPTION = 'DESCRIPTION';

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
