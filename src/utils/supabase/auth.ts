import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * Attempts to resolve a Supabase user from the current cookie session.
 * Returns null if Supabase is not configured, no session exists, or the session is invalid.
 * This function is safe to call from Server Components and Route Handlers.
 */
export async function getSupabaseUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Maps Supabase user metadata to an application role.
 * Falls back to 'operator' when no explicit role is set.
 * In production, this should be driven by a users/roles table or claims.
 */
export function mapRoleFromMetadata(metadata: Record<string, unknown> | undefined): string {
  if (metadata && typeof metadata.role === "string") {
    return metadata.role;
  }
  return "operator";
}
