import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdHowToVote, MdVerifiedUser, MdSecurity, MdAnalytics, MdOutlinePeopleOutline, MdCheckCircle } from 'react-icons/md';
import { FiArrowRight, FiCheckCircle, FiShield, FiLock, FiFileText, FiBell, FiChevronRight } from 'react-icons/fi';
import Button from '../../components/ui/Button';

const HomePage = () => {
  return (
    <div className="space-y-0 bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Government Portal Hero Section */}
      <section className="relative bg-[#0f172a] text-white overflow-hidden border-b-[8px] border-amber-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent"></div>
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-24 translate-y-24">
          <MdHowToVote className="text-[500px] text-white" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">
              <FiShield className="text-sm" /> State Election Commission
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-serif text-white">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">
                Democracy is Digital
              </span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Telangana's highly secure, remote electronic voting system. Exercise your democratic right from anywhere, with absolute privacy and tamper-proof ledger security.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 border-none shadow-lg px-8 py-3 rounded-none flex items-center gap-2">
                  Register to Vote <FiArrowRight className="text-lg" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-slate-500 text-slate-200 hover:bg-slate-800 hover:text-white rounded-none px-8 py-3">
                  Citizen Login
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-8 border-t border-slate-800/60 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400 text-lg" />
                <span>AADHAAR VERIFIED</span>
              </div>
              <div className="flex items-center gap-2">
                <FiLock className="text-blue-400 text-lg" />
                <span>E2E ENCRYPTED</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFileText className="text-amber-400 text-lg" />
                <span>AUDITABLE TRAIL</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            {/* Complex Illustration / Dashboard Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 p-2 rounded-xl shadow-2xl relative z-10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">SEC_PORTAL_V2</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2 mb-6"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gradient-to-br from-blue-900/50 to-slate-800 rounded-lg border border-blue-500/30"></div>
                      <div className="h-24 bg-gradient-to-br from-emerald-900/50 to-slate-800 rounded-lg border border-emerald-500/30"></div>
                    </div>
                    <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700 mt-4 flex items-center justify-center">
                      <MdHowToVote className="text-6xl text-slate-700" />
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -right-6 -bottom-6 bg-emerald-500 text-slate-900 p-4 rounded-lg shadow-xl font-bold flex items-center gap-3 transform rotate-[5deg]">
                  <MdCheckCircle className="text-2xl" />
                  <div>
                    <div className="text-xs opacity-80 uppercase">Status</div>
                    <div className="text-sm">Ballot Cast</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Key Statistics Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900 font-serif">119</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Constituencies</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900 font-serif">3.2<span className="text-blue-600">cr</span></p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Registered Voters</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900 font-serif">100<span className="text-emerald-500">%</span></p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Secure & Encrypted</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900 font-serif">24/7</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Remote Access</p>
          </div>
        </div>
      </section>

      {/* 3. Quick Services & Announcements Split */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Quick Services (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-end justify-between border-b-2 border-slate-200 pb-2">
            <h2 className="text-2xl font-black text-slate-900 font-serif">Citizen Services</h2>
            <Link to="/elections" className="text-sm font-bold text-blue-700 hover:underline flex items-center gap-1">
              View All <FiChevronRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link to="/register" className="group bg-white p-6 border-2 border-slate-100 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <MdOutlinePeopleOutline />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Voter Registration</h3>
              <p className="text-sm text-slate-600">Enroll yourself on the digital platform using your existing EPIC details.</p>
            </Link>

            <Link to="/elections" className="group bg-white p-6 border-2 border-slate-100 hover:border-emerald-500 rounded-xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <MdHowToVote />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Active Elections</h3>
              <p className="text-sm text-slate-600">View upcoming and ongoing elections in your registered constituency.</p>
            </Link>

            <Link to="/results" className="group bg-white p-6 border-2 border-slate-100 hover:border-amber-500 rounded-xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <MdAnalytics />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Election Results</h3>
              <p className="text-sm text-slate-600">Access transparent and verified results immediately after counting concludes.</p>
            </Link>

            <Link to="/login" className="group bg-white p-6 border-2 border-slate-100 hover:border-purple-500 rounded-xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <MdVerifiedUser />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Check Status</h3>
              <p className="text-sm text-slate-600">Login to check your verification status and update your profile details.</p>
            </Link>
          </div>
        </div>

        {/* Announcements (1/3) */}
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
          <div className="bg-slate-900 text-white p-4 flex items-center gap-2">
            <FiBell className="text-amber-400 text-lg animate-pulse" />
            <h3 className="font-bold text-lg">Official Notice Board</h3>
          </div>
          <div className="p-0 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  <div className="shrink-0 text-center bg-slate-100 rounded p-2 border border-slate-200 min-w-[3.5rem]">
                    <p className="text-xs font-bold text-red-600 uppercase">Oct</p>
                    <p className="text-lg font-black text-slate-800 leading-none mt-1">2{i}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm hover:text-blue-700 cursor-pointer">
                      Schedule for General Elections to the Legislative Assembly
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      The Election Commission has announced the schedule for the upcoming assembly elections across all 119 constituencies.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link to="/announcements" className="text-xs font-bold text-blue-700 uppercase tracking-wider hover:underline">
              View All Notices
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Help & Support */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black font-serif">Need Assistance?</h2>
            <p className="text-slate-300">
              Our support team is available to help you with registration, verification, or any technical issues faced during the voting process.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-xl text-amber-400">
                  <FiFileText />
                </div>
                <div>
                  <h4 className="font-bold">Frequently Asked Questions</h4>
                  <Link to="/faq" className="text-sm text-blue-400 hover:underline">Read the FAQ</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-xl text-emerald-400">
                  <FiLock />
                </div>
                <div>
                  <h4 className="font-bold">Security Guidelines</h4>
                  <Link to="/about" className="text-sm text-blue-400 hover:underline">Read about our encryption</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-900/40 border border-blue-500/30 p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-black mb-2">Toll Free Helpline</h3>
            <p className="text-6xl font-black text-amber-400 font-serif tracking-widest mb-4">1950</p>
            <p className="text-sm text-slate-300">Available from 8:00 AM to 8:00 PM</p>
            <Link to="/contact">
              <Button className="mt-6 bg-white text-blue-900 hover:bg-slate-100 font-bold px-8">
                Contact Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
