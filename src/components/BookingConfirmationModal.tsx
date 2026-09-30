import React from 'react';
import { Reservation } from '../types/index.ts';
import {
  CheckCircle,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  X,
  Navigation,
  Download,
} from 'lucide-react';

interface BookingConfirmationModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  reservation,
  onClose,
}) => {
  const cafePhone = '+91 72597 43546';
  const cafeAddress =
    '448, 18th Main Road, 4th T Block East, Pattabhirama Nagar, Jayanagar, Bengaluru, Karnataka 560041';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'THE BLOOM - Cafe & Patisserie, Jayanagar Bengaluru'
  )}`;

  // Generate WhatsApp message per prompt specification:
  // "Hi THE BLOOM, my reservation is confirmed.
  // Booking ID: ...
  // Date: ...
  // Time: ...
  // Guests: ...
  // Name: ..."
  const whatsappText = `Hi THE BLOOM, my reservation is confirmed.

Booking ID: ${reservation.id}
Date: ${reservation.date}
Time: ${reservation.time}
Guests: ${reservation.guests}
Name: ${reservation.customerName}
Seating: ${reservation.seatingPreference}`;

  const whatsappUrl = `https://wa.me/917259743546?text=${encodeURIComponent(whatsappText)}`;

  // Google Calendar URL generator
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Table Reservation at THE BLOOM`);
    const details = encodeURIComponent(
      `Booking ID: ${reservation.id}\nParty of ${reservation.guests}\nSeating: ${reservation.seatingPreference}\nPhone: ${cafePhone}\nAddress: ${cafeAddress}`
    );
    const location = encodeURIComponent(`THE BLOOM - Cafe & Patisserie, Jayanagar, Bengaluru`);

    // Format start time YYYYMMDDTHHmmss
    const [timeStr, modifier] = reservation.time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const startIso = reservation.date.replace(/-/g, '') + 'T' +
      hours.toString().padStart(2, '0') +
      minutes.toString().padStart(2, '0') + '00';

    // End time + 90 mins
    let endHours = hours + 1;
    let endMinutes = minutes + 30;
    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }
    const endIso = reservation.date.replace(/-/g, '') + 'T' +
      endHours.toString().padStart(2, '0') +
      endMinutes.toString().padStart(2, '0') + '00';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  // Download .ics file
  const downloadIcsFile = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//THE BLOOM//Table Reservation//EN
BEGIN:VEVENT
SUMMARY:Table Reservation at THE BLOOM (${reservation.id})
DESCRIPTION:Booking ID: ${reservation.id}\\nGuests: ${reservation.guests}\\nSeating: ${reservation.seatingPreference}\\nPhone: ${cafePhone}
LOCATION:THE BLOOM, 448 18th Main Rd, Jayanagar 4th T Block East, Bengaluru
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `the-bloom-reservation-${reservation.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#F8F4EC] rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-2xl border border-[#D8C8B4] relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close Confirmation"
          className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A3428] shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Heading */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#8FA58A]/20 text-[#304A3A] flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-[#304A3A]" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8FA58A] font-bold">
            Reservation Confirmed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#304A3A] font-normal">
            Your table is reserved.
          </h2>
          <p className="text-xs sm:text-sm text-[#4A3428]/80 font-light max-w-md mx-auto">
            We are looking forward to welcoming you to THE BLOOM. A confirmation notice has been sent to{' '}
            <strong className="font-semibold text-[#304A3A]">{reservation.email}</strong>.
          </p>
        </div>

        {/* Booking Card Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#D8C8B4]/70 shadow-xs mb-8 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#D8C8B4]/40">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#4A3428]/60 font-semibold block">
                Booking ID
              </span>
              <span className="font-mono text-xl font-bold text-[#304A3A]">
                {reservation.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#4A3428]/60 font-semibold block">
                Venue
              </span>
              <span className="font-serif text-sm font-semibold text-[#304A3A]">
                THE BLOOM · Jayanagar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#4A3428]/60 block font-medium">Date</span>
              <span className="font-semibold text-[#304A3A]">{reservation.date}</span>
            </div>
            <div>
              <span className="text-[#4A3428]/60 block font-medium">Time</span>
              <span className="font-mono font-semibold text-[#304A3A]">{reservation.time}</span>
            </div>
            <div>
              <span className="text-[#4A3428]/60 block font-medium">Guests</span>
              <span className="font-semibold text-[#304A3A]">{reservation.guests} Guests</span>
            </div>
            <div>
              <span className="text-[#4A3428]/60 block font-medium">Seating</span>
              <span className="font-semibold text-[#304A3A]">{reservation.seatingPreference}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D8C8B4]/30 text-xs flex justify-between items-center text-[#4A3428]/80">
            <span>Reserved for: <strong className="text-[#304A3A]">{reservation.customerName}</strong> ({reservation.phone})</span>
          </div>

          {reservation.specialRequests && (
            <div className="p-3 bg-[#F8F4EC] rounded-xl text-xs text-[#4A3428]/90">
              <span className="font-semibold text-[#304A3A]">Special note: </span>
              {reservation.specialRequests}
            </div>
          )}
        </div>

        {/* Action Buttons Requested in Prompt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Add to Calendar */}
          <div className="flex gap-2">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-3 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#8FA58A]" />
              <span>Google Calendar</span>
            </a>
            <button
              onClick={downloadIcsFile}
              title="Download .ics file"
              className="py-3 px-3 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 text-[#8FA58A]" />
            </button>
          </div>

          {/* Get Directions */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#8FA58A]" />
            <span>Get Directions</span>
          </a>

          {/* Call Cafe */}
          <a
            href={`tel:${cafePhone.replace(/\s+/g, '')}`}
            className="py-3 px-4 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#8FA58A]" />
            <span>Call Café (+91 72597 43546)</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>WhatsApp Confirmation</span>
          </a>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider font-semibold text-[#304A3A] hover:underline cursor-pointer"
          >
            Back to THE BLOOM
          </button>
        </div>
      </div>
    </div>
  );
};
