import api from './api';

export const verifyCitizen = (data) => api.post('/citizens/verify', data);
export const getProfile = () => api.get('/citizens/profile');
export const updateProfile = (data) => api.put('/citizens/profile', data);
export const getMyStatus = () => api.get('/citizens/profile');
export const getCitizens = (params) => api.get('/citizens/all', { params });
export const getAllCitizens = (params) => api.get('/citizens/all', { params });
export const getCitizenById = (id) => api.get(`/citizens/${id}`);

export default {
  verifyCitizen,
  getProfile,
  updateProfile,
  getMyStatus,
  getCitizens,
  getAllCitizens,
  getCitizenById
};
