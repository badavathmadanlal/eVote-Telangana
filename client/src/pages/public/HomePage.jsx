import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiShield, 
  FiLock, 
  FiFileText, 
  FiUserCheck
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance, MdOutlineFingerprint } from 'react-icons/md';
import { useLanguage } from '../../hooks/useLanguage';
import indianFlagBg from '../../assets/indian_flag_bg.jpg';

const STEPS = [
  {
    number: '01',
    title: 'Citizen Registration',
    desc: 'Register with your verified EPIC voter card credentials and mobile number.',
    icon: <FiUserCheck className="text-2xl text-blue-400" />
  },
  {
    number: '02',
    title: 'Identity (KYC) Verification',
    desc: 'Instant demographic verification against the State Electoral Roll database.',
    icon: <MdOutlineFingerprint className="text-2xl text-amber-400" />
  },
  {
    number: '03',
    title: 'Cast Encrypted Ballot',
    desc: 'Vote in your registered constituency using 256-bit homomorphic encryption.',
    icon: <MdHowToVote className="text-2xl text-emerald-400" />
  },
  {
    number: '04',
    title: 'Verify & Audit Results',
    desc: 'Obtain an immutable cryptographic voting receipt with real-time tally auditability.',
    icon: <FiShield className="text-2xl text-purple-400" />
  }
];

const PILLARS = [
  {
    title: 'Constitutional Secret Ballot',
    desc: 'Your identity is mathematically decoupled from your cast vote before entering the state ballot vault.',
    icon: <FiLock className="text-2xl text-amber-400" />
  },
  {
    title: 'Immutable Audit Trail',
    desc: 'Every ballot cast produces a tamper-evident cryptographic hash for decentralized verification.',
    icon: <FiFileText className="text-2xl text-emerald-400" />
  },
  {
    title: 'Certified Accessibility',
    desc: 'Enabling remote franchise participation for elderly, disabled, and remote electors across the nation.',
    icon: <FiCheckCircle className="text-2xl text-blue-400" />
  }
];

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-0 bg-[#050b1a] text-white min-h-screen w-full overflow-x-hidden">
      
      {/* 1. Full-Screen Cinematic Indian Flag Background Hero Section */}
      <section className="relative bg-[#050b1a] text-white overflow-hidden py-12 sm:py-16 lg:py-24 border-b-2 border-amber-500/40 min-h-[580px] sm:min-h-[640px] flex items-center">
        
        {/* Full-Bleed Photograph Background Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          
          {/* Exact Indian Flag Photograph Layer (High Visibility) */}
          <div 
            className="absolute inset-0 bg-cover bg-center cinematic-flag-bg"
            style={{
              backgroundImage: `url(${indianFlagBg})`,
              backgroundPosition: 'center 28%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />

          {/* Balanced Dark Navy Cinematic Overlay (Allows Saffron/White/Green & Chakra to Shine Through) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050b1a]/70 via-[#071126]/45 to-[#050b1a]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(5,11,26,0.25)_0%,rgba(5,11,26,0.75)_100%)]" />

          {/* Subtle Ambient Tiranga Flares */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF9933]/15 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#138808]/15 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center w-full">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            {/* Top Indicator Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs backdrop-blur-xs flex-wrap justify-center lg:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>State Election Commission Portal</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-mono">National eVote System</span>
            </div>

            {/* Main Headline (Responsive Scale) */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-[1.15] text-white drop-shadow-lg break-words">
              Empowering Democracy Through{' '}
              <br className="hidden sm:inline" />
              <span className="text-amber-500">Secure </span>
              <span className="text-white">Remote </span>
              <span className="text-emerald-400">Voting</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              A next-generation electronic voting system engineered with cryptographic vote privacy, demographic identity validation, and immutable electoral auditability across 6 Indian states.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3.5 px-8 rounded-xl text-xs sm:text-sm shadow-xl hover:shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Register to Vote</span>
                <FiArrowRight />
              </Link>
              
              <Link
                to="/elections"
                className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm border border-slate-700/90 flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-md backdrop-blur-xs"
              >
                <div className="w-5 h-5 rounded-md bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 text-xs">
                  <MdHowToVote />
                </div>
                <span>Explore Elections</span>
              </Link>
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-[11px] sm:text-xs text-slate-400 font-medium text-left">
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-400 shrink-0" /> Aadhaar KYC Verified
              </span>
              <span className="flex items-center gap-1.5">
                <FiLock className="text-blue-400 shrink-0" /> End-to-End Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <FiFileText className="text-amber-400 shrink-0" /> Cryptographic Receipts
              </span>
              <span className="flex items-center gap-1.5">
                <FiShield className="text-purple-400 shrink-0" /> Multi-State Secure
              </span>
            </div>

          </div>

          {/* Right Column: Academic Demo Banner & Live ECI Portal Card (Dark Glass) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-4 w-full">
            
            {/* 1. Academic Demo Notice Banner (Dark Glass) */}
            <div className="w-full max-w-md bg-[#0a1428]/85 border border-amber-500/30 rounded-2xl p-4 sm:p-4.5 shadow-2xl backdrop-blur-md text-left space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  FINAL YEAR PROJECT DEMO
                </span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Academic demonstration spanning 6 states with fictional demographic rolls and mock candidate ballots for B.Tech project presentation.
              </p>
            </div>

            {/* 2. Official State Portals Card (Dark Glass) */}
            <div className="w-full max-w-md bg-[#0a1428]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-700/80 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MdAccountBalance className="text-amber-400 text-lg sm:text-xl" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">OFFICIAL STATE PORTALS</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-mono">
                  ● 6 STATES ACTIVE
                </span>
              </div>

              {/* Metrics Table */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Total Elections:</span>
                  <span className="font-mono font-bold text-amber-400">30 Active / Upcoming</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Supported States:</span>
                  <span className="font-mono font-bold text-slate-200">TS, AP, DL, TN, MH, AS</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Ballot Privacy:</span>
                  <span className="font-mono font-bold text-emerald-400">256-bit Encrypted Vault</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold text-center border border-slate-700 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/results"
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center transition-all shadow-md flex items-center justify-center cursor-pointer"
                >
                  Live Results
                </Link>
              </div>

              {/* Project Credit Note */}
              <div className="pt-2 border-t border-slate-800/80 text-center">
                <p className="text-[10px] text-slate-500 font-mono">
                  Designed & Developed by <span className="text-slate-400 font-medium">Badavath Madanlal</span>
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 2. Four-Step Electoral Process Section (Dark Navy Theme) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 bg-[#050b1a]">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-xs font-bold font-mono tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif text-white">
            {t('home.howItWorksTitle', 'Four Steps to Digital Franchise')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A frictionless, government-grade workflow from voter identity validation to cryptographic receipt generation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="bg-[#0a1428]/80 rounded-2xl p-6 border border-slate-800 shadow-lg hover:border-slate-700 transition-all space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform border border-slate-800">
                  {step.icon}
                </div>
                <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-blue-400 transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="font-bold text-base text-white font-serif">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Constitutional Pillars Section (Dark Theme) */}
      <section className="bg-[#071126] text-white py-14 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <span className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              TRUST & INTEGRITY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-serif">
              Constitutional Pillars of eVote
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Upholding the Representation of the People Act with cutting-edge zero-trust cryptographic guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PILLARS.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-[#0a1428]/90 rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="p-3.5 bg-slate-900 inline-block rounded-xl border border-slate-800">
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white font-serif">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Supported State Portals CTA Strip */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 bg-[#050b1a]">
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border border-blue-900/60 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif">
              Ready to Explore Your State Portal?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Select from Telangana, Andhra Pradesh, Delhi, Tamil Nadu, Maharashtra, or Assam to view state-specific constituencies, active ballots, and official announcements.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              to="/elections"
              className="w-full sm:w-auto text-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-6 sm:py-3.5 sm:px-7 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Browse Active Elections
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 sm:py-3.5 sm:px-7 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
            >
              About the Project
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
