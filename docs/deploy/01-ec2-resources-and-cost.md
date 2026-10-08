# Deployment history

## Current: GitHub Pages + Formspree (since 2026-10-08)

- Static export built and deployed by GitHub Actions (`.github/workflows/pages.yml`) to GitHub Pages, served at `https://greppa.org`.
- Waitlist form posts to Formspree. Hosting cost is $0 on Pages; Formspree has a free tier (check their current limits).
- The domain `greppa.org` is registered at GoDaddy (renewal billed there). Email runs on Google Workspace (billed separately).

## Retired: single AWS EC2 instance (2026-10-01 → 2026-10-08)

Dockerized Next.js + SQLite behind Caddy on one EC2 instance with an Elastic IP (~$13/month). Decommissioned when the site moved to GitHub Pages: the instance, its Elastic IP, and its security group were removed. Resource identifiers are deliberately not recorded here because this repo is public; AWS Console / CLI is the source of truth for anything still provisioned.
