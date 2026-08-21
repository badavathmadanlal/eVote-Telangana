import api from './api';

export const getSummary = () => api.get('/dashboard/summary');
export const getCharts = () => api.get('/dashboard/charts');
export const getRecent = () => api.get('/dashboard/recent');
export const getActivityFeed = () => api.get('/dashboard/activity');
