import React from 'react';

/**
 * Candidate Party Symbol Visual Component
 * Replaces letter placeholders with high-resolution, vector election party symbols.
 * Works uniformly across all 6 supported states (Telangana, AP, Delhi, TN, MH, Assam).
 * 
 * @param {Object} props
 * @param {string} props.symbol - Symbol name string e.g. "Bicycle / Cycle", "Torch", "Rising Sun", "Plow", etc.
 * @param {string} [props.className] - Extra Tailwind classes for sizing/container
 * @param {number} [props.size=32] - Icon dimension in pixels
 */
const CandidateSymbol = ({ symbol = '', className = '', size = 32 }) => {
  const norm = (symbol || '').toLowerCase();

  // Helper SVG container
  const renderSvg = (content, bgGradient = 'from-slate-100 to-slate-200', borderColor = 'border-slate-300') => (
    <div
      className={`rounded-xl bg-gradient-to-br ${bgGradient} border ${borderColor} flex items-center justify-center shadow-xs shrink-0 overflow-hidden ${className}`}
      style={{ width: size + 16, height: size + 16 }}
      title={`Allotted Electoral Symbol: ${symbol}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {content}
      </svg>
    </div>
  );

  // 1. Bicycle / Cycle
  if (norm.includes('bicycle') || norm.includes('cycle')) {
    return renderSvg(
      <g stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Back wheel */}
        <circle cx="5.5" cy="16.5" r="3.5" fill="#f1f5f9" />
        {/* Front wheel */}
        <circle cx="18.5" cy="16.5" r="3.5" fill="#f1f5f9" />
        {/* Frame */}
        <path d="M5.5 16.5 L10 16.5 L14 10 L8.5 10 L5.5 16.5 Z" fill="none" stroke="#2563eb" strokeWidth="1.8" />
        <path d="M10 16.5 L12 9 L11 7.5 H9" />
        <path d="M14 10 L18.5 16.5" />
        {/* Handlebar */}
        <path d="M17 9 L18.5 7 L20 7" stroke="#dc2626" />
        {/* Seat */}
        <path d="M7.5 7.5 H12.5" stroke="#0f172a" strokeWidth="2.2" />
        {/* Pedals */}
        <circle cx="10" cy="16.5" r="1" fill="#0f172a" />
      </g>,
      'from-blue-50 to-indigo-100',
      'border-blue-300'
    );
  }

  // 2. Torch / Deepam
  if (norm.includes('torch') || norm.includes('deepam') || norm.includes('flame')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Flame */}
        <path d="M12 2 C13.5 4.5 16 6 15 9 C14.5 10.5 13.5 11 12 11 C10.5 11 9.5 10.5 9 9 C8 6 10.5 4.5 12 2 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
        <path d="M12 4.5 C12.8 6 14 7 13.5 8.5 C13 9.2 12.5 9.5 12 9.5 C11.5 9.5 11 9.2 10.5 8.5 C10 7 11.2 6 12 4.5 Z" fill="#facc15" />
        {/* Torch Cup */}
        <path d="M8 11 H16 L14.5 14 H9.5 L8 11 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.4" />
        {/* Handle */}
        <path d="M10.5 14 L11 22 H13 L13.5 14" fill="#92400e" stroke="#451a03" strokeWidth="1.4" />
        {/* Grip stripes */}
        <line x1="11" y1="16.5" x2="13" y2="16.5" stroke="#fef3c7" strokeWidth="1.2" />
        <line x1="11" y1="19" x2="13" y2="19" stroke="#fef3c7" strokeWidth="1.2" />
      </g>,
      'from-amber-50 to-orange-100',
      'border-amber-300'
    );
  }

  // 3. Rising Sun / Sun / Suryudu
  if (norm.includes('sun') || norm.includes('suryudu') || norm.includes('rising')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Horizon */}
        <line x1="2" y1="17" x2="22" y2="17" stroke="#b45309" strokeWidth="1.8" />
        {/* Half Sun Body */}
        <path d="M6 17 A6 6 0 0 1 18 17 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        {/* Sun Rays */}
        <line x1="12" y1="4" x2="12" y2="7.5" stroke="#ea580c" strokeWidth="2" />
        <line x1="6.5" y1="6.5" x2="8.8" y2="9.2" stroke="#ea580c" strokeWidth="2" />
        <line x1="17.5" y1="6.5" x2="15.2" y2="9.2" stroke="#ea580c" strokeWidth="2" />
        <line x1="3.5" y1="12" x2="6.8" y2="13" stroke="#ea580c" strokeWidth="2" />
        <line x1="20.5" y1="12" x2="17.2" y2="13" stroke="#ea580c" strokeWidth="2" />
        {/* Water / Ground lines */}
        <line x1="4" y1="19.5" x2="20" y2="19.5" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 2" />
      </g>,
      'from-amber-50 to-yellow-100',
      'border-amber-300'
    );
  }

  // 4. Plow / Nagali
  if (norm.includes('plow') || norm.includes('nagali')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Main Beam */}
        <path d="M3 8 L14 16 L19 16" stroke="#78350f" strokeWidth="2.2" />
        {/* Handle */}
        <path d="M12 7 L15 17" stroke="#92400e" strokeWidth="2" />
        <line x1="10" y1="7" x2="14" y2="7" stroke="#451a03" strokeWidth="2.2" />
        {/* Metal Share / Blade */}
        <path d="M14 16 L21 21 L17 21 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
      </g>,
      'from-emerald-50 to-amber-100',
      'border-emerald-300'
    );
  }

  // 5. Broom
  if (norm.includes('broom')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Handle */}
        <line x1="19" y1="5" x2="10" y2="14" stroke="#92400e" strokeWidth="2.2" />
        {/* Bristle head */}
        <path d="M10 14 L5 21 C7 21.5 11 20 12.5 16.5 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
        {/* Bristle binding */}
        <line x1="9" y1="13" x2="11.5" y2="15.5" stroke="#dc2626" strokeWidth="2" />
      </g>,
      'from-blue-50 to-amber-100',
      'border-slate-300'
    );
  }

  // 6. Flower / Lotus
  if (norm.includes('flower') || norm.includes('lotus')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Center Petal */}
        <path d="M12 4 C10 8 10 14 12 18 C14 14 14 8 12 4 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1.2" />
        {/* Left Petal */}
        <path d="M12 9 C8 10 6 14 8 18 C10 17 11.5 15 12 13 Z" fill="#fb7185" stroke="#be123c" strokeWidth="1.2" />
        {/* Right Petal */}
        <path d="M12 9 C16 10 18 14 16 18 C14 17 12.5 15 12 13 Z" fill="#fb7185" stroke="#be123c" strokeWidth="1.2" />
        {/* Stem / Base */}
        <path d="M7 19 C10 21 14 21 17 19" stroke="#15803d" strokeWidth="1.8" fill="none" />
      </g>,
      'from-rose-50 to-pink-100',
      'border-rose-300'
    );
  }

  // 7. Book
  if (norm.includes('book')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M4 19.5 C5.5 18 8 17.5 12 17.5 C16 17.5 18.5 18 20 19.5 V6.5 C18.5 5 16 4.5 12 4.5 C8 4.5 5.5 5 4 6.5 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
        <path d="M12 4.5 V17.5" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="6.5" y1="8.5" x2="10" y2="8.5" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="6.5" y1="11.5" x2="10" y2="11.5" stroke="#ffffff" strokeWidth="1.2" />
      </g>,
      'from-blue-50 to-sky-100',
      'border-blue-300'
    );
  }

  // 8. Scale
  if (norm.includes('scale')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Center post */}
        <line x1="12" y1="4" x2="12" y2="20" stroke="#475569" strokeWidth="1.8" />
        <line x1="8" y1="20" x2="16" y2="20" stroke="#475569" strokeWidth="2" />
        {/* Beam */}
        <line x1="4" y1="7" x2="20" y2="7" stroke="#475569" strokeWidth="2" />
        {/* Left Pan */}
        <path d="M4 7 L2 13 H8 Z" fill="#9333ea" stroke="#7e22ce" strokeWidth="1.2" />
        {/* Right Pan */}
        <path d="M20 7 L18 13 H24 Z" fill="#9333ea" stroke="#7e22ce" strokeWidth="1.2" />
      </g>,
      'from-purple-50 to-violet-100',
      'border-purple-300'
    );
  }

  // 9. Tree
  if (norm.includes('tree')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Trunk */}
        <rect x="10.5" y="14" width="3" height="7" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        {/* Foliage */}
        <path d="M12 3 C8 3 5 7 6 10 C4 11 4 14 7 15 C8 15 16 15 17 15 C20 14 20 11 18 10 C19 7 16 3 12 3 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.4" />
      </g>,
      'from-emerald-50 to-green-100',
      'border-emerald-300'
    );
  }

  // 10. Lamp
  if (norm.includes('lamp')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Flame */}
        <path d="M12 4 C13.5 6 14 8 12.5 10 C12 10.5 11.5 10 12 8 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
        {/* Diya Body */}
        <path d="M4 14 C4 18 10 19 12 19 C14 19 20 18 20 14 H4 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        {/* Spout */}
        <path d="M18 14 L22 11 L19 15 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
      </g>,
      'from-amber-50 to-yellow-100',
      'border-amber-300'
    );
  }

  // 11. Leaves
  if (norm.includes('leaves') || norm.includes('leaf')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Stem */}
        <path d="M12 21 C12 16 11 12 9 8" stroke="#15803d" strokeWidth="1.8" fill="none" />
        {/* Left Leaf */}
        <path d="M9 13 C5 11 4 6 7 4 C10 6 11 10 9 13 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.2" />
        {/* Right Leaf */}
        <path d="M11 15 C15 13 17 8 15 5 C12 7 11 11 11 15 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.2" />
      </g>,
      'from-emerald-50 to-green-100',
      'border-emerald-300'
    );
  }

  // 12. Boat
  if (norm.includes('boat')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Hull */}
        <path d="M3 16 L6 20 H18 L21 16 Z" fill="#9333ea" stroke="#6b21a8" strokeWidth="1.5" />
        {/* Mast */}
        <line x1="12" y1="5" x2="12" y2="16" stroke="#475569" strokeWidth="1.8" />
        {/* Sail */}
        <path d="M12 5 L18 14 H12 Z" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.2" />
      </g>,
      'from-purple-50 to-fuchsia-100',
      'border-purple-300'
    );
  }

  // 13. Bow & Arrow
  if (norm.includes('bow') || norm.includes('arrow')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Bow */}
        <path d="M6 3 C14 8 14 16 6 21" stroke="#16a34a" strokeWidth="2.2" />
        {/* Bow String */}
        <line x1="6" y1="3" x2="6" y2="21" stroke="#94a3b8" strokeWidth="1.2" />
        {/* Arrow */}
        <line x1="4" y1="12" x2="20" y2="12" stroke="#dc2626" strokeWidth="2" />
        <path d="M17 9 L21 12 L17 15" stroke="#dc2626" strokeWidth="2" fill="none" />
      </g>,
      'from-emerald-50 to-teal-100',
      'border-emerald-300'
    );
  }

  // 14. Clock
  if (norm.includes('clock')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" fill="#f8fafc" stroke="#d97706" strokeWidth="2" />
        {/* Hands at 10:10 */}
        <polyline points="12 6 12 12 16 14" stroke="#d97706" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="1.2" fill="#d97706" />
      </g>,
      'from-amber-50 to-yellow-100',
      'border-amber-300'
    );
  }

  // 15. Kite
  if (norm.includes('kite')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Kite Diamond */}
        <polygon points="12 3 20 11 12 19 4 11" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
        {/* Ribs */}
        <line x1="12" y1="3" x2="12" y2="19" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="4" y1="11" x2="20" y2="11" stroke="#ffffff" strokeWidth="1.2" />
        {/* Tail */}
        <path d="M12 19 L10 22 H14 Z" fill="#ec4899" />
      </g>,
      'from-purple-50 to-pink-100',
      'border-purple-300'
    );
  }

  // 16. Elephant
  if (norm.includes('elephant')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12 C19 8 15 6 11 6 C8 6 5 8 5 12 V18 H8 V14 H10 V18 H14 V14 H16 V18 H19 V14 C20 14 21 12 21 9 L20 9 C20 11 19 11 19 12 Z" fill="#64748b" stroke="#334155" strokeWidth="1.4" />
        <circle cx="8" cy="10" r="1" fill="#f8fafc" />
        {/* Tusk */}
        <path d="M7 13 C6 14 5 14 4 13" stroke="#f8fafc" strokeWidth="1.5" fill="none" />
      </g>,
      'from-amber-50 to-slate-200',
      'border-amber-300'
    );
  }

  // 17. Hand
  if (norm.includes('hand')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 4 V10 M12 3 V10 M14 4 V10 M16 6 V11 M8 9 V13 C8 17 11 19 14 19 C18 19 19 16 19 13 V10" stroke="#2563eb" strokeWidth="1.8" fill="#dbeafe" />
      </g>,
      'from-blue-50 to-sky-100',
      'border-blue-300'
    );
  }

  // 18. Lock & Key
  if (norm.includes('lock')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="10" width="10" height="9" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
        <path d="M7 10 V7 C7 5 8.5 3.5 10 3.5 C11.5 3.5 13 5 13 7 V10" stroke="#059669" strokeWidth="1.8" fill="none" />
        <circle cx="10" cy="14.5" r="1.2" fill="#f8fafc" />
        {/* Key */}
        <circle cx="18" cy="8" r="2.5" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        <path d="M18 10.5 V18 H19.5" stroke="#f59e0b" strokeWidth="1.5" />
      </g>,
      'from-emerald-50 to-teal-100',
      'border-emerald-300'
    );
  }

  // 19. Star
  if (norm.includes('star')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#eab308" stroke="#ca8a04" strokeWidth="1.4" />
      </g>,
      'from-yellow-50 to-amber-100',
      'border-yellow-300'
    );
  }

  // 20. Bell
  if (norm.includes('bell')) {
    return renderSvg(
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8 A6 6 0 0 0 6 8 C6 15 3 17 3 17 H21 C21 17 18 15 18 8" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
        <path d="M10.3 19 A2 2 0 0 0 13.7 19" stroke="#b45309" strokeWidth="1.8" fill="none" />
      </g>,
      'from-amber-50 to-yellow-100',
      'border-amber-300'
    );
  }

  // Default fallback badge
  return (
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 ${className}`}
      title={`Electoral Symbol: ${symbol || 'Candidate Symbol'}`}
    >
      <span className="truncate px-1 text-center font-mono">
        {symbol ? symbol.slice(0, 4) : 'SYM'}
      </span>
    </div>
  );
};

export default CandidateSymbol;
