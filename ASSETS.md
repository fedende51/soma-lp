# SOMA asset provenance

## Precision-machined ring

Generated with the built-in ImageGen tool, with transparency. Full source: `design-assets/precision-ring-source.png`. Web copy: `dist/assets/precision-ring.webp` (1100 × 1005, approximately 141 KB). The original generation remains in Codex's generated-images directory.

Exact prompt:

> Use case: product-mockup. Create one premium photorealistic 3D studio render of an illustrative CNC-machined aerospace/semiconductor diffuser ring, for SOMA manufacturing scheduling software's website. A substantial annular brushed aluminum part with a large open center, 12 evenly spaced precise counterbored bolt holes around the flange, subtle concentric toolpath marks, small notches, believable chamfered edges, satin metal, three-quarter isometric orientation tilted about 35 degrees toward the viewer. The entire single ring is visible, big and isolated, centered with generous transparent margin. Lighting: cool neutral silver top light, restrained cyan-teal rim light from the left, dramatic dark metallic interior but clear technical detail. Camera 85mm product lens, tack sharp manufactured edges, physically plausible proportions. Premium industrial product photography, not illustration or blueprint. Transparent background with actual alpha; no floor, no shadows outside the part, no text, no logos, no annotations, no UI. This is a concept component illustration, not a specific customer's actual part.

The ring is a manufacturing concept image, not a verified drawing, manufactured sample, or customer asset.

## Logo, font, and libraries

The symbol comes from the supplied SOMA logo. The wordmark is typeset. Manrope is self-hosted with its OFL license. GSAP's copyright and license header is preserved in the bundled scripts; see https://gsap.com/standard-license/.

## Current film and sound

The current film is an original coded illustration of a planner-controlled workflow. Sample orders OR-025/OR-027, quantities, machines and routes are illustrative, not customer records or measured results. The encoded film is not a screen recording. Live tracking and ERP integrations are not represented as first-phase features.

Music: Classical vibes 4 by Grigoriy Nuzhny (Mixkit #684), obtained from https://assets.mixkit.co/music/684/684.mp3 and verified on https://mixkit.co/free-stock-music/classical/. License: https://mixkit.co/license/modal/musicFree/ (checked 17 October 2026). Online promotional video and web/social ads are covered; broadcast, games and music-only redistribution are excluded. The raw track and working mix are authoring inputs outside dist; only the synchronized film and a credit notice ship on the site. Preserve the credit and check the original terms for any new use. The old synthesized soundtrack has been removed from the production assets and is retained in ignored previous-version artifacts.

The new score uses the professionally recorded piano/strings track, with four very quiet original tactile clicks and a 1.6-second ending fade. Analysis estimates 93.75 BPM. The encoded landscape soundtrack measures −15.7 LUFS and −2.6 dBFS true peak. Normal-speed moving drafts were reviewed via timed visual captures with audio muted; the agent cannot hear the audio input in this environment and does not claim an audition.

## Interface icons

Lucide Static **1.58.0**, ISC license. Eighteen selected SVGs are vendored in `dist/assets/icons/`; the complete upstream license is retained alongside them. Inline geometry is included in HTML and the small `dist/icons.js` translation helper. No icon font, emoji glyph, or external CDN is required.

The choice follows the supplied cloned Motion Primitives implementation, which imports Lucide (`components/core/dialog.tsx`, `carousel.tsx`, and website controls). No Motion Primitives component code was copied for this correction. SVGs come from the published `lucide-static` npm package; retain its license when redistributing.

## Brochure content and inline film player — 17 October 2026

The owner-supplied `soma-brochure.html` is retained in `design-assets/soma-brochure-reference.html` as a content reference. Its planning, rescheduling, capacity, records, process-library, and offline/export descriptions informed the current EN/JA marketing copy. Its placeholder email/domain, QR destination, usage figures, and alternate logo were not published. Past schedules are described as planning records; live tracking through Soma Data Feed is kept separate from the planner-maintained first phase. ERP and multi-user work remain future extensions.

That earlier revision retained the old encoded film and extracted its poster at 1.5 seconds. The current launch revision described below replaces both compositions and posters. The former board markup is retained as `dist/film/board-source.html` for historical authoring reference only.

The inline player uses native HTML video with local, accessible controls and a native-control fallback without JavaScript. Six additional Lucide Static 1.58.0 icons (pause, volume-2, volume-x, captions, maximize, minimize) are included under the existing ISC notice; the icon inventory is now 18 SVGs.

## Current website and launch direction — 17 October 2026

Warm-white, ink and green editorial direction, larger typography, a sculptural crop of the existing generated ring, and the product film immediately after the hero. No interactive sample has been restored. New poster images are rendered from the current landscape and 4:5 film sources at 8.6 seconds.

The current film replaces the previous board-based composition entirely. The legacy `dist/film/board-source.html` remains only as an authoring reference and is not loaded by the current film or included in the PHP production delivery.


## Animated original rings — 17 October 2026

The supplied `soma-mark.webp` is preserved unchanged. Two SVG clip groups separate the original inner and outer ring artwork at the transparent radial gap; each rotates/scales independently, then the typeset name fades in. No recreated logo paths, alternate logo, or external artwork is substituted. The blue/cyan palette is derived from the supplied logo; deeper shades provide accessible text on white. The website and both film compositions use the same family. Previous green films are preserved in ignored `artifacts/rings-before/`.


## Original wordmark and approved variants — 17 October 2026

Only `logo_soma_light.png` (bright backgrounds) and `logo_soma_dark.png` (dark backgrounds) are used for current logo artwork. Both files are copied byte-for-byte from the supplied sources. `Logo.png` is excluded from the current branding pipeline. SVG viewBoxes crop the name at [104, 1022, 1193, 147] and rings at [330, 228, 742, 730], preserving original pixels/transparency. There is no font substitution, recreation, recoloring or generative edit of either name. `design-assets/logo-crops.json` records source hashes, crop bounds and ring centers. Header/footer and film header use the light variant; the dark film closing panel uses the dark variant.

The site now uses the ring spectrum as a graduation, rather than a single flat blue: navy → sky blue → cyan → pale turquoise. Accessible derivative gradients serve headline text and dark-label buttons. The white canvas and existing entrance motion are preserved. Earlier statements about typeset logo names describe superseded versions.


## Owner-supplied gradient reference — 17 October 2026

The owner supplied a gradient-editor screenshot. It is retained in `design-assets/brand-gradient-reference.png`; five sampled color-handle values and inferred positions are recorded in `design-assets/brand-gradient.json`. The main left-to-right spectrum is #0a3d57 at 0%, #0e618b at 23.6%, #1ba5df at 50.2%, #03c2b0 at 84.2%, #77e4d9 at 100%. These are screenshot samples; the editor's original numeric values were not provided. Accessible text/action/dark-surface variants preserve the same hue progression. Approved light/dark PNG artwork is unchanged.
