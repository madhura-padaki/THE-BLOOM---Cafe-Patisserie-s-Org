import React, { useState, useEffect } from 'react';
import { Menu, X, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenReserve: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReserve, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F4EC]/95 backdrop-blur-md shadow-xs py-3 border-b border-[#D8C8B4]/40'
            : 'bg-gradient-to-b from-[#304A3A]/40 via-[#304A3A]/10 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className={`font-serif tracking-widest text-xl sm:text-2xl transition-colors font-medium ${
              isScrolled ? 'text-[#304A3A]' : 'text-white drop-shadow-sm'
            }`}
          >
            THE BLOOM
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-sm font-medium transition-colors tracking-wide relative hover:opacity-100 ${
                  isScrolled
                    ? 'text-[#4A3428]/85 hover:text-[#304A3A]'
                    : 'text-white/90 hover:text-white drop-shadow-xs'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary action & admin portal */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              aria-label="Admin Portal"
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#64493A] hover:bg-[#D8C8B4]/30'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenReserve}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                isScrolled
                  ? 'bg-[#304A3A] hover:bg-[#22372A] text-[#F8F4EC]'
                  : 'bg-white/95 hover:bg-white text-[#304A3A]'
              }`}
            >
              Reserve a Table
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled ? 'text-[#304A3A]' : 'text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 bg-[#F8F4EC] border-b border-[#D8C8B4]/40 shadow-xl md:hidden py-6 px-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-medium text-[#4A3428] hover:text-[#304A3A] py-2 border-b border-[#D8C8B4]/20"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReserve();
                }}
                className="w-full py-3 bg-[#304A3A] text-[#F8F4EC] rounded-lg text-sm font-semibold tracking-wide text-center"
              >
                Reserve a Table
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 bg-transparent border border-[#304A3A]/20 text-[#304A3A] rounded-lg text-xs font-medium text-center flex items-center justify-center gap-2"
              >
                <Settings className="w-3.5 h-3.5" />
                Staff / Admin Portal
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
