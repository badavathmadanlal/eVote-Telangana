import api from './api';

export const submitContact = (data) => api.post('/contact', data);
export const getContacts = () => api.get('/contact');
export const getContactById = (id) => api.get(`/contact/${id}`);
export const updateContact = (id, data) => api.patch(`/contact/${id}`, data);
export const deleteContact = (id) => api.delete(`/contact/${id}`);
