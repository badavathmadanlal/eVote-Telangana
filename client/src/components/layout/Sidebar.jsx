import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiCheckCircle, 
  FiCalendar, 
  FiUser, 
  FiBarChart2, 
  FiTrendingUp, 
  FiBell, 
  FiLogOut, 
  FiExternalLink, 
  FiChevronLeft, 
  FiChevronRight,
  FiShield
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const adminLinks = [
  { to: '/admin/dashboard', key: 'sidebar.dashboard', defaultLabel: 'Dashboard', icon: <FiHome /> },
  { to: '/admin/citizens', key: 'sidebar.voters', defaultLabel: 'Voters', icon: <FiUsers /> },
  { to: '/admin/elections', key: 'sidebar.elections', defaultLabel: 'Elections', icon: <FiCalendar /> },
  { to: '/admin/candidates', key: 'sidebar.candidates', defaultLabel: 'Candidates', icon: <FiUser /> },
  { to: '/admin/live-voting', key: 'sidebar.liveVoting', defaultLabel: 'Live Voting', icon: <FiTrendingUp /> },
  { to: '/admin/results', key: 'sidebar.results', defaultLabel: 'Results', icon: <FiBarChart2 /> },
  { to: '/admin/announcements', key: 'sidebar.announcements', defaultLabel: 'Announcements', icon: <FiBell /> },
  { to: '/admin/audit-logs', key: 'sidebar.auditLogs', defaultLabel: 'Audit Logs', icon: <FiShield /> },
];

const citizenLinks = [
  { to: '/citizen/dashboard', key: 'sidebar.dashboard', defaultLabel: 'Dashboard', icon: <FiHome /> },
  { to: '/citizen/elections', key: 'sidebar.elections', defaultLabel: 'Elections', icon: <FiCalendar /> },
  { to: '/citizen/history', key: 'sidebar.votingHistory', defaultLabel: 'Voting History', icon: <MdHowToVote /> },
  { to: '/citizen/verification', key: 'sidebar.verification', defaultLabel: 'Verification', icon: <FiCheckCircle /> },
  { to: '/citizen/announcements', key: 'sidebar.announcements', defaultLabel: 'Announcements', icon: <FiBell /> },
  { to: '/citizen/profile', key: 'sidebar.profile', defaultLabel: 'Profile', icon: <FiUser /> },
];

const Sidebar = ({ variant = 'admin', isMobile = false, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const links = variant === 'admin' ? adminLinks : citizenLinks;
  const isEffectiveCollapsed = !isMobile && collapsed;
  const isDemo = Boolean(
    user?.isDemoAccount || 
    user?.mobileNumber?.startsWith('900000000') || 
    user?.mobileNumber === '1234567890' || 
    user?.mobileNumber === '1234567891'
  );

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
  };

  const userState = user?.state || 'Telangana';
  const panelTitle = variant === 'admin' ? 'Admin Portal' : 'Citizen Portal';
  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || 'Citizen';

  return (
    <motion.aside
      animate={{ width: isMobile ? '100%' : isEffectiveCollapsed ? 80 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`flex flex-col min-h-screen bg-slate-900 text-slate-100 border-r border-slate-800 select-none ${
        isMobile ? 'w-full' : 'relative z-20'
      }`}
      aria-label={`${panelTitle} Navigation`}
    >
      {/* 1. Header Branding */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-800/80 h-16 relative">
        {!isEffectiveCollapsed ? (
          <>
            <div className="flex items-center gap-3 overflow-hidden min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shrink-0 shadow-md border border-blue-500/30">
                {variant === 'admin' ? (
                  <MdAccountBalance className="text-xl text-amber-400" />
                ) : (
                  <MdHowToVote className="text-xl text-blue-300" />
                )}
              </div>
              
              <div className="truncate">
                <h2 className="font-bold text-sm text-white tracking-tight leading-tight truncate font-serif">
                  eVote {userState}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${variant === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase truncate">
                    {panelTitle}
                  </p>
                </div>
              </div>
            </div>

            {!isMobile && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <FiChevronLeft size={15} />
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 2. Citizen Identity Card (Anchored on Left) */}
      {!isEffectiveCollapsed && variant === 'citizen' && (
        <div className="p-3 border-b border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                {userName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1 truncate">
                <p className="text-xs font-bold text-slate-100 truncate leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate leading-tight mt-0.5">
                  Voter • {userState}
                </p>
              </div>
            </div>

            {isDemo && (
              <div className="flex items-center justify-between text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <span className="font-bold">ACADEMIC DEMO</span>
                <span className="text-slate-400">Simulated Mode</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map((link) => {
          const isActive = location.pathname === link.to || (link.to === '/citizen/history' && location.pathname === '/citizen/voting-history');

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              title={isEffectiveCollapsed ? t(link.key, link.defaultLabel) : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${isEffectiveCollapsed ? 'justify-center' : ''}`}
            >
              <span className={`text-base shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {link.icon}
              </span>

              {!isEffectiveCollapsed && (
                <span className="truncate">{t(link.key, link.defaultLabel)}</span>
              )}

              {isActive && !isEffectiveCollapsed && (
                <motion.span
                  layoutId="sidebarActiveIndicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 4. Bottom Compact Action Buttons: [ ↗ Public Site ] and [ ↪ Sign Out ] */}
      <div className="p-3 border-t border-slate-800/80 space-y-1.5">
        {!isEffectiveCollapsed ? (
          <>
            {/* Simple Compact Public Site Action Row */}
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <FiExternalLink size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{t('sidebar.publicSite', 'Public Site')}</span>
            </Link>

            {/* Simple Compact Sign Out Action Row */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <FiLogOut size={14} className="shrink-0" />
              <span className="truncate">{t('sidebar.signOut', 'Sign Out')}</span>
            </button>
          </>
        ) : (
          <div className="space-y-1 flex flex-col items-center">
            <Link
              to="/"
              onClick={handleLinkClick}
              title="Public Site"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <FiExternalLink size={16} />
            </Link>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
