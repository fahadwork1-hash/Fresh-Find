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

const GUEST_STORAGE_KEY = 'freshfind_guest_bookmarks_v2';

/**
 * Normalizes notes for an item into an array of note objects
 * Backwards compatible with legacy single-string notes
 */
export function normalizeNotes(rawNotes) {
  if (!rawNotes) return [];
  if (Array.isArray(rawNotes)) {
    return rawNotes.map((n, idx) => {
      if (typeof n === 'string') {
        return {
          id: `legacy_${idx}`,
          text: n,
          createdAt: 'Saved'
        };
      }
      return n;
    });
  }
  if (typeof rawNotes === 'string' && rawNotes.trim()) {
    return [{
      id: 'legacy_0',
      text: rawNotes.trim(),
      createdAt: 'Saved'
    }];
  }
  return [];
}

/**
 * Load bookmarks for guest / unauthenticated visitor
 */
export function getGuestBookmarks() {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY) || sessionStorage.getItem('freshfind_session_bookmarks_v1');
    if (!raw) return { ...defaultBookmarks };
    const parsed = JSON.parse(raw);
    return {
      marketIds: Array.isArray(parsed.marketIds) ? parsed.marketIds : [],
      produceIds: Array.isArray(parsed.produceIds) ? parsed.produceIds : [],
      notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {}
    };
  } catch (err) {
    return { ...defaultBookmarks };
  }
}

/**
 * Save bookmarks for guest / unauthenticated visitor
 */
export function saveGuestBookmarks(bookmarks) {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (err) {
    console.warn('Could not save guest bookmarks:', err);
  }
}

/**
 * Add a new personal note to an item's multiple notes list
 */
export function addItemNote(bookmarks, type, id, text) {
  if (!text || !text.trim()) return bookmarks;
  const key = `${type}_${id}`;
  const existingNotes = normalizeNotes(bookmarks.notes?.[key]);
  const newNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    text: text.trim(),
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  return {
    ...bookmarks,
    notes: {
      ...bookmarks.notes,
      [key]: [...existingNotes, newNote]
    }
  };
}

/**
 * Edit an existing personal note
 */
export function editItemNote(bookmarks, type, id, noteId, newText) {
  const key = `${type}_${id}`;
  const existingNotes = normalizeNotes(bookmarks.notes?.[key]);
  const updatedNotes = existingNotes.map((n) =>
    n.id === noteId ? { ...n, text: newText.trim(), updatedAt: 'Edited' } : n
  );
  return {
    ...bookmarks,
    notes: {
      ...bookmarks.notes,
      [key]: updatedNotes
    }
  };
}

/**
 * Delete a specific personal note from an item
 */
export function deleteItemNote(bookmarks, type, id, noteId) {
  const key = `${type}_${id}`;
  const existingNotes = normalizeNotes(bookmarks.notes?.[key]);
  const updatedNotes = existingNotes.filter((n) => n.id !== noteId);
  return {
    ...bookmarks,
    notes: {
      ...bookmarks.notes,
      [key]: updatedNotes
    }
  };
}

/**
 * Save or update personal note for an item (backwards compatible single note)
 */
export function setItemNote(type, id, noteText) {
  const current = getSessionBookmarks();
  const key = `${type}_${id}`;
  const updatedNotes = { ...current.notes };

  if (!noteText || noteText.trim() === '') {
    delete updatedNotes[key];
  } else {
    updatedNotes[key] = [{
      id: `note_${Date.now()}`,
      text: noteText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
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
      const notes = normalizeNotes(bookmarks.notes[`market_${id}`]);

      content += `${idx + 1}. ${m.name}\n`;
      content += `   Area: ${m.area}\n`;
      content += `   Address: ${m.address}\n`;
      content += `   Contact: ${m.contact?.phone || 'N/A'} | ${m.contact?.email || 'N/A'}\n`;
      if (notes.length === 1) {
        content += `   [Personal Note]: "${notes[0].text}" (${notes[0].createdAt || 'Saved'})\n`;
      } else if (notes.length > 1) {
        content += `   [Personal Notes] (${notes.length}):\n`;
        notes.forEach((n, nIdx) => {
          content += `     • Note ${nIdx + 1}: "${n.text}" (${n.createdAt || 'Saved'})\n`;
        });
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
      const notes = normalizeNotes(bookmarks.notes[`produce_${id}`]);

      content += `${idx + 1}. ${p.name} (${p.category})\n`;
      content += `   Peak Season: ${p.season} (${p.peakMonths?.join(', ') || ''})\n`;
      content += `   Storage Tip: ${p.storageTip || 'N/A'}\n`;
      if (notes.length === 1) {
        content += `   [Personal Note]: "${notes[0].text}" (${notes[0].createdAt || 'Saved'})\n`;
      } else if (notes.length > 1) {
        content += `   [Personal Notes] (${notes.length}):\n`;
        notes.forEach((n, nIdx) => {
          content += `     • Note ${nIdx + 1}: "${n.text}" (${n.createdAt || 'Saved'})\n`;
        });
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
