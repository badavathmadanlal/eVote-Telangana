import api from './api';

export const getLatest = () => api.get('/announcements/latest');
export const getPinned = () => api.get('/announcements/pinned');
export const getById = (id) => api.get(`/announcements/${id}`);
export const getAll = (params) => api.get('/announcements', { params });
export const create = (data) => api.post('/announcements', data);
export const update = (id, data) => api.put(`/announcements/${id}`, data);
export const toggle = (id, data) => api.patch(`/announcements/${id}/toggle`, data);
export const remove = (id) => api.delete(`/announcements/${id}`);
