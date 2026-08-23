import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShield, FiCheckCircle } from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar variant="admin" />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header (Desktop & Mobile) */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          {/* Tiranga top accent */}
          <div className="h-1 w-full flex">
            <div className="h-full w-1/3 bg-[#FF9933]"></div>
            <div className="h-full w-1/3 bg-white"></div>
            <div className="h-full w-1/3 bg-[#138808]"></div>
          </div>

          <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between">
            {/* Left: Mobile hamburger & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open Admin Menu"
              >
                <FiMenu size={20} />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                  <MdAccountBalance className="text-xl" />
                </div>
                <div>
                  <h1 className="text-sm lg:text-base font-bold text-slate-800 leading-tight">
                    State Election Commission
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium">Administration & Control Panel</p>
                </div>
              </div>
            </div>

            {/* Right: Administrator Status & Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Session</span>
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-700 leading-tight">{user?.name || 'Admin User'}</p>
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Animated Drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-72 max-w-[85vw] bg-slate-900 shadow-2xl flex flex-col h-full z-10"
              >
                {/* Close Button */}
                <div className="absolute top-3.5 right-3 z-30">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close Admin Menu"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Admin Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <Sidebar variant="admin" isMobile={true} onClose={() => setDrawerOpen(false)} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
