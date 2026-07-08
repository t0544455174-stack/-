import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Returns null when Supabase env vars are not set, so the game can run
 * fully client-side (localStorage) before any backend is provisioned.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export async function ensureAnonymousSession(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (data.session?.user.id) return data.session.user.id;
  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error("Anonymous sign-in failed", error);
    return null;
  }
  return signInData.user?.id ?? null;
}
