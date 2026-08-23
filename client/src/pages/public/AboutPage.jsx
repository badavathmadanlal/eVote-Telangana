import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShield, 
  FiLock, 
  FiFileText, 
  FiAward, 
  FiCheckCircle, 
  FiGithub, 
  FiLinkedin, 
  FiMail, 
  FiExternalLink,
  FiCode
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';

const AboutPage = () => {
  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Banner */}
        <div className="bg-[#0a1428]/90 p-8 rounded-3xl shadow-xl border border-slate-800 space-y-3 text-center sm:text-left backdrop-blur-md">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <MdAccountBalance className="text-base" />
            <span>State Election Commission • Digital Democracy Initiative</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
            About eVote Multi-State
          </h1>
          
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            eVote Multi-State is a secure, verifiable remote electronic voting platform prototype designed to demonstrate the feasibility of constitutional, encrypted digital elections for citizens across 6 Indian states.
          </p>
        </div>

        {/* Mission & Key Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a1428]/80 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl">
              <MdHowToVote />
            </div>
            <h3 className="text-base font-bold text-white">Democratic Franchise Access</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enabling eligible electors, senior citizens, differently-abled voters, and remote residents to exercise their fundamental franchise safely without logistical barriers.
            </p>
          </div>

          <div className="bg-[#0a1428]/80 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
              <FiLock />
            </div>
            <h3 className="text-base font-bold text-white">Absolute Ballot Secrecy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilizing state-of-the-art cryptographic separation to ensure that a voter's identity is strictly decoupled from their cast candidate selection.
            </p>
          </div>

          <div className="bg-[#0a1428]/80 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
              <FiShield />
            </div>
            <h3 className="text-base font-bold text-white">End-to-End Verifiability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Providing individual voters with cryptographic digital participation receipts while preserving public tally auditability for election observers.
            </p>
          </div>
        </div>

        {/* Academic & Developer Spotlight Card */}
        <div className="bg-gradient-to-br from-[#071126] via-[#0a1835] to-[#071126] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-700/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                <FiCode /> Academic Engineering Project
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">Project Developer & Author</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">B.Tech Computer Science & Engineering</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                This project was conceptualized, designed, and developed by <strong className="text-white">Badavath Madanlal</strong> as an academic endeavor focused on secure systems architecture, distributed ledger integrity, and scalable citizen-centric public software.
              </p>
              <p>
                The platform demonstrates secure authentication flows, role-based governance, multi-language internationalization, and simulated cryptographic ballot recording adhering to standards inspired by the Election Commission of India.
              </p>
            </div>

            <div className="bg-[#050b1a]/90 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md">
                  BM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Badavath Madanlal</h4>
                  <p className="text-slate-400">Lead Developer & Researcher</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-slate-300">
                <p className="flex items-center gap-2">
                  <FiMail className="text-blue-400" />
                  <span>Email: <strong className="text-white font-mono">badavathmadanlal06@gmail.com</strong></span>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href="https://github.com/badavathmadanlal"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-xs"
                >
                  <FiGithub /> GitHub Profile
                </a>
                <a
                  href="https://www.linkedin.com/in/badavathmadanlal/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-xs shadow-sm"
                >
                  <FiLinkedin /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Academic & Demonstration Disclaimer */}
        <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/30 text-amber-200 space-y-2 text-xs backdrop-blur-xs">
          <h4 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-amber-300 font-mono">
            <FiShield className="text-amber-400" /> Academic Demonstration Prototype Notice
          </h4>
          <p className="leading-relaxed text-amber-200/90">
            eVote Multi-State is a demonstration system created strictly for educational, research, and technical feasibility exhibition purposes. This software is not an official electoral voting system for active government elections. Real election authority remains under the constitutional mandate of the Election Commission of India.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
