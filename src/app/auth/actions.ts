"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/utils/session";

/**
 * Sets the session cookie.
 */
async function setSessionCookie(userId: string, role: string) {
  const cookieStore = await cookies();
  const token = createSessionToken(userId, role);
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

type ActionState = { success: boolean; error?: string };

/**
 * Sign in with email and password.
 * Tries Supabase first, falls back to local session on failure.
 */
export async function signInWithPassword(formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  // Try Supabase auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        // Supabase login succeeded — also set local session for backend auth
        const role = (data.user.user_metadata?.role as string) ?? "operator";
        await setSessionCookie(data.user.id, role);
        revalidatePath("/", "layout");
        redirect("/operations");
      }
    } catch (err) {
      console.warn("[signIn] Supabase auth failed:", err);
    }
  }

  // Fallback: create a local session (any email/password works)
  const userId = email.split("@")[0] || "user";
  await setSessionCookie(userId, "operator");
  revalidatePath("/", "layout");
  redirect("/operations");
}

/**
 * Sign up with email and password.
 * Tries Supabase first, falls back to local session on failure.
 */
export async function signUp(formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  // Try Supabase auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "operator" } },
      });
      if (!error && data.user) {
        const role = (data.user.user_metadata?.role as string) ?? "operator";
        await setSessionCookie(data.user.id, role);
        revalidatePath("/", "layout");
        redirect("/operations");
      }
    } catch (err) {
      console.warn("[signUp] Supabase auth failed:", err);
    }
  }

  // Fallback: create a local session
  const userId = email.split("@")[0] || "user";
  await setSessionCookie(userId, "operator");
  revalidatePath("/", "layout");
  redirect("/operations");
}

/**
 * Sign out.
 */
export async function signOut(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("[signOut] Supabase signOut failed:", err);
    }
  }

  // Clear local session
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  revalidatePath("/", "layout");
  redirect("/");
}
