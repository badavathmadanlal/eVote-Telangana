import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getElectionById } from '../../services/electionService';
import { getCandidatesByElection } from '../../services/candidateService';
import { hasVoted } from '../../services/voteService';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiUser, 
  FiShield, 
  FiArrowLeft,
  FiAward,
  FiInfo
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const CitizenElectionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [electionRes, candidatesRes] = await Promise.allSettled([
        getElectionById(id),
        getCandidatesByElection(id)
      ]);

      if (electionRes.status === 'fulfilled' && electionRes.value?.data?.election) {
        setElection(electionRes.value.data.election);
      } else if (electionRes.status === 'fulfilled' && electionRes.value?.data) {
        setElection(electionRes.value.data);
      }

      if (candidatesRes.status === 'fulfilled' && Array.isArray(candidatesRes.value?.data?.candidates)) {
        setCandidates(candidatesRes.value.data.candidates);
      } else if (candidatesRes.status === 'fulfilled' && Array.isArray(candidatesRes.value?.data)) {
        setCandidates(candidatesRes.value.data);
      }

      try {
        const votedRes = await hasVoted(id);
        if (votedRes && (votedRes.data?.hasVoted || votedRes.hasVoted)) {
          setAlreadyVoted(true);
        }
      } catch (e) {
        // ignore check error
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const title = election?.title || 'State Assembly Election 2026';
  const constituency = election?.constituency || user?.constituency || '057-Musheerabad';
  const description = election?.description || 'Official democratic election conducted under the authority of the State Election Commission.';
  const startDate = election?.startDate ? new Date(election.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Polling Open';
  const endDate = election?.endDate ? new Date(election.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Scheduled';
  const isEligible = user?.isKycVerified && (user?.constituency === election?.constituency);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link 
        to="/citizen/elections" 
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <FiArrowLeft /> Back to Elections Directory
      </Link>

      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <MdAccountBalance className="text-amber-600 text-sm" />
              <span>State Election Commission • Certified Polling Event</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-serif">{title}</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shadow-xs">
              ● Active Polling
            </span>
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <FiMapPin className="text-amber-600 text-base shrink-0" />
            <span>Constituency: <strong>{constituency}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FiCalendar className="text-blue-600 text-base shrink-0" />
            <span>Schedule: <strong>{startDate} – {endDate}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FiShield className="text-emerald-600 text-base shrink-0" />
            <span>Security: <strong>256-bit TLS Encrypted</strong></span>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Contesting Candidates</h2>
            <p className="text-xs text-slate-500">Official candidates nominated for this constituency</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {candidates.length > 0 ? `${candidates.length} Nominated` : 'Nomination Roll'}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading candidate profiles...</div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates.map((cand, idx) => (
              <div key={cand._id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                      {(cand.fullName || cand.name)?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cand.fullName || cand.name}</h4>
                      <p className="text-xs text-blue-700 font-semibold">{cand.partyName || cand.party || 'Independent'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {cand.partySymbol || cand.symbol}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                  "{cand.manifesto || 'Focus on citizen infrastructure, digital governance, and local welfare.'}"
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                  <span>Demo Candidate</span>
                  <span>Elector Roll Certified</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            Candidate nominations are certified by the Returning Officer. Full candidate list will be displayed here for voting.
          </div>
        )}
      </div>

      {/* Voting Action Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800 text-center space-y-4">
        {alreadyVoted ? (
          <div className="space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
              <FiCheckCircle />
            </div>
            <h3 className="text-xl font-bold font-serif text-white">Ballot Already Cast</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your secret ballot has already been recorded on the immutable election ledger for this event.
            </p>
            <Link
              to="/citizen/history"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors mt-2"
            >
              View Voting Audit Record
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-blue-600/30 text-blue-400 border border-blue-400/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
              <MdHowToVote />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-white">Ready to Cast Your Encrypted Vote?</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                By entering the voting booth terminal, your identity is verified and detached from your candidate selection using cryptographic privacy protocols.
              </p>
            </div>
            <div>
              <Link
                to={`/citizen/elections/${id}/vote`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-8 rounded-xl text-sm transition-transform hover:scale-105 shadow-lg"
              >
                <MdHowToVote className="text-lg" /> Enter Secure Voting Booth
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenElectionDetails;
