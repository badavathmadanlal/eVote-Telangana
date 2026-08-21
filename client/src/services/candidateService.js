import api from './api';

export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidateById = (id) => api.get(`/candidates/${id}`);
export const getCandidatesByElection = (electionId) => api.get(`/candidates/election/${electionId}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
