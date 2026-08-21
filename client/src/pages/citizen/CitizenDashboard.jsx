import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FiUserCheck, FiShield, FiBell, FiChevronRight, FiClock } from 'react-icons/fi';
import { MdHowToVote } from 'react-icons/md';

const CitizenDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">Welcome back, {user?.firstName} {user?.lastName}</h1>
          <p className="text-sm text-slate-500">Access your digital voter profile and participate in active elections.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
          <FiShield />
          <span className="text-xs font-bold uppercase tracking-wider">Secure Session</span>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Verification Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl">
            <FiUserCheck />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Identity Verification</h3>
            <p className="text-xs text-slate-500 mt-1">Pending KYC approval</p>
          </div>
          <Link to="/citizen/verification" className="text-xs font-bold text-blue-600 hover:underline mt-auto pt-2">
            Complete Verification
          </Link>
        </div>

        {/* Voting Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl">
            <MdHowToVote />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Voting Status</h3>
            <p className="text-xs text-slate-500 mt-1">Eligible to vote</p>
          </div>
          <Link to="/citizen/history" className="text-xs font-bold text-blue-600 hover:underline mt-auto pt-2">
            View Vote History
          </Link>
        </div>

        {/* Active Elections */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col space-y-3 col-span-1 lg:col-span-2 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
            <MdHowToVote className="text-9xl text-white" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Active
            </div>
            <h3 className="text-xl font-bold font-serif mb-1">State Assembly Elections 2026</h3>
            <p className="text-xs text-slate-300 flex-1">Your registered constituency has an ongoing election event.</p>
            
            <Link to="/citizen/elections" className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold py-2 px-4 rounded flex items-center justify-center gap-2 mt-4 transition-colors w-full sm:w-auto">
              Proceed to Ballot <FiChevronRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-900 flex items-center gap-2">
            <FiClock className="text-blue-600" /> Recent Activity
          </div>
          <div className="p-0 divide-y divide-slate-100 text-sm">
            <div className="p-4 text-slate-600 flex justify-between items-center">
              <span>Account Login</span>
              <span className="text-xs text-slate-400">Just now</span>
            </div>
            <div className="p-4 text-slate-600 flex justify-between items-center">
              <span>Password Changed</span>
              <span className="text-xs text-slate-400">2 days ago</span>
            </div>
            <div className="p-4 text-slate-600 flex justify-between items-center">
              <span>Profile Registered</span>
              <span className="text-xs text-slate-400">5 days ago</span>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-900 flex items-center gap-2">
            <FiBell className="text-amber-500" /> Important Notices
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
              <h4 className="text-sm font-bold text-red-900">Complete KYC Verification</h4>
              <p className="text-xs text-red-700 mt-1">You must verify your identity before you can cast a vote.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
              <h4 className="text-sm font-bold text-blue-900">Election Schedule Announced</h4>
              <p className="text-xs text-blue-700 mt-1">Voting lines will be open from Nov 30, 8:00 AM to 5:00 PM.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CitizenDashboard;
