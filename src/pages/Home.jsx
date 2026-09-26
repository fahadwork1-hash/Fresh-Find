import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FeaturedMarkets from '../components/FeaturedMarkets';
import MarketFilters from '../components/MarketFilters';
import MarketCard from '../components/MarketCard';
import SeasonalPicks from '../components/SeasonalPicks';
import ProduceDetailModal from '../components/ProduceDetailModal';
import RealTimeClock from '../components/RealTimeClock';
import VisitorCounter from '../components/VisitorCounter';
import EmptyState from '../components/EmptyState';
import {
  ShoppingBag,
  MapPin,
  Clock,
  ArrowRight,
  Leaf,
  Store,
  Compass,
  CheckCircle2
} from 'lucide-react';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import { filterMarkets } from '../utils/marketUtils';
import { getMarketOpenStatus } from '../utils/dateUtils';

export default function Home() {
  const { currentTime } = useApp();

  // Selected produce for modal inspection
  const [selectedProduce, setSelectedProduce] = useState(null);

  // Quick Find Filter State
  const [quickFilters, setQuickFilters] = useState({
    selectedArea: 'All',
    selectedDay: 'All',
    selectedProduceId: 'All',
    searchQuery: '',
    onlyOpenNow: false
  });

  const handleFilterChange = (key, value) => {
    setQuickFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setQuickFilters({
      selectedArea: 'All',
      selectedDay: 'All',
      selectedProduceId: 'All',
      searchQuery: '',
      onlyOpenNow: false
    });
  };

  // Filtered markets for Quick Find
  const filteredMarkets = useMemo(() => {
    return filterMarkets({
      markets: marketsData,
      produceList: produceData,
      ...quickFilters,
      currentTime
    });
  }, [quickFilters, currentTime]);

  // Currently Open Markets list
  const openNowMarkets = useMemo(() => {
    return marketsData.filter((m) => {
      const status = getMarketOpenStatus(m.schedule, currentTime);
      return status.isOpenNow;
    });
  }, [currentTime]);

  const hasAppliedFilters =
    quickFilters.selectedArea !== 'All' ||
    quickFilters.selectedDay !== 'All' ||
    quickFilters.selectedProduceId !== 'All' ||
    Boolean(quickFilters.searchQuery) ||
    quickFilters.onlyOpenNow;

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Hero Section with Polished Headline and Warm Accents */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900/10 via-stone-50 to-white pt-8 pb-12 md:pt-12 md:pb-16 border-b border-stone-200/60">
        {/* Soft natural background ornaments */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Main Heading - Clean natural line-break & balanced color */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.14] font-sans">
              Discover Local <span className="text-emerald-700">Farmers Markets</span><br className="hidden sm:inline" /> & Fresh Produce
            </h1>

            {/* Introductory Text */}
            <p className="text-stone-600 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
              FreshFind connects you with local agricultural gatherings, weekly operating schedules, harvest-fresh heirloom vegetables, tree-ripe fruits, and pure seasonal goods right across your neighborhood.
            </p>

            {/* Hero Quick Highlights & Clock */}
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <RealTimeClock />
              <Link
                to="/markets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-soft transition-all duration-150 hover:scale-102"
              >
                <span>Browse All {marketsData.length} Markets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 2. Quick Find: "Find a Market Near You" Component */}
        <section id="quick-find" className="scroll-mt-24 space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-1">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>Interactive Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Find a Market Near You
            </h2>
            <p className="text-stone-600 text-sm mt-0.5">
              Filter dynamically by area, operating day of week, or specific farm produce.
            </p>
          </div>

          {/* Unified Filter Controls Bar with left-aligned filters and right-side View Full Directory link */}
          <MarketFilters
            filters={quickFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredMarkets.length}
            hideSearch={true}
            rightAction={
              <Link
                to="/markets"
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-emerald-50/80 transition-colors whitespace-nowrap group"
              >
                <span>View Full Directory</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
          />

          {/* Filter Results Display */}
          {hasAppliedFilters && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  Showing results for current filter selection ({filteredMarkets.length} found):
                </span>
                <button
                  onClick={handleResetFilters}
                  className="font-bold text-rose-600 hover:underline"
                >
                  Clear search
                </button>
              </div>

              {filteredMarkets.length === 0 ? (
                <EmptyState
                  title="No markets match your criteria"
                  description="Try selecting a different day or produce type to discover upcoming markets."
                  onAction={handleResetFilters}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMarkets.map((market) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3. Featured / Rotating Markets Showcase (Elevated with Warmth) */}
        <section className="space-y-4">
          <FeaturedMarkets />
        </section>

        {/* 4. Currently Open Markets Showcase (With Balanced 3+1 Layout to prevent orphan hole) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Real-Time Market Status</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Markets Open Right Now
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">
                Calculated live against current browser day and operating hours.
              </p>
            </div>

            <Link
              to="/markets?openNow=true"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 self-start sm:self-auto flex items-center gap-1"
            >
              <span>Explore All Operating Schedules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {openNowMarkets.length === 0 ? (
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">
                No markets currently operating at this exact hour
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                Most farmers markets operate in early mornings (6:00 AM - 2:00 PM) or weekend mornings. Use our Time Simulator in the clock widget above to test weekend opening hours!
              </p>
            </div>
          ) : (
            /* Balanced Grid: If exactly 4 open markets, show first 3 + a discovery action card so the row is fully filled with no empty gap! */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {openNowMarkets.slice(0, 4).map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}

              {openNowMarkets.length < 4 && (
                <div className="bg-gradient-to-br from-emerald-50 to-stone-100 rounded-3xl border border-dashed border-emerald-300 p-6 flex flex-col justify-between text-center min-h-[340px]">
                  <div className="my-auto space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-soft">
                      <Store className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-lg">
                      Explore All {marketsData.length} Markets
                    </h3>
                    <p className="text-stone-500 text-xs max-w-xs mx-auto">
                      Discover opening days, upcoming weekend harvest fairs, and stall maps across Karachi.
                    </p>
                  </div>
                  <Link
                    to="/markets"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-soft"
                  >
                    <span>View Market Directory</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 5. This Week's Seasonal Picks */}
        <SeasonalPicks
          title="This Week's Seasonal Picks"
          subtitle="Explore produce at its absolute peak harvest flavor this season across our partner markets."
          onSelectProduce={(p) => setSelectedProduce(p)}
        />
      </div>

      {/* Produce Inspection Modal */}
      {selectedProduce && (
        <ProduceDetailModal
          produce={selectedProduce}
          onClose={() => setSelectedProduce(null)}
        />
      )}
    </div>
  );
}
