import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProduceCard from '../components/ProduceCard';
import ProduceDetailModal from '../components/ProduceDetailModal';
import EmptyState from '../components/EmptyState';
import { Apple, Search, Filter, RotateCcw } from 'lucide-react';
import produceData from '../data/produce.json';

const CATEGORIES = [
  'All',
  'Fruits',
  'Vegetables',
  'Herbs',
  'Dairy & Eggs',
  'Honey & Preserves',
  'Artisan & Bakery'
];

export default function ProduceGuide() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduce, setSelectedProduce] = useState(null);

  // Filter produce by category & search
  const filteredProduce = useMemo(() => {
    return produceData.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const categoryMatch = item.category.toLowerCase().includes(q);
        const seasonMatch = item.season.toLowerCase().includes(q);

        if (!nameMatch && !descMatch && !categoryMatch && !seasonMatch) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleReset = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Produce Guide' }]} />

      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
          <Apple className="w-3.5 h-3.5" />
          <span>Farm Fresh Catalog</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
          Local Harvest & Produce Guide
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Discover seasonal vegetables, tree-ripened fruits, fresh herbs, raw honeys, and farm cheeses. Click any produce item to see home storage tips, nutrition facts, and every market that sells it.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="bg-white rounded-3xl border border-stone-200 py-3.5 px-4 sm:py-4 sm:px-5 shadow-soft space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce by name, nutrition, or season (e.g. Tomato, Mango, Iron, Winter)..."
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 bg-stone-200 px-2 py-0.5 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 pt-1">
        <span>
          Showing <strong>{filteredProduce.length}</strong> produce {filteredProduce.length === 1 ? 'item' : 'items'} in {selectedCategory === 'All' ? 'all categories' : selectedCategory}
        </span>

        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={handleReset}
            className="font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Produce Grid */}
      {filteredProduce.length === 0 ? (
        <EmptyState
          title="No produce found in this category"
          description="Try choosing 'All' categories or searching for a different item name."
          actionText="Show All Produce"
          onAction={handleReset}
          icon={Apple}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProduce.map((item) => (
            <ProduceCard
              key={item.id}
              produce={item}
              onSelect={(p) => setSelectedProduce(p)}
            />
          ))}
        </div>
      )}

      {/* Produce Detail Modal */}
      {selectedProduce && (
        <ProduceDetailModal
          produce={selectedProduce}
          onClose={() => setSelectedProduce(null)}
        />
      )}
    </div>
  );
}
