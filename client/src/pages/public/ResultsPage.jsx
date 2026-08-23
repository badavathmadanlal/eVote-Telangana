import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBarChart2, 
  FiCheckCircle, 
  FiAward, 
  FiShield, 
  FiTrendingUp, 
  FiMapPin, 
  FiInfo, 
  FiUsers,
  FiChevronRight
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const STATES_FILTER = ['All States', 'Telangana', 'Andhra Pradesh', 'Delhi', 'Tamil Nadu', 'Maharashtra', 'Assam'];

const DEMO_RESULTS_DATA = {
  Telangana: {
    constituency: '057-Musheerabad',
    assemblyTitle: 'Telangana Legislative Assembly Election',
    registeredVoters: 12500,
    votesCast: 8742,
    turnout: 69.9,
    leadingCandidate: 'Candidate A',
    leadingParty: 'Progressive Democratic Front',
    leadingVotes: 3240,
    leadingPercentage: 37.1,
    candidates: [
      { name: 'Candidate A', party: 'Progressive Democratic Front', symbol: 'Torch', votes: 3240, percentage: 37.1, color: 'bg-amber-500' },
      { name: 'Candidate B', party: 'National E-Democracy Party', symbol: 'Rising Sun', votes: 2410, percentage: 27.6, color: 'bg-blue-600' },
      { name: 'Candidate C', party: 'Citizens Welfare Alliance', symbol: 'Book', votes: 1830, percentage: 20.9, color: 'bg-emerald-600' },
      { name: 'Candidate D', party: 'Independent Peoples Voice', symbol: 'Scale', votes: 1262, percentage: 14.4, color: 'bg-purple-600' },
    ]
  },
  'Andhra Pradesh': {
    constituency: '019-Vijayawada West',
    assemblyTitle: 'Andhra Pradesh Legislative Assembly Election',
    registeredVoters: 14200,
    votesCast: 10280,
    turnout: 72.4,
    leadingCandidate: 'Candidate A',
    leadingParty: 'State Development Coalition',
    leadingVotes: 4120,
    leadingPercentage: 40.1,
    candidates: [
      { name: 'Candidate A', party: 'State Development Coalition', symbol: 'Sun', votes: 4120, percentage: 40.1, color: 'bg-amber-500' },
      { name: 'Candidate B', party: 'United Democratic Congress', symbol: 'Plow', votes: 3350, percentage: 32.6, color: 'bg-blue-600' },
      { name: 'Candidate C', party: 'People Welfare Front', symbol: 'Tree', votes: 1780, percentage: 17.3, color: 'bg-emerald-600' },
      { name: 'Candidate D', party: 'Independent Alliance', symbol: 'Lamp', votes: 1030, percentage: 10.0, color: 'bg-purple-600' },
    ]
  },
  Delhi: {
    constituency: '040-New Delhi',
    assemblyTitle: 'Delhi Legislative Assembly General Election',
    registeredVoters: 11800,
    votesCast: 8000,
    turnout: 67.8,
    leadingCandidate: 'Candidate B',
    leadingParty: 'Civic Reform Party',
    leadingVotes: 3450,
    leadingPercentage: 43.1,
    candidates: [
      { name: 'Candidate B', party: 'Civic Reform Party', symbol: 'Broom', votes: 3450, percentage: 43.1, color: 'bg-blue-600' },
      { name: 'Candidate A', party: 'National Peoples Front', symbol: 'Flower', votes: 2680, percentage: 33.5, color: 'bg-amber-500' },
      { name: 'Candidate C', party: 'Democratic Rights Union', symbol: 'Hand', votes: 1120, percentage: 14.0, color: 'bg-emerald-600' },
      { name: 'Candidate D', party: 'Independent Voice', symbol: 'Bell', votes: 750, percentage: 9.4, color: 'bg-purple-600' },
    ]
  },
  'Tamil Nadu': {
    constituency: '011-Dr. Radhakrishnan Nagar',
    assemblyTitle: 'Tamil Nadu Legislative Assembly Election',
    registeredVoters: 15000,
    votesCast: 11115,
    turnout: 74.1,
    leadingCandidate: 'Candidate A',
    leadingParty: 'Tamil Progressive Alliance',
    leadingVotes: 4850,
    leadingPercentage: 43.6,
    candidates: [
      { name: 'Candidate A', party: 'Tamil Progressive Alliance', symbol: 'Rising Sun', votes: 4850, percentage: 43.6, color: 'bg-amber-500' },
      { name: 'Candidate B', party: 'Dravidian Peoples Party', symbol: 'Leaves', votes: 3720, percentage: 33.5, color: 'bg-blue-600' },
      { name: 'Candidate C', party: 'State Welfare Federation', symbol: 'Lotus', votes: 1640, percentage: 14.8, color: 'bg-emerald-600' },
      { name: 'Candidate D', party: 'Independent Front', symbol: 'Boat', votes: 905, percentage: 8.1, color: 'bg-purple-600' },
    ]
  },
  Maharashtra: {
    constituency: '182-Worli',
    assemblyTitle: 'Maharashtra Legislative Assembly Election',
    registeredVoters: 13600,
    votesCast: 9600,
    turnout: 70.6,
    leadingCandidate: 'Candidate C',
    leadingParty: 'Maharashtra Vikas Coalition',
    leadingVotes: 3820,
    leadingPercentage: 39.8,
    candidates: [
      { name: 'Candidate C', party: 'Maharashtra Vikas Coalition', symbol: 'Bow & Arrow', votes: 3820, percentage: 39.8, color: 'bg-emerald-600' },
      { name: 'Candidate A', party: 'National Alliance Front', symbol: 'Clock', votes: 3140, percentage: 32.7, color: 'bg-amber-500' },
      { name: 'Candidate B', party: 'Peoples Democratic Party', symbol: 'Torch', votes: 1760, percentage: 18.3, color: 'bg-blue-600' },
      { name: 'Candidate D', party: 'Independent Front', symbol: 'Kite', votes: 880, percentage: 9.2, color: 'bg-purple-600' },
    ]
  },
  Assam: {
    constituency: '051-Jalukbari',
    assemblyTitle: 'Assam Legislative Assembly Election',
    registeredVoters: 10500,
    votesCast: 6920,
    turnout: 65.9,
    leadingCandidate: 'Candidate A',
    leadingParty: 'Assam Gana Parishad Alliance',
    leadingVotes: 2950,
    leadingPercentage: 42.6,
    candidates: [
      { name: 'Candidate A', party: 'Assam Gana Parishad Alliance', symbol: 'Elephant', votes: 2950, percentage: 42.6, color: 'bg-amber-500' },
      { name: 'Candidate B', party: 'United Democratic Front', symbol: 'Hand', votes: 2180, percentage: 31.5, color: 'bg-blue-600' },
      { name: 'Candidate C', party: 'Peoples Rights Alliance', symbol: 'Lock & Key', votes: 1140, percentage: 16.5, color: 'bg-emerald-600' },
      { name: 'Candidate D', party: 'Independent Voice', symbol: 'Star', votes: 650, percentage: 9.4, color: 'bg-purple-600' },
    ]
  }
};

const ALL_STATES_TURNOUT_COMPARISON = [
  { state: 'Tamil Nadu', turnout: 74.1, constituency: '011-Dr. Radhakrishnan Nagar', color: 'bg-indigo-600' },
  { state: 'Andhra Pradesh', turnout: 72.4, constituency: '019-Vijayawada West', color: 'bg-blue-600' },
  { state: 'Maharashtra', turnout: 70.6, constituency: '182-Worli', color: 'bg-emerald-600' },
  { state: 'Telangana', turnout: 69.9, constituency: '057-Musheerabad', color: 'bg-amber-500' },
  { state: 'Delhi', turnout: 67.8, constituency: '040-New Delhi', color: 'bg-purple-600' },
  { state: 'Assam', turnout: 65.9, constituency: '051-Jalukbari', color: 'bg-rose-600' },
];

const ResultsPage = () => {
  const [selectedState, setSelectedState] = useState('All States');

  const isAllStates = selectedState === 'All States';
  const currentStateData = !isAllStates ? DEMO_RESULTS_DATA[selectedState] : null;

  // Aggregate stats for "All States"
  const totalRegisteredAll = Object.values(DEMO_RESULTS_DATA).reduce((acc, s) => acc + s.registeredVoters, 0);
  const totalCastAll = Object.values(DEMO_RESULTS_DATA).reduce((acc, s) => acc + s.votesCast, 0);
  const avgTurnoutAll = ((totalCastAll / totalRegisteredAll) * 100).toFixed(1);

  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. Header Banner */}
        <div className="bg-[#0a1428]/90 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
          {/* Subtle Tiranga Ambient Light */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <MdAccountBalance className="text-base" />
              <span>State Election Commission • Results & Tabulation Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
              Electoral Outcomes & Certified Tabulations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consolidated simulated ballot outcomes, candidate vote share percentages, and multi-state participation metrics.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            {/* Pulsing Live Indicator */}
            <span className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>● SIMULATED LIVE RESULTS</span>
            </span>
          </div>
        </div>

        {/* 2. Mandatory Fictional Academic Demo Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4.5 flex items-start gap-3.5 text-amber-200 shadow-sm backdrop-blur-xs">
          <FiInfo className="text-amber-400 text-xl shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-mono font-bold uppercase tracking-widest text-[11px] text-amber-300">
              SIMULATED DEMO RESULTS — ACADEMIC DEMONSTRATION
            </p>
            <p className="text-amber-200/90 leading-relaxed">
              All figures shown are fictional data created for academic project demonstration. Voter choices remain cryptographically decoupled from elector identities under constitutional secret ballot protocols.
            </p>
          </div>
        </div>

        {/* 3. Interactive State Filter Controls */}
        <div className="bg-[#0a1428]/80 p-4.5 rounded-2xl border border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Jurisdiction Filter:
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {isAllStates ? 'Viewing All 6 Supported States' : `Viewing ${selectedState}`}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {STATES_FILTER.map(st => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedState === st
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#050b1a] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 4. High-Level KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0a1428]/90 p-5 rounded-2xl border border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold text-slate-400">Registered Electors</span>
              <FiUsers className="text-blue-400 text-lg" />
            </div>
            <p className="text-2xl font-black text-white font-serif">
              {isAllStates ? totalRegisteredAll.toLocaleString() : currentStateData.registeredVoters.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {isAllStates ? '6 State Portals' : selectedState}
            </p>
          </div>

          <div className="bg-[#0a1428]/90 p-5 rounded-2xl border border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold text-slate-400">Simulated Votes Cast</span>
              <MdHowToVote className="text-emerald-400 text-lg" />
            </div>
            <p className="text-2xl font-black text-white font-serif">
              {isAllStates ? totalCastAll.toLocaleString() : currentStateData.votesCast.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">Ballots Ledger-Recorded</p>
          </div>

          <div className="bg-[#0a1428]/90 p-5 rounded-2xl border border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold text-slate-400">Voter Turnout Rate</span>
              <FiTrendingUp className="text-amber-400 text-lg" />
            </div>
            <p className="text-2xl font-black text-emerald-400 font-serif">
              {isAllStates ? `${avgTurnoutAll}%` : `${currentStateData.turnout}%`}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">Participation Average</p>
          </div>

          <div className="bg-[#0a1428]/90 p-5 rounded-2xl border border-slate-800 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold text-slate-400">Leading Candidate</span>
              <FiAward className="text-purple-400 text-lg" />
            </div>
            <p className="text-xl font-black text-white font-serif truncate">
              {isAllStates ? 'Multi-Candidate' : currentStateData.leadingCandidate}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {isAllStates ? 'State-Specific Leaders' : currentStateData.leadingParty}
            </p>
          </div>
        </div>

        {/* 5. Main Dashboard Content (All States vs Single State) */}
        <AnimatePresence mode="wait">
          {isAllStates ? (
            /* ALL STATES VIEW */
            <motion.div
              key="all-states-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Simulated Turnout by State Bar Chart */}
              <div className="bg-[#0a1428]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white font-serif">
                      Simulated Turnout by State
                    </h2>
                    <p className="text-xs text-slate-400">
                      Fictional academic demonstration data across 6 supported state election commissions.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl self-start sm:self-auto">
                    Comparative Overview
                  </span>
                </div>

                <div className="space-y-4">
                  {ALL_STATES_TURNOUT_COMPARISON.map((item) => (
                    <div key={item.state} className="bg-[#050b1a] p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white text-sm">{item.state}</span>
                          <span className="text-slate-400 text-xs ml-2 font-mono">({item.constituency})</span>
                        </div>
                        <span className="font-mono font-black text-sm text-slate-200">{item.turnout}% Turnout</span>
                      </div>

                      <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${item.turnout}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid of 6 Demo Constituency Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-serif">
                    Constituency Results Summary
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">6 Demo Constituencies</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(DEMO_RESULTS_DATA).map(([stateName, stData]) => (
                    <div
                      key={stateName}
                      className="bg-[#0a1428]/90 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="text-xs font-bold text-amber-400">{stateName}</span>
                          <h4 className="font-black text-sm text-white font-serif">{stData.constituency}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {stData.turnout}%
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Votes Cast:</span>
                          <span className="font-bold text-white">{stData.votesCast.toLocaleString()} / {stData.registeredVoters.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Leading:</span>
                          <span className="font-bold text-blue-400">{stData.leadingCandidate} ({stData.leadingPercentage}%)</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedState(stateName)}
                        className="w-full py-2 px-3 rounded-xl bg-[#050b1a] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View Detailed Breakdown</span>
                        <FiChevronRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* SINGLE STATE VIEW */
            <motion.div
              key={selectedState}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Winner Showcase Card */}
              <div className="bg-gradient-to-br from-[#0a1835] via-[#071126] to-[#0a1835] rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-3xl shadow-lg shrink-0">
                    <FiAward />
                  </div>
                  <div>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                      Simulated Leading Candidate
                    </span>
                    <h2 className="text-2xl font-black text-white font-serif mt-1">
                      {currentStateData.leadingCandidate}
                    </h2>
                    <p className="text-xs text-slate-300 font-semibold">{currentStateData.leadingParty}</p>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-[#050b1a] p-4.5 rounded-2xl border border-amber-500/20 shadow-sm shrink-0">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Simulated Votes Received</p>
                  <p className="text-2xl font-black text-amber-400 font-mono">{currentStateData.leadingVotes.toLocaleString()} Votes</p>
                  <p className="text-xs font-bold text-slate-300">{currentStateData.leadingPercentage}% Vote Share</p>
                </div>
              </div>

              {/* Candidate Vote Count Bar Chart */}
              <div className="bg-[#0a1428]/90 rounded-3xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg font-serif">
                      Simulated Candidate Vote Count
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Constituency: <strong>{currentStateData.constituency}</strong> ({selectedState}) | Total Votes Cast: <strong>{currentStateData.votesCast.toLocaleString()}</strong>
                    </p>
                  </div>

                  <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl self-start sm:self-auto">
                    Fictional academic demonstration data
                  </span>
                </div>

                <div className="space-y-4">
                  {currentStateData.candidates.map((cand, idx) => (
                    <div key={cand.name} className="bg-[#050b1a] p-4.5 rounded-2xl border border-slate-800 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white text-sm">{cand.name}</span>
                            <span className="text-slate-400 text-xs ml-2 font-medium">({cand.party} — Symbol: {cand.symbol})</span>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="font-bold text-white text-sm">{cand.votes.toLocaleString()} Votes</span>
                          <span className="text-blue-400 ml-2 font-bold">({cand.percentage}%)</span>
                        </div>
                      </div>

                      <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${cand.color} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${cand.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Turnout Visualization Card */}
              <div className="bg-[#0a1428]/90 rounded-3xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base font-serif">
                    Simulated Voter Turnout
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Fictional demo data
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-[#050b1a] rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Total Registered</span>
                    <p className="text-xl font-bold text-white">{currentStateData.registeredVoters.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#050b1a] rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Simulated Cast</span>
                    <p className="text-xl font-bold text-blue-400">{currentStateData.votesCast.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#050b1a] rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Turnout Percentage</span>
                    <p className="text-xl font-bold text-emerald-400">{currentStateData.turnout}%</p>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mt-2 border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${currentStateData.turnout}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ResultsPage;
