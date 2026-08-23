import api from './api';

export const sendAiChat = (message) => api.post('/ai/chat', { message });

export default {
  sendAiChat,
};
