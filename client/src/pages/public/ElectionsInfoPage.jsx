import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { getElections } from '../../services/electionService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

const ElectionsInfoPage = () => {
  const { data, loading, error } = useFetch(getElections);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto py-8 px-4"><ErrorMessage message={error} /></div>;

  const elections = data?.elections || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Elections Information</h1>
      {elections.length === 0 ? (
        <p className="text-gray-500">No scheduled elections found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {elections.map((el) => (
            <div key={el._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <Badge color={el.status === 'ACTIVE' ? 'green' : 'gray'}>{el.status}</Badge>
                <span className="text-xs text-gray-400">{el.electionType}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{el.title}</h3>
              <p className="text-xs text-gray-500 font-medium">Constituency: {el.constituency}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{el.description}</p>
              <div className="pt-2 text-xs text-gray-400 border-t border-gray-50 flex justify-between">
                <span>Start: {formatDate(el.startDate)}</span>
                <span>End: {formatDate(el.endDate)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElectionsInfoPage;
