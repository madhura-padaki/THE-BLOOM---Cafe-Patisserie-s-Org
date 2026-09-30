/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { SignatureExperiences } from './components/SignatureExperiences.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { ReservationSection } from './components/ReservationSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { InstagramSection } from './components/InstagramSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { MobileStickyReserve } from './components/MobileStickyReserve.tsx';
import { BookingConfirmationModal } from './components/BookingConfirmationModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import {
  Reservation,
  MenuItem,
  GalleryItem,
  Review,
  BusinessDayHours,
  CafeSettings,
} from './types/index.ts';
import {
  fetchStatus,
  fetchMenu,
  fetchGallery,
  fetchReviews,
  fetchBusinessHours,
  fetchSettings,
} from './services/api.ts';

export default function App() {
  // App Global State
  const [todayStatus, setTodayStatus] = useState<{
    isOpen: boolean;
    dayName: string;
    hoursDisplay: string;
    reason?: string;
  }>({
    isOpen: true,
    dayName: 'Today',
    hoursDisplay: '11:00 AM – 11:00 PM',
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessHours, setBusinessHours] = useState<Record<string, BusinessDayHours>>({});
  const [settings, setSettings] = useState<CafeSettings | null>(null);

  // Modals
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [statusRes, menuRes, galleryRes, reviewsRes, hoursRes, settingsRes] =
        await Promise.allSettled([
          fetchStatus(),
          fetchMenu(),
          fetchGallery(),
          fetchReviews(),
          fetchBusinessHours(),
          fetchSettings(),
        ]);

      if (statusRes.status === 'fulfilled') setTodayStatus(statusRes.value.status);
      if (menuRes.status === 'fulfilled') {
        setCategories(menuRes.value.categories);
        setMenuItems(menuRes.value.items);
      }
      if (galleryRes.status === 'fulfilled') setGallery(galleryRes.value);
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value);
      if (hoursRes.status === 'fulfilled') setBusinessHours(hoursRes.value.hours);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value);
    } catch (e) {
      console.error('Error loading initial app data', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToReserve = () => {
    const el = document.getElementById('reserve');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReviewAdded = (newRev: Review) => {
    setReviews((prev) => [newRev, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#4A3428] selection:bg-[#8FA58A]/30 selection:text-[#304A3A]">
      {/* Sticky Navigation */}
      <Navbar
        onOpenReserve={scrollToReserve}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* Full-Screen Hero */}
        <Hero
          todayStatus={todayStatus}
          onReserveClick={scrollToReserve}
          onMenuClick={scrollToMenu}
        />

        {/* Editorial Storytelling About Section */}
        <AboutSection />

        {/* Signature Experiences: 4 Cards */}
        <SignatureExperiences
          onReserveClick={scrollToReserve}
          onMenuClick={scrollToMenu}
        />

        {/* Interactive Menu Section */}
        <MenuSection
          categories={categories}
          items={menuItems}
          onReserveClick={scrollToReserve}
        />

        {/* Masonry Atmosphere Gallery with Lightbox */}
        <GallerySection items={gallery} />

        {/* Table Reservation Engine */}
        <ReservationSection onBookingSuccess={(res) => setConfirmedReservation(res)} />

        {/* Customer Reviews Section */}
        <ReviewsSection reviews={reviews} onReviewAdded={handleReviewAdded} />

        {/* Instagram / Social Atmosphere Section */}
        <InstagramSection
          instagramHandle={settings?.instagramHandle}
          onImageClick={() => {
            const el = document.getElementById('gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Location, Hours & Google Map Contact Section */}
        <ContactSection businessHours={businessHours} />
      </main>

      {/* Footer */}
      <Footer
        onOpenReserve={scrollToReserve}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Sticky Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Mobile Sticky Reserve Bar (<= 15% mobile viewport cap) */}
      <MobileStickyReserve onReserveClick={scrollToReserve} />

      {/* Booking Confirmation Modal */}
      {confirmedReservation && (
        <BookingConfirmationModal
          reservation={confirmedReservation}
          onClose={() => setConfirmedReservation(null)}
        />
      )}

      {/* Protected Admin Console */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={loadData}
      />
    </div>
  );
}
