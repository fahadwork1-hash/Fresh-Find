import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookmarkPanel from './BookmarkPanel';
import marketsData from '../data/markets.json';
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  Store,
  Apple,
  Phone,
  Info,
  Search,
  User,
  LogOut,
  ChevronDown,
  ShoppingCart
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookmarkPanelOpen, setBookmarkPanelOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  const {
    bookmarks,
    openAuthModal,
    currentUser,
    logoutUser,
    cartItemCount,
    openCartDrawer
  } = useApp();
  const navigate = useNavigate();

  const totalBookmarks = bookmarks.marketIds.length + bookmarks.produceIds.length;

  // Filter suggested markets based on input
  const suggestedMarkets = useMemo(() => {
    if (!navSearch.trim()) return [];
    const query = navSearch.toLowerCase().trim();
    return marketsData
      .filter((m) =>
        m.name.toLowerCase().includes(query) ||
        m.area.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [navSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/markets?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/markets');
    }
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-between h-16 sm:h-[68px]">
            {/* Logo & Brand Identity */}
            <Link
              to="/"
              className="flex items-center ml-1.5 sm:ml-2.5 group focus:outline-none shrink-0"
              aria-label="FreshFind — Return to Home"
            >
              <img
                src="/images/freshfind-brand-logo.png"
                alt="FreshFind — Fresh All Along"
                className="h-[44px] sm:h-[48px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links + Global Search */}
            <nav className="hidden lg:flex items-center justify-between flex-1 ml-6 mr-3" aria-label="Main Navigation">
              {/* Home */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative py-1.5 px-0.5 flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ShoppingBag className="w-[17px] h-[17px] text-[#065f46] stroke-[2]" />
                    <span>Home</span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stone-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* Market */}
              <NavLink
                to="/markets"
                className={({ isActive }) =>
                  `relative py-1.5 px-0.5 flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Store className="w-[17px] h-[17px] text-[#065f46] stroke-[2]" />
                    <span>Market</span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stone-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* Produce */}
              <NavLink
                to="/produce"
                className={({ isActive }) =>
                  `relative py-1.5 px-0.5 flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Apple className="w-[17px] h-[17px] text-[#065f46] stroke-[2]" />
                    <span>Produce</span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stone-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* Seasonal (Orange removed, text color matching other buttons, PEAK badge retained) */}
              <NavLink
                to="/seasonal"
                className={({ isActive }) =>
                  `relative py-1.5 px-0.5 flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Seasonal</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200/90 tracking-wider">
                      Peak
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stone-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* Contact Us */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative py-1.5 px-0.5 flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Phone className="w-[17px] h-[17px] text-[#065f46] stroke-[2]" />
                    <span>Contact Us</span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stone-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* About Us */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `relative py-1.5 px-0.5 flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Info className="w-[17px] h-[17px] text-[#065f46] stroke-[2]" />
                    <span>About Us</span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stone-300 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* Global Search Bar with Autocomplete Suggestions Dropdown (aligned right) */}
              <div ref={searchContainerRef} className="relative shrink-0">
                <form onSubmit={handleNavSearch} className="relative flex items-center group">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-hover:text-emerald-700 pointer-events-none transition-colors duration-150" />
                  <input
                    type="text"
                    value={navSearch}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                      setNavSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    placeholder="Search for markets"
                    aria-label="Search for markets"
                    className="w-[158px] h-[35px] pl-8 pr-2 bg-stone-50/80 hover:bg-white border border-stone-200/90 hover:border-emerald-600 focus:border-emerald-600 rounded-full font-outfit text-xs text-stone-800 placeholder:text-stone-400 placeholder:font-outfit focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:shadow-xs transition-all duration-150 cursor-text"
                  />
                </form>

                {/* Dropdown suggestions */}
                {showDropdown && navSearch.trim().length > 0 && (
                  <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-elevated border border-stone-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <span>Suggested Markets</span>
                      <span>{suggestedMarkets.length} found</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 py-1">
                      {suggestedMarkets.length > 0 ? (
                        suggestedMarkets.map((market) => (
                          <button
                            key={market.id}
                            type="button"
                            onClick={() => {
                              navigate(`/market/${market.id}`);
                              setNavSearch('');
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 transition-colors flex items-center gap-2.5 group cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <Store className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-stone-900 truncate group-hover:text-emerald-800">
                                {market.name}
                              </div>
                              <div className="text-[10px] text-stone-500 truncate">
                                {market.area} • {market.badge || 'Verified Market'}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-stone-500">
                          No markets found for "{navSearch}"
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/markets?search=${encodeURIComponent(navSearch.trim())}`);
                        setShowDropdown(false);
                      }}
                      className="w-full p-2 bg-stone-50 hover:bg-stone-100 text-emerald-700 text-center text-xs font-bold border-t border-stone-100 transition-colors cursor-pointer"
                    >
                      View all in Market Directory →
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Icons: Vertical Divider + Saved Button + Login Button */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Vertical Divider (Desktop) */}
              <div className="hidden lg:block h-6 w-px bg-stone-200/90 mx-0.5" />

              {/* Saved Icon Button (compact square pill with heart and badge) */}
              <button
                type="button"
                onClick={() => setBookmarkPanelOpen(true)}
                aria-label={`Open Bookmarks drawer, ${totalBookmarks} items saved`}
                title="View your saved markets & produce"
                className="relative w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
              >
                <Heart
                  className={`w-4 h-4 stroke-[1.8] ${
                    totalBookmarks > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
                  }`}
                />
                {totalBookmarks > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[17px] h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full shadow-xs">
                    {totalBookmarks}
                  </span>
                )}
              </button>

              {/* Shopping Cart Icon Button (compact square pill with cart and badge) */}
              <button
                type="button"
                onClick={openCartDrawer}
                aria-label={`Open shopping cart, ${cartItemCount} items`}
                title="View your fresh produce cart"
                className="relative w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
              >
                <ShoppingCart className="w-4 h-4 stroke-[1.8] text-stone-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[17px] h-4 px-1 text-[10px] font-bold text-white bg-emerald-600 rounded-full shadow-xs animate-in zoom-in-75 duration-150">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Login / User Profile Pill Button */}
              {currentUser ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label={`User profile for ${currentUser.name}`}
                    title={currentUser.name}
                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs transition-colors flex items-center gap-2 text-sm font-semibold focus:outline-none whitespace-nowrap cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-elevated border border-stone-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 bg-stone-50 border-b border-stone-100">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {currentUser.email || 'Community Member'}
                        </div>
                      </div>
                      <div className="p-1">
                        <button
                          type="button"
                          onClick={() => {
                            logoutUser();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  aria-label="Sign in"
                  title="Sign in to your account"
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xs transition-colors flex items-center gap-2 text-sm font-semibold focus:outline-none whitespace-nowrap cursor-pointer"
                >
                  <User className="w-4 h-4 stroke-[1.8] text-stone-700" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
            {/* Mobile Global Search Bar */}
            <div className="relative">
              <form onSubmit={handleNavSearch} className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search for markets"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </form>

              {navSearch.trim().length > 0 && (
                <div className="mt-2 bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-sm">
                  {suggestedMarkets.length > 0 ? (
                    suggestedMarkets.map((market) => (
                      <button
                        key={market.id}
                        type="button"
                        onClick={() => {
                          navigate(`/market/${market.id}`);
                          setNavSearch('');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-stone-800 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{market.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2.5 text-center text-xs text-stone-500">
                      No markets found
                    </div>
                  )}
                </div>
              )}
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <ShoppingBag className="w-4 h-4 text-[#065f46]" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/markets"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <Store className="w-4 h-4 text-[#065f46]" />
                <span>Market</span>
              </NavLink>

              <NavLink
                to="/produce"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <Apple className="w-4 h-4 text-[#065f46]" />
                <span>Produce</span>
              </NavLink>

              <NavLink
                to="/seasonal"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <span>Seasonal</span>
                <span className="text-[10px] uppercase font-bold bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-full">
                  Peak
                </span>
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <Phone className="w-4 h-4 text-[#065f46]" />
                <span>Contact Us</span>
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <Info className="w-4 h-4 text-[#065f46]" />
                <span>About Us</span>
              </NavLink>
            </nav>

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-stone-100">
              {currentUser ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {currentUser.email || 'Community Member'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 shrink-0 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Bookmarks Drawer Modal */}
      <BookmarkPanel
        isOpen={bookmarkPanelOpen}
        onClose={() => setBookmarkPanelOpen(false)}
      />
    </>
  );
}
