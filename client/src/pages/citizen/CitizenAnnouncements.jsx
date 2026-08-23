import React, { useState, useEffect } from 'react';
import { getAll } from '../../services/announcementService';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiBell, 
  FiCalendar, 
  FiSearch, 
  FiAlertTriangle, 
  FiTag, 
  FiFileText, 
  FiChevronDown, 
  FiChevronUp,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';

const CATEGORIES = ['All', 'VOTER INFORMATION', 'SCHEDULE', 'NOMINATION', 'SECURITY'];

const CitizenAnnouncements = () => {
  const { user } = useAuth();
  const userState = user?.state || 'Telangana';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [userState]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await getAll({ state: userState });
      if (res && res.success && Array.isArray(res.data?.announcements)) {
        setAnnouncements(res.data.announcements);
      } else if (res && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      } else if (Array.isArray(res)) {
        setAnnouncements(res);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      setAnnouncements([]);
      setLoadError('Unable to load official bulletins. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const filteredAnnouncements = announcements.filter(item => {
    const title = item.title || '';
    const content = item.content || item.description || item.body || '';
    const category = item.category || 'VOTER INFORMATION';

    const matchesCategory = activeCategory === 'All' || category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-600 text-sm" />
            <span>State Election Commission • eVote {userState} Gazette</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">{userState} Election Bulletins & Gazettes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Official statutory circulars, polling directives, and roll notifications for {userState}.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs shrink-0">
          <FiBell className="text-amber-600" />
          <span>{userState} Gazette Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${userState} notices...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Loading {userState} official announcements...</p>
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-2xl p-12 border border-red-200 text-center space-y-4 shadow-sm">
          <FiAlertTriangle className="text-3xl text-red-500 mx-auto" />
          <p className="text-sm font-medium text-slate-700">{loadError}</p>
          <button
            onClick={fetchAnnouncements}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            <FiRefreshCw /> Retry
          </button>
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {filteredAnnouncements.map((item, idx) => {
            const id = item._id || idx;
            const isExpanded = expandedId === id;
            const title = item.title || 'Official Election Notification';
            const content = item.content || item.description || item.body || 'Please review official election schedule and voter instructions.';
            const rawDate = item.updatedAt || item.createdAt;
            const updatedDateStr = rawDate ? new Date(rawDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : 'Recent';
            const category = item.category || 'VOTER INFORMATION';
            const isUrgent = item.isPinned || item.priority === 'high' || item.isUrgent;
            const issuer = item.issuer || `Chief Electoral Officer, ${item.state || userState}`;

            return (
              <div 
                key={id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm ${
                  isUrgent ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isUrgent 
                        ? 'bg-amber-500 text-slate-950 font-black' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {category}
                    </span>

                    {isUrgent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
                        <FiAlertTriangle size={12} /> Priority Bulletin
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium sm:ml-auto">
                    <FiCalendar size={13} className="text-slate-400" /> Updated: {updatedDateStr}
                  </span>
                </div>

                <div className="pt-3 space-y-2">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{title}</h3>
                  
                  <p className={`text-xs text-slate-600 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {content}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                      Issued by {issuer}
                    </span>

                    <button
                      onClick={() => toggleExpand(id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none"
                    >
                      {isExpanded ? (
                        <>Show Less <FiChevronUp size={14} /></>
                      ) : (
                        <>Read Full Notice <FiChevronDown size={14} /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            <FiBell />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">No {userState} Announcements Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              There are currently no active gazette notifications matching your filter criteria for {userState}.
            </p>
          </div>

          {activeCategory !== 'All' && (
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Footer Info Box */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <FiShield className="text-blue-600 text-base shrink-0" />
          <span>All gazette publications are digitally signed and verified by the State Election Commission of {userState}.</span>
        </div>
      </div>
    </div>
  );
};

export default CitizenAnnouncements;
