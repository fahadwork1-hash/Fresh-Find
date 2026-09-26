import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrentTimeString, formatCurrentDateString } from '../utils/dateUtils';
import { Clock } from 'lucide-react';

export default function RealTimeClock({ compact = false }) {
  const { currentTime, isSimulatedTime } = useApp();

  const timeString = formatCurrentTimeString(currentTime);
  const dateString = formatCurrentDateString(currentTime);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-full border border-emerald-200/60 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        <span className="tabular-nums font-semibold">{timeString}</span>
        {isSimulatedTime && (
          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
            Sim
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-100 shadow-soft">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 shrink-0">
          <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[14.5px] font-extrabold text-stone-900 tracking-tight tabular-nums leading-snug">
              {timeString}
            </span>
            {isSimulatedTime && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded-md border border-amber-200">
                Simulated
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-stone-500 leading-snug">{dateString}</span>
        </div>
      </div>
    </div>
  );
}
