import React, { useState, useEffect } from 'react';
import { getElections } from '../../services/electionService';
import { getElectionResults } from '../../services/voteService';
import { STATES_DATA } from '../../constants/statesData';
import { 
  FiBarChart2, 
  FiAward, 
  FiSearch, 
  FiFilter, 
  FiCheckCircle, 
  FiShield, 
  FiInfo,
  FiRefreshCw
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const AdminResults = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectionsList();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      fetchResults(selectedElectionId);
    }
  }, [selectedElectionId]);

  const fetchElectionsList = async () => {
    try {
      setLoading(true);
      const res = await getElections();
      const list = res.data?.elections || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setElections(list);
        setSelectedElectionId(list[0]._id);
      }
    } catch (err) {
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (elId) => {
    try {
      setLoading(true);
      const res = await getElectionResults(elId);
      if (res && res.data?.results) {
        setResultsData(res.data.results);
      } else if (res && res.data) {
        setResultsData(res.data);
      } else {
        setResultsData(null);
      }
    } catch (err) {
      setResultsData(null);
    } finally {
      setLoading(false);
    }
  };

  const selectedElection = elections.find(e => e._id === selectedElectionId);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-400 text-sm" />
            <span>State Election Commission • Certified Tabulation</span>
          </div>
          <h1 className="text-2xl font-black font-serif">DEMO ELECTION RESULTS</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated candidate tallies, vote share percentages, and certified winning margins.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono">
          Strict Ballot Privacy
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
        <FiInfo className="text-amber-600 text-lg shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold uppercase tracking-wider text-[11px] text-amber-900">
            DEMO ELECTION RESULTS — Final Year Project Demonstration
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            All result statistics displayed here are computed from simulated digital ballot submissions. Under strict ballot secrecy, individual voter records are detached and never linked to chosen candidates.
          </p>
        </div>
      </div>

      {/* Election Selector Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <FiBarChart2 className="text-blue-600" />
          <span>Select Election Segment:</span>
        </div>

        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          className="w-full sm:w-96 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {elections.map(e => (
            <option key={e._id} value={e._id}>
              {e.title} ({e.constituency} - {e.state})
            </option>
          ))}
        </select>
      </div>

      {/* Results Display */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Aggregating cryptographic ballot counts...</p>
        </div>
      ) : resultsData ? (
        <div className="space-y-6">
          
          {/* Winner Showcase Card */}
          {resultsData.winner && resultsData.totalVotes > 0 && (
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-2xl border-2 border-amber-300 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md">
                  <FiAward />
                </div>
                <div>
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Leading Candidate
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-serif mt-1">
                    {resultsData.winner.fullName}
                  </h2>
                  <p className="text-xs text-slate-600 font-semibold">{resultsData.winner.partyName}</p>
                </div>
              </div>

              <div className="text-center sm:text-right bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Total Votes Received</p>
                <p className="text-2xl font-black text-amber-600 font-mono">{resultsData.winner.votes} Votes</p>
                <p className="text-xs font-bold text-slate-700">{resultsData.winner.percentage}% Vote Share</p>
              </div>
            </div>
          )}

          {/* Results Table & Progress */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {resultsData.title || selectedElection?.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Constituency: {resultsData.constituency || selectedElection?.constituency} | Total Votes Cast: <strong>{resultsData.totalVotes}</strong>
                </p>
              </div>

              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold font-mono">
                Tabulation Verified
              </span>
            </div>

            <div className="space-y-4">
              {(resultsData.candidates || []).map((cand, idx) => (
                <div key={cand.candidateId || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">{cand.fullName}</span>
                        <span className="text-slate-500 ml-2 font-medium">({cand.partyName})</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-900 text-sm">{cand.votes} Votes</span>
                      <span className="text-blue-600 ml-2 font-bold">({cand.percentage}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-blue-600' : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(cand.votes > 0 ? 5 : 0, cand.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2 shadow-sm">
          <FiBarChart2 className="text-4xl text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No votes recorded yet for this election</p>
          <p className="text-xs text-slate-400">Results will appear here as simulated ballots are submitted.</p>
        </div>
      )}

    </div>
  );
};

export default AdminResults;
