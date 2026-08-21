import React from 'react';
import { Link } from 'react-router-dom';

const CitizenElections = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 font-serif">Active Elections</h1>
        <p className="text-sm text-slate-500">Select an active election in your constituency to view details.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        {/* Placeholder Election Card */}
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Active</div>
            <h3 className="text-lg font-bold text-slate-900">State Assembly Elections 2026</h3>
            <p className="text-sm text-slate-500">Constituency: Hyderabad Central</p>
          </div>
          <Link to="/citizen/elections/1" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenElections;
