import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/utils/session";

/**
 * POST /api/login — Direct API-based login.
 * Accepts JSON body { email, password }.
 * Returns 200 + sets session cookie on success.
 * Falls back to local session if Supabase isn't configured.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    let userId = email.split("@")[0] || "user";
    let role = "operator";

    // Try Supabase auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          userId = data.user.id;
          role = (data.user.user_metadata?.role as string) ?? "operator";
        }
      } catch (err) {
        console.warn("[POST /api/login] Supabase failed:", err);
      }
    }

    // Set local session cookie
    const cookieStore = await cookies();
    const token = createSessionToken(userId, role);
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { id: userId, email, role },
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
