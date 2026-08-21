import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShield } from 'react-icons/fi';

const CitizenVote = () => {
  const navigate = useNavigate();

  const handleVoteCast = () => {
    // Mock voting action
    toast.success('Ballot encrypted and submitted successfully.');
    navigate('/citizen/vote-success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-serif">Secure Voting Terminal</h1>
          <p className="text-sm text-slate-400">Your connection to the state ledger is encrypted.</p>
        </div>
        <FiShield className="text-4xl text-emerald-500 opacity-50" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-6 border-b border-slate-100 pb-2">Select Your Candidate</h3>
        
        <div className="space-y-4 max-w-2xl">
          {/* Mock Candidate 1 */}
          <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900">John Doe</h4>
              <p className="text-sm text-slate-500">Party A</p>
            </div>
            <button onClick={handleVoteCast} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold">
              Cast Vote
            </button>
          </div>

          {/* Mock Candidate 2 */}
          <div className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900">Jane Smith</h4>
              <p className="text-sm text-slate-500">Party B</p>
            </div>
            <button onClick={handleVoteCast} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold">
              Cast Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenVote;
