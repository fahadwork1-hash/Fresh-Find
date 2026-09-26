import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Award, 
  ArrowRight,
  Leaf,
  CheckCircle2
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  const pillars = [
    {
      icon: <Leaf className="w-6 h-6 text-brand-600" />,
      title: "eGreen Basket Philosophy",
      description: "Empowering urban families to consume fresh, chemical-free harvests while honoring local growers who preserve soil biodiversity."
    },
    {
      icon: <Compass className="w-6 h-6 text-brand-600" />,
      title: "Hyperlocal Transparency",
      description: "Providing real-time operating hours, authentic vendor rosters, and GPS routing so consumers know exactly where their daily food originates."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-brand-600" />,
      title: "Zero-Middlemen Promise",
      description: "Direct discovery bridges smallholders with communities, ensuring farmers earn 100% fair value for their dawn harvests."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      title: "Seasonal Rhythm",
      description: "Promoting climate-resilient regional eating habits by highlighting produce at its natural peak nutritional potency."
    }
  ];

  const milestones = [
    { stat: "12+", label: "Verified Farmers Markets" },
    { stat: "32+", label: "Seasonal Crops Cataloged" },
    { stat: "100%", label: "Client-Side Privacy (No Trackers)" },
    { stat: "0s", label: "Zero Server Latency Architecture" }
  ];

  const team = [
    {
      name: "Fahad Rasheed",
      role: "MSG Algorithmics",
      image: "/images/team/fahad-rasheed.jpg",
      bio: "Core developer driving platform architecture, state engineering, and seamless digital agricultural experiences."
    },
    {
      name: "Ali Noor",
      role: "MSG Algorithmics",
      image: "/images/team/ali-noor.jpg",
      bio: "Frontend architect designing responsive user interfaces, accessible interactions, and modern farm-to-table UI."
    },
    {
      name: "Mashood Faisal",
      role: "MSG Algorithmics",
      image: "/images/team/mashood-faisal.jpg",
      bio: "Technical analyst ensuring strict SRS requirements compliance, feature testing, and location-based calculations."
    },
    {
      name: "Muhammad Imran",
      role: "MSG Algorithmics",
      image: "/images/team/muhammad-imran.jpg",
      bio: "Product strategist managing local market research, seasonal harvest cataloging, and e-commerce workflows."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Hero Header (Fresh Green & White Aesthetic) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-stone-50/50 pt-8 pb-16 px-4 sm:px-6 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'About Us' }]} />
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-tight">
              Empowering Communities Through <span className="text-[#065f46]">Fresh All Along</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              FreshFind was engineered to eliminate the disconnect between urban kitchens and regional agriculture. We champion organic smallholders, transparent local commerce, and seasonal nutrition.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {milestones.map((item, idx) => (
            <div key={idx} className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-brand-700 mb-1 tracking-tight">
                {item.stat}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Mission & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-700 font-bold text-sm uppercase tracking-wider mb-2">
              Our Story & Purpose
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              Rooted in Nature, Designed for Everyday Convenience
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                In fast-growing metropolitan centers, finding genuine, peak-harvest produce often requires relying on mass-distributed supermarket cold storage with weeks-old nutritional value.
              </p>
              <p>
                FreshFind was conceptualized under the <strong>eGreen Basket</strong> ethos: bringing residents closer to the earth with a seamless, instant directory of local farmers markets, certified weekly bazaars, and organic cooperative pop-ups.
              </p>
              <p>
                Whether you need early morning Sunday desi honey in Clifton, farm-fresh spinach in Gulshan, or cold-pressed mustard oil in F-6 Islamabad, FreshFind gives you live operating statuses, distance estimations, and seasonal advice in milliseconds.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/markets" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-sm hover:shadow group"
              >
                Browse Farmers Markets
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/seasonal" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold transition-colors"
              >
                Explore Seasonal Harvests
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80" 
                alt="Vibrant organic marketplace stall with fresh produce" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-emerald-950 text-white p-5 rounded-2xl shadow-xl max-w-xs hidden sm:block border border-brand-500/20">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> 100% Farm-Direct
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Verified growers harvest at twilight, setting up stalls by morning light for unmatched crispness and nutrition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of eGreen Basket */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            The FreshFind Standards
          </h2>
          <p className="text-slate-600">
            Guided by community stewardship and culinary excellence, every market on our platform is evaluated against four essential criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 border border-brand-100">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Meet Team MSG Algorithmics
          </h2>
          <p className="text-slate-600">
            A passionate collective of agronomists, digital builders, and culinary researchers committed to keeping fresh harvests accessible to all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-soft hover:shadow-card transition-shadow flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden bg-stone-100">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <span className="inline-block self-start text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider my-2">
                  {member.role}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-gradient-to-r from-brand-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-elevated">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Taste the True Freshness of Local Soil?
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Check today’s live market schedules, locate organic stalls in your area, and plan your weekly basket with FreshFind.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/markets" 
              className="px-8 py-3.5 rounded-xl bg-white text-brand-800 font-bold hover:bg-stone-100 transition-colors shadow-sm"
            >
              Find Markets Near You
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3.5 rounded-xl bg-brand-800/60 hover:bg-brand-800 text-white font-semibold transition-colors border border-brand-400/40"
            >
              Suggest a Market
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
