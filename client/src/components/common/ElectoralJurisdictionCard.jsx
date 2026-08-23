import React from 'react';
import { FiMapPin, FiCheckCircle, FiShield } from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';

const ElectoralJurisdictionCard = ({ user, title = 'YOUR ELECTORAL JURISDICTION', compact = false }) => {
  const state = user?.state || 'Telangana';
  const district = user?.district || 'Hyderabad';
  const mandal = user?.mandal || 'Musheerabad';
  const village = user?.village || mandal || 'Demo Village';
  const constituency = user?.constituency || '057-Musheerabad';
  const epicNumber = user?.epicNumber || 'DEMO-TEL-001';

  if (compact) {
    return (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-serif">
            <MdAccountBalance />
            <span>{title}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
            VERIFIED
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">State:</span>
            <strong className="text-white font-medium">{state}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">District:</span>
            <strong className="text-white font-medium">{district}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Mandal / Village:</span>
            <strong className="text-white font-medium">{mandal} • {village}</strong>
          </div>
          <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">Constituency:</span>
            <strong className="text-amber-300 font-mono font-bold">{constituency}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-base">
            <MdAccountBalance />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 font-serif">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400">Authenticated Elector Roll Record</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
          <FiCheckCircle /> AUTHENTICATED
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">State</span>
          <p className="font-bold text-white mt-0.5 flex items-center gap-1">
            <FiCheckCircle className="text-emerald-400 text-[10px]" /> {state}
          </p>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">District</span>
          <p className="font-bold text-white mt-0.5 flex items-center gap-1">
            <FiCheckCircle className="text-emerald-400 text-[10px]" /> {district}
          </p>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Mandal</span>
          <p className="font-bold text-white mt-0.5 flex items-center gap-1">
            <FiCheckCircle className="text-emerald-400 text-[10px]" /> {mandal}
          </p>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Village / Locality</span>
          <p className="font-bold text-white mt-0.5 flex items-center gap-1 truncate">
            <FiCheckCircle className="text-emerald-400 text-[10px]" /> {village}
          </p>
        </div>

        <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 col-span-2 sm:col-span-1">
          <span className="text-amber-400 text-[10px] font-bold uppercase block">Constituency</span>
          <p className="font-black text-amber-300 font-mono mt-0.5 truncate">
            {constituency}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span>Voter ID (EPIC):</span>
          <strong className="text-slate-200 font-mono">{epicNumber}</strong>
        </div>
        <p className="text-amber-400/90 text-[11px] font-medium">
          Authorized to vote exclusively within registered constituency ({constituency})
        </p>
      </div>
    </div>
  );
};

export default ElectoralJurisdictionCard;
