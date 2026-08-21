import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const VoteSuccess = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full space-y-6">
        <div className="flex justify-center">
          <FiCheckCircle className="text-7xl text-emerald-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 font-serif">Vote Recorded Successfully</h1>
          <p className="text-sm text-slate-500">
            Your ballot has been encrypted and securely added to the state election ledger. 
            A cryptographic receipt has been sent to your registered email.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
          <Link to="/citizen/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors">
            Return to Dashboard
          </Link>
          <Link to="/citizen/history" className="text-blue-600 font-semibold text-sm hover:underline">
            View Voting History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoteSuccess;
