import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users } from 'lucide-react';

export default function VisitorCounter({ className = '' }) {
  const { visitorCount } = useApp();
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 900);
    return () => clearTimeout(timer);
  }, [visitorCount]);

  return (
    <div
      className={`inline-flex items-center gap-2.5 bg-emerald-950/70 backdrop-blur-md text-emerald-100 border border-emerald-500/25 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-inner transition-all duration-300 ${
        isPulsing ? 'border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.25)]' : ''
      } ${className}`}
      title="Live community visitor counter"
    >
      <div className="relative flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      </div>
      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span
        className={`font-black tracking-wide tabular-nums transition-all duration-300 ${
          isPulsing ? 'text-emerald-300 scale-105' : 'text-white'
        }`}
      >
        {visitorCount.toLocaleString()}
      </span>
      <span className="text-emerald-300/80 font-normal">Community Visitors</span>
    </div>
  );
}
