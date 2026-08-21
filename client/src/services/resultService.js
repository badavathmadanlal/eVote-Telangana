import api from './api';

export const getElectionResults = (electionId) => api.get(`/results/election/${electionId}`);
export const getDashboard = () => api.get('/results/dashboard');
export const getCandidateResults = (candidateId) => api.get(`/results/candidate/${candidateId}`);
export const getConstituencyResults = (constituency) => api.get(`/results/constituency/${constituency}`);
