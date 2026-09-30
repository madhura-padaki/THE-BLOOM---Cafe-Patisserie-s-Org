import {
  CafeSettings,
  BusinessDayHours,
  SpecialClosure,
  Reservation,
  MenuItem,
  GalleryItem,
  Review,
  BookingStatus,
  SeatingType,
  OccasionType,
} from '../types/index.ts';

export async function fetchStatus(): Promise<{
  status: { isOpen: boolean; dayName: string; hoursDisplay: string; reason?: string };
  phone: string;
  whatsapp: string;
  name: string;
  address: string;
}> {
  const res = await fetch('/api/status');
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function fetchBusinessHours(): Promise<{
  hours: Record<string, BusinessDayHours>;
  closures: SpecialClosure[];
}> {
  const res = await fetch('/api/business-hours');
  if (!res.ok) throw new Error('Failed to fetch hours');
  return res.json();
}

export async function updateBusinessHours(hours: Record<string, BusinessDayHours>): Promise<void> {
  const res = await fetch('/api/business-hours', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hours),
  });
  if (!res.ok) throw new Error('Failed to update business hours');
}

export async function addSpecialClosure(closure: {
  date: string;
  reason: string;
  isClosed: boolean;
  customHours?: { open: string; close: string };
}): Promise<SpecialClosure> {
  const res = await fetch('/api/special-closures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(closure),
  });
  if (!res.ok) throw new Error('Failed to add special closure');
  const data = await res.json();
  return data.closure;
}

export async function removeSpecialClosure(id: string): Promise<void> {
  const res = await fetch(`/api/special-closures/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove closure');
}

export async function checkAvailability(
  date: string,
  guests: number,
  seating: SeatingType
): Promise<{
  isDateClosed: boolean;
  closureReason?: string;
  availableSlots: string[];
  bookedSlots: string[];
  capacityPerSlot: number;
  recommendedSlots: string[];
}> {
  const query = new URLSearchParams({
    date,
    guests: guests.toString(),
    seating,
  });
  const res = await fetch(`/api/availability?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to check availability');
  return res.json();
}

export async function createReservation(data: {
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: SeatingType;
  occasion: OccasionType;
  specialRequests?: string;
}): Promise<{
  success: boolean;
  reservation?: Reservation;
  error?: string;
  alternativeSlots?: string[];
}> {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchReservations(
  status?: BookingStatus,
  search?: string
): Promise<Reservation[]> {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  if (search) query.set('search', search);

  const res = await fetch(`/api/reservations?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reservations');
  const data = await res.json();
  return data.reservations;
}

export async function fetchReservationById(id: string): Promise<Reservation> {
  const res = await fetch(`/api/reservations/${id}`);
  if (!res.ok) throw new Error('Reservation not found');
  const data = await res.json();
  return data.reservation;
}

export async function updateReservationStatus(id: string, status: BookingStatus): Promise<Reservation> {
  const res = await fetch(`/api/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update reservation status');
  const data = await res.json();
  return data.reservation;
}

export async function fetchMenu(): Promise<{ categories: string[]; items: MenuItem[] }> {
  const res = await fetch('/api/menu');
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const res = await fetch('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add menu item');
  const data = await res.json();
  return data.item;
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to update menu item');
  const data = await res.json();
  return data.item;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete menu item');
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch('/api/gallery');
  if (!res.ok) throw new Error('Failed to fetch gallery');
  const data = await res.json();
  return data.gallery;
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const res = await fetch('/api/gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add gallery item');
  const data = await res.json();
  return data.item;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete gallery item');
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch('/api/reviews');
  if (!res.ok) throw new Error('Failed to fetch reviews');
  const data = await res.json();
  return data.reviews;
}

export async function submitReview(review: {
  author: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  const data = await res.json();
  return data.review;
}

export async function fetchSettings(): Promise<CafeSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  const data = await res.json();
  return data.settings;
}

export async function updateSettings(settings: Partial<CafeSettings>): Promise<CafeSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  const data = await res.json();
  return data.settings;
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.json();
}
