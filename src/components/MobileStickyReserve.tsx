import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface MobileStickyReserveProps {
  onReserveClick: () => void;
}

export const MobileStickyReserve: React.FC<MobileStickyReserveProps> = ({ onReserveClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 300px
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside aria-label="Mobile reservation bar" className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-[#F8F4EC]/95 backdrop-blur-md border-t border-[#D8C8B4]/60 px-4 py-2.5 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight">
          <span className="font-serif text-sm font-semibold text-[#304A3A] block">
            THE BLOOM
          </span>
          <span className="text-[10px] text-[#4A3428]/70 block">
            Jayanagar · Tables Available
          </span>
        </div>

        <button
          onClick={onReserveClick}
          className="px-5 py-2 rounded-full bg-[#304A3A] hover:bg-[#22372A] text-white font-semibold text-xs tracking-wider uppercase transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Reserve</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
