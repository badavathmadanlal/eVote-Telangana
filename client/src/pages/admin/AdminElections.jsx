import React, { useState, useEffect } from 'react';
import { getElections, updateElectionStatus } from '../../services/electionService';
import { STATES_DATA } from '../../constants/statesData';
import { 
  FiCalendar, 
  FiSearch, 
  FiFilter, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import toast from 'react-hot-toast';

const AdminElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchElections();
  }, [selectedState, selectedStatus]);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedState !== 'All') params.state = selectedState;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await getElections(params);
      if (res && res.data && Array.isArray(res.data.elections)) {
        setElections(res.data.elections);
      } else if (res && Array.isArray(res.data)) {
        setElections(res.data);
      } else if (Array.isArray(res)) {
        setElections(res);
      } else {
        setElections([]);
      }
    } catch (err) {
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateElectionStatus(id, { status: newStatus });
      toast.success(`Election status updated to ${newStatus}`);
      fetchElections();
    } catch (err) {
      toast.error(err.message || 'Failed to update election status');
    }
  };

  const filteredElections = elections.filter(e => {
    const query = search.toLowerCase();
    return (
      (e.title || '').toLowerCase().includes(query) ||
      (e.constituency || '').toLowerCase().includes(query) ||
      (e.state || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-400 text-sm" />
            <span>State Election Commission • Electoral Registry</span>
          </div>
          <h1 className="text-2xl font-black font-serif">ELECTION EVENT MANAGEMENT</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gazetted assembly election schedules, active polling segments, and candidate rosters.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold font-mono">
          <FiCalendar className="text-amber-400" />
          <span>{filteredElections.length} Elections Configured</span>
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
            placeholder="Search by Title, Constituency, State..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="All">All States</option>
            {STATES_DATA.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Elections Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Loading election records...</p>
          </div>
        ) : filteredElections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3.5 px-4">Election Title</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Constituency</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Polling Schedule</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredElections.map((el) => {
                  const isActive = (el.status || '').toUpperCase() === 'ACTIVE';
                  const startDate = el.startDate ? new Date(el.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Polling Open';
                  const endDate = el.endDate ? new Date(el.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Scheduled';

                  return (
                    <tr key={el._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{el.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {el._id}</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {el.state}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {el.constituency}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {el.electionType || 'State Assembly'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {startDate} – {endDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}>
                          ● {el.status || 'INACTIVE'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(el._id, el.status)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                            isActive
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <FiCalendar className="text-4xl text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No elections found matching criteria</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminElections;
