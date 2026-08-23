import api from './api';

export const castVote = (data) => api.post('/votes', data);
export const getMyVotes = () => api.get('/votes/my-votes');
export const hasVoted = (electionId) => api.get(`/votes/check/${electionId}`);
export const getElectionResults = (electionId) => api.get(`/votes/election/${electionId}/results`);

export default {
  castVote,
  getMyVotes,
  hasVoted,
  getElectionResults
};
