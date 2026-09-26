import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SeasonalPicks from '../components/SeasonalPicks';
import ProduceDetailModal from '../components/ProduceDetailModal';
import { Calendar, HeartHandshake, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

export default function SeasonalPage() {
  const [selectedProduce, setSelectedProduce] = useState(null);

  const seasonalPillars = [
    {
      icon: Sun,
      title: 'Peak Flavor & Nutrients',
      desc: 'Produce harvested at natural maturity develops full sugar content, crisp texture, and maximum natural antioxidants.'
    },
    {
      icon: CloudRain,
      title: 'Supporting Smallholders',
      desc: 'Buying seasonal harvests keeps revenue flowing directly to regional agricultural growers during their peak picking cycles.'
    },
    {
      icon: Wind,
      title: 'Lower Ecological Footprint',
      desc: 'In-season produce travels directly from local riverbelts and nurseries, drastically cutting cold-storage transport emissions.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Seasonal Recommendations' }]} />

      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
          <span>Agricultural Almanac</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
          Seasonal Harvest Recommendations
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Nature provides the right nutrients at the right time of year. Explore what is currently flourishing in regional soils and which local markets have morning harvests available.
        </p>
      </div>

      {/* Pillars of Seasonal Eating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {seasonalPillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-3xl border border-stone-200 shadow-soft space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
              <pillar.icon className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">
              {pillar.title}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Interactive Seasonal Component */}
      <SeasonalPicks
        title="Seasonal Harvest Directory"
        subtitle="Select any season to discover key crops, storage wisdom, and markets with fresh supplies."
        showTabs={true}
        onSelectProduce={(p) => setSelectedProduce(p)}
      />

      {/* Produce Modal */}
      {selectedProduce && (
        <ProduceDetailModal
          produce={selectedProduce}
          onClose={() => setSelectedProduce(null)}
        />
      )}
    </div>
  );
}
