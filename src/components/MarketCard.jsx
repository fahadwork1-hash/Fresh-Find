import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getMarketOpenStatus } from '../utils/dateUtils';
import { calculateDistanceKm, formatDistance } from '../utils/geoUtils';
import BookmarkButton from './BookmarkButton';
import { MapPin, Clock, ArrowRight, Star, Navigation } from 'lucide-react';
import produceData from '../data/produce.json';

export default function MarketCard({ market }) {
  const { currentTime, userCoords } = useApp();

  const openStatus = getMarketOpenStatus(market.schedule, currentTime);

  // Compute distance if location available
  const distanceKm =
    userCoords && market.coordinates
      ? calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          market.coordinates.lat,
          market.coordinates.lng
        )
      : null;

  // Format active operating days summary (e.g. "Sat & Sun • 7:30 AM - 2:30 PM" or "Tue - Sun")
  const activeDays = Object.entries(market.schedule || {})
    .filter(([_, data]) => data.isOpen)
    .map(([day]) => day.slice(0, 3));

  const daysSummary =
    activeDays.length === 7
      ? 'Daily'
      : activeDays.length > 0
      ? activeDays.join(', ')
      : 'Special Events';

  // Get preview of top produce items
  const produceItems = (market.produceIds || [])
    .slice(0, 3)
    .map((id) => produceData.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <article className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={market.image}
          alt={market.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Badge: Organic / Landmark / etc */}
          {market.badge ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/80 backdrop-blur-md text-emerald-100 border border-emerald-400/30">
              {market.badge}
            </span>
          ) : (
            <span></span>
          )}

          {/* Bookmark Button */}
          <BookmarkButton type="market" id={market.id} size="md" />
        </div>

        {/* Bottom overlay: Live Status & Distance */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${
                openStatus.isOpenNow
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-900/85 text-stone-200 border-stone-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  openStatus.isOpenNow ? 'bg-white animate-ping' : 'bg-rose-400'
                }`}
              ></span>
              {openStatus.isOpenNow ? 'Open Now' : 'Closed'}
            </span>
            <span className="text-white/90 drop-shadow text-[11px] hidden sm:inline">
              {openStatus.subText}
            </span>
          </div>

          {distanceKm !== null && (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-emerald-950 font-bold px-2 py-0.5 rounded-full text-[11px] shadow">
              <Navigation className="w-3 h-3 text-emerald-600" />
              {formatDistance(distanceKm)}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Area & Rating */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            <MapPin className="w-3.5 h-3.5" />
            {market.area}
          </span>

          <div className="flex items-center gap-1 text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{market.rating}</span>
            <span className="text-stone-400 font-normal">({market.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1.5">
          <Link to={`/market/${market.id}`} className="hover:underline">
            {market.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed mb-4">
          {market.description}
        </p>

        {/* Schedule preview line */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              <strong className="text-stone-800">{daysSummary}</strong>
            </span>
          </div>
          <span className="text-stone-400 text-[11px] shrink-0">
            {market.highlights?.[0]}
          </span>
        </div>

        {/* Produce tags preview */}
        {produceItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {produceItems.map((prod) => (
              <span
                key={prod.id}
                className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium"
              >
                {prod.name.split(' ')[0]}
              </span>
            ))}
            {market.produceIds.length > 3 && (
              <span className="text-[11px] text-emerald-700 font-medium self-center">
                +{market.produceIds.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* View Details Action Button */}
        <Link
          to={`/market/${market.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all duration-200 group-hover:shadow-sm"
        >
          <span>View Market Details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
