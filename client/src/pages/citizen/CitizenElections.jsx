import React, { useState, useEffect } from 'react';
import { getElections } from '../../services/electionService';
import { getProfile } from '../../services/citizenService';
import { getMyVotes } from '../../services/voteService';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiArrowRight, 
  FiSearch, 
  FiShield, 
  FiLock, 
  FiRefreshCw 
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import ElectoralJurisdictionCard from '../../components/common/ElectoralJurisdictionCard';

const STATUS_TABS = ['ACTIVE', 'UPCOMING', 'COMPLETED'];

const CitizenElections = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [elections, setElections] = useState([]);
  const [votedElectionIds, setVotedElectionIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  const userState = profile?.state || user?.state || 'Telangana';
  const userConstituency = profile?.constituency || user?.constituency || '057-Musheerabad';
  const isKycVerified = Boolean(user?.isKycVerified || profile?.isKycVerified || profile?.isVerified || profile?.status === 'verified');

  useEffect(() => {
    fetchData();
  }, [userState]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [elecRes, profRes, votesRes] = await Promise.all([
        getElections({ state: userState }).catch(() => null),
        getProfile().catch(() => null),
        getMyVotes().catch(() => null)
      ]);

      if (profRes && profRes.data && profRes.data.profile) {
        setProfile(profRes.data.profile);
      }

      if (votesRes) {
        const rawList = Array.isArray(votesRes?.data?.votes)
          ? votesRes.data.votes
          : Array.isArray(votesRes?.votes)
          ? votesRes.votes
          : Array.isArray(votesRes?.data)
          ? votesRes.data
          : Array.isArray(votesRes)
          ? votesRes
          : [];

        const idSet = new Set();
        rawList.forEach((v) => {
          // Strictly extract the actual target election ID
          const eId = v.electionId?._id || v.electionId;
          if (eId && typeof eId === 'string' && eId.trim()) {
            idSet.add(eId.trim());
          } else if (eId && eId.toString) {
            idSet.add(eId.toString());
          }
        });
        setVotedElectionIds(idSet);
      } else {
        setVotedElectionIds(new Set());
      }

      if (elecRes) {
        const val = elecRes;
        const list = val?.data?.elections || val?.elections || (Array.isArray(val?.data) ? val.data : (Array.isArray(val) ? val : []));
        setElections(Array.isArray(list) ? list : []);
      } else {
        setElections([]);
      }
    } catch (err) {
      setElections([]);
      setVotedElectionIds(new Set());
      setLoadError('Unable to load elections. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const activeElections = elections.filter(e => (e.status || '').toUpperCase() === 'ACTIVE');
  const upcomingElections = elections.filter(e => (e.status || '').toUpperCase() === 'UPCOMING');
  const completedElections = elections.filter(e => ['COMPLETED', 'CLOSED'].includes((e.status || '').toUpperCase()));

  const currentTabList = 
    activeTab === 'ACTIVE' ? activeElections :
    activeTab === 'UPCOMING' ? upcomingElections : completedElections;

  const filteredElections = currentTabList.filter(el => {
    const title = el.title || '';
    const elecConstituency = el.constituency || '';
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || elecConstituency.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 1. Electoral Jurisdiction Card */}
      <ElectoralJurisdictionCard 
        user={profile || user} 
        title="YOUR REGISTERED ELECTORAL JURISDICTION" 
      />

      {/* 2. Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-600 text-sm" />
            <span>State Election Commission • eVote {userState}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">
            {userState} Scheduled & Active Elections
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Elections scheduled for your registered constituency (<strong className="text-slate-800">{userConstituency}</strong>) and state assembly segments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isKycVerified ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0">
              <FiCheckCircle className="text-emerald-600" />
              <span>Voting Access Unlocked</span>
            </div>
          ) : (
            <Link
              to="/citizen/verification"
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors"
            >
              <FiAlertCircle className="text-amber-600" />
              <span>Verify KYC to Vote</span>
            </Link>
          )}
        </div>
      </div>

      {/* 3. Status Tabs & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>ACTIVE ({activeElections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'UPCOMING'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>UPCOMING ({upcomingElections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>COMPLETED ({completedElections.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search elections..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Elections Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Loading {userState} elections...</p>
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-2xl p-12 border border-red-200 text-center space-y-4 shadow-sm">
          <FiAlertCircle className="text-3xl text-red-500 mx-auto" />
          <p className="text-sm font-medium text-slate-700">{loadError}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            <FiRefreshCw /> Retry
          </button>
        </div>
      ) : filteredElections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredElections.map((elec) => {
            const elecId = (elec._id || elec.id || '').toString();
            const isUserConstituency = elec.constituency === userConstituency;
            const isTabActive = (elec.status || '').toUpperCase() === 'ACTIVE';
            const isTabUpcoming = (elec.status || '').toUpperCase() === 'UPCOMING';
            const hasVotedInThisElection = Boolean(elecId && votedElectionIds.has(elecId));

            const startStr = elec.startDate ? new Date(elec.startDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'TBA';

            const endStr = elec.endDate ? new Date(elec.endDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'TBA';

            return (
              <div
                key={elecId}
                className={`bg-white rounded-2xl p-6 border transition-all shadow-sm flex flex-col justify-between space-y-5 ${
                  hasVotedInThisElection
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                    : isUserConstituency && isTabActive
                    ? 'border-blue-500 ring-2 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isTabActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : isTabUpcoming
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {elec.status || 'ACTIVE'}
                    </span>

                    {hasVotedInThisElection ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1 border border-emerald-300">
                        <FiCheckCircle size={11} className="text-emerald-700" /> Vote Recorded
                      </span>
                    ) : isUserConstituency ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-300">
                        <FiCheckCircle size={10} /> Your Registered Constituency
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">
                        State Assembly Segment
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {elec.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {elec.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <FiMapPin size={12} /> Constituency
                      </span>
                      <strong className="text-slate-800 font-mono">{elec.constituency}</strong>
                    </div>

                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <FiCalendar size={12} /> Timeline
                      </span>
                      <span className="text-slate-700 font-medium">{startStr} – {endStr}</span>
                    </div>

                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <MdAccountBalance size={12} /> Type
                      </span>
                      <span className="text-slate-700 font-medium">{elec.electionType || 'General Poll'}</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Per-Election Independent Action State */}
                <div className="pt-2">
                  {isTabActive ? (
                    hasVotedInThisElection ? (
                      <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-default">
                        <FiCheckCircle className="text-emerald-600 text-sm shrink-0" />
                        <span>✓ Vote Already Cast</span>
                      </div>
                    ) : isKycVerified ? (
                      <Link
                        to={`/citizen/vote/${elecId}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MdHowToVote className="text-base" />
                        <span>Proceed to Ballot</span>
                        <FiArrowRight />
                      </Link>
                    ) : (
                      <Link
                        to="/citizen/verification"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FiShield className="text-base" />
                        <span>Complete KYC to Vote</span>
                        <FiArrowRight />
                      </Link>
                    )
                  ) : isTabUpcoming ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-xs text-blue-800 font-medium flex items-center justify-center gap-1.5 cursor-default">
                      <FiClock /> Scheduled — Polling Opens on {startStr}
                    </div>
                  ) : (
                    <Link
                      to="/results"
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Results</span>
                      <FiArrowRight />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-3 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            <MdHowToVote />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No {activeTab} Elections Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            There are currently no {activeTab.toLowerCase()} polling events matching your query in {userState}.
          </p>
        </div>
      )}

      {/* Security Info Strip */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <FiLock className="text-blue-600 shrink-0" />
          <span>Electoral authorization is verified cryptographically by the State Election Commission.</span>
        </div>
      </div>
    </div>
  );
};

export default CitizenElections;
