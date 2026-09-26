import React from 'react';
import { Search, MapPin, Calendar, Apple, RotateCcw, Clock } from 'lucide-react';
import { getUniqueAreas } from '../utils/marketUtils';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

const DAYS = [
  'All',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function MarketFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  compact = false,
  hideSearch = false,
  rightAction = null
}) {
  const uniqueAreas = getUniqueAreas(marketsData);

  const hasActiveFilters =
    filters.selectedArea !== 'All' ||
    filters.selectedDay !== 'All' ||
    filters.selectedProduceId !== 'All' ||
    Boolean(filters.searchQuery) ||
    Boolean(filters.onlyOpenNow);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {/* Sleek Unified Discovery Pill Bar */}
        <div className="bg-stone-50/90 rounded-2xl p-2 border border-stone-200/80 flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
          {/* 1. Keyword search input (hidden when hideSearch is true) */}
          {!hideSearch && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange('searchQuery', e.target.value)}
                placeholder="Search by market, area, produce..."
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200/80 rounded-xl text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => onFilterChange('searchQuery', '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 hover:text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Left-aligned Filter Controls Container */}
          <div className="flex flex-wrap items-center gap-2">

          {/* 2. Area dropdown */}
          <div className="relative shrink-0 min-w-[170px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-700">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <select
              aria-label="Filter by Area"
              value={filters.selectedArea}
              onChange={(e) => onFilterChange('selectedArea', e.target.value)}
              className="w-full pl-8 pr-7 py-2.5 bg-white border border-stone-200/80 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer appearance-none"
            >
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area === 'All' ? 'All Areas' : area}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
              ▾
            </div>
          </div>

          {/* 3. Day of Week dropdown */}
          <div className="relative shrink-0 min-w-[150px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-700">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <select
              aria-label="Filter by Day of Week"
              value={filters.selectedDay}
              onChange={(e) => onFilterChange('selectedDay', e.target.value)}
              className="w-full pl-8 pr-7 py-2.5 bg-white border border-stone-200/80 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer appearance-none"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day === 'All' ? 'Any Day' : `${day}s`}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
              ▾
            </div>
          </div>

          {/* 4. Produce Type dropdown */}
          <div className="relative shrink-0 min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-700">
              <Apple className="w-3.5 h-3.5" />
            </div>
            <select
              aria-label="Filter by Produce"
              value={filters.selectedProduceId}
              onChange={(e) => onFilterChange('selectedProduceId', e.target.value)}
              className="w-full pl-8 pr-7 py-2.5 bg-white border border-stone-200/80 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer appearance-none"
            >
              <option value="All">All Produce</option>
              {produceData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
              ▾
            </div>
          </div>

          {/* 5. Open Now Quick Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange('onlyOpenNow', !filters.onlyOpenNow)}
            aria-pressed={filters.onlyOpenNow}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              filters.onlyOpenNow
                ? 'bg-emerald-600 text-white shadow-soft ring-2 ring-emerald-400/40'
                : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${filters.onlyOpenNow ? 'text-white' : 'text-emerald-600'}`} />
            <span>Open Now</span>
            {filters.onlyOpenNow && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5"></span>
            )}
          </button>
          </div>

          {/* Right-aligned action (e.g. "View Full Directory ->") */}
          {rightAction && (
            <div className="ml-auto flex items-center pr-1 pl-2 shrink-0 self-center">
              {rightAction}
            </div>
          )}
        </div>

        {/* Filter Summary & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 px-1 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-stone-600">
              <span>
                Found <strong className="text-emerald-800 font-bold">{totalResults}</strong> matching{' '}
                {totalResults === 1 ? 'market' : 'markets'}
              </span>
            </div>

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
