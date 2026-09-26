import React from 'react';
import BookmarkButton from './BookmarkButton';
import { Calendar, Store, ArrowRight, ShoppingCart } from 'lucide-react';
import marketsData from '../data/markets.json';
import { useApp } from '../context/AppContext';

const SEASON_COLORS = {
  Spring: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Summer: 'bg-amber-100 text-amber-800 border-amber-200',
  Autumn: 'bg-orange-100 text-orange-800 border-orange-200',
  Winter: 'bg-teal-100 text-teal-800 border-teal-200',
  'Year-round': 'bg-blue-100 text-blue-800 border-blue-200'
};

const CATEGORY_COLORS = {
  Fruits: 'bg-rose-50 text-rose-700 border-rose-200',
  Vegetables: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Herbs: 'bg-lime-50 text-lime-700 border-lime-200',
  'Dairy & Eggs': 'bg-amber-50 text-amber-700 border-amber-200',
  'Honey & Preserves': 'bg-yellow-50 text-yellow-800 border-yellow-200',
  'Artisan & Bakery': 'bg-stone-100 text-stone-700 border-stone-200'
};

export default function ProduceCard({ produce, onSelect }) {
  const { cart, addToCart, updateCartQuantity } = useApp();

  // Count matching markets
  const relatedMarkets = marketsData.filter((m) =>
    produce.marketIds?.includes(m.id)
  );

  const cartItem = cart?.find((i) => i.id === produce.id);

  return (
    <article
      onClick={() => onSelect(produce)}
      className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
        <img
          src={produce.image}
          alt={produce.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${
              CATEGORY_COLORS[produce.category] || 'bg-stone-100 text-stone-700'
            }`}
          >
            {produce.category}
          </span>

          <BookmarkButton type="produce" id={produce.id} size="md" />
        </div>

        {/* Season badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm ${
              SEASON_COLORS[produce.season] || 'bg-stone-100 text-stone-700'
            }`}
          >
            <Calendar className="w-3 h-3" />
            {produce.season}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
            {produce.name}
          </h3>
        </div>

        {/* Price Tag in PKR */}
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-base sm:text-lg font-black text-emerald-800">
            Rs. {produce.price || 250}
          </span>
          <span className="text-xs font-semibold text-stone-500">
            / {produce.unit || 'kg'}
          </span>
        </div>

        <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
          {produce.description}
        </p>

        {/* Nutrition highlight preview */}
        {produce.nutritionHighlights?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {produce.nutritionHighlights.slice(0, 2).map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md inline-block"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Available at X Markets (Pinned to bottom via mt-auto) */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Available at <strong>{relatedMarkets.length}</strong> markets</span>
          </span>

          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Add to Cart or Quantity Stepper */}
        {cartItem ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between w-full h-9 mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-2"
          >
            <button
              type="button"
              onClick={() => updateCartQuantity(produce.id, cartItem.quantity - 1)}
              className="w-7 h-7 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shadow-xs cursor-pointer transition-colors"
            >
              -
            </button>
            <span className="text-xs font-black text-emerald-900">
              {cartItem.quantity} in cart
            </span>
            <button
              type="button"
              onClick={() => updateCartQuantity(produce.id, cartItem.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center shadow-xs cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(produce);
            }}
            className="w-full h-9 mt-3 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </article>
  );
}
