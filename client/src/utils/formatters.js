export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(dateString));
};
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
};
export const formatPercent = (val) => `${parseFloat(val || 0).toFixed(1)}%`;
export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
