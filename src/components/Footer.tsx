import React from 'react';
import { Settings, Heart } from 'lucide-react';

interface FooterProps {
  onOpenReserve: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReserve, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#203327] text-[#F8F4EC] pt-16 pb-12 border-t border-[#304A3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl tracking-wider text-white">
              THE BLOOM
            </h3>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8FA58A]">
              Cafe &amp; Patisserie
            </p>
            <p className="font-serif italic text-base text-[#D8C8B4] max-w-sm">
              &ldquo;Good food. Beautiful moments.&rdquo;
            </p>
            <p className="text-xs text-[#F8F4EC]/70 leading-relaxed font-light max-w-sm">
              A cozy botanical sanctuary in the heart of Jayanagar serving artisanal coffee, pastries, pasta, and moments of unhurried joy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8FA58A]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#F8F4EC]/80 font-light">
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('about');
                  }}
                  className="hover:text-white transition-colors"
                >
                  About The Bloom
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Artisan Menu
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('experiences');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Experiences
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('gallery');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Photo Gallery
                </a>
              </li>
              <li>
                <a
                  href="#reserve"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('reserve');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Table Reservations
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('reviews');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Guest Reviews
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('contact');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact &amp; Map
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours Summary */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8FA58A]">
              Opening Hours
            </h4>
            <div className="text-xs space-y-1.5 text-[#F8F4EC]/80 font-light">
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span>Monday:</span>
                <span className="font-mono text-white/90">12:00 PM – 11:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span>Tuesday – Friday:</span>
                <span className="font-mono text-white/90">11:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span>Saturday &amp; Sunday:</span>
                <span className="font-mono text-white/90">11:00 AM – 11:00 PM</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenReserve}
                className="w-full py-2.5 rounded-full bg-[#8FA58A] hover:bg-[#7D9478] text-[#22372A] font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8FA58A]">
              Jayanagar Location
            </h4>
            <div className="text-xs text-[#F8F4EC]/80 font-light space-y-1 leading-relaxed">
              <p>448, 18th Main Road, 4th T Block East,</p>
              <p>Pattabhirama Nagar, Jayanagar,</p>
              <p>Bengaluru, Karnataka 560041</p>
              <p className="pt-2">
                Phone:{' '}
                <a href="tel:+917259743546" className="text-white hover:underline font-mono">
                  +91 72597 43546
                </a>
              </p>
              <p>
                Email:{' '}
                <span className="text-white">hello@thebloomcafe.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F4EC]/60">
          <p>© {currentYear} THE BLOOM - Cafe &amp; Patisserie. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
