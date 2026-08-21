import api from './api';

export const verifyCitizen = (data) => api.post('/citizens/verify', data);
export const getMyStatus = () => api.get('/citizens/me');
export const getCitizens = () => api.get('/citizens');
export const getCitizenById = (id) => api.get(`/citizens/${id}`);
