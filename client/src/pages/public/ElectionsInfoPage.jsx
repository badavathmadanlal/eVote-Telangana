import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATES_DATA } from '../../constants/statesData';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiArrowRight, 
  FiSearch, 
  FiInfo, 
  FiShield,
  FiCalendar
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const ElectionsInfoPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = STATES_DATA.filter(st => 
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.commission.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Banner */}
        <div className="bg-[#0a1428]/90 p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <MdAccountBalance className="text-base" />
              <span>State Election Commissions Directory</span>
            </div>
            <h1 className="text-3xl font-black text-white font-serif">
              State-Wise Remote Election Portals
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Explore gazetted state legislative assemblies, scheduled polling events, candidate rosters, and constituency turnout statistics.
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
              FINAL YEAR PROJECT DEMO — Simulated Election Data
            </p>
            <p className="text-amber-200/90 leading-relaxed">
              All state portals, constituencies, candidates, and voter statistics displayed on this academic project demonstration are fictional simulations for evaluating remote voting mechanisms.
            </p>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="bg-[#0a1428]/80 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <MdAccountBalance className="text-blue-400" />
            <span>Supported State Portals ({STATES_DATA.length} States)</span>
          </div>

          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by state or capital..."
              className="w-full bg-[#050b1a] border border-slate-700 text-white rounded-xl pl-9 pr-3.5 py-2 text-xs placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* States Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((st) => (
            <div
              key={st.id}
              className="bg-[#0a1428]/80 rounded-2xl border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    st.status === 'Polling Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    ● {st.status}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-400">
                    {st.capital}
                  </span>
                </div>

                {/* State Title */}
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">{st.name}</h2>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{st.commission}</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#050b1a] rounded-xl p-3 text-center border border-slate-800">
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">Active Elections</p>
                    <p className="text-sm font-black text-white">{st.activeElectionsCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">Constituencies</p>
                    <p className="text-sm font-black text-white">{st.totalConstituencies}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">Demo Voters</p>
                    <p className="text-sm font-black text-blue-400">{st.demoVotersCount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Constituency Snippet */}
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300 text-[11px]">Key Constituencies:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {st.constituencies.slice(0, 3).map(c => (
                      <span key={c.id} className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                        {c.name.split('-')[1] || c.name}
                      </span>
                    ))}
                    {st.constituencies.length > 3 && (
                      <span className="text-[10px] text-slate-500 pt-0.5">+{st.constituencies.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800">
                <Link
                  to={`/elections/${st.id}`}
                  className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>View State Elections</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ElectionsInfoPage;
