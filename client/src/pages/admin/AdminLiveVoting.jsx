import React, { useState, useEffect } from 'react';
import { getSummary, getRecent } from '../../services/dashboardService';
import { 
  FiTrendingUp, 
  FiRefreshCw, 
  FiShield, 
  FiClock, 
  FiMapPin, 
  FiCheckCircle, 
  FiUsers 
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const AdminLiveVoting = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 15000); // 15s auto-polling
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    try {
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
      setLastUpdated(new Date());
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const eligibleVoters = summary?.eligibleVoters || summary?.verifiedVoters || 68;
  const votesCast = summary?.votesCast || summary?.totalVotes || 0;
  const remainingVoters = Math.max(0, eligibleVoters - votesCast);
  const turnoutPct = summary?.overallTurnout || (eligibleVoters > 0 ? ((votesCast / eligibleVoters) * 100).toFixed(1) : 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Polling Telemetry • Auto-Synchronized</span>
          </div>
          <h1 className="text-2xl font-black font-serif">LIVE VOTING & TURNOUT MONITOR</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time digital ballot ingestion stream across active state assembly segments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-slate-400 font-mono hidden sm:block">
            <p>Last Sync: {lastUpdated.toLocaleTimeString()}</p>
            <p className="text-emerald-400 font-bold">15s Polling Active</p>
          </div>

          <button
            type="button"
            onClick={fetchLiveData}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <FiRefreshCw /> Refresh Now
          </button>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Eligible Electors</p>
          <p className="text-2xl font-black text-slate-900">{eligibleVoters}</p>
          <p className="text-[11px] text-slate-500 font-mono">KYC Authenticated</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Total Ballots Cast</p>
          <p className="text-2xl font-black text-blue-600">{votesCast}</p>
          <p className="text-[11px] text-emerald-600 font-bold font-mono">Ledger Committed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Remaining to Vote</p>
          <p className="text-2xl font-black text-slate-700">{remainingVoters}</p>
          <p className="text-[11px] text-slate-400 font-mono">Pending Session</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Total Turnout %</p>
          <p className="text-2xl font-black text-amber-600">{turnoutPct}%</p>
          <p className="text-[11px] text-slate-500 font-mono">Simulated Activity</p>
        </div>
      </div>

      {/* State Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-sm">State-Level Live Turnout Overview</h2>
          <span className="text-xs font-mono font-bold text-slate-500">6 Legislative Portals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(summary?.stateTurnout || [
            { stateName: 'Telangana', turnoutPercentage: 64.2, eligibleVoters: 24, votesCast: 15 },
            { stateName: 'Andhra Pradesh', turnoutPercentage: 58.0, eligibleVoters: 18, votesCast: 10 },
            { stateName: 'Delhi', turnoutPercentage: 52.5, eligibleVoters: 16, votesCast: 8 },
            { stateName: 'Tamil Nadu', turnoutPercentage: 61.1, eligibleVoters: 18, votesCast: 11 },
            { stateName: 'Maharashtra', turnoutPercentage: 45.0, eligibleVoters: 20, votesCast: 9 },
            { stateName: 'Assam', turnoutPercentage: 40.0, eligibleVoters: 15, votesCast: 6 },
          ]).map((st) => (
            <div key={st.stateName} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-xs">{st.stateName}</span>
                <span className="font-mono font-bold text-blue-700 text-xs">{st.turnoutPercentage}%</span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, st.turnoutPercentage))}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Votes: {st.votesCast}</span>
                <span>Eligible: {st.eligibleVoters}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Anonymous Ingestion Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="font-bold text-slate-900 text-sm">Live Anonymous Ballot Stream</h2>
            <p className="text-[11px] text-slate-400">Strict Ballot Secrecy — Voter identities and candidate choices are separated.</p>
          </div>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono">
            ● Streaming Active
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs font-mono">
          {(recent?.recentVotes || [
            { referenceNumber: 'TEL-DEMO-VOTE-004921', constituency: '057-Musheerabad', electionTitle: 'Telangana Assembly 2026' },
            { referenceNumber: 'TEL-DEMO-VOTE-009124', constituency: '059-Amberpet', electionTitle: 'Telangana Assembly 2026' },
            { referenceNumber: 'TEL-DEMO-VOTE-002148', constituency: '019-Vijayawada West', electionTitle: 'Andhra Pradesh Assembly 2026' },
            { referenceNumber: 'TEL-DEMO-VOTE-007812', constituency: '040-New Delhi', electionTitle: 'Delhi NCT Assembly 2026' },
          ]).map((v, idx) => (
            <div key={v.referenceNumber || idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>
                  <span className="font-bold text-blue-700">{v.referenceNumber}</span>
                  <span className="text-slate-500 ml-2 font-sans font-medium">({v.constituency})</span>
                </div>
              </div>
              <span className="text-slate-400 text-[11px]">Ledger Block Committed</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminLiveVoting;
