# Greppa — waitlist landing page

Marketing landing page for Greppa, a pickleball tournament creation and management
platform. See [`CLAUDE.md`](./CLAUDE.md) for the full product context and
[`docs/plans/01-waitlist-landing-page.md`](./docs/plans/01-waitlist-landing-page.md) for
the plan behind this phase.

## Stack

Next.js (App Router, TypeScript) + Tailwind CSS + Framer Motion, with waitlist
signups stored in SQLite (`better-sqlite3`).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Waitlist signups write to `data/waitlist.db` (git-ignored) relative to the
working directory.

## Environment variables

Copy `.env.example` to `.env.local` for local dev (or `.env` for Docker):

- `WAITLIST_EXPORT_PASSWORD` — password for the basic-auth-protected CSV export at
  `GET /api/waitlist/export` (send as `Authorization: Basic <base64(any:password)>`,
  or `curl -u x:<password> .../api/waitlist/export`).
- `WAITLIST_DB_PATH` — override the SQLite file location (defaults to
  `./data/waitlist.db`; the Docker image sets this to `/app/data/waitlist.db`).
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — Gmail SMTP credentials used to email a
  notification on each waitlist signup. `GMAIL_APP_PASSWORD` is a 16-character
  [App Password](https://myaccount.google.com/apppasswords) (not the account's
  regular password; requires 2-Step Verification). Left unset, signups still
  work — the app just skips sending and logs a warning.
- `NOTIFY_EMAIL` — who receives the signup notification. Defaults to
  `GMAIL_USER` if unset.

## Production build

```bash
npm run build
node .next/standalone/server.js
```

## Docker

```bash
cp .env.example .env   # then edit WAITLIST_EXPORT_PASSWORD
docker compose up -d --build
```

See [`DEPLOY.md`](./DEPLOY.md) for the full EC2 deployment procedure.
