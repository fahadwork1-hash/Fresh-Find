import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

export default function MapEmbed({
  title = 'Market Location',
  address = '',
  coordinates = { lat: 24.8138, lng: 67.0304 },
  zoom = 15,
  height = '350px'
}) {
  const { lat, lng } = coordinates;

  // Google Maps embed URL (works reliably on all browsers without requiring WebGL 3D graphics)
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;

  // Direct Google Maps link for directions
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft flex flex-col">
      {/* Map Control Bar */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-stone-800">{title}</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-400 text-emerald-800 font-bold hover:bg-emerald-50 transition-colors shadow-sm"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>Get Directions in Google Maps</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </a>
      </div>

      {/* Interactive Map Iframe */}
      <div className="relative w-full bg-stone-100 overflow-hidden" style={{ height }}>
        <iframe
          title={`Map for ${title}`}
          src={embedUrl}
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Address Floating Card */}
        {address && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-elevated border border-stone-200 text-xs">
            <span className="font-bold text-stone-900 block truncate">{title}</span>
            <span className="text-stone-600 text-[11px] block mt-0.5 line-clamp-2">
              {address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
