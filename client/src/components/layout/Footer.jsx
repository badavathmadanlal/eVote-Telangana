import React from 'react';
import { Link } from 'react-router-dom';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiGithub, 
  FiLinkedin, 
  FiShield, 
  FiAlertTriangle, 
  FiCode
} from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
    
    {/* 1. National Voters' Helpline Strip */}
    <div className="bg-amber-500 text-slate-950 font-bold py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-base shrink-0" />
          <span>NATIONAL VOTERS' HELPLINE TOLL-FREE: 1950 (24x7 Electoral Support)</span>
        </div>
        <span className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono">
          State Election Commission Telangana • Digital Portal
        </span>
      </div>
    </div>

    {/* 2. Main Footer Grid */}
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
      
      {/* Col 1: Brand & Academic Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700/30 border border-blue-500/40 flex items-center justify-center text-amber-400 text-2xl">
            <MdHowToVote />
          </div>
          <div>
            <p className="font-bold text-white text-base leading-tight font-serif">eVote Telangana</p>
            <p className="text-[11px] text-slate-400 leading-tight">Secure Remote Voting System</p>
          </div>
        </div>

        <p className="text-slate-400 leading-relaxed text-xs">
          An academic prototype for next-generation digital democratic voting featuring homomorphic end-to-end ballot encryption and verifiable electoral audit trails.
        </p>

        {/* Social Developer Links */}
        <div className="flex gap-2.5 pt-1">
          <a 
            href="https://github.com/badavathmadanlal" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="GitHub Profile"
          >
            <FiGithub size={16} />
          </a>
          <a 
            href="https://www.linkedin.com/in/badavathmadanlal/" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-blue-400 border border-slate-800 transition-colors"
            title="LinkedIn Profile"
          >
            <FiLinkedin size={16} />
          </a>
        </div>
      </div>

      {/* Col 2: Portal Navigation */}
      <div>
        <h4 className="text-white font-bold mb-4 uppercase tracking-wider border-b border-slate-800 pb-2 text-xs">
          Quick Links
        </h4>
        <ul className="space-y-2.5">
          {[
            ['/', 'Portal Home'],
            ['/about', 'About eVote Initiative'],
            ['/elections', 'Active & Scheduled Elections'],
            ['/results', 'Live Certified Results'],
            ['/announcements', 'Official Gazette Bulletins'],
            ['/faq', 'Frequently Asked Questions'],
          ].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                <span className="text-amber-500 text-[10px]">›</span> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Col 3: Student Project Developer Details */}
      <div>
        <h4 className="text-white font-bold mb-4 uppercase tracking-wider border-b border-slate-800 pb-2 text-xs flex items-center gap-1.5">
          <FiCode className="text-amber-400" /> Developer Information
        </h4>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Lead Developer</p>
            <p className="font-bold text-white text-xs">Badavath Madanlal</p>
            <p className="text-[11px] text-amber-400">B.Tech Computer Science & Engineering</p>
          </div>

          <div className="pt-1 border-t border-slate-800 space-y-1">
            <p className="flex items-center gap-2 text-slate-300 text-xs">
              <FiMail className="text-blue-400 shrink-0" />
              <span className="truncate">badavathmadanlal06@gmail.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Col 4: Official Commission & Emergency */}
      <div>
        <h4 className="text-white font-bold mb-4 uppercase tracking-wider border-b border-slate-800 pb-2 text-xs">
          Electoral Secretariat
        </h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-slate-400">
            <FiMapPin className="mt-0.5 text-amber-500 shrink-0 text-sm" />
            <span>Chief Electoral Office, South Block, Secretariat, Hyderabad, Telangana — 500022</span>
          </li>
          <li className="flex items-center gap-2 text-slate-400">
            <FiPhone className="text-emerald-400 shrink-0 text-sm" />
            <span>Toll-Free Helpline: 1800-425-1950</span>
          </li>
          <li className="flex items-center gap-2 text-slate-400">
            <FiShield className="text-blue-400 shrink-0 text-sm" />
            <span>ECI Standards Certified Prototype</span>
          </li>
        </ul>
      </div>

    </div>

    {/* 3. Academic Disclaimer & Copyright Bar */}
    <div className="border-t border-slate-900 bg-slate-950 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center md:text-left">
        <div>
          <p className="font-semibold text-slate-300">
            Developed by Badavath Madanlal | B.Tech CSE Student
          </p>
          <p className="text-slate-400 text-[10px] mt-0.5">
            Academic / Student Project — For educational and demonstration purposes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span>eVote Telangana — Secure Remote Voting System &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>

  </footer>
);

export default Footer;
