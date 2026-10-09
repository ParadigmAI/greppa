# Greppa — marketing site

Marketing landing page for Greppa, a pickleball tournament creation and management
platform. See [`CLAUDE.md`](./CLAUDE.md) for the full product context and
[`docs/plans/01-waitlist-landing-page.md`](./docs/plans/01-waitlist-landing-page.md) for
the plan behind this phase.

## Stack

Next.js (App Router, TypeScript, static export) + Tailwind CSS + Framer Motion. The CTA links to the
app at <https://app.greppa.org>. Hosted on GitHub Pages at <https://greppa.org>.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run build` writes the static
site to `out/`.

## Deployment

Every push to `main` runs `.github/workflows/pages.yml`, which builds the site and
publishes it to GitHub Pages. `public/CNAME` sets the custom domain.

DNS (at the registrar): four `A` records on `@` pointing to GitHub Pages
(`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a
`CNAME` for `www` pointing to `<org>.github.io`.
