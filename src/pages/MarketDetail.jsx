import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumbs from '../components/Breadcrumbs';
import MarketSchedule from '../components/MarketSchedule';
import MapEmbed from '../components/MapEmbed';
import BookmarkButton from '../components/BookmarkButton';
import ProduceDetailModal from '../components/ProduceDetailModal';
import EmptyState from '../components/EmptyState';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Share2,
  Edit3,
  Check,
  Star,
  ShieldCheck,
  Store,
  Apple,
  Navigation,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import { getMarketOpenStatus } from '../utils/dateUtils';
import { calculateDistanceKm, formatDistance } from '../utils/geoUtils';
import { shareRecommendation } from '../utils/bookmarkUtils';

export default function MarketDetail() {
  const { id } = useParams();
  const { currentTime, userCoords, bookmarks, updateNote, addToast } = useApp();

  const [selectedProduce, setSelectedProduce] = useState(null);
  const [isEditingNote, setIsEditingNote] = useState(false);

  const market = marketsData.find((m) => m.id === id);

  // If invalid market ID
  if (!market) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: 'Market Directory', to: '/markets' }, { label: 'Not Found' }]} />
        <EmptyState
          title="Market Not Found"
          description={`We could not find any farmers market matching ID "${id}".`}
          actionText="Back to Market Directory"
          onAction={() => (window.location.href = '/markets')}
          icon={Store}
        />
      </div>
    );
  }

  const openStatus = getMarketOpenStatus(market.schedule, currentTime);

  const noteKey = `market_${market.id}`;
  const currentNote = bookmarks.notes[noteKey] || '';
  const [noteDraft, setNoteDraft] = useState(currentNote);

  // Distance if user location enabled
  const distanceKm =
    userCoords && market.coordinates
      ? calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          market.coordinates.lat,
          market.coordinates.lng
        )
      : null;

  // Available produce items
  const availableProduce = (market.produceIds || [])
    .map((pId) => produceData.find((p) => p.id === pId))
    .filter(Boolean);

  const handleSaveNote = () => {
    updateNote('market', market.id, noteDraft);
    setIsEditingNote(false);
  };

  const handleShare = () => {
    shareRecommendation(
      `${market.name} - FreshFind`,
      `Check out ${market.name} in ${market.area}, Karachi on FreshFind!`,
      window.location.href
    );
    addToast('Market recommendation link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Market Directory', to: '/markets' },
          { label: market.name }
        ]}
      />

      {/* Back button */}
      <div>
        <Link
          to="/markets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Market Directory</span>
        </Link>
      </div>

      {/* Main Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-elevated border border-stone-800">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={market.image}
            alt={market.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Top Floating Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              title="Share recommendation"
              className="p-3 rounded-full bg-white/90 backdrop-blur-md text-stone-800 hover:bg-white hover:text-emerald-700 transition-all shadow"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <BookmarkButton type="market" id={market.id} size="lg" showLabel variant="glass" />
          </div>

          {/* Bottom Market Title & Status */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {market.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                  {market.badge}
                </span>
              )}

              {/* Live Status Pill */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                  openStatus.isOpenNow
                    ? 'bg-emerald-600/90 text-white border-emerald-400'
                    : 'bg-stone-800/90 text-stone-200 border-stone-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    openStatus.isOpenNow ? 'bg-white animate-ping' : 'bg-rose-400'
                  }`}
                />
                {openStatus.isOpenNow ? 'Open Now' : 'Closed'}
              </span>

              {distanceKm !== null && (
                <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-emerald-950 font-bold px-2.5 py-1 rounded-full text-xs shadow">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  {formatDistance(distanceKm)}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              {market.name}
            </h1>

            <p className="text-emerald-200 font-medium text-sm sm:text-base flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{market.address}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Details & Schedule on Left, Map & Stalls on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Description, Highlights, Schedule Table, Notes */}
        <div className="lg:col-span-7 space-y-8">
          {/* About Market */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-soft space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>About the Market</span>
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {market.description}
            </p>

            {/* Highlights */}
            {market.highlights?.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                  Market Amenities & Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {market.highlights.map((h, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-xl"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Weekly Schedule Table (Mandatory SRS element) */}
          <MarketSchedule schedule={market.schedule} />

          {/* Personal Session Note (Mandatory SRS requirement) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span>My Personal Session Notes</span>
              </h3>
              <span className="text-[11px] text-stone-400 font-medium">Session-only</span>
            </div>

            {isEditingNote ? (
              <div className="space-y-3">
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Attach a personal shopping note (e.g. remember to check stall #4 for fresh basil)..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNoteDraft(currentNote);
                      setIsEditingNote(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs sm:text-sm">
                <p className="text-stone-600 italic">
                  {currentNote ? `"${currentNote}"` : 'No personal note added yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNoteDraft(currentNote);
                    setIsEditingNote(true);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-bold shrink-0 text-xs inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{currentNote ? 'Edit Note' : 'Add Note'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Embedded Map, Contact, Available Produce */}
        <div className="lg:col-span-5 space-y-8">
          {/* Location & Embedded Map (Mandatory SRS element) */}
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Location & Directions</span>
            </h2>

            <MapEmbed
              title={market.name}
              address={market.address}
              coordinates={market.coordinates}
              height="300px"
            />
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-soft space-y-3 text-xs sm:text-sm">
            <h3 className="font-extrabold text-stone-900 text-base">
              Market Coordinator & Information
            </h3>
            <div className="space-y-2 text-stone-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Coordinator: <strong>{market.contact?.manager || 'Coordinator Desk'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phone: <strong>{market.contact?.phone || 'N/A'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Email: <strong>{market.contact?.email || 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          {/* Typical Produce Available at this market */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <Apple className="w-5 h-5 text-emerald-600" />
                <span>Typical Produce Available ({availableProduce.length})</span>
              </h2>
            </div>

            <p className="text-xs text-stone-500">
              Click any item below to view nutritional facts, home storage advice, and peak season calendar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableProduce.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduce(p)}
                  className="group/prod flex items-center gap-3 p-2.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer shadow-xs"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover/prod:text-emerald-800 truncate">
                      {p.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 block truncate">
                      {p.category} • {p.season}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
