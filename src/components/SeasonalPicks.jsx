import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Store, Info } from 'lucide-react';
import seasonsData from '../data/seasons.json';
import produceData from '../data/produce.json';
import marketsData from '../data/markets.json';
import { getCurrentSeasonId } from '../utils/dateUtils';
import BookmarkButton from './BookmarkButton';

export default function SeasonalPicks({
  title = "This Week's Seasonal Picks",
  subtitle = "Harvested at peak flavor right now in local farms and community orchards.",
  showTabs = true,
  onSelectProduce
}) {
  const defaultSeasonId = getCurrentSeasonId();
  const [activeSeasonId, setActiveSeasonId] = useState(defaultSeasonId);

  const currentSeason =
    seasonsData.seasons.find((s) => s.id === activeSeasonId) ||
    seasonsData.seasons[0];

  // Resolve produce items for the selected season (Guaranteed 8 balanced items for full 4-col rows)
  const seasonalItems = currentSeason.featuredProduceIds
    ? currentSeason.featuredProduceIds
        .map((id) => produceData.find((p) => p.id === id))
        .filter(Boolean)
    : produceData.filter((p) => p.season.toLowerCase() === currentSeason.id.toLowerCase()).slice(0, 8);

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
            <span>Seasonal Harvest Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-stone-600 text-sm md:text-base mt-2 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Season Selector Tabs */}
        {showTabs && (
          <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80 overflow-x-auto self-start md:self-auto">
            {seasonsData.seasons.map((season) => {
              const isActive = season.id === activeSeasonId;
              const isDefault = season.id === defaultSeasonId;

              return (
                <button
                  key={season.id}
                  onClick={() => setActiveSeasonId(season.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <span>{season.name.split(' ')[0]}</span>
                  {isDefault && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-extrabold uppercase ${
                        isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Now
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Season Insights Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-100 rounded-3xl p-5 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900 text-base md:text-lg">
              {currentSeason.name}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              ({currentSeason.months.join(', ')})
            </span>
          </div>
          <p className="text-xs md:text-sm text-stone-600 max-w-2xl leading-relaxed">
            {currentSeason.harvestNotes}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-3.5 text-xs text-stone-700 shrink-0 max-w-sm">
          <strong className="text-emerald-900 font-bold block mb-0.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            Seasonal Shopper Wisdom:
          </strong>
          <span>{currentSeason.shopperTip}</span>
        </div>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {seasonalItems.map((item) => {
          const carryingMarkets = marketsData.filter((m) =>
            item.marketIds?.includes(m.id)
          );

          return (
            <article
              key={item.id}
              className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-emerald-900 shadow-sm">
                    {item.category}
                  </span>
                  <BookmarkButton type="produce" id={item.id} size="sm" />
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{item.season} Peak</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-extrabold text-base text-stone-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                  {item.name}
                </h3>
                <p className="text-stone-600 text-xs md:text-sm line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Markets count */}
                <div className="mt-auto pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1 text-stone-600 font-medium">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In <strong>{carryingMarkets.length}</strong> markets</span>
                  </span>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => onSelectProduce && onSelectProduce(item)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Explore Produce & Stalls</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
