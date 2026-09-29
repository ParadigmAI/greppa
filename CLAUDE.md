# Greppa

## Maintenance rule for this file

**This file is the overarching guidance document for the entire project.** Whenever a feature is added, a decision is made, an architecture choice changes, or scope shifts, update the relevant section of this file in the same session. Do not let it drift out of date — this is the single source of truth for what Greppa is and how it's being built.

---

## What Greppa is

Greppa is a pickleball tournament management and tournament creation platform.

The core product experience: a user starts by **creating a tournament through a chat-based interface** — a conversational flow that guides them quickly from "I want to run a tournament" to a fully configured event, without wading through traditional multi-page forms. Once a tournament exists, the user moves into **managing** the whole tournament (brackets, scheduling, matches, results, communications, etc.).

From that foundation, the product is meant to expand outward into a broader suite of services for pickleball operations:

- **Tournament creation** — chat-guided setup (format, dates, divisions, rules, etc.)
- **Tournament management** — running the event end-to-end once created
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
- (App source structure to be documented here once Phase 1 implementation begins.)

## Status log

- 2026-09-29 — Project initialized. CLAUDE.md and docs/plans/ created. Phase 1 (waitlist landing page) plan in progress.
