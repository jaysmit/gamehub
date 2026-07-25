import { createBrowserClient } from "@supabase/ssr";

// ============================================
// SUPABASE BROWSER CLIENT
// Use this in client components
// ============================================

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for development without Supabase
    console.warn("Supabase not configured. Auth features will be disabled.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
