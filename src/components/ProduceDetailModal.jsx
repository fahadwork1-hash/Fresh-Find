import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import {
  X,
  Calendar,
  Store,
  MapPin,
  Clock,
  ArrowRight,
  Info,
  Share2,
  ShoppingCart
} from 'lucide-react';
import marketsData from '../data/markets.json';
import { shareRecommendation } from '../utils/bookmarkUtils';
import { useApp } from '../context/AppContext';

export default function ProduceDetailModal({ produce, onClose }) {
  const { addToast, cart, addToCart, updateCartQuantity } = useApp();
  const cartItem = cart?.find((i) => i.id === produce?.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!produce) return null;

  const carryingMarkets = marketsData.filter((m) =>
    produce.marketIds?.includes(m.id)
  );

  const handleShare = () => {
    shareRecommendation(
      `${produce.name} on FreshFind`,
      `Discover where to buy fresh local ${produce.name} in Karachi markets!`,
      window.location.href
    );
    addToast('Link copied to clipboard for sharing!', 'info');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="produce-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-elevated border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image & Action Bar */}
        <div className="relative h-56 md:h-64 bg-stone-100 overflow-hidden shrink-0">
          <img
            src={produce.image}
            alt={produce.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share this produce recommendation"
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-emerald-700 hover:bg-white shadow transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <BookmarkButton type="produce" id={produce.id} size="md" />
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 hover:bg-white shadow transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Title in Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                {produce.category}
              </span>
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/20">
                Peak: {produce.season}
              </span>
            </div>
            <h2 id="produce-modal-title" className="text-2xl md:text-3xl font-extrabold drop-shadow-md">
              {produce.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Price & Add to Cart Action Bar */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Farm Market Price</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-emerald-800">
                  Rs. {produce.price || 250}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  / {produce.unit || 'kg'}
                </span>
              </div>
            </div>

            {cartItem ? (
              <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-xl p-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(produce.id, cartItem.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="px-2 text-xs font-black text-emerald-950">
                  {cartItem.quantity} in cart
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(produce.id, cartItem.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center cursor-pointer shadow-xs transition-colors"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(produce)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Harvest & Profile
            </h3>
            <p className="text-stone-700 leading-relaxed text-sm md:text-base">
              {produce.description}
            </p>
          </div>

          {/* Nutrition Highlights */}
          {produce.nutritionHighlights?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>Nutritional & Health Highlights</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {produce.nutritionHighlights.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-3 py-1 rounded-xl"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Storage & Freshness Tips */}
          {produce.storageTip && (
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3 text-sm">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 block font-bold mb-0.5">
                  Freshness & Kitchen Storage Tip:
                </strong>
                <p className="text-amber-800 leading-relaxed text-xs md:text-sm">
                  {produce.storageTip}
                </p>
              </div>
            </div>
          )}

          {/* Markets Carrying This Produce */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Available At These Markets ({carryingMarkets.length})</span>
              </h3>
            </div>

            {carryingMarkets.length === 0 ? (
              <p className="text-stone-500 text-sm italic">
                Currently arriving in upcoming harvests.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {carryingMarkets.map((market) => (
                  <Link
                    key={market.id}
                    to={`/market/${market.id}`}
                    onClick={onClose}
                    className="group/card flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all shadow-sm"
                  >
                    <img
                      src={market.image}
                      alt={market.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs md:text-sm font-bold text-stone-900 group-hover/card:text-emerald-800 truncate">
                        {market.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{market.area}</span>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover/card:text-emerald-700 group-hover/card:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
