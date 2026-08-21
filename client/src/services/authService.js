import api from './api';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const sendLoginOtp = (data) => api.post('/auth/login/otp', data);
export const verifyLoginOtp = (data) => api.post('/auth/login/otp/verify', data);

export const getMe = () => api.get('/auth/me');
export const logout = () => api.get('/auth/logout');

export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const verifyResetOtp = (data) => api.post('/auth/verify-reset-otp', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
