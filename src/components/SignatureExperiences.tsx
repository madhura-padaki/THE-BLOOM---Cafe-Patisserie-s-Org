import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface SignatureExperiencesProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export const SignatureExperiences: React.FC<SignatureExperiencesProps> = ({
  onReserveClick,
  onMenuClick,
}) => {
  const experiences = [
    {
      index: '01',
      title: 'Coffee & Conversations',
      description:
        'Single-origin manual brews, creamy Belgian mochas, and delicate floral lattes brewed for unhurried conversations in sunny spots.',
      image: '/src/assets/images/coffee_lifestyle_1790745757586.jpg',
      alt: 'Artisanal cappuccino with tulip latte art at THE BLOOM',
      tag: 'Morning & Afternoon',
      action: onMenuClick,
      actionLabel: 'View Coffee',
    },
    {
      index: '02',
      title: 'Desserts & Patisserie',
      description:
        'From our signature Venetian Tiramisu and Lotus Biscoff Cheesecake to mirror-glazed fruit entremets crafted with French finesse.',
      image: '/src/assets/images/desserts_patisserie_1790745741987.jpg',
      alt: 'Artisan patisserie and desserts at THE BLOOM',
      tag: 'Sweet Indulgence',
      action: onMenuClick,
      actionLabel: 'View Desserts',
    },
    {
      index: '03',
      title: 'Relaxed Dining',
      description:
        'Handmade Genovese pesto pasta, truffle cream cheese dim sum, sourdough panini, and vibrant salads in our garden dining room.',
      image: '/src/assets/images/hero_cafe_botanical_1790745726283.jpg',
      alt: 'Cozy botanical dining space at THE BLOOM',
      tag: 'Lunch & Dinner',
      action: onReserveClick,
      actionLabel: 'Book Table',
    },
    {
      index: '04',
      title: 'Celebrations & Catch-ups',
      description:
        'A warm, fairy-lit outdoor balcony setting for birthdays, anniversaries, romantic dates, and joyful reunions with loved ones.',
      image: '/src/assets/images/dining_outdoor_terrace_1790745770650.jpg',
      alt: 'Celebration dinner at THE BLOOM balcony terrace',
      tag: 'Special Moments',
      action: onReserveClick,
      actionLabel: 'Reserve Spot',
    },
  ];

  return (
    <section id="experiences" className="py-20 sm:py-28 bg-[#F4EFE6] border-y border-[#D8C8B4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold">
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
            <span>Curated Moments</span>
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#304A3A] font-normal">
            Signature Experiences
          </h2>
          <p className="text-sm sm:text-base text-[#4A3428]/80 leading-relaxed font-light">
            Every visit to THE BLOOM is an opportunity to slow down, taste craftsmanship, and celebrate life’s quiet luxuries.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.index}
              className="group bg-[#F8F4EC] rounded-2xl overflow-hidden border border-[#D8C8B4]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#D8C8B4]/20">
                <img
                  src={exp.image}
                  alt={exp.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-3 left-3 text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#304A3A] shadow-xs">
                  {exp.tag}
                </span>
                <span className="absolute bottom-3 right-3 font-serif text-2xl font-light text-white/90">
                  {exp.index}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#304A3A] font-medium group-hover:text-[#6D8469] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A3428]/75 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>

                <button
                  onClick={exp.action}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-[#D8C8B4]/40 text-xs font-semibold tracking-wider uppercase text-[#304A3A] hover:text-[#6D8469] transition-colors cursor-pointer group/btn"
                >
                  <span>{exp.actionLabel}</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
