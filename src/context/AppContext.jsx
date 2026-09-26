import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUserBookmarks,
  saveUserBookmarks,
  getGuestBookmarks,
  saveGuestBookmarks,
  addItemNote,
  editItemNote,
  deleteItemNote,
  normalizeNotes,
  exportBookmarksToText
} from '../utils/bookmarkUtils';
import { requestUserLocation } from '../utils/geoUtils';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Toast System (Initialized first so all hooks can access it)
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSimulatedTime, setIsSimulatedTime] = useState(false);
  const [simulatedOffsetMinutes, setSimulatedOffsetMinutes] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (isSimulatedTime) {
        // Apply manual simulated offset
        const sim = new Date(now.getTime() + simulatedOffsetMinutes * 60000);
        setCurrentTime(sim);
      } else {
        setCurrentTime(now);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSimulatedTime, simulatedOffsetMinutes]);

  const setPresetSimulatedTime = (preset) => {
    const now = new Date();
    if (preset === 'real') {
      setIsSimulatedTime(false);
      setSimulatedOffsetMinutes(0);
      setCurrentTime(new Date());
      addToast('Switched to live browser clock', 'info');
      return;
    }

    // Set to a specific day / time for demo testing
    const target = new Date();
    if (preset === 'saturday-morning') {
      // Find Saturday
      const day = target.getDay();
      const diff = (6 - day + 7) % 7;
      target.setDate(target.getDate() + diff);
      target.setHours(9, 30, 0, 0); // Saturday 9:30 AM
    } else if (preset === 'sunday-noon') {
      const day = target.getDay();
      const diff = (0 - day + 7) % 7;
      target.setDate(target.getDate() + diff);
      target.setHours(12, 0, 0, 0); // Sunday 12:00 PM
    } else if (preset === 'wednesday-morning') {
      const day = target.getDay();
      const diff = (3 - day + 7) % 7;
      target.setDate(target.getDate() + diff);
      target.setHours(10, 0, 0, 0); // Wednesday 10:00 AM
    } else if (preset === 'night-closed') {
      target.setHours(23, 30, 0, 0); // 11:30 PM (everything closed)
    }

    const diffMinutes = Math.round((target.getTime() - now.getTime()) / 60000);
    setIsSimulatedTime(true);
    setSimulatedOffsetMinutes(diffMinutes);
    setCurrentTime(target);
    addToast(`Clock simulated to: ${target.toLocaleDateString('en-US', { weekday: 'short' })} ${target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 'info');
  };

  // 2. Simulated Visitor Counter
  const [visitorCount, setVisitorCount] = useState(() => {
    const saved = localStorage.getItem('freshfind_visitor_count');
    if (saved) return parseInt(saved, 10);
    return 12458;
  });

  useEffect(() => {
    // Initial increment on first visit in this session
    const sessionVisited = sessionStorage.getItem('freshfind_visited_this_session');
    if (!sessionVisited) {
      sessionStorage.setItem('freshfind_visited_this_session', 'true');
      setVisitorCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('freshfind_visitor_count', next.toString());
        } catch (e) {
          // ignore storage quota
        }
        return next;
      });
    }

    // Steady, organic real-time increment: every 4.5s to 7.5s (normal, realistic pace)
    let timeoutId;
    const scheduleNextVisitor = () => {
      const delay = Math.floor(Math.random() * 3000) + 4500; // 4.5s to 7.5s
      timeoutId = setTimeout(() => {
        setVisitorCount((prev) => {
          // 85% chance of +1, 15% chance of +2
          const inc = Math.random() > 0.85 ? 2 : 1;
          const next = prev + inc;
          try {
            localStorage.setItem('freshfind_visitor_count', next.toString());
          } catch (e) {
            // ignore
          }
          return next;
        });
        scheduleNextVisitor();
      }, delay);
    };

    scheduleNextVisitor();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // 3. User Geolocation
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const requestLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const coords = await requestUserLocation();
      setUserCoords(coords);
      addToast('Location detected! Markets can now be sorted by proximity.', 'success');
      return coords;
    } catch (err) {
      setLocationError(err.message);
      addToast(err.message, 'warning');
      return null;
    } finally {
      setIsLocating(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setUserCoords(null);
    setLocationError(null);
    addToast('Location cleared.', 'info');
  }, []);

  // 4. Auth Modal State
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal({ isOpen: false, mode: 'login' });
  }, []);

  // 5. Registered Users Database & Session (persisted in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_users_db');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // 6. Bookmarks (supports both guest and authenticated user)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_user');
      if (saved) {
        const user = JSON.parse(saved);
        if (user?.email) {
          return getUserBookmarks(user.email);
        }
      }
    } catch (e) {
      // fallback
    }
    return getGuestBookmarks();
  });

  // Keep bookmarks synced when currentUser logs in, logs out, or switches accounts
  useEffect(() => {
    if (currentUser?.email) {
      setBookmarks(getUserBookmarks(currentUser.email));
    } else {
      setBookmarks(getGuestBookmarks());
    }
  }, [currentUser]);

  // Helper to persist bookmarks
  const persistBookmarks = useCallback((updatedBookmarks) => {
    if (currentUser?.email) {
      saveUserBookmarks(currentUser.email, updatedBookmarks);
    } else {
      saveGuestBookmarks(updatedBookmarks);
    }
  }, [currentUser]);

  const handleToggleMarket = useCallback((marketId) => {
    setBookmarks((prev) => {
      const exists = prev.marketIds.includes(marketId);
      const updatedIds = exists
        ? prev.marketIds.filter((id) => id !== marketId)
        : [...prev.marketIds, marketId];
      const updated = { ...prev, marketIds: updatedIds };
      persistBookmarks(updated);

      const market = marketsData.find((m) => m.id === marketId);
      addToast(
        !exists ? `Added "${market?.name || 'Market'}" to favorites!` : `Removed from favorites`,
        !exists ? 'success' : 'info'
      );
      return updated;
    });
  }, [persistBookmarks, addToast]);

  const handleToggleProduce = useCallback((produceId) => {
    setBookmarks((prev) => {
      const exists = prev.produceIds.includes(produceId);
      const updatedIds = exists
        ? prev.produceIds.filter((id) => id !== produceId)
        : [...prev.produceIds, produceId];
      const updated = { ...prev, produceIds: updatedIds };
      persistBookmarks(updated);

      const item = produceData.find((p) => p.id === produceId);
      addToast(
        !exists ? `Added "${item?.name || 'Produce'}" to favorites!` : `Removed from favorites`,
        !exists ? 'success' : 'info'
      );
      return updated;
    });
  }, [persistBookmarks, addToast]);

  const handleAddNote = useCallback((type, id, text) => {
    if (!text || !text.trim()) return;
    setBookmarks((prev) => {
      const updated = addItemNote(prev, type, id, text);
      persistBookmarks(updated);
      addToast('Personal note added!', 'success');
      return updated;
    });
  }, [persistBookmarks, addToast]);

  const handleEditNote = useCallback((type, id, noteId, newText) => {
    if (!newText || !newText.trim()) return;
    setBookmarks((prev) => {
      const updated = editItemNote(prev, type, id, noteId, newText);
      persistBookmarks(updated);
      addToast('Note updated!', 'success');
      return updated;
    });
  }, [persistBookmarks, addToast]);

  const handleDeleteNote = useCallback((type, id, noteId) => {
    setBookmarks((prev) => {
      const updated = deleteItemNote(prev, type, id, noteId);
      persistBookmarks(updated);
      addToast('Note deleted', 'info');
      return updated;
    });
  }, [persistBookmarks, addToast]);

  const handleUpdateNote = useCallback((type, id, text) => {
    handleAddNote(type, id, text);
  }, [handleAddNote]);

  const handleExportBookmarks = useCallback(() => {
    exportBookmarksToText(bookmarks, marketsData, produceData);
    addToast('Exported your favorites to a text file!', 'success');
  }, [bookmarks]);

  const isBookmarkedMarket = useCallback(
    (marketId) => Boolean(bookmarks?.marketIds?.includes(marketId)),
    [bookmarks]
  );

  const isBookmarkedProduce = useCallback(
    (produceId) => Boolean(bookmarks?.produceIds?.includes(produceId)),
    [bookmarks]
  );

  const registerUser = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if email already registered
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      registeredAt: new Date().toISOString()
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('freshfind_users_db', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    // Automatically log in the newly registered user
    setCurrentUser(newUser);
    try {
      localStorage.setItem('freshfind_user', JSON.stringify(newUser));
    } catch (e) {
      // ignore
    }

    addToast(`Account created successfully! Welcome, ${cleanName}!`, 'success');
    return { success: true, user: newUser };
  };

  const loginUser = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if account exists
    const user = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please create an account first.' };
    }

    // Check password
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Successful login
    setCurrentUser(user);
    try {
      localStorage.setItem('freshfind_user', JSON.stringify(user));
    } catch (e) {
      // ignore
    }

    addToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, user };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('freshfind_user');
    } catch (e) {
      // ignore
    }
    addToast('You have been signed out.', 'info');
  };

  // 7. Shopping Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  const openCartDrawer = () => setIsCartOpen(true);
  const closeCartDrawer = () => setIsCartOpen(false);

  const addToCart = useCallback((item, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      let updated;
      if (existingIndex > -1) {
        updated = prev.map((ci, idx) =>
          idx === existingIndex ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      } else {
        updated = [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: item.price || 250,
            unit: item.unit || 'kg',
            image: item.image,
            category: item.category,
            quantity: quantity
          }
        ];
      }
      try {
        localStorage.setItem('freshfind_cart', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });

    addToast(`Added "${item.name}" to cart!`, 'success');
  }, []);

  const updateCartQuantity = useCallback((itemId, newQty) => {
    setCart((prev) => {
      let updated;
      if (newQty <= 0) {
        updated = prev.filter((i) => i.id !== itemId);
      } else {
        updated = prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i));
      }
      try {
        localStorage.setItem('freshfind_cart', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      try {
        localStorage.setItem('freshfind_cart', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    addToast('Item removed from cart', 'info');
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem('freshfind_cart');
    } catch (e) {
      // ignore
    }
  }, []);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        currentTime,
        isSimulatedTime,
        setPresetSimulatedTime,
        visitorCount,
        userCoords,
        isLocating,
        locationError,
        requestLocation,
        clearLocation,
        bookmarks,
        toggleMarket: handleToggleMarket,
        toggleProduce: handleToggleProduce,
        addNote: handleAddNote,
        editNote: handleEditNote,
        deleteNote: handleDeleteNote,
        updateNote: handleUpdateNote,
        exportBookmarks: handleExportBookmarks,
        isBookmarkedMarket,
        isBookmarkedProduce,
        registeredUsers,
        registerUser,
        currentUser,
        loginUser,
        logoutUser,
        authModal,
        openAuthModal,
        closeAuthModal,
        cart,
        isCartOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartTotal,
        orderReceipt,
        setOrderReceipt,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
