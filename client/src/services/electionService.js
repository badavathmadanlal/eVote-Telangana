import api from './api';

export const getElections = (params) => api.get('/elections', { params });
export const getActiveElection = (params) => api.get('/elections/active', { params });
export const getElectionById = (id) => api.get(`/elections/${id}`);
export const createElection = (data) => api.post('/elections', data);
export const updateElection = (id, data) => api.put(`/elections/${id}`, data);
export const updateElectionStatus = (id, data) => api.patch(`/elections/${id}/status`, data);
export const deleteElection = (id) => api.delete(`/elections/${id}`);

export default {
  getElections,
  getActiveElection,
  getElectionById,
  createElection,
  updateElection,
  updateElectionStatus,
  deleteElection
};
