# Soma — Landing Page

Single-page bilingual (EN/JA) marketing site for Soma, production scheduling for
high-mix machine shops. React + TypeScript + Tailwind CSS v4 + Motion, built with
Vite and deployable as a static site to GitHub Pages.

Copy source of truth: the Soma Scheduler brochure (v2) and BRD in the Manganese
project. Register is plain, declarative and benefit-first — no narrative
flourishes. Sections: Hero → Product → How it works → Team → CTA.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build   # output in dist/
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages (enable Pages → Source: GitHub Actions in the
repo settings). `base: './'` in `vite.config.ts` makes the build path-relative,
so it works on any Pages URL.

## Before launch

- Confirm the contact address in `src/lib/contact.ts` — `hello@soma.app` is a
  placeholder standing in for the real Soma address, and every CTA points at it.
