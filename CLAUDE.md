# Greppa

## Maintenance rule for this file

**This file is the overarching guidance document for the entire project.** Whenever a feature is added, a decision is made, an architecture choice changes, or scope shifts, update the relevant section of this file in the same session. Do not let it drift out of date — this is the single source of truth for what Greppa is and how it's being built.

---

## What Greppa is

Greppa is a pickleball tournament management and tournament creation platform.

The core product experience: a user starts by **creating a tournament through a chat-based interface** — a conversational flow that guides them quickly from "I want to run a tournament" to a fully configured event, without wading through traditional multi-page forms. Once a tournament exists, the user moves into **managing** the whole tournament (brackets, scheduling, matches, results, communications, etc.).

From that foundation, the product is meant to expand outward into a broader suite of services for pickleball operations:

- **Tournament creation** — chat-guided setup (format, dates, divisions, rules, etc.)
- **Public tournament page** — the moment a tournament is created, Greppa publishes a live public page for it that the organizer shares with players/audience: players pick their division, choose where to play, and pay online to register. This is the bridge between creation and management — no separate signup tool needed.
- **Tournament management** — running the event end-to-end once created, including a registration & payments dashboard (who's registered, what's been paid, earnings/financials) alongside the court-management side of things
- **Player management** — rosters, registration, player profiles/history, communication
- **Facility & utility management** — court scheduling/utilization, maintenance, resource planning for pickleball facilities
- **Guided workflows** — helping users (organizers, facility operators) navigate decisions they don't have expertise in
- **Supply chain / vendor integrations** — plugging in equipment, balls, nets, and other supply needs directly into the platform (future extension)

This is a phased build. Phase 1 (current) is **not the app itself** — it's a marketing landing page to validate interest and build a waitlist ahead of building the real product.

## Brand

- **Name:** Grepa — spelled **GREPPA** (double P). Always use "Greppa" in prose/branding.
- **Domain concept:** pickleball court aesthetics — the site should feel like moving through a pickleball court, not like a generic SaaS landing page.
- **Color theme:**
  - Court blue (primary/background) — evokes a professional pickleball court surface
  - Luminous/optic green (accent) — the pickleball ball color, used for CTAs, highlights, energy
  - Court-line white/off-white for structure, lines, contrast
- **Design ambition:** should look genuinely uncommon — not a template SaaS landing page. Concept: scrolling through the page feels like moving through different zones of a pickleball court (baseline → kitchen/non-volley zone → net → far court, etc.), with a pickleball motif that visually guides the user down the page (e.g., a ball that travels/bounces along the scroll path, court lines that animate in as dividers between sections).
- This is a distinctive, motion-forward, court-textured design — not corporate-flat.

## Phase 1 scope: Waitlist landing page

- **Pure marketing site.** No real app functionality, no auth, no backend logic beyond capturing waitlist signups.
- **Primary CTA:** "Join Waitlist"
- Clicking the CTA opens a small form: **email required, name optional**, submit button. That's the entire conversion flow.
- Content should communicate the gist of the product: tournament creation (chat-based), tournament management, player management, facility/utility management, and the broader vision (guided workflows, supply chain plug-ins) as "coming" framing.
- Visual experience should follow the court-journey concept described above under Brand.

See `docs/plans/` for the detailed execution plan for this phase.

## Deployment model

- **Static site on GitHub Pages**, served at `https://greppa.org`. The app is a Next.js static export (`output: "export"`); a GitHub Actions workflow (`.github/workflows/pages.yml`) builds and deploys on every push to `main`. The repo lives in the `ParadigmAI` GitHub org and is public.
- **No server, no database, no Docker.** Waitlist submissions are POSTed straight from the browser to **Formspree**. The endpoint is a public URL supplied at build time via the repo Actions *variable* `FORMSPREE_ENDPOINT` (exposed to the app as `NEXT_PUBLIC_FORMSPREE_ENDPOINT`).
- `public/CNAME` pins the custom domain. DNS lives at GoDaddy: four `A` records on `@` to GitHub Pages' IPs plus a `www` CNAME to the org's `github.io` host (exact values in `README.md`). Email DNS records (Google Workspace) are unrelated and must be left alone.
- Because the repo is public, never commit secrets, infra identifiers, or personal data to it. Keep `docs/` and this file free of account IDs, IPs, and credentials.

## Repo structure

- `docs/plans/` — execution plans, one per phase/feature. Check here for the current plan before starting implementation work.
- `docs/deploy/` — deployment history/notes. The AWS EC2 setup was decommissioned on migration to GitHub Pages; keep identifiers out of here (public repo).
- `docs/playbooks/` — product-agnostic, portable methodology docs distilled from this project, written so they can be handed to a *different, unrelated* future project rather than describing Greppa specifically. `01-landing-page-and-deployment-playbook.md` covers the full stack/design/containerization/AWS/DNS approach and every real gotcha hit along the way.
- `app/` — Next.js App Router. `page.tsx` assembles the landing page from `components/sections/`; the app is a fully static export (no API routes).
- `components/` — `sections/` (the 8 court-journey zones + their visuals), `waitlist/` (context, button, modal — the join-waitlist flow used across the page), plus shared pieces (`CourtLineDivider`, `CourtBackdrop`, `Reveal`, `StickyNav`, `Footer`).
- `.github/workflows/pages.yml` / `public/CNAME` / `.env.example` — GitHub Pages deploy, custom domain, and the Formspree endpoint variable, per the Deployment model above.
- Stack: Next.js 16 (App Router, Turbopack, TypeScript) + Tailwind CSS v4 + Framer Motion. `AGENTS.md` at the repo root is auto-generated by Next.js and points at version-matched docs in `node_modules/next/dist/docs/` — read it before assuming any Next.js API from training knowledge, since v16 changed things (Turbopack by default, fully-async request APIs, etc).

## Status log

- 2026-09-29 — Project initialized. CLAUDE.md and docs/plans/ created.
- 2026-09-29 — Phase 1 waitlist landing page built: 8-zone court-journey scroll experience (Hero → Creation → Management → Players → Facilities → Roadmap → Final CTA → Footer), scroll-tied traveling-ball guide (`CourtBall`), animated court-line dividers, waitlist modal (email required/name optional) backed by `POST /api/waitlist` + SQLite, basic-auth CSV export at `GET /api/waitlist/export`. Dockerized (multi-stage Alpine build, standalone Next.js output) and verified locally: image builds, container serves the page, waitlist signups persist across container restarts via the mounted `./data` volume. Not yet deployed to EC2 — that's a manual step for the user per `DEPLOY.md`.
- 2026-09-29 — Design system redesigned to match a reference site (actl.me) at the user's request: navy/cream/lime palette (`--navy #0a2952`, `--cream #ede6c4`, `--lime #aaf136`, plus `--clay`/`--moss` secondary accents), bold serif (Georgia) headlines with tight negative tracking paired with a self-hosted grotesque sans (Schibsted Grotesk), an always-visible floating pill header (`Header.tsx`, replacing the old fade-in `StickyNav`), alternating light/dark section backgrounds, pill buttons with an arrow glyph and hover-lift instead of hover-scale, and a giant lime closing statement in the footer.
- 2026-09-29 — Following user feedback that a pinned multi-stage hero (crossfading 3 court-zone "stages", à la actl.me's scrollytelling) produced overlapping/ghosted headline text, and that the traveling ball was unwanted: **removed `CourtBall` entirely**, **collapsed the Hero back to a single static section** (no pinned scroll-journey mechanic), and **stripped all scroll-triggered fade/slide-in animations** (`Reveal`, the court-line divider draw-in, and the visuals' stagger-ins are now static). The only remaining motion on the page: `CourtSideRail`'s continuous scroll-linked marker (a minimap on the right edge, desktop only — this is what satisfies "a pickleball court animation on the side"), the header/button hover states, and the waitlist modal's open/close transition. Lesson for future work in this repo: avoid opacity-crossfading large headline text tied to scroll position — even a brief overlap window reads as broken; prefer this project's default of static, non-animated section transitions unless asked for scroll-linked motion again.
- 2026-09-29 — Content/copy pass: removed the footer email link (no support email exists yet). Added a "Tournament Registration" zone (id `publish`) right after Creation, covering the public shareable tournament page (players pick a division and pay online to register); folded a registration/payments dashboard mention into the Tournament Management zone's bullets. Removed the Player Management marketing zone from the landing page entirely (kept out of the scroll — not judged impactful enough for Phase 1 messaging; player management remains a real product capability, just not a dedicated section here) and dropped its header nav link. Restructured every `Zone`: the feature name is now the dominant bold headline (`title`), with the punchy one-liner demoted to a smaller secondary `tagline` underneath — previously it was inverted (a witty headline dominated, the feature category was a small eyebrow), which buried what each section was actually about. Header nav labels were made more literal to match ("Creation" → "Tournament Creation", "Management" → "Tournament Management"). Hero was also cut down: dropped the subtext line and shrank the section/type scale after a first pass overflowed the viewport, and now reads "Meet Greppa" (small, lime) over "The full-time manager of your pickleball court." (the big headline).
- 2026-10-01 — **First deploy (since retired; see the 2026-10-08 entry):** the site ran in Docker on a single AWS EC2 instance (Next.js standalone + SQLite waitlist DB + a Gmail SMTP signup notification), fronted by Caddy for automatic Let's Encrypt HTTPS, with `greppa.org` (registered at GoDaddy) pointed at an Elastic IP. Lessons that came out of it and still matter: (1) `app/layout.tsx`'s `metadataBase` and the `PublicPageVisual` mock use `greppa.org`; (2) once a domain's DNS is live, never run an auto-HTTPS config (Caddy/Certbot) that references it from a laptop — it fires real ACME requests against Let's Encrypt's rate limits; (3) an apparent 'site not loading' report right after a DNS change was local/ISP DNS caching, not a server bug; (4) empty directories aren't tracked by git (`public/.gitkeep` fixed a broken Docker COPY).
- 2026-10-01 — Repo pushed to GitHub. The EC2 instance was resized `t3.small` → `t3.micro` for Free Tier (needs a swapfile to survive `next build`).
- 2026-10-01 — Replaced the default create-next-app favicon with a lime pickleball (`app/icon.svg` as the primary modern favicon via Next.js's metadata file convention, plus a regenerated `app/favicon.ico` for older browsers — both rasterized from the same SVG with a throwaway local `sharp`/`to-ico` script, not a project dependency).
- 2026-10-02 — Added `/privacy` and `/terms` pages (basic draft policies appropriate for a pre-launch waitlist — not reviewed by a lawyer; revisit before the real product handles payments or more personal data) and the registered company address to the footer in small print: Greppa, 8415 Pulsar Pl Ste 300, Columbus, OH 43240-4032, United States.
- 2026-10-02 — Set up email on the domain: **Google Workspace** (Business Starter, ~$7–$8.40/user/month), chosen over free alternatives (Zoho Mail free tier, GoDaddy free forwarding, Cloudflare Email Routing) because the user wanted real separate mailboxes with the actual Gmail app/IMAP experience. Google's native GoDaddy integration auto-added MX records, the domain-verification TXT record, SPF, and DKIM with no manual DNS entry needed. One manual fix required: GoDaddy had separately auto-added its own default DMARC record (`p=quarantine`, reporting to a GoDaddy-internal address) alongside the `p=none` one requested — two TXT records at the same `_dmarc` name breaks DMARC validation per spec (exactly one is expected), so the GoDaddy-generated one needs deleting, keeping only `v=DMARC1; p=none;`. If email deliverability issues ever come up, check `_dmarc.greppa.org TXT` first for a duplicate.
- 2026-10-02 — Wrote `docs/playbooks/01-landing-page-and-deployment-playbook.md` at the user's request — a generalized, product-agnostic distillation of everything settled on in this project (stack, design/motion lessons, the two-service Caddy container pattern, every AWS/DNS/Docker gotcha hit, and the working-process lessons), meant to be carried over to a future, unrelated landing-page project rather than re-derived from scratch. Keep this playbook generic if it's ever updated — it should never accumulate Greppa-specific details.
- 2026-10-08 — **Migrated off AWS to GitHub Pages + Formspree.** Converted the app to a static export; deleted the waitlist API routes, SQLite/nodemailer code, Dockerfile, docker-compose, Caddyfile and DEPLOY.md; the signup modal now POSTs JSON to Formspree (with a honeypot field). Added a Pages deploy workflow and `public/CNAME` (`greppa.org`); the repo moves to the `ParadigmAI` org and goes public, with infra identifiers scrubbed from the current files (they remain in older git history — non-secret IDs only). The old server's waitlist DB was backed up locally before shutdown and held 0 signups. Privacy page now names Formspree as the form processor.
