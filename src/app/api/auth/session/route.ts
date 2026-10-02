import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseUser } from "@/utils/supabase/auth";
import { parseSessionToken } from "@/utils/session";

/**
 * Returns the current authentication state.
 * Checks: Supabase session → local nova_session cookie.
 */
export async function GET() {
  try {
    // Try Supabase first
    const supabaseUser = await getSupabaseUser();
    if (supabaseUser) {
      return NextResponse.json({
        authenticated: true,
        source: "supabase",
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          role: (supabaseUser.user_metadata?.role as string) ?? "operator",
        },
      });
    }

    // Try local session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("nova_session")?.value;
    if (token) {
      const session = parseSessionToken(token);
      if (session) {
        return NextResponse.json({
          authenticated: true,
          source: "local",
          user: {
            id: session.userId,
            email: null,
            role: session.role,
          },
        });
      }
    }

    return NextResponse.json({
      authenticated: false,
      source: "none",
      user: null,
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      source: "none",
      user: null,
    });
  }
}
