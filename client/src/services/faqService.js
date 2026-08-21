import api from './api';

export const getFaqs = () => api.get('/faqs');
export const getFaqById = (id) => api.get(`/faqs/${id}`);
export const getFaqsByCategory = (category) => api.get(`/faqs/category/${category}`);
export const searchFaqs = (q) => api.get(`/faqs/search?q=${q}`);
export const createFaq = (data) => api.post('/faqs', data);
export const updateFaq = (id, data) => api.put(`/faqs/${id}`, data);
export const deleteFaq = (id) => api.delete(`/faqs/${id}`);
