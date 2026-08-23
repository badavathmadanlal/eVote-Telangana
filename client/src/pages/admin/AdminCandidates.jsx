import React, { useState, useEffect } from 'react';
import { getCandidates } from '../../services/candidateService';
import { STATES_DATA } from '../../constants/statesData';
import CandidateSymbol from '../../components/common/CandidateSymbol';
import { 
  FiUser, 
  FiSearch, 
  FiFilter, 
  FiAward, 
  FiMapPin, 
  FiCheckCircle, 
  FiXCircle 
} from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('All');

  useEffect(() => {
    fetchCandidates();
  }, [selectedConstituency]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedConstituency !== 'All') params.constituency = selectedConstituency;

      const res = await getCandidates(params);
      if (res && res.data && Array.isArray(res.data.candidates)) {
        setCandidates(res.data.candidates);
      } else if (res && Array.isArray(res.data)) {
        setCandidates(res.data);
      } else if (Array.isArray(res)) {
        setCandidates(res);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const allConstituencies = STATES_DATA.flatMap(s => s.constituencies.map(c => c.name));

  const filteredCandidates = candidates.filter(c => {
    const q = search.toLowerCase();
    return (
      (c.fullName || '').toLowerCase().includes(q) ||
      (c.partyName || '').toLowerCase().includes(q) ||
      (c.partySymbol || '').toLowerCase().includes(q) ||
      (c.constituency || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-400 text-sm" />
            <span>State Election Commission • Candidate Directory</span>
          </div>
          <h1 className="text-2xl font-black font-serif">CANDIDATE MANAGEMENT</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Nominated contenders, party affiliations, electoral symbols, and constituency allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold font-mono">
          <FiUser className="text-blue-400" />
          <span>{filteredCandidates.length} Nominees Listed</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Party, Symbol, Constituency..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedConstituency}
            onChange={(e) => setSelectedConstituency(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="All">All Constituencies</option>
            {allConstituencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Loading candidate records...</p>
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3.5 px-4">Candidate Name</th>
                  <th className="py-3.5 px-4">Party Affiliation</th>
                  <th className="py-3.5 px-4">Allotted Symbol</th>
                  <th className="py-3.5 px-4">Constituency</th>
                  <th className="py-3.5 px-4">Election</th>
                  <th className="py-3.5 px-4">Nomination Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCandidates.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.fullName?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {c._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {c.partyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <CandidateSymbol symbol={c.partySymbol} size={18} className="w-7 h-7" />
                        <span className="font-mono font-bold text-slate-800">{c.partySymbol}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {c.constituency}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">
                      {c.electionId?.title || 'State Assembly Election 2026'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ● Gazetted Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <FiUser className="text-4xl text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No candidates found</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCandidates;
