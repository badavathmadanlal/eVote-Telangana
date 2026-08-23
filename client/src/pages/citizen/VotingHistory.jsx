import React, { useState, useEffect } from 'react';
import { getMyVotes } from '../../services/voteService';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiClock, 
  FiShield, 
  FiFileText, 
  FiCopy, 
  FiDownload,
  FiPrinter,
  FiExternalLink, 
  FiAlertCircle, 
  FiCalendar, 
  FiMapPin,
  FiX
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { generateVotingReceiptPdf } from '../../utils/generateVotingReceiptPdf';

const VotingHistory = () => {
  const { user } = useAuth();
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const res = await getMyVotes();
      if (res && res.success && Array.isArray(res.data?.votes)) {
        setVotes(res.data.votes);
      } else if (res && Array.isArray(res.data)) {
        setVotes(res.data);
      } else if (Array.isArray(res)) {
        setVotes(res);
      } else {
        setVotes([]);
      }
    } catch (err) {
      setVotes([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Digital receipt reference copied to clipboard');
  };

  const downloadReceipt = (v) => {
    const state = v.state || user?.state || 'Telangana';
    const refNum = v.referenceNumber || `TEL-DEMO-VOTE-${v._id?.slice(-6).toUpperCase() || 'DEMO'}`;

    generateVotingReceiptPdf({
      referenceNumber: refNum,
      electionTitle: v.electionTitle || `${state} State Assembly Election 2026`,
      state,
      district: user?.district || 'Hyderabad',
      mandal: user?.mandal || 'Musheerabad',
      village: user?.village || 'Demo Village',
      constituency: v.constituency || user?.constituency || '057-Musheerabad',
      votedAt: v.votedAt || new Date(),
      status: 'VOTE RECORDED',
      epicNumber: user?.epicNumber || 'DEMO-TEL-001',
      electionStatus: 'COMPLETED'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-600 text-sm" />
            <span>State Election Commission • Immutable Ledger Records</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">Voting Audit History</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View certified proof of your democratic participation and cryptographic ballot receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
          <FiShield className="text-blue-600" />
          <span>Ledger Certified</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            <MdHowToVote />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Ballots Cast</p>
            <p className="text-2xl font-black text-slate-900">{votes.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Electoral Status</p>
            <p className="text-sm font-bold text-emerald-600">Active Elector</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
            <FiShield />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Ballot Secrecy</p>
            <p className="text-sm font-bold text-purple-600">Zero-Knowledge Proof</p>
          </div>
        </div>
      </div>

      {/* History Ledger List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Querying immutable voting ledger...</p>
        </div>
      ) : votes.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 font-serif">Certified Participation History</h2>
            <span className="text-xs text-slate-500 font-medium">{votes.length} Record(s) Found</span>
          </div>

          <div className="divide-y divide-slate-100">
            {votes.map((vote, idx) => {
              const electionTitle = vote.electionTitle || vote.electionId?.title || 'State Assembly Election 2026';
              const constituency = vote.constituency || user?.constituency || '057-Musheerabad';
              const dateStr = vote.votedAt ? new Date(vote.votedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recorded in Session';
              const refNum = vote.referenceNumber || `TEL-DEMO-VOTE-${(vote._id || 'DEMO').slice(-6).toUpperCase()}`;

              return (
                <div key={vote._id || idx} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 mt-0.5 border border-emerald-200">
                      <FiCheckCircle />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-slate-900">{electionTitle}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiMapPin className="text-amber-600" /> {constituency}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="text-blue-600" /> {dateStr}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-600">
                        <span className="text-slate-400">Receipt:</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-blue-700 font-bold">{refNum}</span>
                        <button
                          onClick={() => copyToClipboard(refNum)}
                          className="text-slate-400 hover:text-blue-600 p-0.5 transition-colors"
                          title="Copy Receipt Hash"
                        >
                          <FiCopy size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                      Recorded
                    </span>
                    <button
                      onClick={() => downloadReceipt({ ...vote, electionTitle, constituency, dateStr, referenceNumber: refNum })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-xs"
                      title="Download certified PDF receipt"
                    >
                      <FiDownload size={12} /> Download PDF
                    </button>
                    <button
                      onClick={() => setSelectedReceipt({ ...vote, electionTitle, constituency, dateStr, referenceNumber: refNum })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Clean Professional Empty State */
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            <MdHowToVote />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">No voting activity recorded yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              You have not cast any votes in current or past elections yet. Once you participate in an active election in your constituency, your certified cryptographic ballot receipt will appear here.
            </p>
          </div>

          <div className="pt-3">
            <Link
              to="/citizen/elections"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm"
            >
              <MdHowToVote className="text-sm" /> Browse Active Elections
            </Link>
          </div>
        </div>
      )}

      {/* Secrecy Guarantee Disclaimer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <FiShield /> Secret Ballot Integrity & Elector Privacy Guarantee
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Voting history confirms participation only. Candidate selection remains confidential. Under secure digital polling protocols, your vote transaction timestamp and participation receipt are cryptographically detached from your elector identity.
        </p>
      </div>

      {/* Modal: Digital Receipt Slip */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <FiX size={18} />
            </button>

            {/* Slip Header */}
            <div className="text-center space-y-1 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2">
                <FiCheckCircle />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Electronic Ballot Receipt</h3>
              <p className="text-[11px] text-slate-500">State Election Commission • Participation Proof</p>
            </div>

            {/* Slip Body */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Election Event:</span>
                <span className="font-bold text-slate-800 text-right">{selectedReceipt.electionTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Constituency:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.constituency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Cast Timestamp:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.dateStr}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Participation Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle size={12} /> VOTE RECORDED
                </span>
              </div>
              <div className="py-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block mb-1">Receipt Reference:</span>
                <span className="font-mono text-xs text-blue-700 font-bold break-all">{selectedReceipt.referenceNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => downloadReceipt(selectedReceipt)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FiDownload size={13} /> Download PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingHistory;
