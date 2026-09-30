export interface BusinessDayHours {
  day: string; // 'Monday', 'Tuesday', etc.
  open: string; // e.g. '11:00' or '12:00'
  close: string; // e.g. '23:00'
  isOpen: boolean;
}

export interface SpecialClosure {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  isClosed: boolean;
  customHours?: {
    open: string;
    close: string;
  };
}

export type SeatingType = 'Indoor' | 'Outdoor' | 'Balcony' | 'No Preference';

export type OccasionType =
  | 'Birthday'
  | 'Anniversary'
  | 'Date'
  | 'Family Gathering'
  | 'Business Meeting'
  | 'Other'
  | 'None';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No-show';

export interface Reservation {
  id: string; // e.g. BLM-48201
  customerName: string;
  phone: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // '11:00 AM'
  guests: number;
  seatingPreference: SeatingType;
  occasion: OccasionType;
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | null; // e.g. '₹380' or null ('View current menu')
  category: string;
  isVegetarian: boolean;
  isVegan?: boolean;
  isBestseller?: boolean;
  isSeasonal?: boolean;
  isSignature?: boolean;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Food' | 'Desserts' | 'Coffee' | 'Interior' | 'Outdoor' | 'Moments';
  image: string;
  caption?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  source?: string;
}

export interface CafeSettings {
  name: string;
  tagline: string;
  description: string;
  address: string;
  area: string;
  city: string;
  postalCode: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  slotDurationMinutes: number;
  maxPartySize: number;
  seatingCapacity: {
    Indoor: number;
    Outdoor: number;
    Balcony: number;
  };
  confirmationNotes: string;
}
