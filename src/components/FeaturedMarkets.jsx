import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getMarketOpenStatus } from '../utils/dateUtils';
import BookmarkButton from './BookmarkButton';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  Pause,
  Play
} from 'lucide-react';
import marketsData from '../data/markets.json';

export default function FeaturedMarkets() {
  const { currentTime } = useApp();
  const featured = marketsData.filter((m) => m.featured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotating showcase timer
  useEffect(() => {
    if (isPaused || featured.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, featured.length]);

  const activeMarket = featured[currentIndex] || featured[0];
  const openStatus = getMarketOpenStatus(activeMarket.schedule, currentTime);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  if (!activeMarket) return null;

  return (
    <div className="relative bg-gradient-to-br from-[#1b3d2f] via-[#24523e] to-[#143427] rounded-3xl overflow-hidden text-white shadow-card border border-emerald-700/40">
      {/* Background ambient warmth blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
        {/* Left Info Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Header Badges with Warm Honey Accent */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-stone-950 shadow-sm">
              Featured Showcase ({currentIndex + 1}/{featured.length})
            </span>

            {/* Live Open Status */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                openStatus.isOpenNow
                  ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40'
                  : 'bg-stone-800/80 text-stone-300 border-stone-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  openStatus.isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              ></span>
              {openStatus.isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Market Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {activeMarket.name}
            </h3>
            <p className="text-emerald-100/90 text-sm sm:text-base font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{activeMarket.address}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-stone-200 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
            {activeMarket.description}
          </p>

          {/* Operating Times Snippet */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 w-fit">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Schedule:</strong> {openStatus.subText}
            </span>
          </div>

          {/* Actions & Carousel Indicators */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              to={`/market/${activeMarket.id}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-sm shadow-soft transition-all duration-150 hover:scale-102"
            >
              <span>Explore This Market</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <BookmarkButton
              type="market"
              id={activeMarket.id}
              size="lg"
              showLabel
              variant="glass"
            />
          </div>
        </div>

        {/* Right Visual Image Showcase */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
            <img
              src={activeMarket.image}
              alt={activeMarket.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Subtle Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Highlights pill tags */}
            {activeMarket.highlights?.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {activeMarket.highlights.slice(0, 3).map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-black/60 backdrop-blur-md text-emerald-200 px-3 py-1 rounded-xl border border-white/15"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous featured market"
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/15"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next featured market"
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/15"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume auto rotation' : 'Pause auto rotation'}
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/15"
              >
                {isPaused ? <Play className="w-4 h-4 text-amber-300" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to featured slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
