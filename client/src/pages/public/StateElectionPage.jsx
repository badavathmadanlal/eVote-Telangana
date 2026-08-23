import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStateById, STATES_DATA } from '../../constants/statesData';
import { getElections } from '../../services/electionService';
import api from '../../services/api';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiClock, 
  FiArrowRight, 
  FiArrowLeft,
  FiUsers, 
  FiShield, 
  FiInfo,
  FiAward,
  FiCalendar,
  FiFileText,
  FiBell
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const STATUS_TABS = ['ACTIVE', 'UPCOMING', 'COMPLETED'];

const StateElectionPage = () => {
  const { stateId } = useParams();
  const stateData = getStateById(stateId) || STATES_DATA[0];

  const [elections, setElections] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStateData();
  }, [stateId]);

  const fetchStateData = async () => {
    try {
      setLoading(true);
      const [elecRes, announceRes] = await Promise.allSettled([
        getElections({ state: stateData.name }),
        api.get(`/announcements?state=${encodeURIComponent(stateData.name)}`)
      ]);

      if (elecRes.status === 'fulfilled') {
        const val = elecRes.value;
        const list = val?.data?.elections || val?.elections || (Array.isArray(val?.data) ? val.data : (Array.isArray(val) ? val : []));
        setElections(Array.isArray(list) ? list : []);
      } else {
        setElections([]);
      }

      if (announceRes.status === 'fulfilled') {
        const val = announceRes.value;
        const list = val?.data?.announcements || val?.data?.data?.announcements || val?.announcements || (Array.isArray(val?.data) ? val.data : (Array.isArray(val) ? val : []));
        setAnnouncements(Array.isArray(list) ? list : []);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      setElections([]);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const activeElections = elections.filter(e => (e.status || '').toUpperCase() === 'ACTIVE');
  const upcomingElections = elections.filter(e => (e.status || '').toUpperCase() === 'UPCOMING');
  const completedElections = elections.filter(e => ['COMPLETED', 'CLOSED'].includes((e.status || '').toUpperCase()));

  const tabElections = 
    activeTab === 'ACTIVE' ? activeElections :
    activeTab === 'UPCOMING' ? upcomingElections : completedElections;

  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            to="/elections"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FiArrowLeft /> Back to All State Portals
          </Link>
        </div>

        {/* State Banner */}
        <div className="bg-[#0a1428]/90 p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <MdAccountBalance className="text-base" />
              <span>{stateData.commission || stateData.electionCommission}</span>
            </div>
            <h1 className="text-3xl font-black text-white font-serif">
              eVote {stateData.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {stateData.description} (Capital: <strong className="text-white">{stateData.capital}</strong>)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <MdHowToVote className="text-base" /> Citizen Voter Login
            </Link>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 backdrop-blur-xs">
          <FiInfo className="text-amber-400 text-lg shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-mono font-bold uppercase tracking-wider text-[11px] text-amber-300">
              FINAL YEAR PROJECT DEMO — Simulated State Data
            </p>
            <p className="text-amber-200/90 leading-relaxed">
              All election events, candidate manifests, and constituency turnout figures for {stateData.name} are simulated data models created for academic demonstration.
            </p>
          </div>
        </div>

        {/* State Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0a1428]/80 p-5 rounded-2xl border border-slate-800 shadow-sm text-center">
            <p className="text-xs font-semibold text-slate-400">Total Constituencies</p>
            <p className="text-2xl font-black text-white mt-1">{stateData.constituencies?.length || 5}</p>
          </div>

          <div className="bg-[#0a1428]/80 p-5 rounded-2xl border border-slate-800 shadow-sm text-center">
            <p className="text-xs font-semibold text-slate-400">Active Polling Events</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeElections.length || 3}</p>
          </div>

          <div className="bg-[#0a1428]/80 p-5 rounded-2xl border border-slate-800 shadow-sm text-center">
            <p className="text-xs font-semibold text-slate-400">Upcoming Elections</p>
            <p className="text-2xl font-black text-blue-400 mt-1">{upcomingElections.length || 1}</p>
          </div>

          <div className="bg-[#0a1428]/80 p-5 rounded-2xl border border-slate-800 shadow-sm text-center">
            <p className="text-xs font-semibold text-slate-400">Completed Sessions</p>
            <p className="text-2xl font-black text-purple-400 mt-1">{completedElections.length || 1}</p>
          </div>
        </div>

        {/* State-Scoped Scheduled Elections & Tabs */}
        <div className="bg-[#0a1428]/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-serif">
                {stateData.name} State Election Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Gazetted assembly and local civic elections for {stateData.name}
              </p>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-[#050b1a] p-1 rounded-xl border border-slate-800">
              {STATUS_TABS.map(tab => {
                const count = tab === 'ACTIVE' ? activeElections.length : tab === 'UPCOMING' ? upcomingElections.length : completedElections.length;
                const isSelected = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Election Cards */}
          {loading ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Querying {stateData.name} election records...</p>
            </div>
          ) : tabElections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabElections.map((elec, idx) => {
                const id = elec._id || idx;
                const status = (elec.status || 'ACTIVE').toUpperCase();
                const startDate = elec.startDate ? new Date(elec.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Open';
                const endDate = elec.endDate ? new Date(elec.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Scheduled';

                return (
                  <div
                    key={id}
                    className="bg-[#050b1a] rounded-2xl border border-slate-800 p-5 hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : status === 'UPCOMING'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          ● {status}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-400">
                          {elec.constituency}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white leading-snug font-serif">
                        {elec.title}
                      </h3>

                      <div className="text-xs text-slate-400 space-y-1 pt-1">
                        <div className="flex items-center gap-1.5">
                          <FiClock className="text-blue-400 shrink-0 text-xs" />
                          <span>Timeline: {startDate} – {endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiMapPin className="text-amber-400 shrink-0 text-xs" />
                          <span>State: {stateData.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      {status === 'ACTIVE' ? (
                        <Link
                          to="/login"
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <MdHowToVote size={14} /> Login to Vote
                        </Link>
                      ) : status === 'UPCOMING' ? (
                        <Link
                          to="/login"
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FiCalendar size={13} /> View Election Details
                        </Link>
                      ) : (
                        <Link
                          to="/results"
                          className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <FiCheckCircle size={13} /> View Results
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No {activeTab.toLowerCase()} elections found for {stateData.name}.
            </div>
          )}
        </div>

        {/* State Assembly Constituencies */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-serif">
              {stateData.name} Assembly Constituencies
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {stateData.constituencies.length} Assembly Segments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stateData.constituencies.map((c) => (
              <div
                key={c.id}
                className="bg-[#0a1428]/80 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {c.name}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{c.district}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mandal / Taluka:</span>
                    <span className="font-semibold text-white">{c.mandal || c.name.split('-')[1] || c.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Locality:</span>
                    <span className="font-semibold text-white">{c.village || 'Locality Center'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Electors:</span>
                    <span className="font-bold text-amber-400">{typeof c.registeredVoters === 'number' ? c.registeredVoters.toLocaleString() : c.registeredVoters}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State-Aware Official Announcements */}
        <div className="bg-[#0a1428]/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                <FiBell className="text-amber-400" />
                <span>{stateData.name} State Announcements</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official gazette notifications and electoral alerts for {stateData.name}
              </p>
            </div>
            <Link
              to="/announcements"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Announcements →
            </Link>
          </div>

          {announcements.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {announcements.slice(0, 4).map((ann, idx) => {
                const dateObj = ann.updatedAt ? new Date(ann.updatedAt) : (ann.createdAt ? new Date(ann.createdAt) : new Date());
                const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

                return (
                  <div key={ann._id || idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
                          {ann.category || 'ELECTION UPDATE'}
                        </span>
                        <h4 className="font-bold text-sm text-white">{ann.title}</h4>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0 text-right">
                        Updated: {dateStr}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ann.content || ann.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">No active announcements for {stateData.name}.</p>
          )}
        </div>

        {/* State Electoral Guidelines */}
        <div className="bg-[#0a1428]/80 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <FiShield className="text-blue-400" />
            <span>{stateData.name} State Election Guidelines & Voter Eligibility</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-1.5 p-4 rounded-xl bg-[#050b1a] border border-slate-800">
              <p className="font-bold text-white">1. Citizen Identity Verification</p>
              <p>Electors must be verified on the digital electoral roll via Demo KYC before ballots are unlocked.</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#050b1a] border border-slate-800">
              <p className="font-bold text-white">2. Constituency Scoping</p>
              <p>Voters can only access candidate ballots corresponding to their registered assembly constituency.</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#050b1a] border border-slate-800">
              <p className="font-bold text-white">3. Immutable Ballot Secrecy</p>
              <p>Votes are anonymously detached from citizen accounts. Voting history confirms participation only.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StateElectionPage;
