import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getElectionById } from '../../services/electionService';
import { getCandidatesByElection } from '../../services/candidateService';
import { castVote } from '../../services/voteService';
import { useAuth } from '../../hooks/useAuth';
import ElectoralJurisdictionCard from '../../components/common/ElectoralJurisdictionCard';
import CandidateSymbol from '../../components/common/CandidateSymbol';
import toast from 'react-hot-toast';
import { 
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiArrowLeft, 
  FiArrowRight, 
  FiLock,
  FiUser,
  FiAward
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const CitizenVote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchBallotData();
  }, [id]);

  const fetchBallotData = async () => {
    try {
      setLoading(true);
      const [elecRes, candRes] = await Promise.all([
        getElectionById(id),
        getCandidatesByElection(id)
      ]);

      if (elecRes) {
        const elec = elecRes.data?.election || elecRes.election || (elecRes.data && !elecRes.data.election ? elecRes.data : elecRes);
        setElection(elec);
      }

      if (candRes) {
        const list = candRes.data?.candidates || candRes.candidates || (Array.isArray(candRes.data) ? candRes.data : (Array.isArray(candRes) ? candRes : []));
        setCandidates(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      toast.error('Failed to load ballot candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = (candId) => {
    setSelectedCandidateId(candId);
  };

  const handleReviewClick = () => {
    if (!selectedCandidateId) {
      toast.error('Please select a candidate before proceeding');
      return;
    }
    setShowReviewModal(true);
  };

  const handleConfirmVote = async () => {
    try {
      setSubmitting(true);
      const res = await castVote({
        electionId: id,
        candidateId: selectedCandidateId
      });

      const receipt = res.data?.vote || res.data || res.vote || {};
      toast.success('Ballot encrypted and cast successfully!');
      
      const st = election?.state || receipt.state || user?.state || 'Telangana';
      const ref = receipt.referenceNumber || `${st.slice(0, 2).toUpperCase()}-DEMO-VOTE-${Math.floor(100000 + Math.random() * 900000)}`;

      navigate('/citizen/vote-success', {
        state: {
          electionTitle: election?.title || receipt.electionTitle || `${st} State Assembly Election 2026`,
          state: st,
          district: user?.district || 'Capital District',
          mandal: user?.mandal || 'Locality Mandal',
          village: user?.village || 'Locality Center',
          constituency: election?.constituency || receipt.constituency || user?.constituency || 'Assembly Segment',
          referenceNumber: ref,
          votedAt: receipt.votedAt || new Date().toISOString()
        }
      });
    } catch (err) {
      toast.error(err.message || 'Failed to submit vote. You may have already voted or your KYC is pending.');
      setShowReviewModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCandidate = candidates.find(c => (c._id || c.id) === selectedCandidateId);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 max-w-4xl mx-auto shadow-sm">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium text-slate-500">Decrypting digital ballot terminal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link 
        to="/citizen/elections" 
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <FiArrowLeft /> Back to Active Elections
      </Link>

      {/* 1. Verified Electoral Jurisdiction Block */}
      <ElectoralJurisdictionCard 
        user={user} 
        title="YOUR VERIFIED ELECTORAL JURISDICTION" 
      />

      {/* 2. Terminal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <FiShield />
            <span>Encrypted Remote Voting Terminal • 256-bit TLS</span>
          </div>
          <h1 className="text-2xl font-black font-serif">
            {election?.title || 'State Assembly Election 2026'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Constituency: <strong className="text-amber-400 font-mono">{election?.constituency || user?.constituency}</strong> | State: <strong>{election?.state || user?.state || 'Telangana'}</strong>
          </p>
        </div>

        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold font-mono">
          Single Ballot Session
        </div>
      </div>

      {/* 3. Candidate Selection List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">OFFICIAL CANDIDATE BALLOT</h2>
          <p className="text-xs text-slate-500 mt-0.5">Select exactly one candidate to cast your democratic vote.</p>
        </div>

        <div className="space-y-3">
          {candidates.map((cand) => {
            const candId = cand._id || cand.id;
            const isSelected = selectedCandidateId === candId;

            return (
              <div
                key={candId}
                onClick={() => handleSelectCandidate(candId)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Radio Indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Visual Symbol Badge (Replaces alphabet placeholder across all 6 states) */}
                  <CandidateSymbol symbol={cand.partySymbol} size={30} />

                  {/* Candidate Info */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cand.fullName}</h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">{cand.partyName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Symbol: <strong className="text-slate-700">{cand.partySymbol}</strong>
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {selectedCandidate ? '1 Candidate Selected' : 'No candidate selected'}
          </p>

          <button
            type="button"
            onClick={handleReviewClick}
            disabled={!selectedCandidateId}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Review & Confirm Ballot</span>
            <FiArrowRight />
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-3">
                <MdHowToVote />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Review Your Ballot Choice</h3>
              <p className="text-xs text-slate-500">Please confirm your candidate selection before final encryption.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <strong className="text-slate-900">{selectedCandidate.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Political Party:</span>
                <span className="font-semibold text-blue-700">{selectedCandidate.partyName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Party Symbol:</span>
                <div className="flex items-center gap-2">
                  <CandidateSymbol symbol={selectedCandidate.partySymbol} size={18} className="w-7 h-7" />
                  <span className="font-bold text-slate-800">{selectedCandidate.partySymbol}</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Constituency:</span>
                <span className="font-mono font-bold text-slate-800">{election?.constituency || user?.constituency}</span>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
              <FiAlertCircle className="text-amber-600 text-sm shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Your vote cannot be changed after confirmation. The encrypted transaction is final.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Change Selection
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? 'Encrypting Vote...' : 'Confirm & Cast Vote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenVote;
