import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './src/server/dataStore.ts';
import { BookingStatus, SeatingType } from './src/types/index.ts';
import {
  syncReservationToSupabase,
  checkSupabaseStatus,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SupabaseSyncResult,
} from './src/server/supabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Routes
  // 1. Status & Business Hours
  app.get('/api/status', (req: Request, res: Response) => {
    const targetDate = req.query.date as string | undefined;
    const status = store.getTodayStatus(targetDate);
    const settings = store.getSettings();
    res.json({
      status,
      phone: settings.phone,
      whatsapp: settings.whatsappNumber,
      name: settings.name,
      address: settings.address,
    });
  });

  app.get('/api/business-hours', (_req: Request, res: Response) => {
    res.json(store.getBusinessHours());
  });

  app.put('/api/business-hours', (req: Request, res: Response) => {
    const updated = store.updateBusinessHours(req.body);
    res.json({ success: true, hours: updated });
  });

  app.post('/api/special-closures', (req: Request, res: Response) => {
    const { date, reason, isClosed, customHours } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    const closure = store.addSpecialClosure({
      date,
      reason: reason || 'Special Closure',
      isClosed: isClosed ?? true,
      customHours,
    });
    res.status(201).json({ success: true, closure });
  });

  app.delete('/api/special-closures/:id', (req: Request, res: Response) => {
    const success = store.removeSpecialClosure(req.params.id);
    res.json({ success });
  });

  // 2. Table Availability Check
  app.get('/api/availability', (req: Request, res: Response) => {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const guests = parseInt((req.query.guests as string) || '2', 10);
    const seating = (req.query.seating as SeatingType) || 'No Preference';

    const result = store.checkAvailability(date, guests, seating);
    res.json(result);
  });

  // 3. Reservations
  app.post('/api/reservations', async (req: Request, res: Response) => {
    const result = store.createReservation(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Automatically sync appointment/table reservation to Supabase backend
    let supabaseSync: SupabaseSyncResult = { synced: false };
    if (result.reservation) {
      try {
        supabaseSync = await syncReservationToSupabase(result.reservation);
      } catch (err: any) {
        console.error('[Supabase Sync Error]', err);
      }
    }

    res.status(201).json({
      ...result,
      supabaseSync,
    });
  });

  app.get('/api/reservations', (req: Request, res: Response) => {
    const status = req.query.status as BookingStatus | undefined;
    const search = req.query.search as string | undefined;
    const list = store.getReservations(status, search);
    res.json({ reservations: list });
  });

  app.get('/api/reservations/:id', (req: Request, res: Response) => {
    const booking = store.getReservationById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ reservation: booking });
  });

  app.patch('/api/reservations/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = store.updateReservationStatus(req.params.id, status as BookingStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update in Supabase too
    syncReservationToSupabase(updated).catch((err) =>
      console.warn('[Supabase Status Update Error]', err)
    );

    res.json({ success: true, reservation: updated });
  });

  app.put('/api/reservations/:id', async (req: Request, res: Response) => {
    const updated = store.updateReservation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update in Supabase too
    syncReservationToSupabase(updated).catch((err) =>
      console.warn('[Supabase Update Error]', err)
    );

    res.json({ success: true, reservation: updated });
  });

  // 3.5 Supabase Integration Endpoints
  app.get('/api/supabase/status', async (_req: Request, res: Response) => {
    try {
      const status = await checkSupabaseStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed checking Supabase status' });
    }
  });

  app.post('/api/supabase/sync-all', async (_req: Request, res: Response) => {
    try {
      const allReservations = store.getReservations();
      const results: Array<{ id: string; success: boolean; error?: string }> = [];
      let syncedCount = 0;
      let failedCount = 0;

      for (const resItem of allReservations) {
        const syncRes = await syncReservationToSupabase(resItem);
        if (syncRes.synced) {
          syncedCount++;
          results.push({ id: resItem.id, success: true });
        } else {
          failedCount++;
          results.push({ id: resItem.id, success: false, error: syncRes.error });
        }
      }

      res.json({
        total: allReservations.length,
        synced: syncedCount,
        failed: failedCount,
        results,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed batch sync to Supabase' });
    }
  });

  // 4. Menu Management
  app.get('/api/menu', (_req: Request, res: Response) => {
    res.json(store.getMenu());
  });

  app.post('/api/menu', (req: Request, res: Response) => {
    const { name, description, price, category, isVegetarian, isBestseller, isSeasonal, isSignature, image } =
      req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    const item = store.addMenuItem({
      name,
      description: description || '',
      price: price || null,
      category,
      isVegetarian: Boolean(isVegetarian),
      isBestseller: Boolean(isBestseller),
      isSeasonal: Boolean(isSeasonal),
      isSignature: Boolean(isSignature),
      image,
    });
    res.status(201).json({ success: true, item });
  });

  app.put('/api/menu/:id', (req: Request, res: Response) => {
    const updated = store.updateMenuItem(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ success: true, item: updated });
  });

  app.delete('/api/menu/:id', (req: Request, res: Response) => {
    const success = store.deleteMenuItem(req.params.id);
    res.json({ success });
  });

  // 5. Gallery Management
  app.get('/api/gallery', (_req: Request, res: Response) => {
    res.json({ gallery: store.getGallery() });
  });

  app.post('/api/gallery', (req: Request, res: Response) => {
    const { title, category, image, caption } = req.body;
    if (!title || !image) {
      return res.status(400).json({ error: 'Title and image are required' });
    }
    const item = store.addGalleryItem({
      title,
      category: category || 'Moments',
      image,
      caption,
    });
    res.status(201).json({ success: true, item });
  });

  app.delete('/api/gallery/:id', (req: Request, res: Response) => {
    const success = store.deleteGalleryItem(req.params.id);
    res.json({ success });
  });

  // 6. Reviews
  app.get('/api/reviews', (_req: Request, res: Response) => {
    res.json({ reviews: store.getReviews() });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { author, rating, comment } = req.body;
    if (!author || !comment) {
      return res.status(400).json({ error: 'Author and comment are required' });
    }
    const review = store.addReview({
      author,
      rating: Number(rating) || 5,
      comment,
      source: 'Direct Review',
    });
    res.status(201).json({ success: true, review });
  });

  // 7. Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ settings: store.getSettings() });
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const updated = store.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  });

  // 8. Admin Auth
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    // Default admin password 'bloom' or 'bloom2024'
    if (password === 'bloom' || password === 'bloom2024') {
      return res.json({ success: true, token: 'bloom_admin_session_' + Date.now() });
    }
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  });

  // Static assets serving (ensures all images load in both dev and production)
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));
  app.use('/images', express.static(path.resolve(__dirname, 'public/images')));
  app.use('/assets/images', express.static(path.resolve(__dirname, 'public/assets/images')));
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Vite middleware in dev or static files in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`THE BLOOM server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
