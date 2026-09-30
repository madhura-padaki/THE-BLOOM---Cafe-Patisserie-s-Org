import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, Clock, Mail } from 'lucide-react';
import { BusinessDayHours } from '../types/index.ts';

interface ContactSectionProps {
  businessHours: Record<string, BusinessDayHours>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ businessHours }) => {
  const address =
    '448, 18th Main Road, 4th T Block East, Pattabhirama Nagar, Jayanagar, Bengaluru, Karnataka 560041';
  const phone = '+91 72597 43546';
  const rawPhone = '917259743546';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'THE BLOOM - Cafe & Patisserie, 448 18th Main Road Jayanagar Bengaluru'
  )}`;
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    'Hi THE BLOOM, I would like to get directions / ask a question.'
  )}`;

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F4EFE6] border-t border-[#D8C8B4]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold">
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
            <span>Visit Us In Jayanagar</span>
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#304A3A] font-normal">
            Find The Bloom
          </h2>
          <p className="text-sm sm:text-base text-[#4A3428]/80 leading-relaxed font-light">
            We look forward to welcoming you for quiet mornings, sunny afternoons, or evening dinners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Contact Card & Hours */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-[#F8F4EC] rounded-3xl p-6 sm:p-8 border border-[#D8C8B4]/70 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8FA58A] font-bold block mb-1">
                  Location &amp; Inquiries
                </span>
                <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                  THE BLOOM - Cafe &amp; Patisserie
                </h3>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 text-sm text-[#4A3428]/85 font-light">
                <MapPin className="w-5 h-5 text-[#8FA58A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#304A3A]">448, 18th Main Road, 4th T Block East,</p>
                  <p>Pattabhirama Nagar, Jayanagar,</p>
                  <p>Bengaluru, Karnataka 560041, India</p>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="space-y-2 pt-2 border-t border-[#D8C8B4]/40 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#8FA58A] shrink-0" />
                  <a
                    href={`tel:${rawPhone}`}
                    className="font-medium text-[#304A3A] hover:underline"
                  >
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#4A3428]/70">
                  <Mail className="w-4 h-4 text-[#8FA58A] shrink-0" />
                  <span>hello@thebloomcafe.in</span>
                </div>
              </div>

              {/* Action Buttons: Call, WhatsApp, Get Directions */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <a
                  href={`tel:${rawPhone}`}
                  className="py-3 px-2 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold text-center flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#304A3A]" />
                  <span>Call</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] text-xs font-semibold text-center flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl bg-[#304A3A] text-white hover:bg-[#22372A] text-xs font-semibold text-center flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[#F8F4EC] rounded-3xl p-6 sm:p-8 border border-[#D8C8B4]/70 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8FA58A]" />
                <h4 className="font-serif text-lg text-[#304A3A] font-medium">Opening Hours</h4>
              </div>

              <div className="space-y-2 text-xs">
                {daysOrder.map((day) => {
                  const dayData = businessHours[day] || {
                    isOpen: true,
                    open: '11:00',
                    close: '23:00',
                  };
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between py-1 border-b border-[#D8C8B4]/30"
                    >
                      <span className="font-medium text-[#4A3428]">{day}</span>
                      <span className="font-mono text-[#304A3A]">
                        {dayData.isOpen
                          ? `${formatTime(dayData.open)} – ${formatTime(dayData.close)}`
                          : 'Closed'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#4A3428]/60 italic font-light">
                * Kitchen closes 45 minutes prior to closing time.
              </p>
            </div>
          </div>

          {/* Right Column: Embedded Google Maps */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-[#D8C8B4]/70 bg-white relative min-h-[400px]">
            {/* Embedded OpenStreetMap / Google Maps iframe focused on 18th Main Rd Jayanagar 4th T Block */}
            <iframe
              title="THE BLOOM Cafe & Patisserie Google Map Location"
              src="https://maps.google.com/maps?q=12.9279,77.5855&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[420px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Overlay Map Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-xl border border-[#D8C8B4]/60 shadow-md">
              <span className="block font-serif text-sm font-semibold text-[#304A3A]">
                THE BLOOM
              </span>
              <span className="text-[11px] text-[#4A3428]/70">
                18th Main Rd, 4th T Block, Jayanagar
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
