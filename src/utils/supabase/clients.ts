import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type SupabaseClient = ReturnType<typeof createClient>;

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const cookieStore = await cookies();
    return createClient(cookieStore);
  } catch {
    return null;
  }
}

/**
 * Creates a Supabase client with the service role key (bypasses RLS).
 * Used only by server-side background tasks, never exposed to the client.
 */
export async function getServiceClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient: createServerClient } = await import("@supabase/supabase-js");
  return createServerClient(url, key, { auth: { persistSession: false } }) as SupabaseClient;
}
