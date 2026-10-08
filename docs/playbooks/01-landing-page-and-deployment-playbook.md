# Landing page & deployment playbook

A portable, product-agnostic playbook distilled from building and deploying
the Greppa waitlist landing page end to end — stack choices, the
containerized deployment pattern, and every real gotcha hit along the way,
with the fix baked in. Written 2026-10-02 so it can be handed to a future,
unrelated project without re-deriving any of this from scratch.

This is deliberately generic. Nothing here is specific to Greppa, pickleball,
or any particular brand — swap in your own product name, copy, and domain and
the approach carries over directly.

---

## 1. Tech stack

- **Next.js (App Router, TypeScript, Turbopack)** — one codebase for the
  static marketing content and the handful of API routes a waitlist needs
  (signup, export). No separate backend service.
- **Tailwind CSS v4** — CSS-based `@theme` tokens in `globals.css`, not a
  `tailwind.config.js`. Define brand colors as named tokens there once,
  reference them everywhere as utility classes.
- **Framer Motion** — for the motion that's actually worth having (hover
  states, scroll-linked decorative elements, a modal's open/close
  transition). See §4 for where *not* to use it.
- **`better-sqlite3`** for lead storage. A hosted database is overkill for an
  email-capture form; a single SQLite file on a mounted volume is simpler,
  free, and durable enough for this phase. Revisit only if volume or
  multi-instance writes ever become a real constraint.
- **Self-hosted fonts via `next/font/google`** (or a plain system font stack
  like Georgia for a serif headline) — no runtime dependency on an external
  font CDN, keeps the Docker image self-contained.

## 2. Content & design approach

- **Structure:** hero → a handful of feature sections (each: one clear
  headline naming the actual feature, a secondary punchy tagline, a short
  body paragraph, 2–4 bullets, and a simple illustrative visual) → final CTA
  → footer. Alternate light/dark section backgrounds for visual rhythm rather
  than a uniform wall of one color.
- **Headline hierarchy — get this right the first time:** the *feature name*
  is the dominant, bold headline. The witty/punchy one-liner is secondary,
  smaller, in an accent color. (We built this backwards initially — a clever
  headline dominated while the actual feature category was a tiny eyebrow —
  and had to invert it once it was pointed out that the sections didn't
  communicate what they were about at a glance.)
- **If matching a reference site's design:** don't eyeball it from
  screenshots. Fetch the actual HTML and CSS (`curl` the page and its
  stylesheet, `grep` for `:root` custom properties, `@font-face` rules, and
  key selectors) to extract the *exact* color hex values, font stack, and
  spacing scale. Guessing from a visual impression produces a worse match
  than five minutes of reading the real CSS.
- **Lead-capture UX:** one modal, opened from the primary CTA. Email
  required, name (or anything else non-essential) optional. Inline success
  state in the same modal — no redirect, no second page. Resist the urge to
  add more fields; every field is friction a waitlist signup doesn't need.
- **Favicon:** an SVG (`app/icon.svg`, Next.js's metadata-file convention —
  zero config needed) as the primary icon for modern browsers, plus a
  regenerated `app/favicon.ico` for older ones. Rasterize the ICO with a
  throwaway local script (`sharp` + `to-ico`, installed in a scratch
  directory, never added to the project's actual dependencies) rather than
  hand-authoring a separate bitmap.
- **Legal basics before going live:** a Privacy Policy and Terms page (basic
  drafts are fine for a pre-launch page that only collects an email — just be
  upfront with the user that this isn't a substitute for real legal review
  once the product handles payments or more personal data), plus the
  registered company name/address in the footer's small print.

## 3. Motion — what to use, what to avoid

Hard-won lesson from this project: **a pinned, scroll-crossfaded multi-stage
hero is a trap.** It looks impressive in concept (stay pinned, cross-fade
between 2–3 "stages" as the user scrolls) but large headline text at
partial opacity during the crossfade window reads as visibly broken/ghosted
overlapping text — not a subtle transition. This was built, shipped, and then
had to be ripped out and replaced with a single static hero after the user
reported it looked broken on their own screenshots.

**Default to:** static sections, no scroll-triggered fade/slide-in
animations on content. Things appear as the user scrolls to them — full stop,
no transition. This reads as clean and intentional, not undercooked.

**Motion that's fine and worth keeping:**
- Button hover states (lift/scale, not scroll-linked)
- A modal's open/close transition
- A small, continuous, decorative scroll-linked element (e.g. a progress
  marker on a thin sidebar) — *if* the product's visual concept genuinely
  calls for it, is literally the only thing on the page doing this, and
  isn't layered behind other content where it could overlap or distract
- Respect `prefers-reduced-motion` for anything that isn't static

If the user explicitly asks for heavier scroll-driven motion, build it — but
flag the overlap risk for anything involving large/stacked text, and
actually look at it mid-scroll (not just at rest) before calling it done.

## 4. Containerization

**Two Docker Compose services, not one:**

```yaml
services:
  web:
    build: .
    restart: unless-stopped
    expose:
      - "3000"              # NOT published to the host — only Caddy is
    environment:
      - SOME_SECRET=${SOME_SECRET:?set it in .env}
    volumes:
      - ./data:/app/data

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data        # cert storage — must persist across redeploys
      - caddy_config:/config
    depends_on:
      - web

volumes:
  caddy_data:
  caddy_config:
```

```
# Caddyfile
yourdomain.com, www.yourdomain.com {
    log {
        output stdout
        format console
    }
    reverse_proxy web:3000
}

# Fallback: Let's Encrypt can't issue a cert for a raw IP, so keep the
# bare Elastic IP serving plain HTTP for quick checks / as a safety net.
:80 {
    log {
        output stdout
        format console
    }
    reverse_proxy web:3000
}
```

Why this shape:
- **Caddy, not a manually-managed nginx+certbot setup**, for automatic
  HTTPS. Point DNS at the server, list the domain in the Caddyfile, done —
  certificate issuance and renewal are fully automatic.
- **The app container is never published to the host.** Caddy reaches it by
  Compose service name over the internal network. This means the app is
  literally unreachable except through Caddy — no accidentally-exposed
  plaintext port.
- **Turn on Caddy's access log from day one** (`log { output stdout }` in
  every site block). Without it, Caddy logs almost nothing about ordinary
  traffic, which means zero visibility if something needs debugging later —
  we had to retroactively add this mid-project to debug a user-reported
  issue, and it immediately gave a clear answer (every request was
  succeeding; the earlier report was a resolved DNS-caching issue).

**Dockerfile:** standard 3-stage build (deps → builder → runner), Next.js
`output: "standalone"` in `next.config.ts` so the final image only needs the
traced subset of `node_modules`, non-root user in the final stage, and a
mounted volume for anything that needs to persist (the SQLite file here).

**Gotchas that will bite you if you don't know about them:**

- **An empty directory your Dockerfile `COPY`s from won't exist after a
  fresh `git clone`.** Git doesn't track empty directories. If `public/` (or
  any dir your build process expects) is empty locally, it was never
  actually committed — add a `.gitkeep` file to it, or the build breaks on
  the very first deploy with a confusing "not found" error on the `COPY`
  step, even though it works fine locally (because locally the directory
  still physically exists on disk from scaffolding).
- **A bind-mounted data directory gets created by Docker as root on first
  run if it doesn't already exist**, which breaks the app if the container
  runs as a non-root user (good practice) — it can't write to its own data
  directory (`SQLITE_CANTOPEN` or equivalent). Pre-create the directory and
  `chown` it to the container's uid *before* the first `docker compose up`:

  ```bash
  mkdir -p data
  sudo chown <container-uid>:<container-uid> data
  ```

- **Once a domain's DNS actually points at a server, any machine running the
  real Caddyfile (or any ACME client) for that domain will attempt a real
  certificate request against Let's Encrypt's production CA** — including
  your own laptop, if you spin up the compose stack locally to sanity-check
  it. This happened in this project: a "quick local test" of the updated
  `docker-compose.yml` fired real ACME requests the instant it started,
  because DNS was already live. It's harmless if caught immediately
  (`docker compose down`), but it counts against Let's Encrypt's rate
  limits. **Test Caddy/cert config changes with a non-resolving placeholder
  domain, or just deploy straight to the real server.**
- **On a RAM-constrained instance (1GB or less), `next build` inside the
  Docker build step can get OOM-killed.** Add a swapfile before the first
  build, and actually verify it's sufficient with a real `docker compose
  build --no-cache` (not just a cached rebuild, which proves nothing) —
  check `free -h` during the build to confirm swap usage if you want to know
  it's genuinely load-bearing and not just there "to be safe."

  ```bash
  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
  ```

## 5. AWS / EC2 deployment

**Provisioning (via AWS CLI, not the Console, so it's scripted and
reproducible):**

1. Security group: SSH (22) restricted to the deploying machine's current
   public IP only (`curl https://checkip.amazonaws.com`), 80 and 443 open to
   everyone (it's a public website).
2. A dedicated EC2 key pair for this project.
3. Instance: Amazon Linux 2023, `t3.micro` is fine for a landing page's
   traffic level and is free-tier eligible for new-ish accounts — just
   budget for the swapfile (see §4) since 1GB RAM is tight for the build
   step. IMDSv2 enforced (`HttpTokens=required`), encrypted EBS root volume.
4. Elastic IP, associated with the instance, so the public address survives
   stop/start.
5. Install Docker + the Compose plugin + git via the instance's package
   manager.

**GitHub access from the instance:** generate a dedicated SSH key *on the
instance itself* (the private half never leaves it) and register the public
half as a **read-only Deploy Key** on the repo. Don't put a personal access
token or your own SSH key on a server.

**Deploy workflow (manual, not CI/CD — appropriate for this scale):**
```bash
git clone <repo> myapp && cd myapp
cp .env.example .env   # fill in real secrets
mkdir -p data && sudo chown <uid>:<uid> data
docker compose up -d --build
```
Redeploys are just `git pull && docker compose up -d --build` on the box.

**Running a second, unrelated site on the same instance** (if reusing the
same EC2 box rather than spinning up a new one): you *can't* just run a
second independent `caddy` container bound to 80/443 — only one process can
bind those ports. Two real options:

- **Simplest, most isolated: a separate EC2 instance per site.** No shared
  blast radius, no port contention, each site's resource usage and security
  group are independent. Costs more (another `t3.micro` + Elastic IP, a few
  dollars/month), but avoids all of the complexity below. Usually the right
  default unless there's a specific reason to consolidate.
- **Consolidated: one shared "edge" Caddy instance for the whole box.** Run
  Caddy as its own standalone Compose project (not bundled into either
  site's `docker-compose.yml`), bound to 80/443, on a Docker network that
  every site's app container also joins. The shared Caddyfile gets one site
  block per domain, each `reverse_proxy`-ing to that site's container by
  name:

  ```
  siteonedomain.com {
      reverse_proxy siteone-web-1:3000
  }
  sitetwodomain.com {
      reverse_proxy sitetwo-web-1:3000
  }
  ```

  This works and keeps cost down to one instance, but it means a bad deploy
  or resource spike on one site can affect the other (shared CPU/RAM, shared
  Caddy process), and tearing down one site requires care not to disturb the
  other's Caddy config. Reasonable for two low-traffic landing pages;
  reconsider if either site gets real production traffic.

## 6. Domain & DNS

1. Register the domain wherever's convenient (no need to move DNS
   management to AWS/Route 53 unless there's a specific reason to) — a
   registrar's native DNS dashboard is enough.
2. Add two `A` records pointing at the Elastic IP: the bare domain (`@`) and
   `www`.
3. List the real domain(s) in the Caddyfile and redeploy. Caddy requests and
   renews the certificate automatically the first time it sees traffic for
   that domain — no manual certbot steps, ever.
4. **DNS propagation reality check:** a brand-new domain or record change can
   take anywhere from minutes to (rarely) ~24h to propagate, and — this
   tripped us up twice — your own machine's local DNS resolver can lag
   *well behind* the real, fully-propagated state. Before concluding
   something's broken, check against a major public resolver directly:

   ```bash
   dig +short yourdomain.com A @8.8.8.8
   dig +short yourdomain.com A @1.1.1.1
   # bypass local DNS entirely to test the real server:
   curl -s -I --resolve yourdomain.com:443:<elastic-ip> https://yourdomain.com/
   ```

   If those resolve correctly but your own `dig`/browser doesn't, it's local
   caching, not a real problem — flush your resolver or just wait.

## 7. Email on the domain (if needed)

For "a few real mailboxes," evaluated in order of effort/cost:

| Option | Cost | Fit |
|---|---|---|
| Registrar's free forwarding | $0 | Mail just needs to land in an inbox you already check — no real send-as capability |
| Zoho Mail free tier | $0 | Up to 5 real mailboxes, webmail + mobile app only (no IMAP) |
| Google Workspace | ~$7–8.40/user/month | Real Gmail, IMAP/desktop clients, Calendar/Drive — worth it if you want the actual Gmail experience |

If using Google Workspace with a registrar that has a native integration
(GoDaddy does), domain verification, MX, SPF, and even DKIM can all be
auto-configured with zero manual DNS entry. **Still check for a duplicate
DMARC record afterward** — some registrars auto-add their own default
`_dmarc` TXT record, and having two TXT records at `_dmarc` breaks DMARC
validation (exactly one is valid per spec). `dig _dmarc.yourdomain.com TXT`
to check; delete whichever one you don't want, keep a single
`v=DMARC1; p=none;` to start (safe "monitor only" mode before tightening to
`quarantine`/`reject` once you've confirmed mail flows cleanly).

## 8. Navigation correctness (easy to miss)

Any internal link meant to return to the homepage or scroll to a homepage
section must use an **absolute path** (`/`, `/#section-id`), not a bare hash
(`#section-id`). A bare hash only works on the page that actually defines
that anchor — clicked from any other page (e.g. a Privacy Policy or Terms
page), it just appends the hash to the *current* URL and goes nowhere. Use
`next/link`'s `<Link>` for all internal navigation, not a plain `<a>` (also
needed to satisfy Next's own lint rule against it).

## 9. Cost tracking discipline

- **Research actual current pricing** (web search) when estimating cloud
  costs — don't rely on memorized numbers, since cloud pricing changes
  (e.g., AWS started charging for *all* public IPv4 addresses, attached or
  not, in Feb 2024 — a detail worth knowing before assuming an Elastic IP on
  a running instance is "free").
- Keep a living `docs/deploy/*.md` resource inventory: every real resource's
  ID, spec, and purpose, plus a cost table that's updated whenever
  infrastructure changes (e.g., after resizing an instance) rather than left
  stale.
- Instance resizing (e.g., trading build speed for a cheaper/free-tier
  instance type) can be done in place — stop, `modify-instance-attribute`,
  start — without losing the EBS volume, Elastic IP, or any data. No need to
  re-provision from scratch to change instance size.

## 10. Working process (the meta-lesson)

- **Verify, don't assume "deployed" means "working."** After every deploy:
  curl the real endpoints, do a full signup/export round-trip if there's a
  form, check the actual rendered output — not just that the build succeeded
  and the container started.
- **When something might have side effects beyond "it either works or
  errors cleanly"** (e.g., a Caddy config change once DNS is live, a
  purchase, a destructive AWS operation), stop and think about blast radius
  *before* running it, not after.
- **Keep a living project-memory file** (this project's `CLAUDE.md`) updated
  in the same session as every real decision, feature, or bug fix — include
  *why*, not just *what*, especially for anything non-obvious (a gotcha, a
  tradeoff, a reason an alternative was rejected). A future session (or a
  future you) shouldn't have to re-derive context that's already been
  worked out once.

## 6. Alternative: static export on GitHub Pages + a form service

If the site is pure marketing with an email-capture form, a server is overkill. The
simpler path that replaced the EC2/Docker setup in the project this playbook came from:

- Next.js `output: "export"` (+ `trailingSlash: true`, `images.unoptimized: true`); delete
  all API routes and server-only dependencies.
- Post the form from the browser to a form service (Formspree etc.) with
  `Accept: application/json`; add a hidden honeypot field. The endpoint is public, so pass it
  as a `NEXT_PUBLIC_` env var (in CI, from a repository *variable*, not a secret).
- Deploy with a GitHub Actions workflow (`upload-pages-artifact` + `deploy-pages`), Pages
  source set to "GitHub Actions". Put the domain in `public/CNAME`.
- GitHub Pages on a private repo needs a paid plan; a public repo is free. Before making a
  repo public, scrub account IDs/IPs/emails from docs (git history keeps old copies).
- DNS: four `A` records on the apex (185.199.108.153, .109.153, .110.153, .111.153) and a
  `CNAME` for `www` to `<owner>.github.io`. Enable "Enforce HTTPS" once the cert is issued.
  Don't touch MX/SPF/DKIM/DMARC records when editing apex records.
- Clear `.next/` after deleting routes, or stale generated types fail the type-check.
- If GitHub never issues the HTTPS cert (the Pages `/health` endpoint returns an empty object and `https_enforced=true` keeps failing with "certificate does not exist"), remove and re-add the custom domain via the Pages API to kick off issuance, then retry enforcement in a loop. Check authoritative nameservers (`dig @<ns>`) to prove DNS is right; local resolvers may keep serving the old IP for a while.
