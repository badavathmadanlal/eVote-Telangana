import React, { useState, useEffect } from 'react';
import { getSummary, getRecent } from '../../services/dashboardService';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiCalendar, 
  FiClock, 
  FiShield, 
  FiTrendingUp, 
  FiArrowRight,
  FiRefreshCw,
  FiMapPin,
  FiAward
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, recRes] = await Promise.all([
        getSummary().catch(() => null),
        getRecent().catch(() => null)
      ]);

      if (sumRes && sumRes.data) {
        setSummary(sumRes.data);
      }
      if (recRes && recRes.data) {
        setRecent(recRes.data);
      }
    } catch (err) {
      // safe fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalRegistered = summary?.totalRegisteredVoters || summary?.totalUsers || 100;
  const verifiedVoters = summary?.verifiedVoters || summary?.verifiedCitizens || 68;
  const eligibleVoters = summary?.eligibleVoters || verifiedVoters;
  const votesCast = summary?.votesCast || summary?.totalVotes || 0;
  const remainingVoters = Math.max(0, eligibleVoters - votesCast);
  const turnoutPct = summary?.overallTurnout || (eligibleVoters > 0 ? ((votesCast / eligibleVoters) * 100).toFixed(1) : 0);
  const activeElections = summary?.activeElections || 6;
  const activeConstituencies = summary?.activeConstituencies || 30;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-400 text-sm" />
            <span>State Election Commission • Executive Command</span>
          </div>
          <h1 className="text-2xl font-black font-serif">ADMIN CONTROL CENTER</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time digital polling ledger metrics across multi-state legislative assemblies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Live Data</span>
          </button>
          
          <Link
            to="/admin/live-voting"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
          >
            <FiTrendingUp /> Live Monitor
          </Link>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Registered Voters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Registered Electors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base">
              <FiUsers />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalRegistered.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-mono">Fictional Demo Voters</p>
        </div>

        {/* Verified Voters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">KYC Verified</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
              <FiCheckCircle />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{verifiedVoters.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-mono">Eligible to Vote</p>
        </div>

        {/* Votes Cast */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Encrypted Ballots</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
              <MdHowToVote />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-700">{votesCast.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-mono">Votes Recorded</p>
        </div>

        {/* Overall Turnout */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Overall Turnout</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base">
              <FiTrendingUp />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{turnoutPct}%</p>
          <p className="text-[11px] text-slate-500 font-mono">{remainingVoters} Electors Remaining</p>
        </div>
      </div>

      {/* State-wise & Constituency-wise Turnout Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State-Wise Turnout */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">State-Wise Elector Participation</h2>
              <p className="text-[11px] text-slate-400">Simulated Assembly Turnout Metrics</p>
            </div>
            <span className="text-xs font-bold text-blue-600">6 States</span>
          </div>

          <div className="space-y-3.5">
            {(summary?.stateTurnout || [
              { stateName: 'Telangana', turnoutPercentage: 64.2, eligibleVoters: 24, votesCast: 15 },
              { stateName: 'Andhra Pradesh', turnoutPercentage: 58.0, eligibleVoters: 18, votesCast: 10 },
              { stateName: 'Delhi', turnoutPercentage: 52.5, eligibleVoters: 16, votesCast: 8 },
              { stateName: 'Tamil Nadu', turnoutPercentage: 61.1, eligibleVoters: 18, votesCast: 11 },
              { stateName: 'Maharashtra', turnoutPercentage: 45.0, eligibleVoters: 20, votesCast: 9 },
              { stateName: 'Assam', turnoutPercentage: 40.0, eligibleVoters: 15, votesCast: 6 },
            ]).map((st) => (
              <div key={st.stateName} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{st.stateName}</span>
                  <span className="font-mono font-bold text-slate-700">{st.turnoutPercentage}% ({st.votesCast} / {st.eligibleVoters} cast)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, st.turnoutPercentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constituency Roster & Active Elections */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Key Assembly Constituencies</h2>
              <p className="text-[11px] text-slate-400">Live Polling Status & Voter Allocation</p>
            </div>
            <Link to="/admin/elections" className="text-xs font-bold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {(summary?.constituencyTurnout?.slice(0, 5) || [
              { constituency: '057-Musheerabad', state: 'Telangana', turnoutPercentage: 75.0, votesCast: 6, eligibleVoters: 8 },
              { constituency: '059-Amberpet', state: 'Telangana', turnoutPercentage: 62.5, votesCast: 5, eligibleVoters: 8 },
              { constituency: '019-Vijayawada West', state: 'Andhra Pradesh', turnoutPercentage: 50.0, votesCast: 4, eligibleVoters: 8 },
              { constituency: '040-New Delhi', state: 'Delhi', turnoutPercentage: 42.8, votesCast: 3, eligibleVoters: 7 },
              { constituency: '011-Dr. Radhakrishnan Nagar', state: 'Tamil Nadu', turnoutPercentage: 66.6, votesCast: 4, eligibleVoters: 6 }
            ]).map((c) => (
              <div key={c.constituency} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{c.constituency}</p>
                  <p className="text-[11px] text-slate-400">{c.state}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600">{c.turnoutPercentage}% Turnout</span>
                  <p className="text-[10px] text-slate-400">{c.votesCast} votes recorded</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Cryptographic Audit Receipts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Recent Ledger Ballot Confirmations</h2>
            <p className="text-[11px] text-slate-400">Anonymous cryptographic receipt entries (Strict Ballot Secrecy Enforced)</p>
          </div>
          <Link to="/admin/live-voting" className="text-xs font-bold text-blue-600 hover:underline">
            Live Stream →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(recent?.recentVotes || [
            { referenceNumber: 'TEL-DEMO-VOTE-004921', constituency: '057-Musheerabad', electionTitle: 'Telangana Assembly 2026' },
            { referenceNumber: 'TEL-DEMO-VOTE-009124', constituency: '059-Amberpet', electionTitle: 'Telangana Assembly 2026' },
            { referenceNumber: 'TEL-DEMO-VOTE-002148', constituency: '019-Vijayawada West', electionTitle: 'Andhra Pradesh Assembly 2026' },
          ]).map((v, idx) => (
            <div key={v.referenceNumber || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {v.referenceNumber}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Committed</span>
              </div>
              <p className="font-semibold text-slate-800 truncate">{v.electionTitle}</p>
              <p className="text-[11px] text-slate-500 font-mono">Constituency: {v.constituency}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
