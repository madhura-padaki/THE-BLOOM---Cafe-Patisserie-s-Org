import fs from 'fs';
import path from 'path';
import {
  BusinessDayHours,
  SpecialClosure,
  Reservation,
  MenuItem,
  GalleryItem,
  Review,
  CafeSettings,
  BookingStatus,
  SeatingType,
  OccasionType,
} from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bloom_store.json');

export interface DatabaseSchema {
  settings: CafeSettings;
  businessHours: Record<string, BusinessDayHours>;
  specialClosures: SpecialClosure[];
  reservations: Reservation[];
  menuCategories: string[];
  menuItems: MenuItem[];
  gallery: GalleryItem[];
  reviews: Review[];
}

const defaultSettings: CafeSettings = {
  name: 'THE BLOOM - Cafe & Patisserie',
  tagline: 'Where good food meets beautiful moments.',
  description:
    'A cozy café in Jayanagar serving thoughtfully crafted food, coffee, desserts and drinks in a warm botanical setting.',
  address: '448, 18th Main Road, 4th T Block East, Pattabhirama Nagar',
  area: 'Jayanagar',
  city: 'Bengaluru, Karnataka',
  postalCode: '560041',
  phone: '+91 72597 43546',
  whatsappNumber: '+917259743546',
  email: 'hello@thebloomcafe.in',
  instagramHandle: '', // Blank per prompt: "Do not invent an Instagram username. Use 'Follow us on Instagram' only when the official account is connected."
  slotDurationMinutes: 90,
  maxPartySize: 12,
  seatingCapacity: {
    Indoor: 30,
    Outdoor: 18,
    Balcony: 14,
  },
  confirmationNotes:
    'Tables are reserved for 90 minutes. We hold reserved tables for up to 15 minutes past the scheduled arrival time. Please call or WhatsApp us if you are delayed.',
};

const defaultHours: Record<string, BusinessDayHours> = {
  Monday: { day: 'Monday', open: '12:00', close: '23:00', isOpen: true },
  Tuesday: { day: 'Tuesday', open: '11:00', close: '23:00', isOpen: true },
  Wednesday: { day: 'Wednesday', open: '11:00', close: '23:00', isOpen: true },
  Thursday: { day: 'Thursday', open: '11:00', close: '23:00', isOpen: true },
  Friday: { day: 'Friday', open: '11:00', close: '23:00', isOpen: true },
  Saturday: { day: 'Saturday', open: '11:00', close: '23:00', isOpen: true },
  Sunday: { day: 'Sunday', open: '11:00', close: '23:00', isOpen: true },
};

const defaultCategories = [
  'Coffee & Hot Beverages',
  'Cold Beverages',
  'Desserts',
  'Patisserie',
  'Pasta',
  'Sandwiches',
  'Starters / Small Plates',
  'Main Course',
  'Salads',
  'Special / Seasonal Items',
];

const defaultMenuItems: MenuItem[] = [
  // Signature Items Highlighted in Request
  {
    id: 'menu-1',
    name: 'Classic Venetian Tiramisu',
    description: 'Savoiardi ladyfingers steeped in fresh espresso and Marsala, layered with whipped mascarpone cream and dusted with Dutch cocoa.',
    price: '₹340',
    category: 'Patisserie',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
    image: '/src/assets/images/desserts_patisserie_1790745741987.jpg',
  },
  {
    id: 'menu-2',
    name: 'Biscoff Caramel Cheesecake',
    description: 'Slow-baked creamy Philadelphia cheesecake base layered with rich spiced Lotus Biscoff spread and biscuit crumble.',
    price: '₹360',
    category: 'Desserts',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
    image: '/src/assets/images/desserts_patisserie_1790745741987.jpg',
  },
  {
    id: 'menu-3',
    name: 'Artisan Dark Fudge Brownie',
    description: 'Warm, 70% dark Belgian chocolate fudge brownie with a crackly crust, served with vanilla bean mascarpone glaze.',
    price: '₹280',
    category: 'Desserts',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
  },
  {
    id: 'menu-4',
    name: 'Signature Belgian Mocha',
    description: 'Double ristretto espresso poured over melted Belgian couverture dark chocolate with steamed silky milk.',
    price: '₹260',
    category: 'Coffee & Hot Beverages',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
    image: '/src/assets/images/coffee_lifestyle_1790745757586.jpg',
  },
  {
    id: 'menu-5',
    name: 'Velvet French Hot Chocolate',
    description: 'Thick European drinking chocolate crafted with single-origin cocoa, a hint of Madagascar vanilla, and whipped cream.',
    price: '₹280',
    category: 'Coffee & Hot Beverages',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
  },
  {
    id: 'menu-6',
    name: 'Handcrafted Genovese Pesto Pasta',
    description: 'Al dente tagliatelle tossed in fragrant fresh sweet basil, roasted pine nuts, extra virgin olive oil, and aged parmesan.',
    price: '₹420',
    category: 'Pasta',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
  },
  {
    id: 'menu-7',
    name: 'Glazed Raspberry & Lychee Entremet',
    description: 'Mirror-glazed spherical entremet with lychee mousse, raspberry coulis center, and delicate almond dacquoise base.',
    price: '₹390',
    category: 'Patisserie',
    isVegetarian: true,
    isSeasonal: true,
    isSignature: true,
    image: '/src/assets/images/desserts_patisserie_1790745741987.jpg',
  },
  {
    id: 'menu-8',
    name: 'Truffle Cream Cheese Dim Sum',
    description: 'Translucent steamed parcels filled with herbed Philadelphia cream cheese, water chestnuts, and subtle white truffle oil.',
    price: '₹360',
    category: 'Starters / Small Plates',
    isVegetarian: true,
    isBestseller: true,
    isSignature: true,
  },
  // Additional staples
  {
    id: 'menu-9',
    name: 'Rose Vanilla Cloud Latte',
    description: 'Lightly floral rose essence and bourbon vanilla paired with specialty espresso and velvety milk foam, garnished with dried rose petals.',
    price: '₹270',
    category: 'Coffee & Hot Beverages',
    isVegetarian: true,
    isBestseller: false,
    image: '/src/assets/images/coffee_lifestyle_1790745757586.jpg',
  },
  {
    id: 'menu-10',
    name: 'Iced Spanish Cortado',
    description: 'Concentrated espresso shaken over ice with sweetened condensed milk and fresh organic whole milk.',
    price: '₹250',
    category: 'Cold Beverages',
    isVegetarian: true,
  },
  {
    id: 'menu-11',
    name: 'Sparkling Peach & Rosemary Iced Tea',
    description: 'Cold-steeped Darjeeling black tea infused with white peach puree, fresh rosemary sprigs, and sparkling mineral water.',
    price: '₹240',
    category: 'Cold Beverages',
    isVegetarian: true,
    isVegan: true,
  },
  {
    id: 'menu-12',
    name: 'Wild Burrata & Charred Sourdough',
    description: 'Fresh artisanal burrata cheese from local dairy, heirloom cherry tomatoes, basil reduction, and grilled country sourdough.',
    price: '₹460',
    category: 'Starters / Small Plates',
    isVegetarian: true,
  },
  {
    id: 'menu-13',
    name: 'Grilled Halloumi & Roasted Pepper Panini',
    description: 'Crispy pressed ciabatta with grilled Cypriot halloumi, fire-roasted sweet bell peppers, balsamic glaze, and rocket leaves.',
    price: '₹390',
    category: 'Sandwiches',
    isVegetarian: true,
  },
  {
    id: 'menu-14',
    name: 'Slow Roasted Herb Chicken Sourdough Sandwich',
    description: 'Thyme-basted tender chicken breast, aged gouda, pickled shallots, and house Dijon aioli on toasted artisan sourdough.',
    price: '₹440',
    category: 'Sandwiches',
    isVegetarian: false,
  },
  {
    id: 'menu-15',
    name: 'Truffle & Forest Wild Mushroom Risotto',
    description: 'Arborio rice slowly simmered with porcini stock, sautéed shiitake, shimeji mushrooms, fresh thyme, and Grana Padano.',
    price: '₹490',
    category: 'Main Course',
    isVegetarian: true,
  },
  {
    id: 'menu-16',
    name: 'Citrus Quinoa & Avocado Garden Bowl',
    description: 'Organic red quinoa, creamy Hass avocado, ruby grapefruit segments, crisp baby spinach, and honey-mustard vinaigrette.',
    price: '₹380',
    category: 'Salads',
    isVegetarian: true,
    isVegan: true,
  },
  {
    id: 'menu-17',
    name: 'Seasonal Mango & Passionfruit Tart',
    description: 'Crisp sablé tart shell filled with Alphonso mango curd, passionfruit gel, and edible pansy blossoms.',
    price: null, // "View current menu" per guidelines
    category: 'Special / Seasonal Items',
    isVegetarian: true,
    isSeasonal: true,
  },
];

const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Botanical Garden House Sanctuary',
    category: 'Interior',
    image: '/src/assets/images/hero_cafe_botanical_1790745726283.jpg',
    caption: 'Sunlit interior with lush tropical plants and warm natural textures in Jayanagar.',
  },
  {
    id: 'gal-2',
    title: 'Artisan Patisserie & Sweet Craft',
    category: 'Desserts',
    image: '/src/assets/images/desserts_patisserie_1790745741987.jpg',
    caption: 'Handcrafted Tiramisu, Biscoff Cheesecake, and seasonal entremets.',
  },
  {
    id: 'gal-3',
    title: 'Morning Specialty Brew',
    category: 'Coffee',
    image: '/src/assets/images/coffee_lifestyle_1790745757586.jpg',
    caption: 'Freshly pulled espresso with delicate tulip latte art in ceramic tableware.',
  },
  {
    id: 'gal-4',
    title: 'Balcony Terrace Under the Canopy',
    category: 'Outdoor',
    image: '/src/assets/images/dining_outdoor_terrace_1790745770650.jpg',
    caption: 'Breezy outdoor seating surrounded by greenery and warm evening ambient lights.',
  },
  {
    id: 'gal-5',
    title: 'Handmade Pasta & Culinary Details',
    category: 'Food',
    image: '/src/assets/images/hero_cafe_botanical_1790745726283.jpg',
    caption: 'Fresh basil pesto and artisanal dishes prepared fresh daily.',
  },
  {
    id: 'gal-6',
    title: 'Afternoon Conversations & Catch-ups',
    category: 'Moments',
    image: '/src/assets/images/dining_outdoor_terrace_1790745770650.jpg',
    caption: 'A relaxed space where good food meets beautiful moments.',
  },
];

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    author: 'Sneha Kulkarni',
    rating: 5,
    date: '2 weeks ago',
    comment:
      'One of Jayanagar’s most charming cafe spots. The botanical aesthetic and warm lighting make it feel like an intimate garden retreat. The Tiramisu and Rose Vanilla Latte are unforgettable!',
    source: 'Google Review',
  },
  {
    id: 'rev-2',
    author: 'Rahul Deshmukh',
    rating: 5,
    date: '1 month ago',
    comment:
      'Loved the outdoor balcony seating, such a peaceful vibe in 4th T Block. The Pesto Pasta and Biscoff Cheesecake were phenomenal. Reserving a table online made the weekend brunch completely hassle-free.',
    source: 'Google Review',
  },
  {
    id: 'rev-3',
    author: 'Meera Venkatesh',
    rating: 5,
    date: '3 weeks ago',
    comment:
      'The house-style atmosphere is cozy and romantic. Attentive hospitality, thoughtfully crafted coffee, and aesthetic presentation across every dish.',
    source: 'Google Review',
  },
  {
    id: 'rev-4',
    author: 'Ananya Hegde',
    rating: 5,
    date: '1 month ago',
    comment:
      'A true sanctuary in the heart of Jayanagar. The Truffle Cream Cheese Dim Sum and Velvet Hot Chocolate are to die for! Perfect for slow mornings or date evenings.',
    source: 'Google Review',
  },
];

const defaultReservations: Reservation[] = [
  {
    id: 'BLM-9281',
    customerName: 'Pooja Narayanan',
    phone: '+91 98450 12345',
    email: 'pooja.n@gmail.com',
    date: '2026-09-30',
    time: '12:30 PM',
    guests: 2,
    seatingPreference: 'Balcony',
    occasion: 'Date',
    specialRequests: 'Quiet corner table please',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'BLM-9282',
    customerName: 'Vikram & Friends',
    phone: '+91 98801 67890',
    email: 'vikram.k@outlook.com',
    date: '2026-09-30',
    time: '07:30 PM',
    guests: 4,
    seatingPreference: 'Outdoor',
    occasion: 'Birthday',
    specialRequests: 'Celebrating a 25th birthday, would love dessert candle presentation!',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

class DataStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          businessHours: { ...defaultHours, ...(parsed.businessHours || {}) },
          specialClosures: parsed.specialClosures || [],
          reservations: parsed.reservations || defaultReservations,
          menuCategories: parsed.menuCategories || defaultCategories,
          menuItems: parsed.menuItems || defaultMenuItems,
          gallery: parsed.gallery || defaultGallery,
          reviews: parsed.reviews || defaultReviews,
        };
      }
    } catch (e) {
      console.error('Error reading bloom_store.json, creating defaults', e);
    }

    const initial: DatabaseSchema = {
      settings: defaultSettings,
      businessHours: defaultHours,
      specialClosures: [],
      reservations: defaultReservations,
      menuCategories: defaultCategories,
      menuItems: defaultMenuItems,
      gallery: defaultGallery,
      reviews: defaultReviews,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save data store', e);
    }
  }

  public getSettings(): CafeSettings {
    return this.data.settings;
  }

  public updateSettings(partial: Partial<CafeSettings>): CafeSettings {
    this.data.settings = { ...this.data.settings, ...partial };
    this.saveData(this.data);
    return this.data.settings;
  }

  public getBusinessHours(): { hours: Record<string, BusinessDayHours>; closures: SpecialClosure[] } {
    return {
      hours: this.data.businessHours,
      closures: this.data.specialClosures,
    };
  }

  public updateBusinessHours(hours: Record<string, BusinessDayHours>): Record<string, BusinessDayHours> {
    this.data.businessHours = { ...this.data.businessHours, ...hours };
    this.saveData(this.data);
    return this.data.businessHours;
  }

  public addSpecialClosure(closure: Omit<SpecialClosure, 'id'>): SpecialClosure {
    const newClosure: SpecialClosure = {
      ...closure,
      id: 'closure-' + Date.now(),
    };
    this.data.specialClosures.push(newClosure);
    this.saveData(this.data);
    return newClosure;
  }

  public removeSpecialClosure(id: string): boolean {
    const initialLen = this.data.specialClosures.length;
    this.data.specialClosures = this.data.specialClosures.filter((c) => c.id !== id);
    if (this.data.specialClosures.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getTodayStatus(targetDate?: string): {
    isOpen: boolean;
    dayName: string;
    hoursDisplay: string;
    reason?: string;
  } {
    const dateObj = targetDate ? new Date(targetDate + 'T00:00:00') : new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dateObj.getDay()];

    const isoDate = dateObj.toISOString().split('T')[0];
    const special = this.data.specialClosures.find((c) => c.date === isoDate);

    if (special) {
      if (special.isClosed) {
        return {
          isOpen: false,
          dayName,
          hoursDisplay: 'Closed Today (' + special.reason + ')',
          reason: special.reason,
        };
      }
      if (special.customHours) {
        return {
          isOpen: true,
          dayName,
          hoursDisplay: `${special.customHours.open} – ${special.customHours.close} (${special.reason})`,
        };
      }
    }

    const dayConfig = this.data.businessHours[dayName] || {
      day: dayName,
      open: '11:00',
      close: '23:00',
      isOpen: true,
    };

    if (!dayConfig.isOpen) {
      return {
        isOpen: false,
        dayName,
        hoursDisplay: 'Closed Today',
      };
    }

    // Convert 24hr to 12hr AM/PM for display
    const formatTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 || 12;
      return `${hr}:${m.toString().padStart(2, '0')} ${suffix}`;
    };

    return {
      isOpen: true,
      dayName,
      hoursDisplay: `${formatTime(dayConfig.open)} – ${formatTime(dayConfig.close)}`,
    };
  }

  // Availability checking logic:
  // 1. Checks if cafe is closed on selected date
  // 2. Checks time slots within opening hours
  // 3. Sums active guests for that slot and seating preference
  // 4. Returns available slots and recommended alternatives
  public checkAvailability(
    date: string,
    guests: number,
    seatingPreference: SeatingType = 'No Preference'
  ): {
    isDateClosed: boolean;
    closureReason?: string;
    availableSlots: string[];
    bookedSlots: string[];
    capacityPerSlot: number;
    recommendedSlots: string[];
  } {
    const dateObj = new Date(date + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dateObj.getDay()];

    const special = this.data.specialClosures.find((c) => c.date === date);
    if (special && special.isClosed) {
      return {
        isDateClosed: true,
        closureReason: special.reason || 'Special Closure',
        availableSlots: [],
        bookedSlots: [],
        capacityPerSlot: 0,
        recommendedSlots: [],
      };
    }

    const dayConfig = this.data.businessHours[dayName];
    if (!dayConfig || !dayConfig.isOpen) {
      return {
        isDateClosed: true,
        closureReason: 'Closed on ' + dayName + 's',
        availableSlots: [],
        bookedSlots: [],
        capacityPerSlot: 0,
        recommendedSlots: [],
      };
    }

    const openTime = special?.customHours?.open || dayConfig.open; // e.g. "11:00"
    const closeTime = special?.customHours?.close || dayConfig.close; // e.g. "23:00"

    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);

    // Generate 30-minute intervals up to 30 mins before closing
    const allSlots: string[] = [];
    let curH = openH;
    let curM = openM;
    const endMinutes = closeH * 60 + closeM - 30; // last bookable slot

    while (curH * 60 + curM <= endMinutes) {
      const suffix = curH >= 12 ? 'PM' : 'AM';
      const displayH = curH % 12 || 12;
      const displayStr = `${displayH}:${curM.toString().padStart(2, '0')} ${suffix}`;
      allSlots.push(displayStr);

      curM += 30;
      if (curM >= 60) {
        curH += 1;
        curM = 0;
      }
    }

    // Determine seating capacity threshold
    let capacity = 30; // default for Indoor
    if (seatingPreference === 'Indoor') capacity = this.data.settings.seatingCapacity.Indoor;
    else if (seatingPreference === 'Outdoor') capacity = this.data.settings.seatingCapacity.Outdoor;
    else if (seatingPreference === 'Balcony') capacity = this.data.settings.seatingCapacity.Balcony;
    else {
      // No preference uses total capacity
      capacity =
        this.data.settings.seatingCapacity.Indoor +
        this.data.settings.seatingCapacity.Outdoor +
        this.data.settings.seatingCapacity.Balcony;
    }

    // Find active reservations for this date
    const dateReservations = this.data.reservations.filter(
      (r) =>
        r.date === date &&
        (r.status === 'Confirmed' || r.status === 'Pending') &&
        (seatingPreference === 'No Preference' ||
          r.seatingPreference === 'No Preference' ||
          r.seatingPreference === seatingPreference)
    );

    const slotGuestCounts: Record<string, number> = {};
    for (const res of dateReservations) {
      slotGuestCounts[res.time] = (slotGuestCounts[res.time] || 0) + res.guests;
    }

    const availableSlots: string[] = [];
    const bookedSlots: string[] = [];

    for (const slot of allSlots) {
      const currentBooked = slotGuestCounts[slot] || 0;
      if (currentBooked + guests <= capacity) {
        availableSlots.push(slot);
      } else {
        bookedSlots.push(slot);
      }
    }

    return {
      isDateClosed: false,
      availableSlots,
      bookedSlots,
      capacityPerSlot: capacity,
      recommendedSlots: availableSlots.slice(0, 4),
    };
  }

  public createReservation(data: {
    customerName: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: SeatingType;
    occasion: OccasionType;
    specialRequests?: string;
  }): { success: boolean; reservation?: Reservation; error?: string; alternativeSlots?: string[] } {
    // Validate inputs
    if (!data.customerName || data.customerName.trim().length < 2) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!data.phone || data.phone.trim().length < 8) {
      return { success: false, error: 'Please enter a valid mobile number.' };
    }
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!data.date) {
      return { success: false, error: 'Please select a reservation date.' };
    }
    if (!data.time) {
      return { success: false, error: 'Please select a reservation time.' };
    }

    // Check past date
    const today = new Date().toISOString().split('T')[0];
    if (data.date < today) {
      return { success: false, error: 'Please select a future date.' };
    }

    // Check availability
    const avail = this.checkAvailability(data.date, data.guests, data.seatingPreference);
    if (avail.isDateClosed) {
      return {
        success: false,
        error: `We're closed on this date (${avail.closureReason}). Please choose another day.`,
      };
    }

    if (!avail.availableSlots.includes(data.time)) {
      // Find nearest alternatives
      const alternatives = avail.availableSlots.slice(0, 3);
      return {
        success: false,
        error: 'Sorry, this time slot is no longer available.',
        alternativeSlots: alternatives,
      };
    }

    // Generate Booking ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BLM-${randomNum}`;

    const newRes: Reservation = {
      id: bookingId,
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      date: data.date,
      time: data.time,
      guests: Number(data.guests),
      seatingPreference: data.seatingPreference,
      occasion: data.occasion,
      specialRequests: data.specialRequests ? data.specialRequests.trim() : undefined,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.reservations.unshift(newRes);
    this.saveData(this.data);

    return {
      success: true,
      reservation: newRes,
    };
  }

  public getReservations(filterStatus?: BookingStatus, search?: string): Reservation[] {
    let list = [...this.data.reservations];
    if (filterStatus) {
      list = list.filter((r) => r.status === filterStatus);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getReservationById(id: string): Reservation | undefined {
    return this.data.reservations.find((r) => r.id.toLowerCase() === id.toLowerCase());
  }

  public updateReservationStatus(id: string, status: BookingStatus): Reservation | null {
    const res = this.data.reservations.find((r) => r.id.toLowerCase() === id.toLowerCase());
    if (res) {
      res.status = status;
      res.updatedAt = new Date().toISOString();
      this.saveData(this.data);
      return res;
    }
    return null;
  }

  public updateReservation(id: string, update: Partial<Reservation>): Reservation | null {
    const res = this.data.reservations.find((r) => r.id.toLowerCase() === id.toLowerCase());
    if (res) {
      Object.assign(res, update, { updatedAt: new Date().toISOString() });
      this.saveData(this.data);
      return res;
    }
    return null;
  }

  public deleteReservation(id: string): boolean {
    const initialLen = this.data.reservations.length;
    this.data.reservations = this.data.reservations.filter(
      (r) => r.id.toLowerCase() !== id.toLowerCase()
    );
    if (this.data.reservations.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public upsertReservation(item: Reservation): void {
    const idx = this.data.reservations.findIndex(
      (r) => r.id.toLowerCase() === item.id.toLowerCase()
    );
    if (idx >= 0) {
      this.data.reservations[idx] = { ...this.data.reservations[idx], ...item };
    } else {
      this.data.reservations.unshift(item);
    }
    this.saveData(this.data);
  }

  // Menu items
  public getMenu(): { categories: string[]; items: MenuItem[] } {
    return {
      categories: this.data.menuCategories,
      items: this.data.menuItems,
    };
  }

  public addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: 'menu-' + Date.now(),
    };
    this.data.menuItems.push(newItem);
    this.saveData(this.data);
    return newItem;
  }

  public updateMenuItem(id: string, update: Partial<MenuItem>): MenuItem | null {
    const item = this.data.menuItems.find((m) => m.id === id);
    if (item) {
      Object.assign(item, update);
      this.saveData(this.data);
      return item;
    }
    return null;
  }

  public deleteMenuItem(id: string): boolean {
    const initialLen = this.data.menuItems.length;
    this.data.menuItems = this.data.menuItems.filter((m) => m.id !== id);
    if (this.data.menuItems.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Gallery
  public getGallery(): GalleryItem[] {
    return this.data.gallery;
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    this.data.gallery.push(newItem);
    this.saveData(this.data);
    return newItem;
  }

  public deleteGalleryItem(id: string): boolean {
    const initialLen = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    if (this.data.gallery.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Reviews
  public getReviews(): Review[] {
    return this.data.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'date'>): Review {
    const newRev: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      date: 'Just now',
    };
    this.data.reviews.unshift(newRev);
    this.saveData(this.data);
    return newRev;
  }
}

export const store = new DataStore();
