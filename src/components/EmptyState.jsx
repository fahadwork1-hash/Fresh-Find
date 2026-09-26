import React from 'react';
import { SearchX, RotateCcw, Store } from 'lucide-react';

export default function EmptyState({
  title = "No results found",
  description = "No items match your selected filters. Try broadening your criteria or resetting filters.",
  actionText = "Reset Filters",
  onAction,
  icon: Icon = SearchX
}) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-8 sm:p-12 text-center my-6 flex flex-col items-center justify-center max-w-md mx-auto shadow-soft">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="font-extrabold text-stone-900 text-lg mb-2">
        {title}
      </h3>

      <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-6">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-soft transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
