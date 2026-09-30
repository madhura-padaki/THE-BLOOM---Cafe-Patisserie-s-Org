import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'thulqrlemeqrekzhixxp';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = 'sb_publishable_9UB9QmOub5gLO_El8sqVhA_E6hJE6s6';
export const SUPABASE_SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`;
export const SUPABASE_TABLE_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`;

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Direct client-side insert to Supabase
 */
export async function directSupabaseInsert(reservation: any): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
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
      status: reservation.status || 'Confirmed',
    };

    const { error } = await supabaseClient.from('reservations').upsert(payload, { onConflict: 'id' });
    if (!error) return { success: true };
    return { success: false, error: error.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchSupabaseStatus(): Promise<{
  connected: boolean;
  tableExists: boolean;
  tableFound?: string;
  projectId: string;
  error?: string;
  sqlSetupScript: string;
}> {
  const res = await fetch('/api/supabase/status');
  if (!res.ok) throw new Error('Failed to fetch Supabase status');
  return res.json();
}

export async function syncAllReservationsToSupabase(): Promise<{
  total: number;
  synced: number;
  failed: number;
  results: Array<{ id: string; success: boolean; error?: string }>;
}> {
  const res = await fetch('/api/supabase/sync-all', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync reservations to Supabase');
  return res.json();
}
