import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

/**
 * Lightweight session check for middleware (Edge-compatible).
 * Full validation happens server-side in resolvePrincipal.
 * Just checks format: userId.role.timestamp.signature (4 dot-separated parts).
 */
function hasSessionCookie(request: NextRequest): boolean {
  const token = request.cookies.get("nova_session")?.value;
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 4 && parts.every((p) => p.length > 0);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If on login/register page and already logged in, redirect to operations
  if ((pathname === "/login" || pathname === "/register") && hasSessionCookie(request)) {
    return NextResponse.redirect(new URL("/operations", request.url));
  }

  // Refresh Supabase session if env vars are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { supabaseResponse } = createClient(request);
      return supabaseResponse;
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
