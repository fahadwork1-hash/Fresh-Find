import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export default function BookmarkButton({
  type = 'market', // 'market' | 'produce'
  id,
  showLabel = false,
  className = '',
  size = 'md',
  variant = 'default' // 'default' | 'glass'
}) {
  const { isBookmarkedMarket, isBookmarkedProduce, toggleMarket, toggleProduce } = useApp();

  const isSaved = type === 'market' ? isBookmarkedMarket(id) : isBookmarkedProduce(id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'market') {
      toggleMarket(id);
    } else {
      toggleProduce(id);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'px-4 sm:px-5 py-2.5 text-sm'
  };

  // Glassmorphic variant (for dark banners like FeaturedMarkets and hero banners)
  if (variant === 'glass') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
        title={isSaved ? 'Remove from session favorites' : 'Bookmark this item'}
        className={`group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
          isSaved
            ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white border-2 border-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.55)] hover:shadow-[0_6px_25px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-2 border-white/40 hover:border-rose-300 shadow-md hover:shadow-[0_0_24px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95'
        } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            isSaved
              ? 'fill-white text-white scale-110'
              : 'text-white group-hover:text-rose-400 group-hover:fill-rose-400/40 group-hover:scale-125'
          }`}
        />
        {showLabel && (
          <span className="ml-2 font-black text-sm tracking-wide text-white group-hover:text-rose-100 transition-colors drop-shadow-xs">
            {isSaved ? 'Bookmarked' : 'Bookmark'}
          </span>
        )}
      </button>
    );
  }

  // Default clean card variant
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
      title={isSaved ? 'Remove from session favorites' : 'Bookmark this item'}
      className={`group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
        isSaved
          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border border-rose-400 shadow-[0_2px_12px_rgba(244,63,94,0.35)] hover:bg-rose-600 hover:scale-110 active:scale-95'
          : 'bg-white/95 backdrop-blur-md text-stone-600 border border-stone-200/90 shadow-xs hover:border-rose-300 hover:bg-rose-50/80 hover:text-rose-600 hover:scale-110 hover:shadow-md active:scale-95'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          isSaved
            ? 'fill-white text-white scale-110'
            : 'group-hover:scale-125 group-hover:text-rose-500 group-hover:fill-rose-500/25'
        }`}
      />
      {showLabel && (
        <span className="ml-2 font-bold tracking-wide">
          {isSaved ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </button>
  );
}
