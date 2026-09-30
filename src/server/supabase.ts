import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Reservation } from '../types/index.ts';

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://thulqrlemeqrekzhixxp.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_9UB9QmOub5gLO_El8sqVhA_E6hJE6s6';

export const SUPABASE_PROJECT_ID = (() => {
  try {
    const url = new URL(SUPABASE_URL);
    return url.hostname.split('.')[0] || 'thulqrlemeqrekzhixxp';
  } catch {
    return 'thulqrlemeqrekzhixxp';
  }
})();

export const SUPABASE_SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`;
export const SUPABASE_TABLE_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`;

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseSyncResult {
  synced: boolean;
  tableUsed?: string;
  error?: string;
  code?: string;
  hint?: string;
}

let cachedWorkingTable: string | null = null;

/**
 * Saves a reservation / appointment to the user's Supabase database.
 * Supports 'reservations', 'appointments', 'bookings', and schema variations.
 */
export async function syncReservationToSupabase(
  reservation: Reservation
): Promise<SupabaseSyncResult> {
  const defaultTables = ['reservations', 'appointments', 'bookings', 'table_reservations'];
  const tablesToTry = cachedWorkingTable
    ? [cachedWorkingTable, ...defaultTables.filter((t) => t !== cachedWorkingTable)]
    : defaultTables;

  // Form payload with snake_case
  const snakePayload: Record<string, any> = {
    id: reservation.id,
    customer_name: reservation.customerName,
    phone: reservation.phone,
    email: reservation.email,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    seating_preference: reservation.seatingPreference,
    occasion: reservation.occasion,
    special_requests: reservation.specialRequests || '',
    status: reservation.status,
    created_at: reservation.createdAt,
    updated_at: reservation.updatedAt,
  };

  // Form payload with camelCase
  const camelPayload: Record<string, any> = {
    id: reservation.id,
    customerName: reservation.customerName,
    phone: reservation.phone,
    email: reservation.email,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    seatingPreference: reservation.seatingPreference,
    occasion: reservation.occasion,
    specialRequests: reservation.specialRequests || '',
    status: reservation.status,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };

  // Generic appointment-style payload (name, notes, appointment_date)
  const appointmentStylePayload: Record<string, any> = {
    id: reservation.id,
    name: reservation.customerName,
    phone: reservation.phone,
    email: reservation.email,
    appointment_date: reservation.date,
    appointment_time: reservation.time,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    notes: reservation.specialRequests || '',
    status: reservation.status,
  };

  const payloadsToTry = [snakePayload, camelPayload, appointmentStylePayload];
  let lastError: any = null;

  for (const table of tablesToTry) {
    for (const payload of payloadsToTry) {
      try {
        const { error } = await supabase
          .from(table)
          .upsert(payload, { onConflict: 'id' });

        if (!error) {
          cachedWorkingTable = table;
          console.log(`[Supabase] Successfully saved reservation ${reservation.id} to table '${table}'`);
          return {
            synced: true,
            tableUsed: table,
          };
        }

        lastError = error;

        // If table doesn't exist (PGRST205), skip other payloads for this table immediately
        if (error.code === 'PGRST205') {
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }
  }

  console.warn(`[Supabase] Could not sync reservation to Supabase:`, lastError?.message || lastError);

  return {
    synced: false,
    error: lastError?.message || 'Could not save to Supabase table',
    code: lastError?.code,
    hint:
      lastError?.code === 'PGRST205'
        ? "Table 'reservations' does not exist yet in Supabase. Run the provided SQL setup script in your Supabase SQL Editor."
        : lastError?.hint,
  };
}

/**
 * Checks connection and checks if the reservations table exists in Supabase.
 */
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  tableExists: boolean;
  tableFound?: string;
  projectId: string;
  error?: string;
  sqlSetupScript: string;
}> {
  const sqlSetupScript = `-- 1. Create reservations table in Supabase
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

-- 2. Optional: Create appointments view for backward compatibility
CREATE OR REPLACE VIEW public.appointments AS SELECT * FROM public.reservations;

-- 3. Enable Row Level Security (RLS) & allow public inserts and reads
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to reservations" ON public.reservations;
CREATE POLICY "Allow public insert to reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select from reservations" ON public.reservations;
CREATE POLICY "Allow public select from reservations" 
ON public.reservations 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public update to reservations" ON public.reservations;
CREATE POLICY "Allow public update to reservations" 
ON public.reservations 
FOR UPDATE 
USING (true);`;

  const tablesToTest = ['reservations', 'appointments', 'bookings'];

  for (const table of tablesToTest) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        return {
          connected: true,
          tableExists: true,
          tableFound: table,
          projectId: SUPABASE_PROJECT_ID,
          sqlSetupScript,
        };
      }
      // If error is permission or something else other than table not found, table exists!
      if (error.code !== 'PGRST205') {
        return {
          connected: true,
          tableExists: true,
          tableFound: table,
          projectId: SUPABASE_PROJECT_ID,
          error: error.message,
          sqlSetupScript,
        };
      }
    } catch (e: any) {
      // continue to next table
    }
  }

  return {
    connected: true,
    tableExists: false,
    projectId: SUPABASE_PROJECT_ID,
    error: "Table 'reservations' has not been created yet in Supabase.",
    sqlSetupScript,
  };
}

/**
 * Retrieves all reservations directly from the Supabase database.
 */
export async function getReservationsFromSupabase(): Promise<Reservation[]> {
  const tablesToTry = ['reservations', 'appointments', 'bookings'];

  for (const table of tablesToTry) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') continue; // table not found, try next
        console.warn(`[Supabase query error on ${table}]`, error.message);
        continue;
      }

      if (data && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id,
          customerName: row.customer_name || row.customerName || row.name || 'Guest',
          phone: row.phone || '',
          email: row.email || '',
          date: row.date || '',
          time: row.time || '',
          guests: Number(row.guests) || 2,
          seatingPreference: (row.seating_preference || row.seatingPreference || 'No Preference') as any,
          occasion: (row.occasion || 'None') as any,
          specialRequests: row.special_requests || row.specialRequests || '',
          status: (row.status || 'Confirmed') as any,
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: row.updated_at || new Date().toISOString(),
        }));
      }
    } catch (e: any) {
      console.warn(`[Supabase fetch failed on ${table}]`, e.message);
    }
  }

  return [];
}

/**
 * Updates a reservation in the Supabase database.
 */
export async function updateReservationInSupabase(
  id: string,
  updates: Partial<Reservation>
): Promise<boolean> {
  const rowUpdates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.customerName !== undefined) rowUpdates.customer_name = updates.customerName;
  if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
  if (updates.email !== undefined) rowUpdates.email = updates.email;
  if (updates.date !== undefined) rowUpdates.date = updates.date;
  if (updates.time !== undefined) rowUpdates.time = updates.time;
  if (updates.guests !== undefined) rowUpdates.guests = Number(updates.guests);
  if (updates.seatingPreference !== undefined) rowUpdates.seating_preference = updates.seatingPreference;
  if (updates.occasion !== undefined) rowUpdates.occasion = updates.occasion;
  if (updates.specialRequests !== undefined) rowUpdates.special_requests = updates.specialRequests;
  if (updates.status !== undefined) rowUpdates.status = updates.status;

  const tablesToTry = ['reservations', 'appointments', 'bookings'];
  for (const table of tablesToTry) {
    try {
      const { error } = await supabase.from(table).update(rowUpdates).eq('id', id);
      if (!error) return true;
    } catch (e) {
      // try next
    }
  }
  return false;
}

/**
 * Deletes a reservation from the Supabase database.
 */
export async function deleteReservationFromSupabase(id: string): Promise<boolean> {
  const tablesToTry = ['reservations', 'appointments', 'bookings'];
  for (const table of tablesToTry) {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      // try next
    }
  }
  return false;
}

