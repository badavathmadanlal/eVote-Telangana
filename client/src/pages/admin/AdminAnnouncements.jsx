import React, { useState, useEffect } from 'react';
import { getAll, create, remove } from '../../services/announcementService';
import toast from 'react-hot-toast';
import { 
  FiBell, 
  FiPlus, 
  FiTrash2, 
  FiSearch, 
  FiFilter, 
  FiCheckCircle, 
  FiCalendar,
  FiX
} from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';

const CATEGORIES = ['Election', 'General', 'Security', 'Maintenance', 'Emergency'];

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Election',
    isPinned: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await getAll();
      const list = res.data?.announcements || res.data || [];
      if (Array.isArray(list)) {
        setAnnouncements(list);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      await create({
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        isPinned: form.isPinned,
        isPublished: true
      });
      toast.success('Announcement published successfully');
      setShowModal(false);
      setForm({ title: '', content: '', category: 'Election', isPinned: false });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Failed to publish announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await remove(id);
      toast.success('Announcement deleted');
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const matchesCat = filterCat === 'All' || a.category === filterCat;
    const matchesSearch = 
      (a.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.content || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-400 text-sm" />
            <span>State Election Commission • Public Gazettes</span>
          </div>
          <h1 className="text-2xl font-black font-serif">ANNOUNCEMENT DISPATCH CENTER</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish official gazettes, polling schedules, and security advisories to citizen portals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
        >
          <FiPlus /> New Announcement
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                filterCat === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-sm">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Loading gazette announcements...</p>
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                    a.category === 'Security'
                      ? 'bg-purple-100 text-purple-800'
                      : a.category === 'Election'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    ● {a.category}
                  </span>

                  {a.isPinned && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      Pinned Notice
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 font-mono">
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-serif">{a.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(a._id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                title="Delete Announcement"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2 shadow-sm">
            <FiBell className="text-4xl text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No announcements match your selected filter</p>
          </div>
        )}
      </div>

      {/* Modal: New Announcement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif">Publish Official Announcement</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gazette Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Extended Polling Window for Assembly Segments"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content / Body *</label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Provide detailed instructions or notice details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={form.isPinned}
                  onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPinned" className="font-semibold text-slate-700 cursor-pointer">
                  Pin to top of citizen notices
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAnnouncements;
