import React, { useState, useEffect } from 'react';
import { getAllCitizens } from '../../services/citizenService';
import { STATES_DATA } from '../../constants/statesData';
import { 
  FiSearch, 
  FiFilter, 
  FiUsers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiShield,
  FiLock,
  FiMapPin
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const AdminCitizens = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedConstituency, setSelectedConstituency] = useState('All');
  const [selectedKyc, setSelectedKyc] = useState('All');
  const [selectedVotingStatus, setSelectedVotingStatus] = useState('All');

  useEffect(() => {
    fetchVoters();
  }, [search, selectedState, selectedDistrict, selectedConstituency, selectedKyc, selectedVotingStatus]);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedState !== 'All') params.state = selectedState;
      if (selectedDistrict !== 'All') params.district = selectedDistrict;
      if (selectedConstituency !== 'All') params.constituency = selectedConstituency;
      if (selectedKyc !== 'All') params.kycStatus = selectedKyc;
      if (selectedVotingStatus !== 'All') params.hasVoted = selectedVotingStatus === 'VOTED';

      const res = await getAllCitizens(params);
      if (res && res.data && Array.isArray(res.data.citizens)) {
        setVoters(res.data.citizens);
      } else if (res && Array.isArray(res.citizens)) {
        setVoters(res.citizens);
      } else {
        setVoters([]);
      }
    } catch (err) {
      setVoters([]);
    } finally {
      setLoading(false);
    }
  };

  const currentStateObj = STATES_DATA.find(s => s.name === selectedState);
  
  const availableDistricts = selectedState === 'All'
    ? [...new Set(STATES_DATA.flatMap(s => s.districts || []))]
    : (currentStateObj?.districts || []);

  const availableConstituencies = selectedState === 'All'
    ? STATES_DATA.flatMap(s => s.constituencies.map(c => c.name))
    : (currentStateObj?.constituencies.map(c => c.name) || []);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-400 text-sm" />
            <span>State Election Commission • Elector Registry</span>
          </div>
          <h1 className="text-2xl font-black font-serif">VOTER & ELECTOR MANAGEMENT</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Electoral roll records, digital KYC authentication states, and constituency allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold font-mono">
          <FiUsers className="text-blue-400" />
          <span>{voters.length} Electors Loaded</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search */}
          <div className="relative lg:col-span-2">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name, Demo EPIC, Mobile..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => { 
                setSelectedState(e.target.value); 
                setSelectedDistrict('All');
                setSelectedConstituency('All'); 
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="All">All States</option>
              {STATES_DATA.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="All">All Districts</option>
              {availableDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Constituency Filter */}
          <div>
            <select
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="All">All Constituencies</option>
              {availableConstituencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* KYC Status Filter */}
          <div>
            <select
              value={selectedKyc}
              onChange={(e) => setSelectedKyc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="All">All KYC Status</option>
              <option value="VERIFIED">KYC Verified</option>
              <option value="PENDING">KYC Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Querying electoral roll records from database...</p>
          </div>
        ) : voters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Elector Name</th>
                  <th className="py-3 px-4">EPIC / Voter ID</th>
                  <th className="py-3 px-4">State & District</th>
                  <th className="py-3 px-4">Mandal & Constituency</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4 text-center">Voting Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voters.map((v, idx) => (
                  <tr key={v._id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">{v.sNo || idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{v.name || `${v.firstName} ${v.lastName}`}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{v.mobileNumber || v.mobile}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {v.epicNumber || v.voterId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{v.state}</span>
                      <span className="text-slate-400 block text-[11px]">{v.district}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{v.constituency}</span>
                      <span className="text-slate-400 block text-[11px]">{v.mandal || v.village}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {v.isKycVerified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          <FiCheckCircle size={10} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          <FiAlertCircle size={10} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {v.hasVoted ? (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
                          <MdHowToVote size={11} /> Voted
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">
                          Not Yet Voted
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <FiUsers className="text-3xl text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No electors found matching criteria</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCitizens;
