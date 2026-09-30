import React from 'react';
import { Sparkles, MapPin, Coffee, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F8F4EC] relative overflow-hidden">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8FA58A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D9A7A0]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold">
              <span className="w-8 h-[1px] bg-[#8FA58A]" />
              <span>Our Story</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#304A3A] font-normal leading-tight">
              Welcome to The Bloom
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-[#4A3428]/90 leading-relaxed">
              &ldquo;A cozy house-style café in the heart of Jayanagar, created for slow mornings, relaxed lunches, coffee conversations and memorable evenings.&rdquo;
            </p>

            <div className="space-y-4 text-sm sm:text-base text-[#4A3428]/80 leading-relaxed font-light">
              <p>
                Tucked into the leafy lanes of 4th T Block East, THE BLOOM was envisioned as a tranquil botanical sanctuary. Inspired by blooming flowers, sun-drenched verandas, and natural greenery, every corner is designed to help you pause and unwind.
              </p>
              <p>
                Whether you prefer the cool comfort of our indoor dining space or the airy charm of our garden-style outdoor balcony terrace, our team prepares specialty coffee, artisanal patisserie desserts, hearty pasta, and small plates with genuine care. From intimate date nights and lively catch-ups to milestone birthday celebrations, we invite you to make memories with us.
              </p>
            </div>

            {/* Small Statistics / Features Requested */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#D8C8B4]/60">
              <div className="p-3 bg-white/70 rounded-xl border border-[#D8C8B4]/40 text-center">
                <span className="block text-[11px] sm:text-xs font-semibold tracking-wider text-[#304A3A] uppercase">
                  Cozy Ambience
                </span>
                <span className="text-[10px] text-[#4A3428]/70 mt-1 block">Botanical Haven</span>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-[#D8C8B4]/40 text-center">
                <span className="block text-[11px] sm:text-xs font-semibold tracking-wider text-[#304A3A] uppercase">
                  Indoor + Outdoor
                </span>
                <span className="text-[10px] text-[#4A3428]/70 mt-1 block">Balcony Terrace</span>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-[#D8C8B4]/40 text-center">
                <span className="block text-[11px] sm:text-xs font-semibold tracking-wider text-[#304A3A] uppercase">
                  Coffee &amp; Desserts
                </span>
                <span className="text-[10px] text-[#4A3428]/70 mt-1 block">Handcrafted Fresh</span>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-[#D8C8B4]/40 text-center">
                <span className="block text-[11px] sm:text-xs font-semibold tracking-wider text-[#304A3A] uppercase">
                  Jayanagar
                </span>
                <span className="text-[10px] text-[#4A3428]/70 mt-1 block">Bengaluru 560041</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Lifestyle Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-16/11 group">
              <img
                src="/src/assets/images/dining_outdoor_terrace_1790745770650.jpg"
                alt="Cozy outdoor balcony terrace seating surrounded by lush greenery at THE BLOOM Jayanagar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium bg-black/35 backdrop-blur-md py-2 px-4 rounded-xl border border-white/20">
                Balcony Garden Terrace · Perfect for evening conversations &amp; quiet afternoons
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
