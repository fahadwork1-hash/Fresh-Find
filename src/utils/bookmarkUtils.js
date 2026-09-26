// Session-only bookmarking and personal notes utility for FreshFind
// Adheres strictly to the SRS: SESSION-ONLY storage via sessionStorage

const STORAGE_KEY = 'freshfind_session_bookmarks_v1';

/**
 * Default empty state
 */
const defaultBookmarks = {
  marketIds: [],
  produceIds: [],
  notes: {} // key: `${type}_${id}`, value: string
};

/**
 * Load bookmarks for a specific user from localStorage
 */
export function getUserBookmarks(userEmail) {
  if (!userEmail) return { ...defaultBookmarks };
  try {
    const key = `freshfind_bookmarks_${userEmail.trim().toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) return { ...defaultBookmarks };
    const parsed = JSON.parse(raw);
    return {
      marketIds: Array.isArray(parsed.marketIds) ? parsed.marketIds : [],
      produceIds: Array.isArray(parsed.produceIds) ? parsed.produceIds : [],
      notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {}
    };
  } catch (err) {
    console.warn('Could not read user bookmarks:', err);
    return { ...defaultBookmarks };
  }
}

/**
 * Save bookmarks for a specific user to localStorage
 */
export function saveUserBookmarks(userEmail, bookmarks) {
  if (!userEmail) return;
  try {
    const key = `freshfind_bookmarks_${userEmail.trim().toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(bookmarks));
  } catch (err) {
    console.warn('Could not save user bookmarks:', err);
  }
}

/**
 * Load bookmarks from sessionStorage (fallback)
 */
export function getSessionBookmarks() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultBookmarks };
    const parsed = JSON.parse(raw);
    return {
      marketIds: Array.isArray(parsed.marketIds) ? parsed.marketIds : [],
      produceIds: Array.isArray(parsed.produceIds) ? parsed.produceIds : [],
      notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {}
    };
  } catch (err) {
    console.warn('Could not read session bookmarks:', err);
    return { ...defaultBookmarks };
  }
}

/**
 * Save bookmarks to sessionStorage (fallback)
 */
export function saveSessionBookmarks(bookmarks) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (err) {
    console.warn('Could not save session bookmarks:', err);
  }
}

/**
 * Toggle bookmark for a market
 */
export function toggleMarketBookmark(marketId) {
  const current = getSessionBookmarks();
  const exists = current.marketIds.includes(marketId);
  const updatedIds = exists
    ? current.marketIds.filter((id) => id !== marketId)
    : [...current.marketIds, marketId];

  const updated = {
    ...current,
    marketIds: updatedIds
  };
  saveSessionBookmarks(updated);
  return updated;
}

/**
 * Toggle bookmark for a produce item
 */
export function toggleProduceBookmark(produceId) {
  const current = getSessionBookmarks();
  const exists = current.produceIds.includes(produceId);
  const updatedIds = exists
    ? current.produceIds.filter((id) => id !== produceId)
    : [...current.produceIds, produceId];

  const updated = {
    ...current,
    produceIds: updatedIds
  };
  saveSessionBookmarks(updated);
  return updated;
}

/**
 * Save or update personal note for an item
 */
export function setItemNote(type, id, noteText) {
  const current = getSessionBookmarks();
  const key = `${type}_${id}`;
  const updatedNotes = { ...current.notes };

  if (!noteText || noteText.trim() === '') {
    delete updatedNotes[key];
  } else {
    updatedNotes[key] = noteText.trim();
  }

  const updated = {
    ...current,
    notes: updatedNotes
  };
  saveSessionBookmarks(updated);
  return updated;
}

/**
 * Exports bookmarked items into a formatted text file download
 */
export function exportBookmarksToText(bookmarks, allMarkets, allProduce) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let content = `====================================================\n`;
  content += ` FRESHFIND - FRESH ALL ALONG\n`;
  content += ` Saved Bookmarks & Session Notes\n`;
  content += ` Exported: ${dateStr}\n`;
  content += `====================================================\n\n`;

  // Markets Section
  content += `--- SAVED FARMERS MARKETS (${bookmarks.marketIds.length}) ---\n\n`;
  if (bookmarks.marketIds.length === 0) {
    content += `No markets bookmarked yet.\n\n`;
  } else {
    bookmarks.marketIds.forEach((id, idx) => {
      const m = allMarkets.find((item) => item.id === id);
      if (!m) return;
      const note = bookmarks.notes[`market_${id}`];

      content += `${idx + 1}. ${m.name}\n`;
      content += `   Area: ${m.area}\n`;
      content += `   Address: ${m.address}\n`;
      content += `   Contact: ${m.contact?.phone || 'N/A'} | ${m.contact?.email || 'N/A'}\n`;
      if (note) {
        content += `   [Personal Note]: "${note}"\n`;
      }
      content += `\n`;
    });
  }

  // Produce Section
  content += `--- SAVED PRODUCE ITEMS (${bookmarks.produceIds.length}) ---\n\n`;
  if (bookmarks.produceIds.length === 0) {
    content += `No produce items bookmarked yet.\n\n`;
  } else {
    bookmarks.produceIds.forEach((id, idx) => {
      const p = allProduce.find((item) => item.id === id);
      if (!p) return;
      const note = bookmarks.notes[`produce_${id}`];

      content += `${idx + 1}. ${p.name} (${p.category})\n`;
      content += `   Peak Season: ${p.season} (${p.peakMonths?.join(', ') || ''})\n`;
      content += `   Storage Tip: ${p.storageTip || 'N/A'}\n`;
      if (note) {
        content += `   [Personal Note]: "${note}"\n`;
      }
      content += `\n`;
    });
  }

  content += `====================================================\n`;
  content += `Discover more fresh local food at FreshFind!\n`;

  // Trigger browser download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `freshfind-bookmarks-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Social share helpers
 */
export function shareRecommendation(title, text, url = window.location.href) {
  if (navigator.share) {
    navigator
      .share({
        title,
        text,
        url
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          copyToClipboard(url);
        }
      });
  } else {
    copyToClipboard(url);
  }
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve(false);
}
