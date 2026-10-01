import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, name } = (body ?? {}) as { email?: unknown; name?: unknown };

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = typeof name === "string" && name.trim() ? name.trim().slice(0, 200) : null;

  try {
    const db = getDb();
    db.prepare(
      `INSERT INTO waitlist (email, name) VALUES (?, ?)
       ON CONFLICT(email) DO UPDATE SET name = COALESCE(excluded.name, waitlist.name)`
    ).run(normalizedEmail, normalizedName);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to record waitlist signup", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
