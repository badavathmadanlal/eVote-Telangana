import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiShield, 
  FiPrinter, 
  FiDownload,
  FiArrowRight, 
  FiClock, 
  FiMapPin, 
  FiFileText,
  FiAward
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { generateVotingReceiptPdf } from '../../utils/generateVotingReceiptPdf';

const VoteSuccess = () => {
  const location = useLocation();
  const { user } = useAuth();
  const stateData = location.state || {};

  const state = stateData.state || user?.state || 'Telangana';
  const district = stateData.district || user?.district || 'Hyderabad';
  const mandal = stateData.mandal || user?.mandal || 'Musheerabad';
  const village = stateData.village || user?.village || mandal || 'Demo Village';
  const electionTitle = stateData.electionTitle || `${state} State Assembly Demo Election 2026`;
  const constituency = stateData.constituency || user?.constituency || '057-Musheerabad';
  const referenceNumber = stateData.referenceNumber || `TEL-DEMO-VOTE-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = stateData.votedAt 
    ? new Date(stateData.votedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    generateVotingReceiptPdf({
      referenceNumber,
      electionTitle,
      state,
      district,
      mandal,
      village,
      constituency,
      votedAt: stateData.votedAt || new Date(),
      status: 'VOTE RECORDED',
      epicNumber: user?.epicNumber || 'DEMO-TEL-001',
      electionStatus: 'ACTIVE'
    });
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 w-full space-y-6 text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-sm">
          <FiCheckCircle />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <MdAccountBalance className="text-amber-600" />
            <span>State Election Commission • eVote {state}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Vote Recorded Successfully
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your encrypted ballot transaction has been verified and committed to the state voting ledger.
          </p>
        </div>

        {/* Cryptographic Receipt Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Election Event</span>
            <span className="font-bold text-slate-900 text-right">{electionTitle}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Jurisdiction</span>
            <span className="font-bold text-slate-900">{constituency}, {district}, {state}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Timestamp</span>
            <span className="font-mono font-bold text-slate-700">{dateStr}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Receipt Reference</span>
            <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 text-xs">
              {referenceNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Electoral Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <FiCheckCircle size={13} /> VOTE RECORDED
            </span>
          </div>
        </div>

        {/* Strict Secrecy Banner */}
        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 text-xs text-center font-medium leading-relaxed">
          <FiShield className="inline-block text-amber-600 mr-1 text-sm mb-0.5" />
          <span>This receipt confirms participation only. It does not reveal the candidate selected.</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <FiDownload /> Download Voting Receipt
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <FiPrinter /> Print Receipt
          </button>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <Link to="/citizen/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            ← Citizen Dashboard
          </Link>
          <Link to="/citizen/history" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
            View Voting History →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VoteSuccess;
