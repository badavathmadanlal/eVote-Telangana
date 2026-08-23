import React, { useState } from 'react';
import { FiArrowRight, FiInfo, FiChevronDown, FiUser, FiMapPin } from 'react-icons/fi';
import { MdHowToVote } from 'react-icons/md';
import { DEMO_CITIZENS, getDemoCitizenByState } from '../../constants/demoAccounts';

const STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Delhi',
  'Tamil Nadu',
  'Maharashtra',
  'Assam'
];

const AcademicDemoAccessCard = ({ onSelectAccount, activeMobile }) => {
  const [selectedState, setSelectedState] = useState('');

  const activeCitizen = selectedState ? getDemoCitizenByState(selectedState) : null;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
            <MdHowToVote />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-serif">
            ACADEMIC DEMO ACCESS
          </h3>
        </div>
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed">
        Select state-wise sample data to access the corresponding citizen demo portal.
      </p>

      {/* State Dropdown Selector */}
      <div className="space-y-2">
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">
              Select State ▼
            </option>
            {STATES.map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-slate-200">
                {st}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            <FiChevronDown />
          </div>
        </div>

        {/* Single Dynamic Citizen Card for Selected State */}
        {activeCitizen && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onSelectAccount && onSelectAccount(activeCitizen.mobile)}
              className="w-full flex items-center justify-between p-3 rounded-xl text-left border bg-slate-950/90 hover:bg-slate-800/90 border-amber-500/50 hover:border-amber-400 transition-all group focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-md"
              title={`Use demo citizen: ${activeCitizen.name} (${activeCitizen.state})`}
            >
              <div className="min-w-0 pr-2 space-y-0.5">
                <p className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                  {activeCitizen.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-amber-400 font-semibold">{activeCitizen.state}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-slate-300">{activeCitizen.epic}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Mobile: <span className="text-slate-300 font-bold">{activeCitizen.mobile}</span> (OTP: 123456)
                </div>
              </div>

              <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 shrink-0 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/30">
                Use Demo <FiArrowRight size={11} />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400">
        <FiInfo className="text-amber-400 shrink-0 text-xs" />
        <span>Fictional sample citizens for Final Year Project demonstration only.</span>
      </div>
    </div>
  );
};

export default AcademicDemoAccessCard;
