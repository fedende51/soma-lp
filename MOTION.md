# SOMA / A clear plan — motion system

Current creative direction and 32-second scene plan: LAUNCH-CREATIVE.md.

- Workflow: Product Launch Motion from the user-supplied AbubakrChan repository, cloned commit b25b1630ecdebfe1fccf513256b2e7b8fd91a2c2. Read core skill, original prompts, and technique guide. Use one persistent surface, pure seek(t), closed-form critically damped springs, independently timed blur/content swaps, direct cursor drags, and four temporal subframes per master frame.
- Look: warm paper #f4f5f0, near-black #121b1b, purposeful green #087467, soft mint #b9f0ce. Manrope, with Courier New reserved for metadata. No gaming imagery, arpeggiated synth melody, sparkle particles or neon chrome.
- Product truth: one changed order, human review of downstream effects, protected pinned work, reusable routing, independent repeat-order copy. All sample identifiers and quantities are illustrative. No live feeds or customer-performance claims.
- Music first: licensed Classical vibes 4 by Grigoriy Nuzhny, approximately 93.75 BPM. Main narrative beats follow 2.56-second phrases, with the main reveal around eight seconds. Four understated click peaks align to the actual date, drag, apply and reuse actions. Raw music is not a public web asset.
- Formats: 1920x1080 and a separately composed 1080x1350 phone version, both 60 fps, 32 seconds, H.264/yuv420p/BT.709 plus AAC. Portrait machine rows, typography and content are re-laid out rather than cropped. Drafts use 30 fps; phone draft height is 676 (even for H.264).
- Rendering: video/render-flow.mjs (--draft, --stills, --portrait), video/mix-licensed.py, and video/review-moving.mjs. Preview controls are authoring-only. Encoded frames and seam checks live in artifacts/.
- Site: use one short GSAP hero entrance and restrained one-time section entrances. Respect reduced motion. Inline film only; compact SVG controls, explicit sound/caption controls and native fullscreen fallback. No autoplay with sound.
- Limits: actual Chrome playback and timed visual captures support the motion review. This environment rejects audio input, so audio was measured and sourced from a professional recording; no listening audition is claimed. Physical iPhone/Safari is not available.

References reviewed: Linear's 2026 UI-refresh rationale (https://linear.app/changelog/2026-03-12-ui-refresh) and Ramp's Q2 2026 launch (https://ramp.com/new-on-ramp-q2-2026). The inference for SOMA is a short promise and focused workflow evidence, with clear hierarchy; these are not claims that all startups share one style.


## Logo-ring revision

The owner requested the supplied blue/cyan ring palette while retaining white. Logo layers use the exact source image, clipped at its transparent radial gap (radius 52 in a 128×125 viewBox). The outer ring scales 0→1 while rotating −210°→0°; the inner scales 0→1 while rotating +230°→0°. The name fades in after the ring arrival, at 0.96–1.28s. Header runs once per document load; footer once on first entry. Film uses the same time-computed entrance. No splash screen or loop.

Website information fades from 0 and moves down 16px into position, 620ms duration / 90ms hierarchy staggering. Reduced motion skips all rotation and translation. Missing motion scripts reveal the page via a short fallback; JavaScript-disabled visitors see all content and the complete logo. `scripts/brand-motion-qa.mjs` records normal-speed playback and numeric motion samples at phone, tablet and desktop widths.

Reference: Hexacore by Nija Design / Nija Works, https://dribbble.com/shots/27043403-Hexacore-IT-Consulting-Animation . Played in-browser and reviewed as a local contact sheet; timing/staging informs this revision. No artwork or assets are incorporated from that reference.


The logo layers now crop the two approved original PNGs in their 1400-unit source coordinates. Both ring layers rotate around (700, 593). The delayed name is a cropped image SVG, not typeset text; its timing is unchanged. The dark closing panel in the film uses the original white lettering from `logo_soma_dark.png`. Brand gradients are static within each settled site view and are computed from time in the film, without adding an ambient loop.
