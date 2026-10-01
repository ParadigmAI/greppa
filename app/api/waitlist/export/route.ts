import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isAuthorized(request: Request): boolean {
  const expected = process.env.WAITLIST_EXPORT_PASSWORD;
  if (!expected) return false;

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return false;

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const [, password] = decoded.split(":");
  return password === expected;
}

function toCsvValue(value: string | null): string {
  const str = value ?? "";
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Greppa waitlist export"' },
    });
  }

  const db = getDb();
  const rows = db
    .prepare("SELECT id, email, name, created_at FROM waitlist ORDER BY created_at ASC")
    .all() as { id: number; email: string; name: string | null; created_at: string }[];

  const header = "id,email,name,created_at";
  const lines = rows.map((row) =>
    [row.id, toCsvValue(row.email), toCsvValue(row.name), row.created_at].join(",")
  );
  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="greppa-waitlist.csv"`,
    },
  });
}
