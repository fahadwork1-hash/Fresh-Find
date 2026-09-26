import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpDown, Navigation, Clock } from 'lucide-react';

export default function MarketSort({ sortBy, onSortChange }) {
  const { userCoords, isLocating, requestLocation } = useApp();

  const handleProximitySelect = async (e) => {
    const value = e.target.value;
    if (value === 'proximity' && !userCoords) {
      const coords = await requestLocation();
      if (!coords) {
        // If location denied or failed, keep previous or default
        return;
      }
    }
    onSortChange(value);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs md:text-sm">
      <span className="text-stone-500 font-medium flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
        <span>Sort By:</span>
      </span>

      <select
        aria-label="Sort markets by"
        value={sortBy}
        onChange={handleProximitySelect}
        className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs md:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
      >
        <option value="alphabetical-asc">Name (A to Z)</option>
        <option value="alphabetical-desc">Name (Z to A)</option>
        <option value="proximity">
          {userCoords ? 'Proximity (Closest First)' : 'Proximity (Use Geolocation)'}
        </option>
        <option value="next-open">Next Opening / Open Now</option>
        <option value="rating">Highest Rated</option>
      </select>

      {/* Geolocation shortcut if not already enabled */}
      {!userCoords && (
        <button
          type="button"
          onClick={requestLocation}
          disabled={isLocating}
          title="Detect my current location for proximity sorting"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm disabled:opacity-50"
        >
          <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting...' : 'Near Me'}</span>
        </button>
      )}

      {userCoords && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
          <Navigation className="w-3 h-3 text-emerald-600" />
          Location Active
        </span>
      )}
    </div>
  );
}
