import React from 'react';
import { useApp } from '../context/AppContext';
import { getMarketOpenStatus } from '../utils/dateUtils';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MarketSchedule({ schedule }) {
  const { currentTime } = useApp();
  const currentStatus = getMarketOpenStatus(schedule, currentTime);

  // Get current day name
  const currentDayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-soft">
      {/* Schedule Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-forest p-4 text-white flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-300" />
          <h3 className="font-bold text-base tracking-tight">Weekly Operating Hours</h3>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              currentStatus.isOpenNow
                ? 'bg-emerald-400/20 text-emerald-100 border-emerald-400/40'
                : 'bg-rose-400/20 text-rose-100 border-rose-400/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentStatus.isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
              }`}
            ></span>
            {currentStatus.isOpenNow ? 'Open Now' : 'Closed'}
          </span>
          <span className="text-xs text-emerald-100/80 font-medium">
            ({currentStatus.subText})
          </span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3">Day of Week</th>
              <th scope="col" className="px-5 py-3">Operating Hours</th>
              <th scope="col" className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {DAYS.map((day) => {
              const dayData = schedule?.[day];
              const isToday = day === currentDayName;
              const isOpenOnThisDay = dayData?.isOpen;

              return (
                <tr
                  key={day}
                  className={`transition-colors ${
                    isToday
                      ? 'bg-emerald-50/80 font-semibold text-emerald-950'
                      : 'text-stone-700 hover:bg-stone-50/50'
                  }`}
                >
                  <td className="px-5 py-3.5 flex items-center gap-2">
                    <span>{day}</span>
                    {isToday && (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {isOpenOnThisDay ? (
                      <div className="flex items-center gap-1.5 text-stone-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dayData.display}</span>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">Closed</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {isOpenOnThisDay ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-xs bg-emerald-100/70 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-stone-400 text-xs bg-stone-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        Closed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
