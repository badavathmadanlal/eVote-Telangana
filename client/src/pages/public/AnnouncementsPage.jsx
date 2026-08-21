import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { getLatest } from '../../services/announcementService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

const AnnouncementsPage = () => {
  const { data, loading, error } = useFetch(getLatest);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto py-8 px-4"><ErrorMessage message={error} /></div>;

  const announcements = data?.announcements || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Latest Announcements</h1>
      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements available right now.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <Badge color="blue">{item.category}</Badge>
                <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
