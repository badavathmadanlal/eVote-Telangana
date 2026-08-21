import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiChevronDown, FiShield, FiPhoneCall } from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Elections', to: '/elections' },
  { label: 'Results', to: '/results' },
  { label: 'Announcements', to: '/announcements' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* 1. Indian Tiranga Top Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-amber-400">Government of Telangana</span>
            <span className="hidden md:inline text-slate-400">| Chief Electoral Officer</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:flex items-center gap-1">
              <FiPhoneCall className="text-emerald-400" /> Helpline: <strong className="text-white">1950</strong>
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <FiShield className="text-blue-400" /> Official Portal
            </span>
          </div>
        </div>
      </div>

      {/* 2. Professional Government Header */}
      <div className="bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-b border-slate-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Indian Flag & State Emblem */}
          <div className="flex items-center gap-4">
            {/* Tiranga Flag Badge */}
            <div className="w-10 h-7 rounded border border-slate-300 overflow-hidden flex flex-col shadow-sm shrink-0">
              <div className="h-1/3 bg-[#FF9933]"></div>
              <div className="h-1/3 bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border border-[#000080]"></div>
              </div>
              <div className="h-1/3 bg-[#138808]"></div>
            </div>
            
            <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
              <MdAccountBalance className="text-amber-800 text-3xl shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Government of Telangana</p>
                <p className="text-[10px] text-slate-500 font-medium">State Election Commission</p>
              </div>
            </div>
          </div>

          {/* Center: Main Portal Identity */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <MdHowToVote className="text-blue-800 text-3xl" />
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight font-serif">
                eVote Telangana
              </h1>
            </div>
            <p className="text-xs font-semibold text-blue-900 tracking-widest uppercase mt-0.5">
              Secure Remote Voting System
            </p>
          </div>

          {/* Right: ECI Badge */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300 uppercase tracking-wider">
                Certified Secure
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Election Commission of India Standards</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Improved Navbar */}
      <nav className="bg-slate-900 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          
          {/* Links */}
          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Auth Action */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium text-white transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <FiChevronDown className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-md shadow-xl border border-slate-200 py-1 text-slate-800 z-50"
                    >
                      <Link
                        to={dashboardLink}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        <FiSettings /> Dashboard
                      </Link>
                      <Link
                        to="/citizen/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        <FiUser /> Profile
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <FiLogOut /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Navigation Menu</span>
            <button
              className="p-1 text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-slate-900 border-t border-slate-800 text-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {publicLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded text-xs font-semibold uppercase ${
                      isActive ? 'bg-blue-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="my-2 border-slate-800" />
              {user ? (
                <>
                  <Link
                    to={dashboardLink}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/30 rounded w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-800 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-slate-900 bg-amber-400 rounded"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
