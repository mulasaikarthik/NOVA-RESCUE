import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * GET /api/setup — Returns the Supabase schema SQL that must be applied.
 * POST /api/setup — Attempts to apply the schema (only works if a service role key is configured).
 */
export async function GET() {
  const schemaPath = join(process.cwd(), "supabase", "schema.sql");
  let schemaSql = "";
  try {
    schemaSql = readFileSync(schemaPath, "utf-8");
  } catch {
    return NextResponse.json(
      {
        ready: false,
        message: "Schema file not found on server.",
      },
      { status: 500 },
    );
  }

  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return NextResponse.json({
    ready: hasUrl && hasKey,
    hasServiceRole,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: hasUrl,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: hasKey,
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
    },
    instructions: hasServiceRole
      ? "Service role is configured. POST to this endpoint to auto-apply the schema."
      : "Run the SQL below in the Supabase SQL Editor to create all required tables.",
    schemaSql,
  });
}

export async function POST(request: Request) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json(
      {
        success: false,
        message: "SUPABASE_SERVICE_ROLE_KEY is not configured. Apply the schema manually in the Supabase SQL Editor.",
      },
      { status: 403 },
    );
  }

  const schemaPath = join(process.cwd(), "supabase", "schema.sql");
  let schemaSql = "";
  try {
    schemaSql = readFileSync(schemaPath, "utf-8");
  } catch {
    return NextResponse.json({ success: false, message: "Schema file not found." }, { status: 500 });
  }

  try {
    // Call Supabase REST RPC for exec_sql if available; otherwise use the /rest/v1/rpc path directly
    const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ sql: schemaSql }),
    });
    const body = await response.text();
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      response: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to apply schema.",
      },
      { status: 500 },
    );
  }
}
