import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiChevronDown, 
  FiShield, 
  FiPhoneCall, 
  FiGlobe,
  FiArrowRight
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const publicLinks = [
  { key: 'nav.home', defaultLabel: 'HOME', to: '/' },
  { key: 'nav.about', defaultLabel: 'ABOUT US', to: '/about' },
  { key: 'nav.elections', defaultLabel: 'ELECTIONS', to: '/elections' },
  { key: 'nav.results', defaultLabel: 'RESULTS', to: '/results' },
  { key: 'nav.announcements', defaultLabel: 'ANNOUNCEMENTS', to: '/announcements' },
  { key: 'nav.faq', defaultLabel: 'FAQ', to: '/faq' },
  { key: 'nav.contact', defaultLabel: 'CONTACT', to: '/contact' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { language, changeLanguage, languages, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const portalLink = user?.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard';
  const portalLabel = user?.role === 'admin' ? 'Admin Portal' : 'Citizen Portal';
  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-50 bg-[#07111f]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white w-full">
      {/* 1. Indian Tiranga Top Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* 2. Top Utility Bar (Dark Navy Theme - Responsive Wrapping) */}
      <div className="bg-[#050b1a] text-slate-300 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-bold text-amber-400">
              State Election Commission Portal
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">SEC Digital Portal</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-mono">
              B.Tech CSE Project
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <FiPhoneCall className="text-emerald-400" /> Helpline: <strong className="text-white">1950</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Horizontal Public Header */}
      <div className="py-3 px-3 sm:px-4 bg-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md border border-blue-400/40 shrink-0">
              <MdHowToVote className="text-xl sm:text-2xl text-amber-300 transition-transform group-hover:scale-110" />
            </div>
            
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight font-serif leading-none">
                  eVote Multi-State
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 uppercase font-mono">
                  SEC Digital
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 leading-tight mt-0.5">
                {t('nav.portalSubtitle', 'Secure Remote Voting System')}
              </p>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {t(link.key, link.defaultLabel)}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT: Language Selector + Auth CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors focus:outline-none cursor-pointer border border-slate-700/80 backdrop-blur-xs"
                aria-label="Select Language"
              >
                <FiGlobe className="text-blue-400" />
                <span>{currentLangObj?.nativeLabel || 'English'}</span>
                <FiChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-1.5 w-36 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-1 text-slate-200 z-50"
                  >
                    {languages.map((lng) => (
                      <button
                        key={lng.code}
                        onClick={() => {
                          changeLanguage(lng.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                          language === lng.code ? 'font-bold text-blue-400 bg-blue-500/10' : 'text-slate-300'
                        }`}
                      >
                        <span>{lng.nativeLabel}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{lng.code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={portalLink}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <MdHowToVote className="text-amber-300" />
                  <span>{portalLabel}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {t('nav.login', 'LOGIN')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
                >
                  {t('nav.register', 'REGISTER')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation (Dark Glass Theme) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#07111f]/98 backdrop-blur-xl border-b border-slate-800 px-4 py-4 space-y-3 shadow-2xl"
          >
            <nav className="flex flex-col space-y-1">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                      isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <span>{t(link.key, link.defaultLabel)}</span>
                  <FiArrowRight size={13} className="text-slate-500" />
                </NavLink>
              ))}
            </nav>

            {/* Mobile Language Selector */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <FiGlobe className="text-blue-400" /> Language:
              </span>
              <select
                value={language}
                onChange={(e) => {
                  changeLanguage(e.target.value);
                  setMenuOpen(false);
                }}
                className="text-xs font-bold bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none cursor-pointer"
              >
                {languages.map((lng) => (
                  <option key={lng.code} value={lng.code} className="bg-slate-900 text-white">
                    {lng.nativeLabel} ({lng.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Auth CTAs */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to={portalLink}
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-md flex items-center justify-center gap-2"
                  >
                    <MdHowToVote />
                    <span>{portalLabel}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-950/60 text-red-400 font-bold text-xs text-center border border-red-800/60 hover:bg-red-900/40 transition-colors cursor-pointer"
                  >
                    {t('citizen.signOut', 'Sign Out')}
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center border border-slate-700"
                  >
                    {t('nav.login', 'LOGIN')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-md"
                  >
                    {t('nav.register', 'REGISTER')}
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
