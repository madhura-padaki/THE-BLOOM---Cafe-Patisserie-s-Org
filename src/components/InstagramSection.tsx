import React from 'react';
import { Instagram, Sparkles } from 'lucide-react';

interface InstagramSectionProps {
  instagramHandle?: string;
  onImageClick?: (index: number) => void;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  instagramHandle,
  onImageClick,
}) => {
  const feedPhotos = [
    {
      src: '/src/assets/images/hero_cafe_botanical_1790745726283.jpg',
      caption: 'Quiet morning light filtering through our botanical canopy.',
    },
    {
      src: '/src/assets/images/desserts_patisserie_1790745741987.jpg',
      caption: 'Fresh Venetian Tiramisu & Biscoff Cheesecake prepared daily.',
    },
    {
      src: '/src/assets/images/coffee_lifestyle_1790745757586.jpg',
      caption: 'The art of slow pour and specialty brews.',
    },
    {
      src: '/src/assets/images/dining_outdoor_terrace_1790745770650.jpg',
      caption: 'Evening breeze on the balcony terrace in Jayanagar.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F8F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div>
          <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold mb-2">
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
            <span>Botanical Moments</span>
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#304A3A] font-normal">
            Follow The Bloom
          </h2>
          <p className="text-xs sm:text-sm text-[#4A3428]/70 font-light mt-1">
            Glimpses of daily life, seasonal creations, and warm gatherings in Jayanagar.
          </p>
        </div>

        {/* 4 Image Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {feedPhotos.map((photo, i) => (
            <div
              key={i}
              onClick={() => onImageClick?.(i)}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-xs hover:shadow-md bg-[#D8C8B4]/20 border border-[#D8C8B4]/40 cursor-pointer"
            >
              <img
                src={photo.src}
                alt="THE BLOOM cafe moment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Follow on Instagram CTA only when handle is set per prompt guidelines */}
        {instagramHandle ? (
          <div className="pt-2">
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#304A3A] hover:bg-[#22372A] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow us on Instagram (@{instagramHandle})</span>
            </a>
          </div>
        ) : (
          <div className="text-xs text-[#4A3428]/60 font-light italic">
            Connect with us on our verified social channels or visit us in Jayanagar.
          </div>
        )}
      </div>
    </section>
  );
};
