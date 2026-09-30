import React from 'react';
import { Calendar, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface HeroProps {
  todayStatus: {
    isOpen: boolean;
    dayName: string;
    hoursDisplay: string;
    reason?: string;
  };
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ todayStatus, onReserveClick, onMenuClick }) => {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Fallback and Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_cafe_botanical_1790745726283.jpg"
          alt="THE BLOOM Cafe & Patisserie botanical garden atmosphere in Jayanagar Bengaluru"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 animate-in fade-in zoom-in-95 duration-1000"
        />
        {/* Subtle cinematic cream/dark botanical gradient scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#203327]/90 via-[#203327]/55 to-[#203327]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center flex flex-col items-center">
        {/* Dynamic Business Hours Status */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-700">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                todayStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                todayStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </span>
          <span className="font-semibold">{todayStatus.isOpen ? 'Open Today' : 'Today’s Hours'}:</span>
          <span className="text-white/90">{todayStatus.hoursDisplay}</span>
        </div>

        {/* Brand Title & Subtitle */}
        <div className="space-y-3 mb-6 sm:mb-8">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#F8F4EC] tracking-wider drop-shadow-md">
            THE BLOOM
          </h1>
          <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-[#D8C8B4] font-medium">
            Cafe &amp; Patisserie
          </p>
        </div>

        {/* Editorial Quote */}
        <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white/95 max-w-2xl mb-4 text-balance drop-shadow-sm">
          &ldquo;Where good food meets beautiful moments.&rdquo;
        </blockquote>

        {/* Supporting Text */}
        <p className="text-sm sm:text-base md:text-lg text-[#F8F4EC]/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light text-balance">
          A cozy café in Jayanagar serving thoughtfully crafted food, coffee, desserts and drinks in a warm botanical setting.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onReserveClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8FA58A] hover:bg-[#7D9478] text-[#22372A] font-semibold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#22372A]" />
            <span>Reserve a Table</span>
          </button>

          <button
            onClick={onMenuClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#F8F4EC] border border-white/30 font-medium text-sm sm:text-base tracking-wider transition-all duration-200 backdrop-blur-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Micro-Features Indicator */}
        <div className="mt-14 pt-8 border-t border-white/15 w-full max-w-3xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#D8C8B4] uppercase tracking-widest font-medium">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FA58A]" />
            Jayanagar 4th T Block
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FA58A]" />
            Indoor &amp; Balcony Seating
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FA58A]" />
            Artisanal Patisserie
          </span>
        </div>
      </div>
    </section>
  );
};
