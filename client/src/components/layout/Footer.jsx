import React from 'react';
import { Link } from 'react-router-dom';
import { MdHowToVote, MdAccountBalance } from 'react-icons/md';
import { FiPhone, FiMail, FiMapPin, FiGithub, FiLinkedin, FiShield, FiAlertTriangle } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
    
    {/* Emergency Helpline Strip */}
    <div className="bg-amber-500 text-slate-950 font-bold py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-base shrink-0" />
          <span>NATIONAL VOTERS' HELPLINE TOLL-FREE: 1950 (24x7 Support)</span>
        </div>
        <span className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
          Election Grievance Portal Active
        </span>
      </div>
    </div>

    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      {/* Brand & Government Identity */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MdAccountBalance className="text-amber-500 text-3xl shrink-0" />
          <div>
            <p className="font-bold text-white text-base leading-tight">eVote Telangana</p>
            <p className="text-xs text-slate-400 leading-tight">State Election Commission Portal</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Official remote voting platform authorized by the Chief Electoral Officer, Telangana for transparent, secure digital elections.
        </p>
        <div className="flex gap-3 pt-1">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
            <FiGithub size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
            <FiLinkedin size={16} />
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
          Quick Links
        </h4>
        <ul className="space-y-2 text-xs">
          {[
            ['/', 'Portal Home'],
            ['/about', 'About eVote'],
            ['/elections', 'Active Elections'],
            ['/results', 'Election Results'],
            ['/announcements', 'Official Bulletins'],
          ].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500 text-[10px]">›</span> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Help & Policies */}
      <div>
        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
          Help & Policies
        </h4>
        <ul className="space-y-2 text-xs">
          {[
            ['/faq', 'Frequently Asked Questions'],
            ['/contact', 'Contact Support'],
            ['/about', 'Privacy Policy & Data Rights'],
            ['/about', 'Terms & Electoral Conditions'],
            ['/contact', 'Report Voting Vulnerability'],
          ].map(([to, label]) => (
            <li key={label}>
              <Link to={to} className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-500 text-[10px]">›</span> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Official Address & Emergency */}
      <div>
        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
          Commission Office
        </h4>
        <ul className="space-y-3 text-xs">
          <li className="flex items-start gap-2 text-slate-400">
            <FiMapPin className="mt-0.5 text-amber-500 shrink-0 text-sm" />
            <span>Chief Electoral Office, South Block, Secretariat, Hyderabad, Telangana – 500022</span>
          </li>
          <li className="flex items-center gap-2 text-slate-400">
            <FiPhone className="text-amber-500 shrink-0 text-sm" />
            <span>Toll-Free Helpline: 1800-425-1950</span>
          </li>
          <li className="flex items-center gap-2 text-slate-400">
            <FiMail className="text-amber-500 shrink-0 text-sm" />
            <span>ceo-telangana@eci.gov.in</span>
          </li>
        </ul>
      </div>

    </div>

    {/* Copyright & Disclaimer Bar */}
    <div className="border-t border-slate-900 bg-slate-950/80 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} State Election Commission, Telangana. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          <FiShield className="text-emerald-500" /> Designed for Government & Citizen Electoral Trust
        </p>
      </div>
    </div>

  </footer>
);

export default Footer;
