import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShield, FiInfo, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const CitizenLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user } = useAuth();
  const { language, changeLanguage, languages, t } = useLanguage();

  const isDemo = Boolean(
    user?.isDemoAccount || 
    (user?.mobileNumber && user.mobileNumber.startsWith('900000000')) ||
    user?.mobileNumber === '1234567890' || 
    user?.mobileNumber === '1234567891'
  );

  const userState = user?.state || 'Telangana';
  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* 1. Desktop Left Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar variant="citizen" />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar for Citizen Portal (Desktop & Mobile) */}
        <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
          {/* Indian Tiranga Strip */}
          <div className="h-1 w-full flex">
            <div className="h-full w-1/3 bg-[#FF9933]"></div>
            <div className="h-full w-1/3 bg-white"></div>
            <div className="h-full w-1/3 bg-[#138808]"></div>
          </div>

          <div className="px-4 py-3 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Toggle & State Portal Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <FiMenu size={20} />
              </button>
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <MdHowToVote className="text-lg text-amber-300" />
                </div>
                <div>
                  <h1 className="text-sm font-bold leading-tight font-serif">
                    eVote {userState}
                  </h1>
                  <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                    State Election Commission • Citizen Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Global Language Selector & Citizen Identity Badge */}
            <div className="flex items-center gap-3">
              
              {/* Global Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors focus:outline-none cursor-pointer border border-slate-700"
                  aria-label="Select Language"
                >
                  <FiGlobe className="text-blue-400" />
                  <span className="hidden sm:inline">{currentLangObj?.nativeLabel || 'English'}</span>
                  <span className="sm:hidden uppercase">{currentLangObj?.code || 'EN'}</span>
                  <FiChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-slate-800 z-50"
                    >
                      {languages.map((lng) => (
                        <button
                          key={lng.code}
                          onClick={() => {
                            changeLanguage(lng.code);
                            setLangOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                            language === lng.code ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span>{lng.nativeLabel}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{lng.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Demo Mode Badge & Elector Details */}
              {isDemo && (
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold">
                  <span>● DEMO</span>
                  <span className="text-slate-500">|</span>
                  <span>{user?.epicNumber || 'EPIC'}</span>
                </div>
              )}

              {/* Citizen Avatar */}
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>

            </div>

          </div>
        </header>

        {/* Mobile Animated Drawer (Left Sidebar on mobile) */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="fixed inset-y-0 left-0 w-72 max-w-[80vw] z-50 lg:hidden shadow-2xl bg-slate-900"
              >
                <Sidebar variant="citizen" isMobile={true} onClose={() => setDrawerOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;
