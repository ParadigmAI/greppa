import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.WAITLIST_DB_PATH || path.join(process.cwd(), "data", "waitlist.db");

declare global {
  var __greppaDb: Database.Database | undefined;
}

function createConnection() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

// Reuse a single connection across hot reloads / route invocations in the same process.
export function getDb() {
  if (!global.__greppaDb) {
    global.__greppaDb = createConnection();
  }
  return global.__greppaDb;
}
