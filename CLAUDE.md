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

- **Containerized with Docker.** The landing page ships as a Docker image/container from day one, even though it's "just" a landing page — this is intentional, done for a clean, scalable deploy path rather than for current necessity.
- **Target infra:** a single AWS EC2 instance.
  - Workflow: clone this git repo directly onto the EC2 instance, then build/run the Docker container there (not a separate CI/CD pipeline at this stage — keep it simple: `git pull` + `docker compose up` style operation on the box).
  - A custom domain will be pointed (DNS) at the EC2 instance's endpoint.
- Practical implications for how the app is built:
  - Keep the Docker setup minimal and self-contained (single `Dockerfile` + `docker-compose.yml` is enough at this stage — no k8s, no multi-service orchestration needed for a static/marketing site).
  - Favor a build that produces a small, production-ready static or lightly-served bundle (fast start time on a modest EC2 instance).
  - Waitlist form submissions need a persistence target — keep this decision explicit in the plan (see docs/plans) since there's no full backend yet; avoid over-building infra for what is fundamentally an email capture form.
  - Document the exact `git clone` → `docker build` → `docker run`/`docker compose up` steps somewhere in the repo (README or deploy doc) once the app is built, since that is the literal deployment procedure.

## Repo structure

- `docs/plans/` — execution plans, one per phase/feature. Check here for the current plan before starting implementation work.
- `docs/deploy/` — live infrastructure inventory: every AWS resource actually provisioned (IDs, specs) and its estimated monthly cost. Update this whenever infrastructure changes — it should always reflect what's really running, not what was originally planned.
- `app/` — Next.js App Router. `page.tsx` assembles the landing page from `components/sections/`; `app/api/waitlist/` holds the signup + CSV export routes.
- `components/` — `sections/` (the 8 court-journey zones + their visuals), `waitlist/` (context, button, modal — the join-waitlist flow used across the page), plus shared pieces (`CourtBall`, `CourtLineDivider`, `CourtBackdrop`, `Reveal`, `StickyNav`, `Footer`).
- `lib/db.ts` — SQLite (`better-sqlite3`) connection singleton for waitlist storage.
- `Dockerfile` / `docker-compose.yml` / `.env.example` — containerized deploy, per the Deployment model above.
- `DEPLOY.md` — literal EC2 clone → build → run → DNS steps.
- Stack: Next.js 16 (App Router, Turbopack, TypeScript) + Tailwind CSS v4 + Framer Motion. `AGENTS.md` at the repo root is auto-generated by Next.js and points at version-matched docs in `node_modules/next/dist/docs/` — read it before assuming any Next.js API from training knowledge, since v16 changed things (Turbopack by default, fully-async request APIs, etc).

## Status log

- 2026-09-29 — Project initialized. CLAUDE.md and docs/plans/ created.
- 2026-09-29 — Phase 1 waitlist landing page built: 8-zone court-journey scroll experience (Hero → Creation → Management → Players → Facilities → Roadmap → Final CTA → Footer), scroll-tied traveling-ball guide (`CourtBall`), animated court-line dividers, waitlist modal (email required/name optional) backed by `POST /api/waitlist` + SQLite, basic-auth CSV export at `GET /api/waitlist/export`. Dockerized (multi-stage Alpine build, standalone Next.js output) and verified locally: image builds, container serves the page, waitlist signups persist across container restarts via the mounted `./data` volume. Not yet deployed to EC2 — that's a manual step for the user per `DEPLOY.md`.
- 2026-09-29 — Design system redesigned to match a reference site (actl.me) at the user's request: navy/cream/lime palette (`--navy #0a2952`, `--cream #ede6c4`, `--lime #aaf136`, plus `--clay`/`--moss` secondary accents), bold serif (Georgia) headlines with tight negative tracking paired with a self-hosted grotesque sans (Schibsted Grotesk), an always-visible floating pill header (`Header.tsx`, replacing the old fade-in `StickyNav`), alternating light/dark section backgrounds, pill buttons with an arrow glyph and hover-lift instead of hover-scale, and a giant lime closing statement in the footer.
- 2026-09-29 — Following user feedback that a pinned multi-stage hero (crossfading 3 court-zone "stages", à la actl.me's scrollytelling) produced overlapping/ghosted headline text, and that the traveling ball was unwanted: **removed `CourtBall` entirely**, **collapsed the Hero back to a single static section** (no pinned scroll-journey mechanic), and **stripped all scroll-triggered fade/slide-in animations** (`Reveal`, the court-line divider draw-in, and the visuals' stagger-ins are now static). The only remaining motion on the page: `CourtSideRail`'s continuous scroll-linked marker (a minimap on the right edge, desktop only — this is what satisfies "a pickleball court animation on the side"), the header/button hover states, and the waitlist modal's open/close transition. Lesson for future work in this repo: avoid opacity-crossfading large headline text tied to scroll position — even a brief overlap window reads as broken; prefer this project's default of static, non-animated section transitions unless asked for scroll-linked motion again.
- 2026-09-29 — Content/copy pass: removed the footer email link (no support email exists yet). Added a "Tournament Registration" zone (id `publish`) right after Creation, covering the public shareable tournament page (players pick a division and pay online to register); folded a registration/payments dashboard mention into the Tournament Management zone's bullets. Removed the Player Management marketing zone from the landing page entirely (kept out of the scroll — not judged impactful enough for Phase 1 messaging; player management remains a real product capability, just not a dedicated section here) and dropped its header nav link. Restructured every `Zone`: the feature name is now the dominant bold headline (`title`), with the punchy one-liner demoted to a smaller secondary `tagline` underneath — previously it was inverted (a witty headline dominated, the feature category was a small eyebrow), which buried what each section was actually about. Header nav labels were made more literal to match ("Creation" → "Tournament Creation", "Management" → "Tournament Management"). Hero was also cut down: dropped the subtext line and shrank the section/type scale after a first pass overflowed the viewport, and now reads "Meet Greppa" (small, lime) over "The full-time manager of your pickleball court." (the big headline).
- 2026-10-01 — Pushed to GitHub: `github.com/miranthajayatilake/greppa` (private). Local git identity and `gh` auth both resolve to the `miranthajayatilake` account (`mj.jayathilaka@gmail.com`) — the other account (`mirantha-jay`) was logged out of this machine per the user's request.
- 2026-10-01 — Added a waitlist signup notification email (`lib/mailer.ts`, wired into `POST /api/waitlist`), sent via Gmail SMTP (`nodemailer`, `service: "gmail"`) rather than a new third-party transactional-email vendor — uses credentials the user already has (a Gmail App Password) instead of introducing another account to manage. Controlled by `GMAIL_USER` / `GMAIL_APP_PASSWORD` / `NOTIFY_EMAIL` env vars (documented in `.env.example` and `README.md`); if unset, signups still succeed and the app just logs a warning and skips the email — sending is never allowed to block or fail a signup. Default notify target is `mj.jayathilaka@gmail.com`. Not yet live-tested end-to-end (needs the user to generate a real Gmail App Password) as of this entry.
- 2026-10-01 — **Deployed to AWS EC2** (first live deploy of Phase 1). Provisioned directly via the AWS CLI (account `741375879015`, IAM user `greppa` with `AmazonEC2FullAccess` only — no SSM permissions, so Session Manager wasn't available; used standard SSH with a dedicated key pair instead, restricted to the deploying machine's IP): instance `i-04e7cc68e3253ba96` (`t3.small`, Amazon Linux 2023, encrypted 20GB gp3 root volume, IMDSv2 enforced with hop limit 2), security group `greppa-web-sg` (sg-050c6930c1486c37b — 22/tcp from the deploy IP only, 80/443 open), Elastic IP **100.63.10.70** (allocation `eipalloc-03581496be3d20ba1`). GitHub access from the box uses a dedicated SSH deploy key generated on the instance itself (private key never left it) and registered as a read-only Deploy Key on the repo — not a personal token. SSH private key for instance access lives at `~/.ssh/greppa-deploy.pem` on the operator's machine (ed25519, key pair name `greppa-deploy`). Live at `http://100.63.10.70/` (plain HTTP — no domain or TLS yet; see DEPLOY.md's custom-domain section for the Caddy/Let's Encrypt step when a domain is ready). `WAITLIST_EXPORT_PASSWORD` was generated and set in the instance's `.env`, held by the operator (not in this file). Gmail notification env vars were deliberately left blank on this deploy (not yet configured).
  - **Bug hit and fixed during this deploy, now documented in DEPLOY.md:** a brand-new `git clone` has no `./data` directory, so `docker compose up` auto-creates it as root — but the container runs as uid 1001 (per the Dockerfile), so SQLite couldn't open its file (`SQLITE_CANTOPEN`) and every waitlist signup failed with a generic 500 until `chown 1001:1001 data` was run on the host. DEPLOY.md's first-deploy steps now include this explicitly; apply it on any fresh clone before the first `docker compose up`.
  - `public/.gitkeep` was added because the `public/` directory existed locally but, being empty, was never actually tracked by git — a fresh clone was missing it entirely, which broke the Dockerfile's `COPY --from=builder /app/public` step. Watch for this pattern (an empty dir that looks present locally but isn't in git) if other expected-but-empty directories come up.
- 2026-10-01 — Wrote `docs/deploy/01-ec2-resources-and-cost.md`: a live inventory of every AWS resource from the deploy above, with researched `us-east-1` pricing per resource (not guessed from training data). Keep this file in sync with reality whenever infrastructure changes.
- 2026-10-01 — **Resized the EC2 instance from `t3.small` to `t3.micro`** at the user's request, to get within/near the EC2 Free Tier — they were explicit that a slower landing page is an acceptable tradeoff. Done in place (stop → `modify-instance-attribute` → start), so the EBS volume, Elastic IP, and all data were untouched; the instance ID, security group, and key pair are all unchanged from the original deploy above. Added a 2GB swapfile (`/swapfile`, persisted via `/etc/fstab`) as a safety net, since `t3.micro`'s 1GB RAM is tight for `next build` inside the Docker build. **Verified, not assumed:** ran a real `docker compose build --no-cache` on the resized instance — it succeeded, took ~75s for the build step (vs ~20s on `t3.small`), and swap usage peaked at 142MB, confirming the swapfile is load-bearing, not just precautionary. New estimate ≈ $12.84/month (≈ $5.25/month if the account is within its Free Tier window — unconfirmed, the `greppa` IAM user has no Billing/Cost Explorer permissions to check programmatically; see the cost doc for how to check via the Console).
