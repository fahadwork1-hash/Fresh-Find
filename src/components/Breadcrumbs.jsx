import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1 text-xs md:text-sm text-stone-500 font-medium">
      <ol className="flex items-center flex-wrap gap-1.5 md:gap-2">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-stone-500 hover:text-emerald-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 md:gap-2">
              <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" aria-hidden="true" />
              {isLast || !item.to ? (
                <span
                  className="font-bold text-emerald-900 truncate max-w-[200px] md:max-w-xs"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-stone-500 hover:text-emerald-700 transition-colors truncate max-w-[160px] md:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
