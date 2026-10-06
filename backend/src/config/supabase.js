/**
 * supabase.js — central Supabase client for the Baker's Delight backend.
 *
 * Uses the SERVICE ROLE KEY — this file is server-side only.
 * The service role key bypasses Row Level Security and must NEVER be sent
 * to the browser or stored in any VITE_ environment variable.
 *
 * Environment variables required (set in Render / .env):
 *   SUPABASE_URL              — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — your Supabase service role key (server only)
 */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
    'Add them to your .env file or Render environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // Disable auto-refresh and session persistence — this is a server-side client
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

module.exports = { supabase };
