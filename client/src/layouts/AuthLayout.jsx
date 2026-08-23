import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiShield, FiLock, FiCheckCircle, FiPhoneCall, FiArrowLeft } from 'react-icons/fi';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* 1. Indian Tiranga Top Accent Strip */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Left Informational Panel (xl: 4/12 width) */}
        <div className="hidden xl:flex flex-col justify-between w-4/12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-10 border-r border-slate-800 relative overflow-hidden">
          
          {/* Subtle blurred aura */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="space-y-3 relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-amber-300 flex items-center justify-center text-2xl shadow-md border border-blue-400/30">
                <MdHowToVote />
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-serif tracking-tight text-white leading-tight">
                  eVote Telangana
                </h1>
                <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  State Election Commission
                </p>
              </div>
            </Link>

            <div className="pt-2">
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                Secure Remote Authentication Terminal
              </span>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-6 relative z-10 py-6">
            <h2 className="text-2xl sm:text-3xl font-black font-serif leading-snug text-white">
              Exercise Your Franchise <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                Safely & Privately
              </span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for simple citizen access across urban and rural Telangana with multi-factor identity authentication and secret ballot encryption.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <FiCheckCircle size={13} /> Aadhaar Verified
                </div>
                <p className="text-[11px] text-slate-400">Single active vote per registered elector</p>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                  <FiLock size={13} /> Secret Ballot
                </div>
                <p className="text-[11px] text-slate-400">Cryptographically severed from identity</p>
              </div>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Developed by <strong className="text-slate-300">Badavath Madanlal</strong></span>
            <span className="flex items-center gap-1 text-emerald-400">
              <FiPhoneCall size={12} /> Helpline 1950
            </span>
          </div>

        </div>

        {/* Right Form Outlet Panel (Spacious container for 2-column desktop layout) */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-950 overflow-y-auto">
          <div className="w-full max-w-5xl space-y-4">
            
            {/* Top Navigation Strip */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-amber-300 flex items-center justify-center text-xl">
                  <MdHowToVote />
                </div>
                <span className="font-bold text-base text-white font-serif">eVote Telangana</span>
              </Link>

              <Link to="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                <FiArrowLeft size={13} /> Back to Public Home
              </Link>
            </div>

            {/* Main Page Outlet */}
            <Outlet />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
