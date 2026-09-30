import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { SeatingType, OccasionType, Reservation } from '../types/index.ts';
import { checkAvailability, createReservation } from '../services/api.ts';

interface ReservationSectionProps {
  onBookingSuccess: (reservation: Reservation) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ onBookingSuccess }) => {
  // Today's date YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [step, setStep] = useState<number>(1);

  // Form State
  const [date, setDate] = useState<string>(getTodayString());
  const [guests, setGuests] = useState<number>(2);
  const [time, setTime] = useState<string>('');
  const [seatingPreference, setSeatingPreference] = useState<SeatingType>('No Preference');

  // Customer Details
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [occasion, setOccasion] = useState<OccasionType>('None');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Availability State
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<boolean>(false);
  const [availabilityData, setAvailabilityData] = useState<{
    isDateClosed: boolean;
    closureReason?: string;
    availableSlots: string[];
    bookedSlots: string[];
    recommendedSlots: string[];
  } | null>(null);

  // Booking Execution State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [alternativeTimes, setAlternativeTimes] = useState<string[]>([]);

  // Form validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    date?: string;
    time?: string;
  }>({});

  // Check availability whenever date, guests, or seating changes
  useEffect(() => {
    let isMounted = true;
    const loadAvailability = async () => {
      setIsCheckingAvailability(true);
      setBookingError(null);
      try {
        const result = await checkAvailability(date, guests, seatingPreference);
        if (isMounted) {
          setAvailabilityData(result);
          // If current selected time is no longer available in this slot list, reset or check
          if (time && !result.availableSlots.includes(time)) {
            setTime('');
          }
        }
      } catch (err) {
        console.error('Failed checking availability', err);
      } finally {
        if (isMounted) setIsCheckingAvailability(false);
      }
    };

    loadAvailability();
    return () => {
      isMounted = false;
    };
  }, [date, guests, seatingPreference]);

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const occasionOptions: OccasionType[] = [
    'None',
    'Birthday',
    'Anniversary',
    'Date',
    'Family Gathering',
    'Business Meeting',
    'Other',
  ];

  const seatingOptions: { type: SeatingType; label: string; desc: string }[] = [
    {
      type: 'Indoor',
      label: 'Indoor Dining',
      desc: 'Cozy botanic house room, air-conditioned & warm lighting',
    },
    {
      type: 'Outdoor',
      label: 'Garden Courtyard',
      desc: 'Ground-level breezy patio nestled among green tropical plants',
    },
    {
      type: 'Balcony',
      label: 'Balcony Terrace',
      desc: 'Elevated airy veranda with treetop views & evening fairy lights',
    },
    {
      type: 'No Preference',
      label: 'Best Available Table',
      desc: 'We will seat you at the most delightful spot upon arrival',
    },
  ];

  // Validation
  const validateStep5 = () => {
    const errors: typeof fieldErrors = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.name = 'Please enter your full name.';
    }
    // Indian mobile phone standard: 10 digits, or international format
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid mobile number.';
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Please enter a valid email address.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromDetails = () => {
    if (validateStep5()) {
      setStep(6);
    }
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    setBookingError(null);
    setAlternativeTimes([]);

    try {
      const response = await createReservation({
        customerName,
        phone,
        email,
        date,
        time,
        guests,
        seatingPreference,
        occasion,
        specialRequests,
      });

      if (response.success && response.reservation) {
        onBookingSuccess(response.reservation);
      } else {
        setBookingError(response.error || 'We couldn’t complete your reservation. Please try again.');
        if (response.alternativeSlots && response.alternativeSlots.length > 0) {
          setAlternativeTimes(response.alternativeSlots);
        }
      }
    } catch (err: any) {
      setBookingError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reserve" className="py-20 sm:py-28 bg-[#F8F4EC] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold">
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
            <span>Table Reservations</span>
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#304A3A] font-normal">
            Reserve Your Experience
          </h2>
          <p className="text-sm sm:text-base text-[#4A3428]/80 leading-relaxed font-light">
            Book your table at THE BLOOM in under 60 seconds. Real-time availability, instant confirmation.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-10 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-[#D8C8B4]/60 shadow-xs flex items-center justify-between overflow-x-auto">
          {[
            { num: 1, label: 'Date' },
            { num: 2, label: 'Guests' },
            { num: 3, label: 'Time' },
            { num: 4, label: 'Seating' },
            { num: 5, label: 'Details' },
            { num: 6, label: 'Confirm' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                // Allow jumping backwards or forward if data exists
                if (s.num < step) setStep(s.num);
                else if (s.num === 2 && date) setStep(2);
                else if (s.num === 3 && date && guests) setStep(3);
                else if (s.num === 4 && time) setStep(4);
              }}
              disabled={s.num > step}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                step === s.num
                  ? 'bg-[#304A3A] text-white shadow-xs'
                  : step > s.num
                  ? 'text-[#304A3A] hover:bg-[#D8C8B4]/30'
                  : 'text-[#4A3428]/40 cursor-not-allowed'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-white text-[#304A3A]'
                    : step > s.num
                    ? 'bg-[#8FA58A]/30 text-[#304A3A]'
                    : 'bg-[#D8C8B4]/40 text-[#4A3428]/50'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-[#D8C8B4]/80 shadow-xl">
          {/* STEP 1: Date */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#D8C8B4]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#304A3A]">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">Select Date</h3>
                  <p className="text-xs text-[#4A3428]/70">When would you like to visit THE BLOOM?</p>
                </div>
              </div>

              {/* Quick Date Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDate(getTodayString())}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    date === getTodayString()
                      ? 'bg-[#304A3A] text-white border-[#304A3A]'
                      : 'bg-[#F8F4EC] text-[#4A3428] border-[#D8C8B4]/60 hover:bg-white'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDate(getTomorrowString())}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    date === getTomorrowString()
                      ? 'bg-[#304A3A] text-white border-[#304A3A]'
                      : 'bg-[#F8F4EC] text-[#4A3428] border-[#D8C8B4]/60 hover:bg-white'
                  }`}
                >
                  Tomorrow
                </button>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A]">
                  Choose Calendar Date
                </label>
                <input
                  type="date"
                  min={getTodayString()}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  className="w-full sm:w-80 px-4 py-3 bg-[#F8F4EC] border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/60"
                />
              </div>

              {/* Closure warning check */}
              {availabilityData?.isDateClosed && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice:</span> We are closed on this date (
                    {availabilityData.closureReason}). Please select another date.
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-[#D8C8B4]/40 flex justify-end">
                <button
                  type="button"
                  disabled={availabilityData?.isDateClosed}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full bg-[#304A3A] text-[#F8F4EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Guests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Guests */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#D8C8B4]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#304A3A]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">Number of Guests</h3>
                  <p className="text-xs text-[#4A3428]/70">For how many people should we prepare the table?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {guestOptions.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGuests(g)}
                    className={`py-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      guests === g
                        ? 'bg-[#304A3A] text-white border-[#304A3A] shadow-md scale-102'
                        : 'bg-[#F8F4EC] text-[#4A3428] border-[#D8C8B4]/60 hover:bg-white hover:border-[#8FA58A]'
                    }`}
                  >
                    {g} {g === 1 ? 'Guest' : g === 10 ? '10+ Guests' : 'Guests'}
                  </button>
                ))}
              </div>

              {guests >= 8 && (
                <div className="p-3.5 bg-[#8FA58A]/10 border border-[#8FA58A]/30 rounded-xl text-xs text-[#304A3A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#8FA58A]" />
                  <span>Large group reservation! We’ll ensure comfortable contiguous seating.</span>
                </div>
              )}

              <div className="pt-6 border-t border-[#D8C8B4]/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-[#D8C8B4] text-xs font-semibold uppercase tracking-wider text-[#4A3428] hover:bg-[#F8F4EC] flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-full bg-[#304A3A] text-[#F8F4EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Select Time Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Available Time */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#D8C8B4]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#304A3A]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">Select Time Slot</h3>
                  <p className="text-xs text-[#4A3428]/70">
                    Live availability for {guests} {guests === 1 ? 'guest' : 'guests'} on {date}
                  </p>
                </div>
              </div>

              {/* Status feedback element */}
              {isCheckingAvailability ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-[#304A3A]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8FA58A]" />
                  <span>Checking availability...</span>
                </div>
              ) : availabilityData?.isDateClosed ? (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                  <p className="font-serif text-lg text-amber-900">
                    We&apos;re closed on this date ({availabilityData.closureReason}).
                  </p>
                  <p className="text-xs text-amber-800">
                    Please return to Step 1 and choose an alternative date.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-3 px-4 py-2 bg-[#304A3A] text-white rounded-full text-xs font-medium"
                  >
                    Change Date
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Status header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Table Available
                    </span>
                    <span className="text-[#4A3428]/70">
                      {availabilityData?.availableSlots.length || 0} slots open
                    </span>
                  </div>

                  {/* Available Time Slots Grid */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#304A3A] mb-3">
                      Available Times (30-min intervals)
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {availabilityData?.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer text-center ${
                            time === slot
                              ? 'bg-[#304A3A] text-white shadow-md scale-103 font-bold ring-2 ring-[#8FA58A]'
                              : 'bg-[#F8F4EC] text-[#4A3428] border border-[#D8C8B4]/60 hover:bg-white hover:border-[#8FA58A]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Booked / Unavailable Slots indicator if any */}
                  {availabilityData?.bookedSlots && availabilityData.bookedSlots.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#4A3428]/50 mb-2">
                        Fully Booked Slots
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {availabilityData.bookedSlots.map((slot) => (
                          <span
                            key={slot}
                            className="py-1 px-2.5 rounded-lg text-[11px] font-mono bg-stone-100 text-stone-400 line-through border border-stone-200 cursor-not-allowed"
                            title="This slot is fully reserved"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-6 border-t border-[#D8C8B4]/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full border border-[#D8C8B4] text-xs font-semibold uppercase tracking-wider text-[#4A3428] hover:bg-[#F8F4EC] flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!time}
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-full bg-[#304A3A] text-[#F8F4EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Select Seating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Seating Preference */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#D8C8B4]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#304A3A]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">Seating Preference</h3>
                  <p className="text-xs text-[#4A3428]/70">Where in the cafe would you enjoy sitting?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {seatingOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSeatingPreference(opt.type)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      seatingPreference === opt.type
                        ? 'bg-[#F8F4EC] border-[#304A3A] ring-2 ring-[#304A3A] shadow-md'
                        : 'bg-white border-[#D8C8B4]/70 hover:border-[#8FA58A] hover:bg-[#F8F4EC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-lg text-[#304A3A] font-semibold">
                          {opt.label}
                        </span>
                        {seatingPreference === opt.type && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#304A3A]" />
                        )}
                      </div>
                      <p className="text-xs text-[#4A3428]/70 leading-relaxed font-light">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-[#D8C8B4]/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-full border border-[#D8C8B4] text-xs font-semibold uppercase tracking-wider text-[#4A3428] hover:bg-[#F8F4EC] flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-3 rounded-full bg-[#304A3A] text-[#F8F4EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Customer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Customer Details */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#D8C8B4]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#304A3A]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">Guest Information</h3>
                  <p className="text-xs text-[#4A3428]/70">Details for confirmation and reservation lookup</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/60"
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-red-600 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A]">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/60"
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-red-600 font-medium">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/60"
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-red-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Special Occasion */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A]">
                    Special Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as OccasionType)}
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/60"
                  >
                    {occasionOptions.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ === 'None' ? 'Regular Dining / Catch-up' : occ}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A]">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Dietary preferences, quiet corner table, high chair, birthday surprise candle..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F8F4EC] border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/60"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#D8C8B4]/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-full border border-[#D8C8B4] text-xs font-semibold uppercase tracking-wider text-[#4A3428] hover:bg-[#F8F4EC] flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextFromDetails}
                  className="px-6 py-3 rounded-full bg-[#304A3A] text-[#F8F4EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Booking Summary & Confirmation */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#D8C8B4]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-[#304A3A] text-[#F8F4EC] flex items-center justify-center font-serif text-lg font-bold">
                  B
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">Review &amp; Confirm</h3>
                  <p className="text-xs text-[#4A3428]/70">
                    THE BLOOM · 448, 18th Main Road, Jayanagar 4th T Block
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-[#F8F4EC] rounded-2xl p-6 border border-[#D8C8B4]/80 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#D8C8B4]/50">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#4A3428]/60 font-semibold">
                      Date
                    </span>
                    <span className="font-serif text-base text-[#304A3A] font-semibold">{date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#4A3428]/60 font-semibold">
                      Time Slot
                    </span>
                    <span className="font-mono text-base text-[#304A3A] font-semibold">{time}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#4A3428]/60 font-semibold">
                      Party Size
                    </span>
                    <span className="font-serif text-base text-[#304A3A] font-semibold">
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#4A3428]/60 font-semibold">
                      Seating
                    </span>
                    <span className="font-serif text-base text-[#304A3A] font-semibold">
                      {seatingPreference}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#4A3428]/60 block font-medium">Customer:</span>
                    <span className="font-semibold text-[#304A3A]">{customerName}</span>
                    <div className="text-[#4A3428]/80">{phone} · {email}</div>
                  </div>

                  <div>
                    <span className="text-[#4A3428]/60 block font-medium">Occasion:</span>
                    <span className="font-semibold text-[#304A3A]">
                      {occasion === 'None' ? 'Casual Dining' : occasion}
                    </span>
                    {specialRequests && (
                      <p className="mt-1 text-[#4A3428]/80 italic">&ldquo;{specialRequests}&rdquo;</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Alert with Immediate Alternatives if Slot Was Taken */}
              {bookingError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{bookingError}</span>
                  </div>

                  {alternativeTimes.length > 0 && (
                    <div className="pt-2 border-t border-red-100">
                      <span className="text-xs font-semibold text-[#304A3A] block mb-2">
                        Nearby Available Alternative Times:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {alternativeTimes.map((alt) => (
                          <button
                            key={alt}
                            type="button"
                            onClick={() => {
                              setTime(alt);
                              setBookingError(null);
                            }}
                            className="px-3 py-1.5 bg-white border border-[#304A3A] rounded-lg text-xs font-mono font-semibold text-[#304A3A] hover:bg-[#304A3A] hover:text-white transition-colors cursor-pointer"
                          >
                            Switch to {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Holding policy note */}
              <p className="text-[11px] text-[#4A3428]/70 leading-relaxed font-light">
                * We hold reserved tables for 15 minutes past scheduled arrival. If your plans change, please notify us via WhatsApp or phone.
              </p>

              <div className="pt-6 border-t border-[#D8C8B4]/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-5 py-2.5 rounded-full border border-[#D8C8B4] text-xs font-semibold uppercase tracking-wider text-[#4A3428] hover:bg-[#F8F4EC] flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmReservation}
                  className="px-8 py-3.5 rounded-full bg-[#8FA58A] hover:bg-[#7D9478] text-[#22372A] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#22372A]" />
                      <span>Confirming Table...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#22372A]" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
