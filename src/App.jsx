import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import DummyAuthModal from './components/DummyAuthModal';
import ToastContainer from './components/ToastContainer';
import CartDrawer from './components/CartDrawer';
import OrderReceiptModal from './components/OrderReceiptModal';

// Pages
import Home from './pages/Home';
import MarketDirectory from './pages/MarketDirectory';
import MarketDetail from './pages/MarketDetail';
import ProduceGuide from './pages/ProduceGuide';
import SeasonalPage from './pages/SeasonalPage';
import About from './pages/About';
import Contact from './pages/Contact';

// Icons for 404
import { ShoppingBag, ArrowLeft, Home as HomeIcon, Search } from 'lucide-react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 404 Not Found Page
function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            404 Error • Page Lost In The Fields
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Fresh Crop Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page or market listing you are seeking might have been moved or is currently out of season.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors shadow-soft"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/markets"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Markets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50/50 font-sans text-slate-800">
      <ScrollToTop />
      
      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<MarketDirectory />} />
          <Route path="/market/:id" element={<MarketDetail />} />
          <Route path="/produce" element={<ProduceGuide />} />
          <Route path="/seasonal" element={<SeasonalPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Deterministic Chatbot Assistant */}
      <Chatbot />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Order Receipt Confirmation Modal */}
      <OrderReceiptModal />

      {/* Dummy Authentication Modal (SRS Demo compliance) */}
      <DummyAuthModal />
    </div>
  );
}
