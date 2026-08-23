import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { STATES_DATA } from '../../constants/statesData';
import { 
  FiBell, 
  FiCalendar, 
  FiSearch, 
  FiAlertTriangle, 
  FiShield, 
  FiChevronDown, 
  FiChevronUp,
  FiFileText,
  FiMapPin
} from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';

const STATES_LIST = ['All States', 'Telangana', 'Andhra Pradesh', 'Delhi', 'Tamil Nadu', 'Maharashtra', 'Assam'];
const CATEGORIES = ['All', 'VOTER INFORMATION', 'SCHEDULE', 'NOMINATION', 'SECURITY'];

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('All States');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedState]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const url = selectedState === 'All States' 
        ? '/announcements' 
        : `/announcements?state=${encodeURIComponent(selectedState)}`;
      
      const res = await api.get(url);
      if (res && res.data && Array.isArray(res.data.data?.announcements)) {
        setAnnouncements(res.data.data.announcements);
      } else if (res && Array.isArray(res.data?.announcements)) {
        setAnnouncements(res.data.announcements);
      } else if (res && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const filteredAnnouncements = announcements.filter(item => {
    const title = item.title || '';
    const content = item.content || item.description || '';
    const category = item.category || 'General';

    const matchesCategory = activeCategory === 'All' || category.toUpperCase().includes(activeCategory.toUpperCase());
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Banner */}
        <div className="bg-[#0a1428]/90 p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <MdAccountBalance className="text-base" />
              <span>State Election Commissions • Gazette & Press Desk</span>
            </div>
            <h1 className="text-3xl font-black text-white font-serif">
              Official Announcements & Bulletins
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Latest state-wise gazette notifications, polling schedules, and press releases issued by the Election Commissions.
            </p>
          </div>

          <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs shrink-0">
            <FiBell className="text-amber-400" />
            <span>State Gazettes</span>
          </span>
        </div>

        {/* State Filter Chips */}
        <div className="bg-[#0a1428]/80 p-4.5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Filter by State Portal:
            </span>
            <span className="text-xs font-medium text-slate-500">
              {filteredAnnouncements.length} Announcement(s)
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {STATES_LIST.map(st => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedState === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#050b1a] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Search Toolbar */}
        <div className="bg-[#0a1428]/80 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-[#050b1a] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full bg-[#050b1a] border border-slate-700 text-white rounded-xl pl-9 pr-3.5 py-1.5 text-xs placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Announcement List */}
        {loading ? (
          <div className="bg-[#0a1428]/80 rounded-2xl p-12 border border-slate-800 text-center space-y-3 shadow-sm">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400">Querying state gazette desk...</p>
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((item, idx) => {
              const id = item._id || idx;
              const isExpanded = expandedId === id;
              const dateObj = item.updatedAt ? new Date(item.updatedAt) : (item.createdAt ? new Date(item.createdAt) : new Date());
              const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

              return (
                <div
                  key={id}
                  className="bg-[#0a1428]/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-6 shadow-sm space-y-3 cursor-pointer"
                  onClick={() => toggleExpand(id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.category || 'ELECTION UPDATE'}
                      </span>
                      {item.state && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                          <FiMapPin size={10} /> {item.state}
                        </span>
                      )}
                      {item.isPinned && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Pinned
                        </span>
                      )}
                    </div>

                    {/* Updated Date on the RIGHT SIDE */}
                    <span className="text-xs font-mono font-semibold text-slate-400 sm:text-right">
                      Updated: {dateStr}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white leading-snug font-serif">
                      {item.title}
                    </h3>
                    <p className={`text-xs text-slate-300 mt-2 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {item.content || item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-blue-400 font-semibold">
                    <span>{isExpanded ? 'Show less' : 'Read full notification'}</span>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0a1428]/80 rounded-2xl p-12 border border-slate-800 text-center space-y-2 shadow-sm">
            <FiBell className="text-3xl text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No announcements found</p>
            <p className="text-xs text-slate-500">Try selecting a different state or category filter.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnnouncementsPage;
