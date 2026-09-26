import React from 'react';
import { Link } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';
import {
  Heart,
  MapPin,
  Mail,
  ArrowUp,
  Leaf,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-3.5 sm:pt-4 pb-6 sm:pb-7 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header of Footer: Tagline & Relocated Back to Top Button */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-5 sm:mb-6 border-b border-stone-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wide">Fresh All Along &bull; Connecting Communities with Local Harvests</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-emerald-950 text-stone-300 hover:text-white text-xs font-semibold border border-stone-800 hover:border-emerald-700/60 transition-all duration-200 shadow-sm group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Main Highlight Columns */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10 pb-6 sm:pb-8 border-b border-stone-800">
          {/* Brand Info Column (Left aligned) */}
          <div className="w-full lg:max-w-lg xl:max-w-xl space-y-3">
            <Link
              to="/"
              className="inline-block group focus:outline-none"
              aria-label="FreshFind — Return to Home"
            >
              <img
                src="/images/freshfind-brand-logo.png"
                alt="FreshFind — Fresh All Along"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              FreshFind connects city residents directly with sustainable local farmers markets, seasonal harvest guides, and neighborhood food producers under the <strong>eGreen Basket</strong> initiative.
            </p>

            <div className="pt-2">
              <VisitorCounter />
            </div>
          </div>

          {/* Right-Aligned Columns: Explore FreshFind & Community Contact */}
          <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-16 lg:gap-20 xl:gap-24 lg:ml-auto">
            {/* Quick Links Column */}
            <div className="space-y-3 shrink-0 min-w-[170px]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore FreshFind</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-medium">
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Home / Quick Find
                  </Link>
                </li>
                <li>
                  <Link to="/markets" className="hover:text-emerald-400 transition-colors">
                    Market Directory
                  </Link>
                </li>
                <li>
                  <Link to="/produce" className="hover:text-emerald-400 transition-colors">
                    Produce Guide & Stalls
                  </Link>
                </li>
                <li>
                  <Link to="/seasonal" className="hover:text-emerald-400 transition-colors">
                    Seasonal Recommendations
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-emerald-400 transition-colors">
                    About Us & Platform Purpose
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                    Contact Us & Location
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Details Column */}
            <div className="space-y-3 shrink-0 min-w-[200px]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Community Contact
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-stone-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Karachi, Sindh, Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>team@freshfind.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} <strong>FreshFind</strong> — Fresh All Along. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
