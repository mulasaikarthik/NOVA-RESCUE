import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/utils/session";

/**
 * POST /api/register — Create account + auto-login.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    let userId = email.split("@")[0] || "user";
    let role = "operator";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: "operator", full_name: name ?? "" } },
        });
        if (!error && data.user) {
          userId = data.user.id;
          role = (data.user.user_metadata?.role as string) ?? "operator";
        }
      } catch (err) {
        console.warn("[POST /api/register] Supabase failed:", err);
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
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
