import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiCheckCircle, FiCalendar, FiUser, FiBarChart2, FiMic, FiBell, FiMessageSquare, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { MdHowToVote } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/citizens', label: 'Citizens', icon: <FiCheckCircle /> },
  { to: '/admin/elections', label: 'Elections', icon: <FiCalendar /> },
  { to: '/admin/candidates', label: 'Candidates', icon: <FiUser /> },
  { to: '/admin/results', label: 'Results', icon: <FiBarChart2 /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  { to: '/admin/announcements', label: 'Announcements', icon: <FiBell /> },
  { to: '/admin/contacts', label: 'Contacts', icon: <FiMessageSquare /> },
  { to: '/admin/faqs', label: 'FAQs', icon: <FiHelpCircle /> },
];

const citizenLinks = [
  { to: '/citizen/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/citizen/elections', label: 'Elections', icon: <FiCalendar /> },
  { to: '/citizen/history', label: 'Voting History', icon: <MdHowToVote /> },
  { to: '/citizen/verification', label: 'Verification', icon: <FiCheckCircle /> },
  { to: '/citizen/announcements', label: 'Announcements', icon: <FiBell /> },
  { to: '/citizen/profile', label: 'Profile', icon: <FiUser /> },
];

const Sidebar = ({ variant = 'admin' }) => {
  const { user, logout } = useAuth();
  const links = variant === 'admin' ? adminLinks : citizenLinks;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 p-5 border-b border-gray-700">
        <MdHowToVote className="text-blue-400 text-2xl" />
        <div>
          <p className="font-bold text-sm leading-tight">eVote Telangana</p>
          <p className="text-xs text-gray-400 leading-tight capitalize">{variant} Panel</p>
        </div>
      </div>

      {/* User Badge */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
            }>
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-700">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-1">
          Public Site
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-white hover:bg-red-700 transition-colors w-full">
          <FiLogOut /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
