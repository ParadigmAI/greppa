# Plan: Greppa Waitlist Landing Page (Phase 1)

Status: Built — verified locally (dev + production build + Docker). Not yet deployed to EC2.
Owner: miranthaj@gmail.com
Related: [[CLAUDE.md]] for full product context and brand direction

## 1. Goal

Ship a single marketing landing page that:
1. Communicates what Greppa is (chat-based tournament creation → tournament management → player management → facility/utility management → future guided workflows & supply chain integrations).
2. Delivers a genuinely uncommon visual experience built around a pickleball-court journey concept.
3. Converts visitors into waitlist signups via one primary CTA: **"Join Waitlist"**, backed by a minimal email(+optional name) capture form.
4. Ships as a Docker container that can be cloned onto an EC2 box and run with a single command, ready for a custom domain to be pointed at it.

Explicitly **not** in scope: any real tournament/app functionality, auth, user accounts, payments, admin dashboard (a simple way to export/view waitlist entries is in scope, see §5).

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Single codebase for static marketing content + one tiny API route for the waitlist submission; standalone output produces a small, fast-starting Docker image — good fit for a modest EC2 instance. |
| Styling | Tailwind CSS | Fast to build a bespoke visual system without fighting a component library's defaults — important since the design goal is "uncommon," not "default Bootstrap-y." |
| Motion | Framer Motion + native CSS scroll-driven animation where possible | Needed for the traveling-ball / court-journey scroll experience. |
| Waitlist storage | SQLite file (via `better-sqlite3`) on a mounted Docker volume | Zero external services/accounts needed, durable across container restarts as long as the volume persists, trivially exportable (it's just a file). Right-sized for an email-capture form — explicitly avoiding standing up a hosted DB for this. |
| Deployment | Docker + docker-compose, single EC2 instance | Per [[CLAUDE.md]] deployment model — `git clone` on the box, `docker compose up -d`, point DNS at the instance. |

If waitlist volume ever outgrows SQLite-on-a-volume, revisit — not a Phase 1 concern.

## 3. Site structure — the "court journey" concept

The page is a single long scroll structured as **zones of a pickleball court**, traveled top to bottom. A pickleball visually travels down the page as the user scrolls (a small fixed/sticky element that moves along a path, bounces at section transitions, and leaves a subtle trail), acting as the through-line/guide. Court lines (thin luminous-green or white strokes) animate in to mark the transition between zones, echoing actual court markings (baseline, non-volley zone/kitchen line, centerline, sideline).

Zones, in order:

1. **Baseline (Hero)** — Where a rally starts. Headline + one-liner on what Greppa is, the "Join Waitlist" CTA front and center, and the ball's first "serve" animation kicks off the scroll journey here.
   - Headline direction: something like "Tournament day, without the tournament headache." (copy to be refined during build, not locked here)
   - Subhead: one sentence covering chat-based creation → full management.
2. **Kitchen / Non-Volley Zone (Tournament Creation)** — Feature block on the chat-based tournament creation flow. This is the product's signature differentiator, so it gets the most visual attention: mock chat bubbles showing a fast back-and-forth ("What format?" → "Double elimination" → "How many divisions?"...) that assembles into a tournament card.
3. **Net (Tournament Management)** — The pivot point of the page (literally: the net divides the court). Feature block on managing the live tournament: brackets, scheduling, match results, communication.
4. **Far Baseline (Player Management)** — Roster/registration, player history, communications — framed as the other "side" of the court experience.
5. **Sidelines / Off-court (Facility & Utility Management)** — Court scheduling/utilization, maintenance, resource planning — the facility-operator side of the product.
6. **Out of Bounds → What's Next (Vision)** — Brief, lighter-weight teaser section for guided workflows and supply-chain integrations, framed explicitly as roadmap/coming, not shipping today.
7. **Second Serve (Final CTA + Form)** — Closing section, restates the CTA, hosts the waitlist form (or re-opens the same modal/drawer used in the hero — one form experience, invoked from multiple places).
8. **Footer** — Minimal: wordmark, one-line tagline, contact/email, year.

Each zone shares a consistent visual grammar (court-blue background with subtle court-texture, green accent line work) so it reads as one continuous court rather than disconnected sections.

## 4. Waitlist form UX

- CTA button ("Join Waitlist") appears in the hero and in the closing section (and optionally a slim sticky header once the user scrolls past the hero).
- Clicking it opens a **lightweight modal/drawer** (not a page navigation) with:
  - Email field — **required**
  - Name field — **optional**
  - Submit button (label: "Join Waitlist" or "Count me in")
  - Inline success state after submit (no redirect): a short confirmation message with a small celebratory motion touch (e.g., the ball does a little spin), replacing the form in place.
  - Basic client-side email validation; server-side validation + duplicate-email handling (idempotent — resubmitting the same email updates nothing and just shows success, doesn't error) on the API route.
- No account creation, no email verification loop, no third-party ESP integration in Phase 1 — straight to SQLite. (An ESP/CRM integration, e.g. exporting to Mailchimp/Resend audiences, is a natural fast-follow, not Phase 1.)

## 5. Data persistence & access

- API route: `POST /api/waitlist` — accepts `{ email, name? }`, writes a row `{ id, email, name, created_at }` to SQLite, returns `{ ok: true }`.
- SQLite file lives at a path mounted as a Docker volume (e.g. `./data/waitlist.db` on the host → `/app/data/waitlist.db` in the container) so signups survive container rebuilds/redeploys.
- Minimal read path for the owner to retrieve signups: a small authenticated-by-obscurity or basic-auth-protected `GET /api/waitlist/export` (CSV) is enough for Phase 1 — not a UI dashboard. (Decide at build time whether basic auth via an env-var-set password is sufficient; this is a low-stakes internal tool, not user-facing.)

## 6. Visual & motion design system

- **Palette:**
  - Court blue — primary background (deep, saturated blue, court-surface feel)
  - Luminous/optic green — primary accent, CTA color, ball motif, highlight lines (the actual pickleball-yellow-green, not a generic green)
  - White / off-white — court lines, primary text on blue backgrounds, structure
  - A darker ink-blue for depth/shadow layering between zones
- **Typography:** a confident, slightly sporty display face for headlines paired with a clean, highly legible sans for body copy. (Exact font pairing to be chosen during build — Google Fonts, self-hosted to keep the Docker image self-contained rather than depending on an external font CDN at runtime.)
- **Texture:** subtle court-surface texture (fine grain / gradient mesh) rather than flat color fills, so backgrounds don't read as generic flat-design SaaS.
- **Motion grammar:**
  - A ball element that travels down the page tied to scroll position, bouncing/pausing at each zone transition.
  - Court lines draw themselves in (stroke animation) as each zone enters the viewport.
  - Section transitions use subtle parallax between "court surface" background layers and foreground content, reinforcing depth/movement.
  - Respect `prefers-reduced-motion` — provide a static/minimal-motion fallback so the page remains fully usable and not disorienting for users who need reduced motion.
- **Responsiveness:** the court-journey concept needs a deliberately simplified mobile version (ball animation can be lighter-weight; vertical scroll-tied motion still works but with reduced parallax layers for performance).

## 7. Docker & deployment

- `Dockerfile`: multi-stage build — install deps → `next build` (standalone output) → minimal runtime image (`node:XX-alpine`) copying only the standalone build output + static assets. Goal: small image, fast cold start on a modest EC2 instance.
- `docker-compose.yml`: single service (`web`), exposes the app port (e.g. `3000`), mounts `./data` volume for the SQLite file, reads config (port, basic-auth password for the export route, etc.) from a `.env` file (not committed — `.env.example` committed instead).
- **EC2 deployment procedure** (to be written up verbatim in a `DEPLOY.md` once the app exists):
  1. `git clone <repo>` on the EC2 instance
  2. `cp .env.example .env` and fill in values
  3. `docker compose up -d --build`
  4. Point the custom domain's DNS (A record) at the EC2 instance's public IP (or use an Elastic IP so the address is stable across instance stop/start)
  5. (Fast-follow, not Phase 1 blocker) put a reverse proxy / TLS terminator (e.g. Caddy or nginx + Let's Encrypt) in front of the container so the custom domain serves over HTTPS — flag this explicitly as needed before real public launch, even though it's not required to get the container itself running.
- No CI/CD pipeline in Phase 1 — deploys are manual `git pull && docker compose up -d --build` on the box, per [[CLAUDE.md]].

## 8. Build checklist

- [x] Scaffold Next.js + TypeScript + Tailwind project (Next.js 16, Turbopack, Tailwind v4)
- [x] Set up brand tokens (colors, fonts) — court blue / luminous green / court lines in `app/globals.css`; Bebas Neue (display) + Inter (body) via self-hosted `next/font/google`
- [x] Build section shells for all 8 zones with real copy (Hero, Creation, Management, Players, Facilities, Roadmap, Final CTA, Footer)
- [x] Implement scroll-tied ball animation (`CourtBall`) + animated court-line dividers (`CourtLineDivider`) between zones
- [x] Write copy for each zone (first pass — good enough to ship, revisit anytime)
- [x] Build waitlist modal component (`components/waitlist/`) with client-side + server-side validation
- [x] Build `POST /api/waitlist` route + SQLite schema (auto-created on first run)
- [x] Build `GET /api/waitlist/export` (basic-auth protected CSV export)
- [x] `prefers-reduced-motion` fallback: the traveling ball is hidden entirely; entrance/reveal animations drop their movement and shorten duration (see `useReducedMotion` in `CourtBall`, `Hero`, `Reveal`)
- [x] Responsive pass: mobile layout stacks zones, ball animation adapts its horizontal range on narrow screens
- [x] Write `Dockerfile` (standalone output, multi-stage Alpine build) + `docker-compose.yml` + `.env.example`
- [x] Local Docker build/run smoke test — image builds, page serves, waitlist POST + CSV export work, data persists across `docker restart` via the mounted `./data` volume
- [x] Write `DEPLOY.md` with the exact EC2 clone/build/run/DNS steps
- [x] Update [[CLAUDE.md]] status log
- [ ] Deploy to the actual EC2 instance + point custom domain (manual step for the user)

## 9. Open decisions (flagged, not blocking initial build)

- Final copy/headlines — draft during build, not locked in this plan.
- Exact font pairing.
- Whether the EC2 box needs a reverse proxy/TLS layer before or right after first deploy (recommended: before any real public traffic, since waitlist emails should not be submitted over plain HTTP).
