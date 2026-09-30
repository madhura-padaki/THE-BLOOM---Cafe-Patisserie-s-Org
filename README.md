# THE BLOOM – Café & Patisserie

> A modern, full-stack web application and table reservation system for **THE BLOOM**, an artisanal botanical café and patisserie located in Jayanagar, Bengaluru.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
  - [Customer-Facing Experience](#customer-facing-experience)
  - [Table Reservation Engine](#table-reservation-engine)
  - [Admin Management Dashboard](#admin-management-dashboard)
  - [Supabase Real-Time Integration](#supabase-real-time-integration)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend & APIs](#backend--apis)
  - [Database & Storage](#database--storage)
  - [Tooling & Architecture](#tooling--architecture)
- [Responsive Design](#responsive-design)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Supabase Configuration & SQL Schema](#supabase-configuration--sql-schema)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Running the Application](#running-the-application)
- [Build and Deployment](#build-and-deployment)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## Project Overview

**THE BLOOM – Café & Patisserie** is an editorial-grade, full-stack hospitality web platform designed for a botanical café in Jayanagar 4th T Block, Bengaluru. 

The application bridges the gap between customer-facing visual storytelling and real-time operational efficiency. Guests can explore handcrafted artisanal menus, check live café operating hours, submit real-time table reservation requests with seating preferences (indoor vs. balcony garden terrace), and receive instant confirmation cards with WhatsApp sharing. 

Under the hood, the system is powered by an Express REST API with an in-memory & file-backed persistent data store coupled with automated cloud synchronization to **Supabase (PostgreSQL)** with Row-Level Security (RLS). A comprehensive, password-protected **Admin Dashboard** allows café managers to manage bookings, adjust menu items, update business hours, handle holiday closures, and run database sync diagnostics.

---

## Screenshots

### Home Page
<!-- Add screenshot here -->

### Reservation Page
<!-- Add screenshot here -->

### Admin Dashboard
<!-- Add screenshot here -->

---

## Key Features

### Customer-Facing Experience
- **Live Café Operating Status**: Automatically calculates whether the café is currently open, displays today's hours, and accounts for scheduled holiday closures or adjusted hours in real-time.
- **Editorial Botanical Aesthetic**: Custom palette inspired by nature (`#203327` forest green, `#8FA58A` sage, `#F8F4EC` warm cream, `#D9A7A0` dusty rose), complete with serif typography and smooth entrance animations.
- **Categorized Artisanal Menu**: Tabbed menu explorer (Artisanal Coffee, Patisserie & Desserts, Breakfast & Brunch, Mains & Pasta, Coolers & Teas) with dietary filters (Vegetarian), and highlight badges (*Signature*, *Bestseller*, *Seasonal*).
- **Visual Lifestyle & Atmosphere Gallery**: Curated photo grid capturing interior ambiance, outdoor balcony terrace seating, specialty latte art, and patisserie creations.
- **Community Reviews & Feedback**: Displays authentic guest reviews and includes an interactive review submission form with 5-star ratings.
- **Location & Contact Integration**: Direct Google Maps directions, address information, telephone click-to-call, and a persistent floating WhatsApp chat button.

### Table Reservation Engine
- **Date & Slot Availability**: Guests pick a date, time slot, number of guests, and seating preference (*Indoor Dining*, *Balcony Terrace*, *Garden View*, or *No Preference*).
- **Occasion & Special Requests**: Supports custom requests such as birthdays, anniversaries, business meetings, and dietary notes.
- **Instant Booking Confirmation**: Generates a unique reference ID (e.g. `BLM-3455`) with full reservation details.
- **WhatsApp Share Action**: One-click sharing that formats the booking confirmation details directly into a pre-filled WhatsApp message.
- **Automated Dual-Sync**: Every reservation is immediately persisted to the backend store and asynchronously synced to the connected Supabase PostgreSQL database.

### Admin Management Dashboard
Protected by an administrative authentication modal (`bloom` or `bloom2024`), providing café managers with full operational control:
- **Reservations Manager**:
  - Live search by customer name, phone number, email, or reservation ID.
  - Filter bookings by status: `Confirmed`, `Pending`, `Seated`, `Cancelled`, `Completed`.
  - Inline status updater with automatic synchronization to Supabase.
  - Manual booking creation modal for walk-in or phone reservations.
- **Menu Items Manager**:
  - Full CRUD operations (Create, Read, Update, Delete) for menu offerings.
  - Toggle tags: Vegetarian, Bestseller, Seasonal, and Signature.
  - Category selector with instant price and description updating.
- **Gallery Manager**:
  - Add new gallery images with titles, categories, and captions.
  - Delete or reorder existing gallery items.
- **Hours & Special Closures**:
  - Modify opening and closing times per day of the week.
  - Schedule special closure dates (holidays, private events, maintenance) with custom notices.
- **Supabase Integration & Health Diagnostics**:
  - Live database connection status indicator.
  - Active table verification (`reservations`).
  - Copyable production SQL schema setup script.
  - One-click batch synchronization button to sync all local bookings into Supabase.
- **Café Profile & Contact Settings**:
  - Edit business phone, WhatsApp number, physical address, and notification preferences.

### Supabase Real-Time Integration
- Direct integration using `@supabase/supabase-js`.
- Automated retry and fallback logic: if Supabase is temporarily unreachable, reservations are safely preserved locally and can be synchronized with one click from the Admin Dashboard.
- Support for PostgreSQL Row-Level Security (RLS) policies allowing public insertions and controlled reads.

---

## Technologies Used

### Frontend
- **React 19** (`react`, `react-dom`): Modern component architecture using hooks and functional components.
- **TypeScript**: Full static typing across components, models, and API services.
- **Vite 8**: Next-generation frontend build tooling with hot module replacement and optimized production bundling.
- **Tailwind CSS v4** (`@tailwindcss/vite`): Utility-first CSS styling with modern theme variables and typography.
- **Motion** (`motion`): Fluid UI transitions, modal animators, and micro-interactions.
- **Lucide React** (`lucide-react`): Consistent, lightweight icons throughout the interface.

### Backend & APIs
- **Node.js & Express 4**: High-performance HTTP server running custom REST API routes for reservations, menu, business hours, reviews, and admin workflows.
- **TSX**: Seamless TypeScript execution for the server runtime without manual pre-compilation steps.
- **Vite Middleware Integration**: Unified full-stack development experience running Express and Vite on a single port (`3000`).

### Database & Storage
- **Supabase (PostgreSQL)**: Cloud-hosted relational database for persistent table reservations.
- **Local JSON Data Store** (`src/server/dataStore.ts` & `data/store.json`): Server-authoritative fallback and local cache ensuring zero data loss during network disruptions.

### Tooling & Architecture
- **ESLint & TypeScript Compiler (`tsc`)**: Strict type checking and linting.
- **dotenv**: Environment variable isolation between development and production.

---

## Responsive Design

The application is engineered with a mobile-first philosophy and optimized for all screen sizes:
- **Mobile Viewports (< 640px)**:
  - Collapsible navigation with a sliding overlay menu.
  - **Sticky Mobile Reserve Bar**: A bottom drawer CTA button that gives quick access to table reservations without obscuring content.
  - Single-column card layouts, touch-friendly tap targets, and streamlined form inputs.
- **Tablet Viewports (640px – 1024px)**:
  - 2-column menu grids and responsive gallery columns.
  - Adaptive admin dashboard layouts with horizontal scrolling tables.
- **Desktop Viewports (> 1024px)**:
  - Expansive hero banner with dynamic operating badges.
  - Multi-column editorial storytelling layouts.
  - Sticky reservation summary panel and comprehensive data tables in the Admin Dashboard.

---

## Folder Structure

```text
├── data/
│   └── store.json                  # Local JSON database storage
├── public/
│   ├── assets/                     # Static production assets
│   └── images/                     # Café photography (hero, terrace, coffee, patisserie)
├── src/
│   ├── assets/
│   │   └── images/                 # Source photography assets
│   ├── components/
│   │   ├── AboutSection.tsx        # Café story and indoor/outdoor features
│   │   ├── AdminDashboard.tsx      # Multi-tab admin management console
│   │   ├── BookingConfirmationModal.tsx # Booking success card with WhatsApp share
│   │   ├── ContactSection.tsx      # Map directions, contact numbers, hours
│   │   ├── FloatingWhatsApp.tsx    # Persistent floating WhatsApp chat button
│   │   ├── Footer.tsx              # Brand footer with links and social icons
│   │   ├── GallerySection.tsx      # Curated atmosphere & dish photos
│   │   ├── Hero.tsx                # Hero section with live opening status indicator
│   │   ├── InstagramSection.tsx    # Social grid preview
│   │   ├── MenuSection.tsx         # Filterable categorized food & beverage menu
│   │   ├── MobileStickyReserve.tsx # Sticky bottom reservation bar for mobile devices
│   │   ├── Navbar.tsx              # Responsive navigation header
│   │   ├── ReservationSection.tsx  # Interactive table booking form
│   │   ├── ReviewsSection.tsx      # Guest testimonials & review submission
│   │   └── SignatureExperiences.tsx# Curated highlights (Terrace, Artisanal Brews, etc.)
│   ├── server/
│   │   ├── dataStore.ts            # Local data persistence, validation & initial seed
│   │   └── supabase.ts             # Supabase client, health checks, and sync engine
│   ├── services/
│   │   ├── api.ts                  # Client-side API service methods
│   │   └── supabase.ts             # Client-side Supabase credentials & utilities
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (Reservations, Menu, Settings, etc.)
│   ├── App.tsx                     # Main application layout and state manager
│   ├── index.css                   # Global Tailwind CSS imports & theme rules
│   └── main.tsx                    # React DOM root entry point
├── .env.example                    # Template for environment variables
├── index.html                      # HTML5 entry template with SEO metadata
├── metadata.json                   # Applet project metadata and capabilities
├── package.json                    # Project scripts and dependencies
├── server.ts                       # Express server and Vite middleware integration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build and plugin configuration
```

---

## Environment Variables

Create a `.env` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Define the following variables:

```env
# Supabase Database Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-publishable-or-anon-key

# Optional: Custom Port (Defaults to 3000)
PORT=3000
```

> **Note:** The backend gracefully falls back to local JSON storage if Supabase credentials are not provided or if the database is initializing.

---

## Supabase Configuration & SQL Schema

To sync table reservations with your own Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Run the following SQL setup script to create the `reservations` table and configure Row-Level Security:

```sql
-- 1. Create the reservations table for THE BLOOM
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  seating_preference TEXT,
  occasion TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Optional: Create an appointments view for backward compatibility
CREATE OR REPLACE VIEW public.appointments AS 
  SELECT * FROM public.reservations;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow public insertion for new table bookings
DROP POLICY IF EXISTS "Allow public insert to reservations" ON public.reservations;
CREATE POLICY "Allow public insert to reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- 5. Policy: Allow reading reservations
DROP POLICY IF EXISTS "Allow public select from reservations" ON public.reservations;
CREATE POLICY "Allow public select from reservations" 
ON public.reservations 
FOR SELECT 
USING (true);

-- 6. Policy: Allow updating reservation status
DROP POLICY IF EXISTS "Allow public update to reservations" ON public.reservations;
CREATE POLICY "Allow public update to reservations" 
ON public.reservations 
FOR UPDATE 
USING (true);
```

4. Once the query executes successfully, add your `SUPABASE_URL` and `SUPABASE_KEY` to your `.env` file. You can monitor all incoming reservations in real-time under the **Table Editor** tab.

---

## Installation and Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **bun** / **yarn**

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/the-bloom-cafe.git
   cd the-bloom-cafe
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Add your SUPABASE_URL and SUPABASE_KEY to .env
   ```

### Running the Application

To launch both the Express backend and the Vite development server on port `3000`:

```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:3000
```

To access the **Admin Dashboard**:
1. Click the **Admin** link in the navigation bar (or footer).
2. Enter the default administrator password: `bloom` or `bloom2024`.

---

## Build and Deployment

### 1. Compile and Validate Types
Run the TypeScript compiler to verify all types:
```bash
npm run lint
```

### 2. Build for Production
Bundle the client assets into the `dist/` folder:
```bash
npm run build
```

### 3. Start Production Server
Run the production server with static asset serving:
```bash
npm run start
```

The Express server will automatically serve the bundled Vite application from `dist/` along with static image assets from `public/`.

---

## Future Enhancements

- [ ] **Automated SMS & Email Confirmations**: Integration with Twilio / SendGrid for instant customer booking notifications and reminders.
- [ ] **Table Floor Plan Visualization**: Interactive 2D seating map allowing guests to pick exact indoor and balcony tables.
- [ ] **Pre-order & Takeaway Integration**: Allow customers to pre-select signature desserts and coffees when booking a table.
- [ ] **Customer Loyalty System**: Points and perks program for repeat guests and private event bookings.

---

## Author

**THE BLOOM – Café & Patisserie**  
- Location: 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041  
- Concept & Development: Full-Stack Web Application for Modern Hospitality Management  
