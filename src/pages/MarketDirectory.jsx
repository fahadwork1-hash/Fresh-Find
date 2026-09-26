import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumbs from '../components/Breadcrumbs';
import MarketFilters from '../components/MarketFilters';
import MarketSort from '../components/MarketSort';
import MarketCard from '../components/MarketCard';
import EmptyState from '../components/EmptyState';
import { Store, SlidersHorizontal } from 'lucide-react';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import { filterMarkets, sortMarkets } from '../utils/marketUtils';

export default function MarketDirectory() {
  const { currentTime, userCoords } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL parameters if present
  const initialArea = searchParams.get('area') || 'All';
  const initialDay = searchParams.get('day') || 'All';
  const initialProduce = searchParams.get('produce') || 'All';
  const initialOpenNow = searchParams.get('openNow') === 'true';
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';

  const [filters, setFilters] = useState({
    selectedArea: initialArea,
    selectedDay: initialDay,
    selectedProduceId: initialProduce,
    searchQuery: initialSearch,
    onlyOpenNow: initialOpenNow
  });

  // Sync search from global navbar query parameter
  React.useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null && q !== undefined) {
      setFilters((prev) => ({ ...prev, searchQuery: q }));
    }
  }, [searchParams]);

  const [sortBy, setSortBy] = useState('alphabetical-asc');

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      selectedArea: 'All',
      selectedDay: 'All',
      selectedProduceId: 'All',
      searchQuery: '',
      onlyOpenNow: false
    });
  };

  // Filtered and Sorted market results
  const displayedMarkets = useMemo(() => {
    const filtered = filterMarkets({
      markets: marketsData,
      produceList: produceData,
      ...filters,
      currentTime
    });

    return sortMarkets({
      markets: filtered,
      sortBy,
      userCoords,
      currentTime
    });
  }, [filters, sortBy, userCoords, currentTime]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Market Directory' }]} />

      {/* Directory Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
          <Store className="w-3.5 h-3.5" />
          <span>Local Agricultural Hubs</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
          Farmers Market Directory
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Explore complete schedules, neighborhood locations, and farm-fresh produce available at verified community markets across Karachi.
        </p>
      </div>

      {/* Filter System */}
      <MarketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={displayedMarkets.length}
      />

      {/* Results Header: Count & Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
          <span className="font-extrabold text-emerald-800 text-base">
            {displayedMarkets.length}
          </span>
          <span>
            {displayedMarkets.length === 1 ? 'market found' : 'markets found'}
          </span>
        </div>

        <MarketSort sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Market Cards Grid */}
      {displayedMarkets.length === 0 ? (
        <EmptyState
          title="No markets match your criteria"
          description="Try broadening your area, selecting a different day of the week, or clearing your produce search."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
