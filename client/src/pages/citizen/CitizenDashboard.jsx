import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../services/citizenService';
import { getActiveElection } from '../../services/electionService';
import { getMyVotes } from '../../services/voteService';
import { Link } from 'react-router-dom';
import { 
  FiUserCheck, 
  FiShield, 
  FiBell, 
  FiChevronRight, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiMapPin 
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import ElectoralJurisdictionCard from '../../components/common/ElectoralJurisdictionCard';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [hasVotedInActive, setHasVotedInActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDemo = user?.isDemoAccount || user?.mobileNumber === '1234567890' || user?.mobileNumber === '1234567891';

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, elecRes, votesRes] = await Promise.all([
        getProfile().catch(() => null),
        getActiveElection({ constituency: user?.constituency || '057-Musheerabad' }).catch(() => null),
        getMyVotes().catch(() => null)
      ]);

      if (profRes && profRes.data && profRes.data.profile) {
        setProfile(profRes.data.profile);
      }

      let activeElecObj = null;
      if (elecRes && elecRes.data && elecRes.data.election) {
        activeElecObj = elecRes.data.election;
        setActiveElection(activeElecObj);
      }

      if (votesRes && activeElecObj) {
        const voteList = votesRes.data?.votes || votesRes.data || (Array.isArray(votesRes) ? votesRes : []);
        const activeId = (activeElecObj._id || activeElecObj.id || '').toString();
        const voted = voteList.some(v => (v.electionId?._id || v.electionId || v._id).toString() === activeId);
        setHasVotedInActive(voted);
      }
    } catch (err) {
      // safe fallback
    } finally {
      setLoading(false);
    }
  };

  const isKycVerified = Boolean(user?.isKycVerified || profile?.isKycVerified || profile?.isVerified || profile?.status === 'verified');
  const constituency = profile?.constituency || user?.constituency || '057-Musheerabad';
  const userState = profile?.state || user?.state || 'Telangana';
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (profile?.name || user?.name || 'Citizen Voter');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-600 text-sm" />
            <span>State Election Commission • eVote {userState}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">Welcome back, {fullName}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered Constituency: <strong className="text-slate-800 font-semibold">{constituency}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0">
          <FiShield className="text-emerald-600" />
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-600">Session Security</p>
            <p className="text-xs font-bold font-mono">TLS 1.3 ENCRYPTED</p>
          </div>
        </div>
      </div>

      {/* Verified Electoral Jurisdiction */}
      <ElectoralJurisdictionCard user={profile || user} />

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Identity Verification Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${
              isKycVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {isKycVerified ? <FiCheckCircle /> : <FiUserCheck />}
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
              isKycVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isKycVerified ? 'Verified' : 'Pending'}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">Electoral KYC</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isKycVerified ? 'Authenticated on State Roll' : 'Pending Digital Verification'}
            </p>
          </div>

          {!isKycVerified ? (
            <Link 
              to="/citizen/verification" 
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-1 border-t border-slate-100"
            >
              Verify KYC Identity <FiChevronRight />
            </Link>
          ) : (
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1 border-t border-slate-100">
              <FiCheckCircle size={12} /> Ballot Access Granted
            </div>
          )}
        </div>

        {/* Voting Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              <MdHowToVote />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
              hasVotedInActive ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {hasVotedInActive ? 'Vote Cast' : 'Eligible'}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Ballot Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasVotedInActive ? 'Vote recorded on ledger' : 'Ballot available for polling'}
            </p>
          </div>

          <Link 
            to={hasVotedInActive ? '/citizen/history' : '/citizen/elections'} 
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 border-t border-slate-100"
          >
            {hasVotedInActive ? 'View Audit Receipt' : 'View Active Elections'} <FiChevronRight />
          </Link>
        </div>

        {/* Constituency Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              <FiMapPin />
            </div>
            <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded uppercase">
              Assigned
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">{constituency}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{profile?.district || user?.district || 'Capital District'} District, {userState}</p>
          </div>

          <Link 
            to="/citizen/profile" 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-1 border-t border-slate-100"
          >
            Voter Card Details <FiChevronRight />
          </Link>
        </div>

        {/* State Commission Portal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              <FiBell />
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase">
              State Roll
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">{userState} Portal</h3>
            <p className="text-xs text-slate-500 mt-0.5">Gazette Notices & Schedule</p>
          </div>

          <Link 
            to="/citizen/announcements" 
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 pt-1 border-t border-slate-100"
          >
            State Gazette <FiChevronRight />
          </Link>
        </div>

      </div>

      {/* Main Active Election Hero Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/80 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
            <MdHowToVote className="text-9xl text-white" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Active Election
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              {activeElection?.title || `${userState} State Assembly General Election 2026`}
            </h3>
            <p className="text-xs text-slate-300">
              Constituency: <strong className="text-amber-400 font-mono">{constituency}</strong> | State: <strong>{userState}</strong>
            </p>
          </div>

          <div className="relative z-10 pt-3">
            {hasVotedInActive ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <FiCheckCircle size={14} /> Vote Recorded for this Election
                </span>
                <Link
                  to="/citizen/history"
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-xl inline-flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <span>View Voting Receipt</span>
                  <FiChevronRight size={13} />
                </Link>
              </div>
            ) : isKycVerified ? (
              <Link
                to={activeElection ? `/citizen/vote/${activeElection._id}` : '/citizen/elections'}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-2.5 px-5 rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto cursor-pointer"
              >
                <MdHowToVote size={15} />
                <span>Proceed to Ballot</span>
                <FiChevronRight />
              </Link>
            ) : (
              <Link
                to="/citizen/verification"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto cursor-pointer"
              >
                <FiShield size={14} />
                <span>Complete Verification to Vote</span>
                <FiChevronRight />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Electoral Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
            <FiClock className="text-blue-600 text-base" /> Recent Activity Log
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="p-4 flex justify-between items-center text-slate-700">
              <div>
                <p className="font-semibold">Voter Portal Sign In</p>
                <p className="text-[11px] text-slate-400 font-mono">OTP Authenticated Session</p>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Active</span>
            </div>

            <div className="p-4 flex justify-between items-center text-slate-700">
              <div>
                <p className="font-semibold">Identity KYC Status</p>
                <p className="text-[11px] text-slate-400 font-mono">Electoral Roll Record</p>
              </div>
              <span className={`text-[11px] font-bold ${isKycVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isKycVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>

            <div className="p-4 flex justify-between items-center text-slate-700">
              <div>
                <p className="font-semibold">Constituency Allocation</p>
                <p className="text-[11px] text-slate-400 font-mono">{constituency}</p>
              </div>
              <span className="text-[11px] text-slate-500 font-bold">Assigned</span>
            </div>
          </div>
        </div>

        {/* Electoral Guidelines */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
            <FiShield className="text-amber-600 text-base" /> Electoral Safeguards & Ballot Privacy
          </div>
          <div className="p-5 space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <p><strong>Independent Active Voting:</strong> Every active election maintains its own independent voting status.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <p><strong>Ballot Secrecy:</strong> Vote transactions are cryptographically detached from voter identities to ensure confidentiality.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <p><strong>Audit Receipt:</strong> A digital cryptographic receipt is provided upon successful ballot submission without revealing candidate choice.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
