import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Pause, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Maximize2,
  X
} from 'lucide-react';
import { Sponsor } from '../types';
import { useAuction } from '../context/AuctionContext';

interface SponsorSlideshowProps {
  variant?: 'banner' | 'card' | 'broadcast' | 'ticker';
  autoPlayInterval?: number; // milliseconds
  className?: string;
  showControls?: boolean;
}

export const SponsorSlideshow: React.FC<SponsorSlideshowProps> = ({
  variant = 'banner',
  autoPlayInterval = 5000,
  className = '',
  showControls = true,
}) => {
  const { sponsors } = useAuction();
  const activeSponsors = sponsors.filter(s => s.isActive);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-advance slideshow timer
  useEffect(() => {
    if (!isPlaying || activeSponsors.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSponsors.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, activeSponsors.length, autoPlayInterval]);

  if (activeSponsors.length === 0) {
    return null;
  }

  const currentSponsor = activeSponsors[currentIndex] || activeSponsors[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeSponsors.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeSponsors.length) % activeSponsors.length);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Title Sponsor':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-300 font-extrabold shadow-amber-500/30';
      case 'Powered By':
        return 'bg-gradient-to-r from-blue-500 to-cyan-400 text-black border-cyan-300 font-extrabold shadow-cyan-500/30';
      case 'Associate Sponsor':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black border-emerald-300 font-extrabold shadow-emerald-500/30';
      case 'Beverage Partner':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 text-black border-orange-300 font-extrabold shadow-orange-500/30';
      case 'Media Partner':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300 font-extrabold shadow-purple-500/30';
      default:
        return 'bg-slate-800 text-amber-400 border-amber-500/40 font-bold';
    }
  };

  // 1. BROADCAST VARIANT (For Big TV Screen Board)
  if (variant === 'broadcast') {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950 shadow-2xl ${className}`}>
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          {/* Background Image with Dark Vignette Overlay */}
          <img
            src={currentSponsor.image}
            alt={currentSponsor.name}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

          {/* Top Bar with Live Tag and Badge */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                OFFICIAL SPONSOR
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border shadow-md ${getTierColor(currentSponsor.tier)}`}>
                {currentSponsor.tier}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-amber-400 font-digital font-bold">{currentIndex + 1}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400 font-digital">{activeSponsors.length}</span>
            </div>
          </div>

          {/* Content Info */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                {currentSponsor.logo && (
                  <span className="text-2xl drop-shadow">{currentSponsor.logo}</span>
                )}
                <h4 className="font-sports text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide drop-shadow-md">
                  {currentSponsor.name}
                </h4>
              </div>
              {currentSponsor.tagline && (
                <p className="text-xs sm:text-sm text-amber-300 font-medium line-clamp-1 drop-shadow">
                  “{currentSponsor.tagline}”
                </p>
              )}
            </div>

            {/* Controls */}
            {showControls && (
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title="Previous Sponsor"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition"
                  title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title="Next Sponsor"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="h-1 bg-slate-900 w-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeSponsors.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // 2. TICKER VARIANT (Minimalist Top / Bottom Bar)
  if (variant === 'ticker') {
    return (
      <div className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-500/20 py-2 px-4 flex items-center justify-between gap-4 overflow-hidden ${className}`}>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>KPL SPONSOR SPOTLIGHT:</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${getTierColor(currentSponsor.tier)}`}>
            {currentSponsor.tier}
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-sm font-sports font-bold text-white uppercase tracking-wide truncate">
            {currentSponsor.name}
          </span>
          {currentSponsor.tagline && (
            <span className="text-xs text-slate-400 hidden md:inline truncate">
              — “{currentSponsor.tagline}”
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. DEFAULT BANNER VARIANT (For Live Auction Page & Arena)
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch min-h-[140px] sm:min-h-[160px]">
        {/* Left 4 Cols: High-Impact Sponsor Photo */}
        <div className="md:col-span-5 relative overflow-hidden h-36 md:h-auto min-h-[140px] bg-slate-950">
          <img
            src={currentSponsor.image}
            alt={currentSponsor.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-black/30 to-slate-900" />
          
          {/* Tier Badge on Image */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border shadow-lg ${getTierColor(currentSponsor.tier)}`}>
              {currentSponsor.tier}
            </span>
          </div>

          {/* Quick Enlarge Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-2.5 left-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-sm border border-slate-700 transition"
            title="View Full Sponsor Gallery"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right 7 Cols: Sponsor Details & Navigation */}
        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  TOURNAMENT PARTNER SPOTLIGHT
                </span>
              </div>

              {/* Slide Counter */}
              <div className="flex items-center gap-1 text-[11px] font-digital text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                <span className="text-amber-400 font-bold">{currentIndex + 1}</span>
                <span>/</span>
                <span>{activeSponsors.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentSponsor.logo && (
                <span className="text-2xl">{currentSponsor.logo}</span>
              )}
              <h3 className="font-sports text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                {currentSponsor.name}
              </h3>
            </div>

            {currentSponsor.tagline && (
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2">
                “{currentSponsor.tagline}”
              </p>
            )}
          </div>

          {/* Footer Controls & Dots */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
            {/* Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {activeSponsors.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-6 bg-amber-400' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={s.name}
                />
              ))}
            </div>

            {/* Prev / Play / Next Controls */}
            {showControls && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Previous Sponsor"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Next Sponsor"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-0.5 bg-slate-900 w-full overflow-hidden">
        <div 
          className="h-full bg-amber-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / activeSponsors.length) * 100}%` }}
        />
      </div>

      {/* FULLSCREEN SPONSOR GALLERY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-950 border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sports text-2xl font-bold text-white uppercase tracking-wide">
                    Official Tournament Sponsors & Partners
                  </h3>
                  <p className="text-xs text-slate-400">Katasvan Premier League 2026 • Proud Supporters</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of All Sponsors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSponsors.map((s, index) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border shadow-md ${getTierColor(s.tier)}`}>
                        {s.tier}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {s.logo && <span className="text-xl">{s.logo}</span>}
                      <h4 className="font-sports text-xl font-bold text-white uppercase tracking-wide">
                        {s.name}
                      </h4>
                    </div>
                    {s.tagline && (
                      <p className="text-xs text-slate-300">
                        “{s.tagline}”
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition"
              >
                Close Sponsor Showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
