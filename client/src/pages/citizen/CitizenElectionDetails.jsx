import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CitizenElectionDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 font-serif">Election Details</h1>
        <p className="text-sm text-slate-500">Review guidelines and proceed to cast your ballot.</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
        <h3 className="text-xl font-bold mb-4">State Assembly Elections 2026</h3>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-6">
          By proceeding, you verify that you are casting this vote freely and without coercion. This process is end-to-end encrypted and your identity will be detached from your ballot.
        </p>
        <Link to={`/citizen/elections/${id}/vote`} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg inline-block">
          Proceed to Secure Voting Terminal
        </Link>
      </div>
    </div>
  );
};

export default CitizenElectionDetails;
