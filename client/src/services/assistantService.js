import api from './api';

export const chat = (message) => api.post('/assistant/chat', { message });
