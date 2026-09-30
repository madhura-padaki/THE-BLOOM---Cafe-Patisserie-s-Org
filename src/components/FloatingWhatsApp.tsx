import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const phone = '917259743546';
  const defaultText = 'Hi THE BLOOM, I would like to make a reservation.';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(defaultText)}`;

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with THE BLOOM on WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-3 focus:ring-[#25D366]/40 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          WhatsApp Us
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#25D366] animate-ping" />
      </a>
    </aside>
  );
};
