import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  X,
  Heart,
  FileDown,
  Share2,
  Trash2,
  Edit3,
  Check,
  Store,
  Apple,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  FileText
} from 'lucide-react';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import { shareRecommendation, normalizeNotes } from '../utils/bookmarkUtils';

/**
 * Sub-component for managing multiple personal notes on a single bookmarked item
 */
function ItemNotesSection({ type, id, notes, onAddNote, onEditNote, onDeleteNote }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  const notesList = normalizeNotes(notes);

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
    setIsAdding(false);
  };

  const handleSaveEdit = (noteId) => {
    if (editText.trim()) {
      onEditNote(type, id, noteId, editText.trim());
    }
    setEditingNoteId(null);
    setEditText('');
  };

  const handleCreateNote = () => {
    if (newText.trim()) {
      onAddNote(type, id, newText.trim());
      setNewText('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-stone-50/90 rounded-xl p-3 text-xs border border-stone-200/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[11px] text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          Personal Notes ({notesList.length})
        </span>
        {!isAdding && (
          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
              setEditingNoteId(null);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded-md border border-stone-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Note</span>
          </button>
        )}
      </div>

      {/* Existing Notes List */}
      {notesList.length > 0 ? (
        <div className="space-y-1.5">
          {notesList.map((n, idx) => {
            const isEditingThis = editingNoteId === n.id;
            if (isEditingThis) {
              return (
                <div key={n.id || idx} className="p-2 bg-white rounded-lg border border-emerald-400 space-y-2 shadow-2xs">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingNoteId(null)}
                      className="px-2.5 py-0.5 text-stone-500 hover:bg-stone-100 rounded text-[11px] font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(n.id)}
                      className="px-2.5 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={n.id || idx}
                className="flex items-start justify-between gap-2 p-2 bg-white rounded-lg border border-stone-200/70 hover:border-stone-300 transition-all text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-stone-800 text-[11.5px] leading-relaxed break-words font-medium">
                    {n.text}
                  </p>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {n.createdAt || 'Saved note'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(n)}
                    title="Edit note"
                    className="p-1 text-stone-400 hover:text-emerald-700 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(type, id, n.id)}
                    title="Delete note"
                    className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : !isAdding ? (
        <p className="text-stone-400 italic text-[11px] py-0.5">
          No personal notes yet. Click "+ Add Note" to keep grocery reminders.
        </p>
      ) : null}

      {/* New Note Form */}
      {isAdding && (
        <div className="p-2 bg-white rounded-lg border border-emerald-400 space-y-2 shadow-2xs">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Type your personal shopping reminder (e.g. check stall 4 for pure honey)..."
            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            rows={2}
            autoFocus
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewText('');
              }}
              className="px-2.5 py-0.5 text-stone-500 hover:bg-stone-100 rounded text-[11px] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateNote}
              disabled={!newText.trim()}
              className="px-2.5 py-0.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookmarkPanel({ isOpen, onClose }) {
  const {
    bookmarks,
    toggleMarket,
    toggleProduce,
    addNote,
    editNote,
    deleteNote,
    exportBookmarks,
    addToast,
    currentUser,
    cart,
    addToCart,
    updateCartQuantity
  } = useApp();

  const [activeTab, setActiveTab] = useState('markets'); // 'markets' | 'produce'

  if (!isOpen) return null;

  const bookmarkedMarkets = marketsData.filter((m) =>
    bookmarks.marketIds.includes(m.id)
  );

  const bookmarkedProduce = produceData.filter((p) =>
    bookmarks.produceIds.includes(p.id)
  );

  const totalCount = bookmarks.marketIds.length + bookmarks.produceIds.length;

  const handleShareList = () => {
    shareRecommendation(
      'My FreshFind Saved Farmers Markets & Produce',
      `Check out my favorite local farmers markets and seasonal produce on FreshFind!`,
      window.location.origin
    );
    addToast('FreshFind recommendation link copied to clipboard!', 'info');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookmark-panel-title"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-forest p-5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-300/40 flex items-center justify-center text-rose-300">
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            </div>
            <div>
              <h2 id="bookmark-panel-title" className="font-extrabold text-base tracking-tight">
                My Saved Favorites
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                {currentUser ? `${currentUser.name}'s Account • ${totalCount} saved` : `Saved Favorites • ${totalCount} saved`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close bookmarks panel"
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Actions (Export / Share) */}
        <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={exportBookmarks}
            disabled={totalCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-emerald-800 text-xs font-bold shadow-xs hover:bg-emerald-50 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Bookmarks (.txt)</span>
          </button>

          <button
            type="button"
            onClick={handleShareList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-stone-700 text-xs font-bold shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Share</span>
          </button>
        </div>

        {/* Tabs: Markets vs Produce */}
        <div className="flex border-b border-stone-200 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('markets')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'markets'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Markets ({bookmarkedMarkets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('produce')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'produce'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>Produce ({bookmarkedProduce.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'markets' ? (
            bookmarkedMarkets.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-800 text-sm mb-1">
                  No markets bookmarked yet
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                  Browse the market directory and click the heart icon on any market to save it for your shopping trip.
                </p>
                <Link
                  to="/markets"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  <span>Explore Markets</span>
                </Link>
              </div>
            ) : (
              bookmarkedMarkets.map((market) => (
                <div
                  key={market.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-white shadow-soft hover:border-emerald-300 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={market.image}
                      alt={market.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/market/${market.id}`}
                        onClick={onClose}
                        className="font-bold text-sm text-stone-900 hover:text-emerald-700 transition-colors line-clamp-1"
                      >
                        {market.name}
                      </Link>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{market.area}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMarket(market.id)}
                      title="Remove bookmark"
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Multiple Personal Notes Section */}
                  <ItemNotesSection
                    type="market"
                    id={market.id}
                    notes={bookmarks.notes?.[`market_${market.id}`]}
                    onAddNote={addNote}
                    onEditNote={editNote}
                    onDeleteNote={deleteNote}
                  />
                </div>
              ))
            )
          ) : bookmarkedProduce.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">
                No produce bookmarked yet
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                Explore the Produce Guide and save fresh vegetables, fruits, or herbs to your list.
              </p>
              <Link
                to="/produce"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                <span>Browse Produce Guide</span>
              </Link>
            </div>
          ) : (
            bookmarkedProduce.map((produce) => {
              const cartItem = cart?.find((item) => item.id === produce.id);

              return (
                <div
                  key={produce.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-white shadow-soft hover:border-emerald-300 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={produce.image}
                      alt={produce.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-stone-900 truncate">
                        {produce.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded">
                          {produce.category}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {produce.season}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm font-extrabold text-emerald-800">
                          Rs. {produce.price || 250}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-500">
                          / {produce.unit || 'kg'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProduce(produce.id)}
                      title="Remove bookmark"
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart or Quantity Stepper */}
                  {cartItem ? (
                    <div className="flex items-center justify-between w-full bg-emerald-50 border border-emerald-200/90 rounded-xl px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-900">
                        <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-xs font-bold">
                          {cartItem.quantity} in cart
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(produce.id, cartItem.quantity - 1)}
                          aria-label={`Decrease ${produce.name} quantity`}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(produce.id, cartItem.quantity + 1)}
                          aria-label={`Increase ${produce.name} quantity`}
                          className="w-6 h-6 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(produce)}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}

                  {/* Multiple Personal Notes Section */}
                  <ItemNotesSection
                    type="produce"
                    id={produce.id}
                    notes={bookmarks.notes?.[`produce_${produce.id}`]}
                    onAddNote={addNote}
                    onEditNote={editNote}
                    onDeleteNote={deleteNote}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center shrink-0">
          <p className="text-[11px] text-stone-500">
            Personal notes are saved on your device and can be exported as a shopping checklist at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
