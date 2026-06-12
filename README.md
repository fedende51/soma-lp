# Argus — Landing Page

Single-page bilingual (EN/JA) marketing site for Argus, a production intelligence
platform for manufacturers. React + TypeScript + Tailwind CSS v4 + Motion, built
with Vite and deployable as a static site to GitHub Pages.

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

- Replace `VIDEO_URL_PLACEHOLDER` in `src/components/Hero.tsx` with real
  abstract factory-floor / production-line footage (mp4, muted, loopable).
