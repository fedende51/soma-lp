# SOMA — design audit and revision brief

## Before — 1440 / 768 / 390

Evidence: `artifacts/before/desktop.png`, `tablet.png`, `mobile.png`; original film in `artifacts/previous/soma-launch-v1.mp4`.

### P0 — Blocking

No broken primary flow observed in the previous functional verification. Booking remains an explicitly described email request, not a calendar reservation.

### P1 — Quality

| Finding | Evidence | Revision |
| --- | --- | --- |
| Product and audience are secondary to a generic promise in the first viewport. | Desktop/mobile hero | Name production planning for precision manufacturers immediately; bring a clear demo action and product identity into the hero. |
| Body copy is 11–14px; much of the demo is 7–9px. | All viewports | Use 16px body, 12px minimum readable metadata, and a properly scrollable planning demo with legible job labels. |
| The sage/ivory treatment does not express the supplied logo's brighter teal and technical product personality. | Desktop full-page | Retain SOMA's logo, establish graphite/teal/light-surface tokens, and use a purposeful precision-component visual. |
| Mobile demo is a clipped miniature with limited visual explanation. | Mobile board | Keep the real-size board scrollable, add a visible scroll hint, and pair scenarios with clear state changes and selected-order details. |
| Film is a set of scene cuts with similar text entrances; the cursor never demonstrates an action. | Original film | Maintain one morphing surface, make pointer actions drive the schedule change, use continuous framing, and synchronize UI sound to measured beats. |
| Repetitive synthesized loop lacks a build and resolution. | Original score source | Compose an original score with an intro, build, product reveal, focused interaction section, and resolved ending; measure levels and cue timing. |

### P2 — Polish

| Finding | Revision |
| --- | --- |
| Dense FAQ and pale metadata weaken the final third. | Use readable disclosure rows and measured contrast. |
| Hero letter spacing makes adjacent words run together on mobile. | Reduce negative tracking and use deliberate line breaks. |
| Most motion is only a fade entrance. | Use one deliberate hero sequence and scenario transitions that explain the effect of a scheduling change. Respect reduced motion. |

### P3 — Preference

No preference-only changes are needed to justify this revision.

### Verdict

The biggest improvement is to make the product's actual workflow the visual story: a changed order becomes a legible, controlled change to a production plan. The site and film should share that story and an explicit SOMA visual system.

## Applied skills

Design Taste core; landing-page, typography, color, accessibility, motion, and screenshot-first design review; official GSAP core/timeline/ScrollTrigger; LottieFiles motion principles; Product Launch Motion's continuous shape, cursor, spring, music-first, and render/QA workflow. Better Design MCP and Superdesign hosted canvas are not connected and are not claimed as used.

## After — verified revision

Evidence: `artifacts/after/desktop.png`, `tablet.png`, `mobile.png`; `artifacts/accessibility.json`; `artifacts/lighthouse-mobile.json`; `artifacts/encoded/storyboard.jpg` and `report.json`.

- The first viewport names production planning for precision manufacturing, supplies a clear demo action, and presents SOMA's supplied logo with an illustrative machined component.
- Readable body type and an unscaled, keyboard-focusable horizontally scrollable planning board replace the miniature demo. Scenario changes retain non-overlapping work and identify the effect in text.
- The 32-second encoded film maintains one morphing surface, uses visible selection/drag/confirmation, and demonstrates routing reuse. It contains exactly 1,920 frames at 60 fps, with stereo AAC. Four subframes per output frame provide motion blur.
- Seeking away and back to 16.5 seconds produces an identical authored state. The drag pointer is geometrically over the moved job. Full-file decoding and browser playback/seek/close passed. No black or fully white frames were found. Mean pixel deltas at the 8/16/24-second render seams are 0.376 / 0.086 / 0.051, below the conservative discontinuity threshold.
- The original score measures approximately −16.2 LUFS and −2.4 dBFS true peak. Audio was measured, not auditioned.
- Functional checks passed in both languages across 360, 390, 768, 1024 and 1440px layouts. The email request and fallback, weekday validation, direct booking URL, and Escape behavior passed.
- Axe reports no WCAG-tagged violations in desktop English, desktop Japanese, the change scenario, mobile Japanese, and the booking dialog. This is automated evidence, not certification or a screen-reader audition.
- Latest throttled mobile Lighthouse: performance **94**, accessibility **100**, LCP **2.81s**, CLS **0**, TBT **51ms**, initial transfer **283,598 bytes**. LCP remains 0.31 seconds above the 2.5-second target on this simulated local profile; this is a recorded P2 performance limit. Real-user INP and production CDN performance have not been measured.

### Final verdict

The product and audience are clear immediately, and the visual story now follows a specific manufacturing workflow. The site and film share a deliberate identity, readable hierarchy, and meaningful cause-and-effect motion. All identified P1 issues have been addressed; the remaining recorded performance gap is bounded and explicit.

## Smartphone correction — 2026-10-16

This supersedes the earlier mobile verdict: the prior scrollable desktop board was technically usable but was a poor phone composition.

### P0 — Blocking

No blocking primary-flow failure observed.

### P1 — Quality

| Finding | Before evidence | Fix and verification |
| --- | --- | --- |
| A 1,150px board leaves almost the entire schedule outside the phone viewport. | `artifacts/mobile-before/mobile.png` | At 640px and below, the same board becomes a selected-order route with machine, day, and operation rows. Order and scenario state remain shared with desktop. No board or page overflow at 320, 360, 390, 430, or 640px in either language. |
| A tall stacked hero postpones the product and gives the decorative image too much space. | `artifacts/mobile-before/mobile-top.png` | Compact image composition, one full-width primary action, quieter film action, simplified phone header. Tablet hero uses two columns. Reviewed 320/390/430px EN/JA and 768px renders. |
| Small scenario links and cramped desktop metadata undermine phone legibility and touch use. | Mobile board/control area | Full-width 48px scenario controls, 44px order selectors, selected product name and dates remain legible. Selection, reset, three scenarios, and language switching verified. |

### P2 — Polish

| Finding | Fix and verification |
| --- | --- |
| Fallback film text can overrun the short phone poster before the lazy image loads. | Remove decorative fallback copy; retain play control and image. Review loaded poster and open/close real video. |
| Japanese booking headline breaks words awkwardly; narrow bottom hero links wrap. | Shorten Japanese booking heading and use deliberate line height; keep exploration link on one line. Inspect dialog and 320px hero. |
| Long page rhythm and compressed footer/FAQ are poorly adapted to phones. | Reduce phone section spacing, shorten drawing height, stack footer, enlarge disclosure and form targets. |

### P3 — Preference

No preference-only changes included.

### Evidence and limits

After screenshots: `artifacts/mobile-verified/` (top, full page, board, film, booking; English and Japanese). `scripts/mobile-qa.mjs` verifies 8 viewport widths × 2 languages, selected order route, scenarios, no horizontal overflow, video/dialog visibility, and booking reflow. Ten Axe page scans report zero WCAG-tagged violations; no browser errors. The existing functional suite also passes. These are Chromium emulations, not a physical iPhone/Safari or screen-reader session. At tablet sizes the full desktop scheduling canvas deliberately remains horizontally scrollable with its visible hint.

### Verdict

The largest correction is replacing the cropped desktop canvas with a readable order route on phones. Mobile now has its own composition within the same visual system and interaction state; desktop keeps the full shop overview.

## Icon correction — 2026-10-17

### P0 — Blocking

None observed.

### P1 — Quality

The user's real iPhone screenshot shows emoji substitutions for the demo arrow, film play button, and next-operation arrow. These were Unicode characters, and the previous Chromium-only review missed the platform difference. Evidence: supplied `1-Photo-1.jpg`; `artifacts/icon-before/mobile-top.png` records the source layout but does not reproduce Apple's emoji font.

Replace all interface arrow, play, check, close, reset, and chevron symbols with Lucide SVG paths. Use one 24-unit grid and 1.75px stroke system, optical sizes for small controls, a filled play triangle, and decorative `aria-hidden` SVGs inside labeled buttons. Replace CSS-generated arrows and disclosure symbols with SVG masks as well. The cloned Motion Primitives repo uses the same Lucide family; preserve the vendored upstream ISC license.

### P2 — Polish

Align icon boxes with button baselines and center playback geometry without the prior text-glyph padding. Preserve path-based icons across translation, scenario changes, and reset.

### P3 — Preference

None included.

### Verification

Visually reviewed rendered English/Japanese phone hero and the existing desktop/tablet captures. The 8-width × 2-language suite checks for reintroduced font-based icon characters and requires actual path geometry for the three reported locations plus the operation check. Existing interactions, booking, language switching, layout overflow, and Axe checks pass. These are Chromium emulations; no claim of physical iPhone/Safari execution is made. The correction removes the dependency on platform text/emoji fonts directly.

### Verdict

The important fix is an explicit SVG icon system: cloning resources did not excuse leaving platform-dependent glyphs in the interface, and earlier viewport checks did not catch their real iPhone appearance.

## Brochure and player revision — 17 October 2026

### P0 — Blocking

No blocking interaction failure observed.

### P1 — Quality

| Finding / evidence | Correction |
| --- | --- |
| User does not want the interactive scheduling example. Before: `artifacts/brochure-before/mobile.png` and `desktop.png`. | Remove sample board, order selectors, scenarios, and their state handlers from the marketing page. Replace with an editorial EN/JA explanation based on the supplied brochure. |
| A dialog and platform-native video controls create an oversized, generic phone presentation. | Replace the dialog with a single inline cinema surface, a compact play invitation, and custom SVG controls. There is no video close button. The 16:9 picture stays proportional. |
| Brochure mixes planning records and live machine tracking and includes placeholder contact links. | Use the brochure for product copy while preserving the BRD phase distinction and the owner's configured contact. Data Feed is a separate discussion; ERP/multi-user remains future scope. |

### P2 — Polish

Use the established graphite/teal visual system, 44px control targets with 17–18px SVG geometry, a full-width seek row on phones, accurate time feedback, caption toggles in both languages, fullscreen with retained controls where supported, and native video controls without JavaScript. Preserve independent film authoring by moving its board source out of the marketing page. No change to encoded film or soundtrack.

### P3 — Preference

No preference-only changes included.

### Verification

After: `artifacts/brochure-verified/` (EN/JA full pages, product sections, film/player captures). `scripts/presentation-qa.mjs`: 81 functional assertions across eight viewport widths and two languages; eight Axe scans with no WCAG-tagged violations; no page errors or failed asset requests. Verified actual playback, pause, seek, mute, captions, language change during playback, fullscreen, no-JavaScript native fallback, booking validation/fallback, direct booking URL, and deterministic film authoring. Real iPhone Safari/fullscreen was not available; the inline picture uses playsinline and an optional native fullscreen fallback.

### Verdict

The site now presents the product directly and gives the film its own restrained, responsive player. The largest improvement is removing the video dialog entirely, eliminating the oversized close-button problem instead of rescaling it.

## Fresh website and directed launch film — 17 October 2026

### P0 — Blocking

None observed in the current local presentation and protected delivery checks.

### P1 — Quality

| Finding / evidence | Correction and verification |
| --- | --- |
| The owner described the synthesized score as game music and the film as a poor introduction. Previous film and assets retained in `artifacts/previous-v3/`; original site captures in `artifacts/launch-before/`. | Rebuild the film around one illustrative order: a changed deadline, connected operations, planner review, and reusable routing. A persistent surface, deterministic spring geometry, action-driven cursor and 93.75 BPM cue grid apply the actual Product Launch Motion workflow at b25b163. Replace the old synthesizer score with licensed piano/strings music. |
| A tiny landscape interface remains hard to follow on a phone even inside improved controls. | Compose a separate 1080×1350 phone film with larger, stacked scenes. The site selects it below 641px, with a matching poster and 4:5 player. Browser QA verifies the actual selected media dimensions. |
| A dark opening, repeated technical annotations and a late film section weaken the introduction. | Use a warm-white/ink/green hero, a simpler promise, a stronger sculptural crop of the supplied concept ring, and the film as the first substantive section. Maintain the static brochure presentation and EN/JA copy. |

### P2 — Polish

Corrected a clipped process-library panel and compressed repeat-order composition in moving-draft review. Separate portrait tracks preserve staging rather than cropping the landscape frame. Kept consistent SVG controls, restrained transitions, captions and no-JavaScript fallback; no video modal or close button. Film poster and subtitles now reflect the new story. Removed standalone WAVs from production files.

### Evidence

- Current EN/JA desktop, tablet and phone screenshots: `artifacts/brochure-verified/`. Fresh-direction hero captures: `artifacts/launch-after/`. Reviewed the 390px film, 768px Japanese full page and 1440px English full page after the portrait export.
- `scripts/presentation-qa.mjs`: **82 assertions** across 8 widths and 2 languages; **8 Axe scans with zero WCAG-tagged violations**; no browser exceptions or missing assets. Actual playback, seek, sound toggle, subtitles, language switch, fullscreen, native fallback and booking were exercised.
- Normal-speed visual review of both 32-second moving drafts: `artifacts/flow/moving-review.json` and `artifacts/flow-portrait/moving-review.json`, with timed playback captures. This is visual playback review, not frame-only approval.
- Both masters: 32 seconds, 60 fps, H.264/yuv420p/BT.709, AAC stereo. Landscape 1920×1080; phone 1080×1350. Four temporal subframes per output frame.
- Full decode: **1,920 frames per composition, zero black/white frames**. Segment seam differences below 0.23 grayscale levels in either composition. Reports: `artifacts/encoded/report.json`, `artifacts/encoded-portrait/report.json`.
- Landscape mix measured −15.7 LUFS, −2.6 dBFS true peak. Professionally recorded licensed track and four quiet original tactile accents; source and terms in `ASSETS.md`.

### Limits and verdict

The resulting film demonstrates one coherent planner-controlled workflow, with readable phone staging and a visual system shared with the site. Product scenes are illustrative; no finished product screen recording or live tracking is implied. Better Design MCP and Superdesign hosted services remain unconnected and were not used. Chromium emulation does not establish physical iPhone/Safari or screen-reader results. Audio input cannot be heard in this environment: levels and encoding were measured, but no listening review is claimed. The owner's assessment of the actual soundtrack remains essential.

## Logo palette and one-time entrances — 17 October 2026

### P0 — Blocking

None observed in local layout, interaction or motion checks.

### P1 — Quality

| Evidence / finding | Correction |
| --- | --- |
| Owner wants the supplied logo colors; the previous page and film use green. Before: `artifacts/rings-before/`. | Match white, deep blue, sky blue and cyan to the actual supplied ring artwork, with darker text shades for contrast. Recolor both film compositions and posters, the technical illustration, controls and action section. |
| The first logo appearance is static; prior content movement rises from below and the headline does not fade from zero. | Preserve and split the original ring image with SVG clips at its transparent radial gap. Scale both from zero with opposing rotations, then fade in SOMA. Stage content from opacity 0 / y −16px into place. |

### P2 — Polish

No blocking splash or endless ring rotation. Header entrance runs once per document load; footer once when first entering view. Hierarchy stagger is 90ms; most content settles in 620ms. Cache-version changed styles, motion/player scripts, films and posters so returning visitors can see the new version. Native player, captions, booking, EN/JA and the static product explanation remain intact.

### P3 — Preference

No additional preference changes beyond the owner's requested palette and movement.

### Evidence and limits

After: `artifacts/rings-after/` desktop/tablet/phone; current EN/JA film and full-page captures in `artifacts/brochure-verified/`. The actual logo source was inspected. The Hexacore reference by Nija Design / Nija Works was played in the browser and examined as a 0.5-second contact sheet. Only staging/pacing informed the revision; no reference assets are shipped.

`scripts/brand-motion-qa.mjs` passes 29 assertions with normal-speed page recordings and numeric animation samples at 390/768/1440px. It verifies opposite rotation signs, scale growth, delayed name, downward fade, final state, no header replay on scrolling, reduced motion and missing-script/no-JavaScript fallbacks. The first check caught a logo replacement that had not matched HTML attribute order; the exact artwork now has two independently animated groups and passes the rendered checks.

Both recolored moving film drafts were played at normal speed and reviewed via timed playback captures and beat/transition frames before master export (`artifacts/flow/`, `artifacts/flow-portrait/`). The score and narrative are unchanged. Full encoded-master verification is recorded in their `artifacts/encoded*/report.json` files. No audio listening claim is made. Real iPhone/Safari and assistive-technology testing were unavailable. Better Design and Superdesign hosted services remain unconnected and were not used.

### Verdict

The site now follows the supplied blue/cyan identity on white. The most important motion change is the clear sequence from two independently arriving rings to the name, followed by restrained, downward content arrivals.

Final verification for this revision: 82 presentation/player assertions across eight widths and EN/JA, eight Axe scans with zero WCAG-tagged violations, no browser exceptions or missing assets. Both encoded films contain all 1,920 frames, zero completely white/black frames, and segment seams below 0.20 grayscale levels. The 29 normal-motion/fallback assertions pass. Protected delivery uses the same production HTML/CSS/JS and film assets.

## Original wordmark and full gradient correction — 17 October 2026

### P0 — Blocking

None observed in current local interaction and motion checks.

### P1 — Brand quality

| Finding / evidence | Correction |
| --- | --- |
| The owner identifies the typed SOMA name as the wrong lettering. Before: `artifacts/gradient-before/`. | Replace the typeset logo name with an exact SVG image crop from `logo_soma_light.png` on white and `logo_soma_dark.png` on the dark film closing panel. The full source files are byte-identical to the supplied originals; crop bounds and hashes are in `design-assets/logo-crops.json`. |
| Flat blue misses the actual rings' graduation. | Use the full navy → sky blue → cyan → turquoise spectrum in headline, action, illustration and dark-section treatments. Keep the white canvas and readable text; the logo artwork itself is neither recolored nor recreated. |

### P2 — Polish

Preserve the independently counter-rotating rings and delayed wordmark fade with source-coordinate origins (700, 593). Scale the original wide lettering to fit phone headers without distortion. Keep all image transparency. The site/film typography in ordinary prose remains Manrope. `Logo.png` is not used in the current branding pipeline. Version changed asset URLs for returning visitors.

### P3 — Preference

No extra preference changes beyond the owner's corrections.

### Verification

After: `artifacts/gradient-after/` desktop/tablet/phone, with normal-motion samples in `artifacts/ring-motion/` and EN/JA full pages/film captures in `artifacts/brochure-verified/`. Reviewed the exact original lettering composited on white/dark backgrounds before implementing the crop; browser captures confirm its final appearance. The approved source PNGs match their source hashes byte-for-byte. Header/footer crops use light; the dark film closing crop uses dark. No typeset wordmark remains in those lockups.

82 presentation assertions across eight widths and two languages; eight Axe scans with no WCAG-tagged violations, browser exceptions or missing assets. 29 normal-motion/fallback assertions pass, including actual opposing rotation signs, name timing, downward fade and final state. Measured minimum gradient-stop contrast: 4.33:1 for large headline text on white; 5.55:1 for action labels; 5.21:1 for muted copy on dark sections. The full source logo colors remain unaltered.

Both updated film drafts were played at normal speed and reviewed through timed captures, including the white wordmark on the dark closing panel. Beat and transition captures were checked before master export. Encoded-master reports are in `artifacts/encoded*/report.json`. The score, 32-second story, booking and private PHP gate are unchanged. No physical iPhone/Safari or screen-reader session was available. Better Design MCP and Superdesign hosted services remain unconnected and were not used.

### Verdict

The strongest correction is using the real SOMA lettering. The full graduation now relates the site to the ring artwork while preserving the bright layout and existing motion.

Final master checks: both 32-second / 60-fps exports decode to 1,920 frames with zero completely white/black frames; segment seam differences remain below 0.21 grayscale levels. Current player/media verification again passes 82 assertions and eight Axe scans. Source PNGs are byte-identical to the approved light/dark originals, and the latest poster frames include the cropped wordmark.

## Supplied gradient calibration and corporate name — 17 October 2026

### P0 — Blocking

None observed in local presentation checks.

### P1 — Brand/content accuracy

The owner supplied the actual gradient-editor reference and clarified that the company is a 株式会社. The prior palette was inferred from ring artwork, and the footer used only SOMA. Before: `artifacts/company-before/`.

Use the screenshot's five sampled stops at their inferred positions, horizontally. Record the samples and method in `design-assets/brand-gradient.json`; do not describe screenshot samples as the source editor's confirmed numeric values. Apply the raw spectrum to brand accents and contrast-safe tonal versions to headings, buttons and dark sections. Use SOMA Co., Ltd. / 株式会社SOMA for corporate references, page titles, copyright and demo-request company text. Keep product names distinct and the original logo image artwork intact.

### P2 — Polish

Check copyright and longer bilingual labels at narrow widths. The company name remains unbroken while the copyright line may wrap naturally. Cache-version the edited CSS and translation script.

### P3 — Preference

No changes outside the requested color calibration and corporate wording.

### Verification

After: `artifacts/company-after/` full pages and focused footer captures at phone/tablet/desktop in both languages. Verified exact corporate text and translated titles in all six views. The 82-assertion presentation/player suite and eight Axe scans pass with no WCAG-tagged violations, page errors or failed assets. Minimum gradient-stop contrast: large headline 4.38:1, action labels 5.23:1, muted dark-section copy 4.82:1. Existing film files and motion code are unchanged; metadata checks pass for both film compositions. Local protected delivery is tested separately. No live-host, physical iPhone/Safari or screen-reader test is claimed. Better Design and Superdesign hosted services remain unconnected and were not used.

### Verdict

The site now uses the owner's supplied gradient progression and shows the full corporate identity in the selected language, including the footer.


## Open hero composition — 17 October 2026

### P0 — Blocking

None observed in the rendered layouts and existing interaction checks.

### P1 — Quality

| Finding / screenshot evidence | Fix and verification |
| --- | --- |
| The blueprint grid and colored top rule enclose the ring in a table-like panel. The owner supplied a phone screenshot of this treatment; local before views are `artifacts/clean-hero-before/{desktop,tablet,mobile}-top.png`. | Remove the grid markup and top rule. Place the complete transparent illustration directly on white, in the same page composition as the copy. After views at the same sizes are in `artifacts/clean-hero-after/`. The full silhouette stays visible at desktop, tablet and phone sizes. |
| The floating “The knowledge stays” card covers the object and looks like a simulated product widget. Same before evidence. | Remove the entire card and its icon/check affordances. Reusable routing remains explained in the actual knowledge section. The hero now has no overlay or simulated operation control. |

### P2 — Hierarchy

The duplicate watch action between the hero CTA and image interrupts the phone reading order. Remove that button and its unused click handler; keep the real inline film player below the hero. Its Play control still starts the composed phone film, with working pause, seek, audio, captions and fullscreen. Adjust image dimensions to its actual 1100×1005 aspect ratio and keep responsive image selection.

### P3 — Preference

No additional preference changes outside the owner's hero feedback.

### Verification

Reviewed real full-page and focused desktop 1440px, tablet 768px and phone 390px renders before/after. Also reviewed Japanese hero captures at 320/768/1440px in `artifacts/clean-hero-after/`. Existing layout checks pass at eight widths from 320 to 1440px in EN/JA, with no horizontal overflow. All 82 presentation/player assertions and eight Axe scans pass, with zero WCAG-tagged violations, browser exceptions or failed assets. The 29 existing normal-motion and fallback checks pass, including opposing logo rotations, late original wordmark, downward information fades, final state, reduced motion and absent-script behavior.

The original light/dark logo artwork, supplied five-stop gradient, corporate translations and film masters are unchanged. Both film metadata checks pass. No physical iPhone/Safari, screen-reader or live Renderpopstudio session was available. Better Design MCP and Superdesign hosted services remain unconnected and were not used.

### Verdict

The illustration now belongs to the white page. Removing its frame and overlays is the main improvement: the eye follows the headline, demo action and complete component without an extra widget competing for attention.


## Frosted routing note — 17 October 2026

### P0 — Blocking

None observed in current local checks.

### P1 — Quality

No new quality regressions observed in the rendered hero.

### P2 — Readability and fit

Retain navy heading text and darker supporting copy on the translucent surface. At 70% white opacity, calculated contrast against a worst-case black background is 5.48:1 for the title and 4.91:1 for supporting text. Use a 94% white fallback when backdrop-filter is unavailable. Keep the note within the phone illustration width and allow Japanese copy to wrap naturally.

### P3 — Owner-requested refinement

The owner clarified that the floating rectangle is welcome when semitransparent, blurred and rounded. Restore the routing label/title/copy as one frosted note overlapping the ring's lower edge, with 18px backdrop blur and 18–20px corner radii. Retain the unframed white canvas and the dedicated inline film section. Before: `artifacts/glass-card-before/`. After: `artifacts/glass-card-after/` with desktop/tablet/phone top and full-page captures, Japanese views at 320/390/768/1440px and a forced no-blur fallback.

### Verification

Reviewed actual renders at 1440/768/390px in English, plus Japanese phone/tablet captures and the no-blur fallback. Computed browser styles confirm 0.7 white alpha, 18px backdrop blur, and the responsive corner radii. All 82 presentation/player assertions, eight Axe scans and 29 existing motion/fallback assertions pass, with no WCAG-tagged violations, browser errors or failed assets. Both unchanged film metadata checks pass. Gate code and configuration are unchanged from the preceding protected delivery verification. Physical iPhone/Safari, screen-reader and live Renderpopstudio testing were not available. Better Design MCP and Superdesign hosted services remain unconnected and were not used.

### Verdict

The restored note is lighter and softer: the ring remains visible as a blurred silhouette through its surface, while the copy stays readable on phone and desktop.


## Clean inline film player — 17 October 2026

### P0 — Blocking

None observed in current player checks.

### P1 — Mobile presentation

The permanent control strip adds a large block below the phone video, followed by a download link the owner does not want. Before evidence: the owner's supplied screenshot and `artifacts/player-overlay-before/mobile.png`. Remove the download/footer markup and place the controls inside the film stage. The player now occupies only the picture's aspect ratio. The poster starts with a single Play button; playback controls fade after 2.2 seconds without interaction.

### P2 — Interaction and accessibility

Touch reveals the overlay without pausing the film. Pause and keyboard focus keep controls available. Space plays/pauses; arrow keys seek. Retain captions in both languages, audio and fullscreen. Update playback errors to offer retry without referring to the removed download link. Add bilingual keyboard guidance and keep native no-JavaScript controls. Lighten the inactive progress track for visibility against the dark overlay. Use 44px transport targets and a 24px phone seek target. A visible inset focus ring works on the white video surface.

### P3 — Preference

No unrelated brand, hero or encoded-film changes.

### Verification

Actual film sections and playback states reviewed at desktop 1440px, tablet 768px and phone 390px. After evidence: `artifacts/player-overlay-after/{desktop,tablet,phone}-film.png`, `*-playing-clean.png`, `*-paused.png` and `*-ja-paused.png`. Additional interaction results are recorded in `interaction-review.json`: auto-hide and replay work at all three sizes; three paused-player Axe scans have zero WCAG-tagged violations. The existing presentation suite now passes 90 assertions, including no download link, no strip below the picture, clean poster, touch reveal, keyboard access, seek, translated captions, pause and fullscreen. Its eight EN/JA page Axe scans pass, with zero browser exceptions or failed assets. Both unchanged film metadata checks pass. The original logo and hero animation code is unchanged; its preceding 29-check motion review still applies. Physical iPhone/Safari, a screen reader and the live Renderpopstudio account were not available. Better Design MCP and Superdesign hosted services remain unconnected and were not used.

### Verdict

The film now reads as a picture with a play invitation. Controls remain available within it, without adding a second panel underneath or asking visitors to download anything.


## Lighter routing glass — 17 October 2026

### P0 / P1 — Blocking and quality

No new issues observed in targeted hero checks.

### P2 — Readability

Use deeper navy #062e43 throughout the card to preserve text contrast at the lower white opacity. Calculated minimum over an underlying black pixel is 4.98:1. Preserve the readable 94% white no-blur fallback.

### P3 — Owner-requested refinement

Reduce the note's white opacity from 70% to 60%, revealing more of the ring underneath. Keep 18px blur, rounded corners, placement and copy. Before/after rendered views: `artifacts/transparency-before/` and `artifacts/transparency-after/`.

### Verification

Reviewed rendered desktop 1440px, tablet 768px and phone 390px hero views. Six targeted EN/JA Axe scans pass with no WCAG-tagged violations or horizontal overflow; computed styles confirm alpha 0.6 and the unchanged blur. Results: `artifacts/transparency-after/review.json`. This is a CSS surface/text-color refinement plus a stylesheet cache version; the prior 90 player/layout checks and film, booking, password and logo motion implementations are unchanged. No physical iPhone/Safari, screen-reader or live Renderpopstudio testing is claimed. Better Design and Superdesign hosted services remain unconnected and were not used.

### Verdict

The same glass note now reveals more of the metal silhouette while keeping its copy readable.


## Three first-impression directions — 17 October 2026

### P0 — Blocking

No blocking issues observed in current local checks.

### P1 — Quality findings and fixes

| Draft evidence | Substantive correction |
| --- | --- |
| Editorial phone: the oversized photo crossed into the narrow copy column, obscuring words. `artifacts/hero-directions-draft/editorial-phone.png`. | Move the crop outward to the right and shorten the copy. Final geometry checks confirm the image's rendered bounds stay clear of the paragraph at 320/390px in EN/JA. |
| Japanese headlines wrapped into orphaned characters on tablet/desktop. Initial examples in the draft/final capture history. | Give each direction a Japanese display scale that fits its actual column. Final tablet/desktop views show deliberate two-line Japanese headings. |

### P2 — Polish

Shorten Spotlight's phone sculpture area and orbit so the demo action appears earlier and the decorative arc stays clear of the category line. Keep the full-size original logo lettering, one hero CTA and accessible SVG icons. In Flow, label the route as illustrative, make the numbered markers decorative for assistive technology and translate the part/process copy. The comparison page previews actual 390/768/1440px iframe viewports and offers direct full-page links. A test initially polled a not-yet-created iframe body; its readiness check now waits safely for that body. No product failure is attributed to that test race.

### P3 — Owner-requested exploration

- Editorial: large type, an outward component crop and one frosted knowledge note.
- Spotlight: a component-first composition, a fine orbital accent and compact copy.
- Flow: part-to-process storytelling with a static route and short outcome-led headline.

These are alternative pages for comparison; the existing homepage's source, shared styles/scripts and encoded films are unchanged. No direction has been selected on the owner's behalf.

### Verification

Reviewed actual rendered full pages and first views at desktop 1440px, tablet 768px and phone 390px in EN/JA. Final evidence: `artifacts/hero-directions-final/`, including three normal-motion settled views and comparison-page captures. The dedicated suite passes 123 assertions across all three directions at 320/390/768/1440px in both languages: layout overflow, unobscured Editorial copy, functional demo dialogs, normal logo/hero settling, no interactive scheduler/download link and working design/device switches. Eighteen header/hero Axe scans and two comparison-page scans find zero WCAG-tagged violations. No browser errors or failed assets. Existing film metadata checks pass. The three directions retain the original logo entrance and downward information fade through the shared GSAP code. All added UI code is project-authored; no new third-party component or visual is incorporated.

No physical iPhone/Safari, screen-reader or live Renderpopstudio test is claimed. Better Design MCP and Superdesign hosted services remain unconnected and were not used. Their installed sources were consulted where relevant; this was authored and reviewed locally using Design Taste and the existing site/motion system.

### Verdict

The study offers three distinct opening rhythms with the same SOMA identity. Spotlight is the strongest immediate visual introduction; Flow communicates the reusable-routing idea fastest. The important improvement is making the mobile composition intentional rather than shrinking a desktop split.


## Selected responsive opening — 17 October 2026

### P0 — Blocking

None observed in the selected responsive layout and interaction checks.

### P1 — Owner selection

Apply Editorial on phones and Spotlight on tablets/desktops to the main homepage. Keep the approved typography, crop, orbital accent, frosted note and compact wider-screen caption. Use one semantic h1 and one component image; CSS hides the inactive headline/copy/caption from both the screen and accessibility tree. Before: `artifacts/selected-hero-before/`. After: `artifacts/selected-hero-after/`.

### P2 — Breakpoint and motion

Use the existing 640px phone threshold, matching the film's responsive composition. Allow slightly smaller wider-screen type just above that threshold so a narrow tablet layout does not clip the headline. Resize without replacing DOM content or rerunning intro motion. Preserve the original logo image crops, 60% white card surface and contrast-safe ink. Add the selected Japanese strings to the normal localization map, including both responsive headings.

### P3 — Preference

No additional design direction beyond the owner's chosen phone and wider-screen versions. The original three alternatives remain as reference pages.

### Verification

Actual desktop/tablet/phone renders reviewed in EN/JA. `artifacts/selected-hero-after/selection-review.json` compares headline, description, CTA, illustration and image bounds with the approved standalone layouts at 390/768/1440px: all six language/size comparisons have zero geometry difference. Normal-motion resizing through 640/641/768/390px shows the intended headline, no horizontal overflow, and a settled logo that does not replay. Boundary and Japanese views were visually reviewed.

The main presentation/player suite passes 116 assertions over nine widths from 320 to 1440px and both languages, including the 640/641px boundary and correct visible responsive headline. Eight Axe scans find zero WCAG-tagged violations; no browser errors or failed assets. All 29 existing logo/content-motion and fallback assertions pass. Both unchanged film metadata checks pass. The standalone study builder now accepts additional hero classes; its reference pages are preserved. Generated Python caches are ignored.

No physical iPhone/Safari, screen-reader or live Renderpopstudio test is claimed. Better Design MCP and Superdesign's hosted services remain unconnected and were not used.

### Verdict

The live opening now follows the owner's device-specific choice, preserving the approved layouts rather than approximating them with one scaled arrangement.


## Floating rectangle removal - 17 October 2026

### P0 - Blocking

None observed.

### P1 - Quality

No new findings in this scoped revision.

### P2 - Polish

No additional changes. Keep the selected Editorial phone and Spotlight wider layout.

### P3 - Owner-requested removal

Remove only the floating ENGINEERING KNOWLEDGE rectangle from the phone homepage
and Editorial reference. Keep the dedicated engineering knowledge section and wide
caption. Before captures: artifacts/no-knowledge-before/ and the prior selected hero
study. After: artifacts/no-floating-card-after/ at 390, 768 and 1440px, EN/JA.

### Verification

Actual phone/tablet/desktop first views reviewed. Six EN/JA inspections show no
floating rectangle, one intact knowledge section and no horizontal overflow.
The existing presentation/player suite passes 116 assertions across nine widths;
eight Axe scans have zero WCAG-tagged violations, browser errors or failed assets.
No motion, player, logo, typography or PHP changes were made. The local delivery
ZIP includes the unchanged complete password gate and all current deployed files.
Better Design MCP and Superdesign hosted services remain unconnected and were
not used. No physical iPhone/Safari, screen-reader or live-host test is claimed.

### Verdict

The requested floating rectangle is absent; the rest of the approved site remains.


## Spotlight caption removal - 17 October 2026

### P0 - Blocking

None observed.

### P1 - Quality

No new findings in this scoped change.

### P2 - Polish

No unrelated styling changes.

### P3 - Owner-requested removal

Remove the remaining Spotlight expertise capsule from the homepage and Spotlight
reference. Before: artifacts/no-floating-card-after/ at 390/768/1440px, EN/JA.
After: artifacts/clean-selected-hero/ at the same sizes and languages. The phone
floating rectangle remains absent. The dedicated knowledge section remains.

### Verification

Actual phone, tablet and desktop rendered views reviewed. Six viewport/language
inspections show neither overlay, one intact knowledge section and no overflow.
Six Axe scans have zero WCAG-tagged violations, browser errors or failed assets.
The reference builder preserves the removals. The complete host ZIP has valid
CRCs and SHA256 hashes, matching deployed site files and an unchanged PHP gate.
No physical-device or live-host test is claimed. No hosted design review was used.

### Verdict

The highlighted capsule is removed without changing the selected hero layouts.


## Login logo and legal name - 17 October 2026

### P0 - Blocking

None observed in local PHP checks.

### P1 - Brand accuracy

Before (artifacts/login-brand-before/): the password screen typed SOMA in Arial
and its copyright omitted Co., Ltd. Use the original dark-background PNG for
the wordmark and rings; correct the English footer. The main site already has
the full English and Japanese company names.

### P2 - Requested motion

The owner explicitly requested continuous login-ring rotation. Use two slow
opposing CSS rotations (24/30 seconds), keeping the original crop intact and
disabling motion under prefers-reduced-motion. The login is self-contained and
works without JavaScript or anonymous access to protected logo assets.

### P3 - Scope

No additional homepage or film changes. Both removed hero callouts stay absent.

### Verification

After: artifacts/login-brand-after/ at 320/390/768/1440px, actual PHP 8.4.26.
Rendered phone/tablet/desktop views reviewed. Four Axe scans show zero tagged
WCAG violations and no horizontal overflow. PNG hash matches the original; no-JS
wordmark, opposite continuous ring matrices, reduced-motion behavior, wrong
password feedback and successful login pass. Main English/Japanese footers are
verified. Both PHP sources pass syntax checks; no browser errors or failed assets.
The original gate logic differs only in which brand asset is embedded.
No physical-device, screen-reader, live-host or hosted design review is claimed.

### Verdict

The login carries the actual SOMA identity and full English company name.


## Continuous main-page logo rotation - 17 October 2026

### P0 - Blocking

None observed.

### P1 - Brand consistency

The owner selected the login's continuous opposing ring rotation for the main-page
logos. Before: artifacts/clean-selected-hero/ and earlier normal-motion recordings.
After: artifacts/ring-motion/ at 390/768/1440px. Preserve both original logo image
crops and the entrance scale/rotation/wordmark sequence; then loop at 24/30 seconds.

### P2 - Motion lifecycle

Pause the header/footer loops while offscreen and resume their phase on return.
Create paused loop tweens within GSAP matchMedia so changing reduced-motion
preferences reverts and kills them. Re-enabling creates one loop per ring. Cache
versions are refreshed on all four website entry pages.

### P3 - Owner-requested preference

Continuous brand motion is explicitly requested; no other content is animated
indefinitely. The wordmark remains stationary.

### Verification

Actual phone/tablet/desktop rendered views reviewed. Forty motion checks pass,
including entrance choreography, continuous opposing rotation for both logos,
offscreen pause, resume without replay, runtime preference changes and fallbacks.
Normal-motion recordings and frame samples retained. The 116-assertion site/player
suite passes at nine widths in EN/JA; eight Axe scans find zero tagged violations.
No browser errors or failed assets. Original logo binaries, films, login and
password configuration are unchanged from the preceding package.
No physical-device, screen-reader, live-host or hosted design review is claimed.

### Verdict

The header and footer carry the selected continuous brand motion while preserving
the original entrance and readable wordmark.


## Dark mode - 17 October 2026

### P0 - Blocking

None observed in current checks.

### P1 - Requested theme

Before: artifacts/theme-before/ (white-only site). The owner requested the
login's #101719 background as a dark option. Add a persistent moon/sun switch
while retaining the white first-visit default. After: artifacts/theme-final/,
both themes in EN/JA at phone/tablet/desktop sizes, including booking views.

### P2 - Color, branding and small screens

Remap semantic surfaces, text, borders and input colors. Use the exact original
light/dark PNGs inside the existing SVG crops; keep the parent ring animation
intact. Keep the metal image natural, and adapt the line illustration to dark
surfaces. Compact header controls fit 320px; navigation yields below 1000px.
The controls have 44px targets, translated labels, keyboard activation and visible
focus. New theme code runs before paint, tolerates blocked storage and synchronizes
reference iframes. No-JavaScript users retain the original visible white site.

### P3 - Scope

Original gradient, layouts, film, company names, login and removed hero captions
are retained. Only theme semantics and a compact header switch are added.

### Verification

240 theme checks across seven widths, two themes and both languages pass. Thirty-
two Axe scans covering pages and booking dialogs report zero tagged violations.
The existing 116-assertion presentation/player suite at nine widths and eight Axe
scans also passes; no browser errors or failed assets. Actual renders reviewed.
Measured dark body contrast is 16.73:1, muted 9.15:1, input edges 5.15:1, focus
10.8:1 and headline gradient minimum 10.8:1. Action gradient text minimum is
5.23:1. Theme switching preserves ongoing ring motion without replaying the intro.
Reload, language retention, keyboard, unavailable storage, iframe synchronization
and no-JavaScript behavior are verified. Original logo assets and videos untouched.
No physical-device, screen-reader, live-host or hosted design review is claimed.

### Verdict

Dark mode follows the selected login surface and SOMA identity while the original
white presentation remains available and unchanged in content and layout.


## Summary strip and ring-motion feasibility - 17 October 2026

### P0 - Blocking

No rendering failures observed in the shipped strip-removal revision.

### P1 - Ring fidelity (unresolved; not shipped)

The available ring is a flat RGBA image; no matching 3D/CAD source was found. A
separate parametric 3D study rotates about its machining axis with a fixed camera,
but its shape, bevels and material response do not match the original photograph's
quality. Evidence: artifacts/ring-study/, including multiple angles, normal-motion
recording and source-vs-render comparisons. Reject this replacement and retain
the original still image. A suitable 3D model is required for faithful completion.
The temporary Three.js dependency was removed; no study code or assets ship.

### P2 - Requested content removal

Remove the three-line capability strip from all four marketing pages and its
unneeded reveal hook. Before: artifacts/theme-final/ and the owner screenshot.
After: artifacts/strip-removed/. Keep the current typography, themes and section
spacing; the film now follows the hero directly.

### P3 - Scope

No other copy, login, logo motion, video or password changes.

### Verification

116 existing site/player checks across nine widths and both languages pass; eight
Axe scans find zero tagged violations, browser errors or failed assets. Six light/
dark inspections at 390/768/1440px confirm no strip or overflow and the original
image source. Rendered phone/tablet/desktop views reviewed. No physical-device,
live-host, screen-reader or hosted design review is claimed.

### Verdict

The requested text removal is ready to upload. The high-quality ring remains a
still image; true-axis animation is explicitly unfinished pending a suitable asset.

## Selected 3D A, theme and FAQ motion — 17 October 2026

The user selected the improved brushed-silver reconstruction after seeing two
material studies. This supersedes the previous decision to ship only the still.
The part is an illustrative reconstruction, with approximate hidden geometry;
the original image remains its progressive-loading and no-WebGL fallback.

### P0 — Blocking

None in the final local package. The authenticated PHP gate permits the HDR
reflection asset and the bundle only after login. A local-test login mismatch
was traced to the test router processing a root favicon request through the
subfolder gate; restricting the local router fixed it. Production routing and
the configured password were preserved.

### P1 — Quality, fixed and verified

- Full-page snapshot blending briefly duplicated the spinning metal geometry.
  Replaced it with interpolation of registered color tokens, including gradient
  stops, and opacity blending between the original PNG logo crops. The 3D render
  and opposing logo rotations remain live without a phase reset. Final evidence:
  artifacts/site-motion-update/theme-mid-transition.png and moving recordings.
- FAQ disclosure height is measured once per action, then animated for 340ms
  opening / 260ms closing, with a smaller downward text reveal. The limited
  height tween deliberately reflows the following rows rather than scaling the
  text. The plus bar contracts into the minus; an old SVG mask override that
  hid the minus was corrected. See faq-expanded.png and faq-mid-open.png.
- The phone crop put a right-aligned pause target outside the visible viewport.
  The control now sits inside the crop's left edge. A touch-enabled 390px browser
  verified its bounds and pause/resume behavior through the packaged PHP site.

### P2 — Safeguards and limits

- A rotates about local Y at 24 seconds per turn with the camera fixed. Rendering
  is capped at 30fps and stops offscreen, when paused, or when the page is hidden.
  Reduced motion shows a static A render and removes theme/FAQ transitions.
- Original light/dark logos, footer company names, login branding, the launch
  films and booking behavior are retained. The complete homepage body and full
  translation script match the saved pre-change versions; see results.json.
- The older-browser theme path blends solid surfaces and logo layers. Explicit
  gradient-token defaults preserve readable text without CSS @property support.
- Browser sizes emulate phone/tablet/desktop; physical iPhone, Safari, screen
  reader and actual remote-host performance are not claimed. Better Design and
  Superdesign remote workflows remain unconnected and were not invoked.

### Verification

240 existing theme/booking checks and the focused interaction suite passed.
48 tagged Axe scans (32 existing plus 16 focused combinations) found no
violations. Focused renders cover 320/390/768/1440px, both themes and languages.
Normal-motion checks verify intermediate colors/logo opacity, uninterrupted
rotation, rapid toggles, keyboard disclosures, mid-animation reversals, locale
changes, dynamic reduced motion and fallback without WebGL. Nine authenticated
PHP-package checks verify login, protected 3D assets, touch pause, theme, FAQ,
film byte ranges and logout. No browser script errors were observed.

### Verdict

The selected A finish and requested transitions are ready for upload. Marketing
copy is unchanged in this revision. The key remaining practical limit is that
the reconstructed part is illustrative rather than CAD accurate.

## Automatic ring without controls — 17 October 2026

The user confirmed that rotation works on their smartphone and requested removal
of the ring's play/pause control. Removed the button, icon styles, translated
control labels, click handling and manual pause state. Rotation remains automatic
while visible, with offscreen/hidden-page and system reduced-motion behavior.
This supersedes the previous ring-control design and verification notes.

The focused suite passed across 320/390/768/1440px in both themes and languages
(16 tagged Axe scans without violations). Automatic rotation without controls,
fixed camera/axis, theme and FAQ behavior, copy preservation, and fallbacks remain
verified. Nine local PHP-package checks passed, including a touch-enabled phone
view with an advancing ring angle and no button in the hero render.
## Phone framing and seamless first-frame handover — 17 October 2026

### P1 — Verified fixes

The previous phone 3D camera produced a different projection from the static
illustration. CSS editorial rotation was already present; the main difference
was the model camera. Alpha-mask analysis of the source measured a central-hole
axis ratio of 0.675 at 30.91 degrees before its -12 degree phone crop. The new
phone camera matches those projection values and closely follows the former
outer width and center. Wide screens retain the selected A camera. The part
remains an illustrative reconstruction rather than identical recovered CAD.
Before: artifacts/ring-framing/390-static-before.png and 390-3d-before.png.
After: 390-light-ready.png. Approximate silhouette differences remain because
this is a reconstructed part, especially its thickness and notch geometry.

The original illustration no longer appears while the model loads. Six alpha
WebP posters (600/800/1100px, phone and wide views) are rendered directly from
this model at phase zero. The live canvas replaces its corresponding poster at
phase zero without an overlapping fade, then begins rotation. The picture
source remains intact inside the enhancement wrapper. Failure keeps that same
poster rather than reverting to the former artwork. The no-JavaScript fallback
also uses the matching responsive poster.

### Verification

Four delayed-bundle tests cover phone light/dark, tablet and desktop. Poster and
live-stage bounds agree within 0.1 CSS pixels. Before/after mean RGB differences
are below 0.3/255, concentrated at compressed/antialiased edges. The correct
camera switches at 640px while preserving rotation phase. Captures are in
artifacts/ring-framing/, with numeric results and difference reports. The
16-combination interaction/layout suite passes with zero tagged Axe violations
and no script or asset errors. Ten authenticated local PHP checks pass,
including the phone poster/camera and automatic rotation without controls.
All English content and translation keys match the previous site; the full
Japanese translation script remains byte-identical. Only artwork markup changed.

The phone foreground poster is 40-84 KB and wide poster is 36-78 KB. Full 3D
still loads progressively (the existing 2K HDR is 6.3 MB). No Lighthouse p75,
physical-phone GPU benchmark, Safari, or remote-host validation is claimed.
Better Design and Superdesign hosted services were not used.

### Verdict

The phone framing is closer to the former composition, and loading now keeps
the same object, material and pose on screen. The website's copy, logos, theme
and FAQ transitions, login and launch film remain intact.

## Four-section header and stable bilingual controls — 17 October 2026

### P1 — Verified fixes

- The header omitted section 04 and placed the film after later sections.
  Its links now follow the numbered page order: Launch film, Scheduler,
  The thinking, Details. Details points to the existing FAQ section. All four
  links remain visible on a second row at tablet and phone widths.
- The previous locale button showed one language with a chevron. Both choices
  now appear as JP・EN in 700 weight and the SOMA / SCHEDULER accent token.
  The active choice is underlined and exposes aria-pressed. There is no dropdown.
- Localized demo labels previously changed the control cluster's width. A
  reserved grid column, fixed 88px language group and 172 × 44px demo button
  keep the theme, language and demo controls at identical coordinates across
  EN → JP → EN. The existing phone hero remains its primary demo action.

### Verification

The focused header suite passed 60 rendered states at 320, 390, 640, 641, 768,
1024, 1100, 1101, 1280 and 1440px in both themes. It checks link order,
visibility, clearances, overflow, exact control geometry, accent/weight,
selection semantics, keyboard activation, persistence and booking behavior.
Sixteen tagged Axe scans returned no violations. Phone, tablet and desktop
screenshots were visually reviewed in artifacts/header-update/; representative
views are 390-dark-en-top.png, 768-light-ja-top.png and 1440-dark-en-top.png.

English and Japanese content outside navigation matches the previous delivery.
Japanese navigation is compacted for the header; main headings, footer legal
name, product claims and booking copy are preserved. The existing interaction
suite also passes, including animated themes/logos, FAQs, automatic 3D rotation,
reduced motion and matching image fallback. Eleven local authenticated PHP
package checks pass, including the new header's stable bilingual layout.

### P0 / unresolved P1

None found in this scope. Physical-device/Safari, assistive-technology and live
remote-host testing are not claimed. Better Design MCP and Superdesign hosted
services remain unconnected; this review used the installed local Design Taste
guidance and actual browser renders.

### Verdict

The header now maps directly to the four page sections. Its visible language
choices and fixed action geometry make switching language predictable without
changing the approved hero, motion or content.

## Match desktop/tablet framing and rename navigation — 17 October 2026

### P1 — Verified fix

The wide-screen camera still used option A's comparison-preview pose rather
than the static illustration's projection. The phone calibration now applies
to every breakpoint: position [4, 8.3, 6.5], target [0, -0.24, 0], roll 0.54,
zoom 1.07 and view offset [-0.0235, 0.054]. The page keeps its existing 86%
wide-screen artwork sizing and +10 degree layout rotation. Phone sizing and
-12 degree crop are unchanged. All six posters are regenerated from phase zero.
Before/reference: artifacts/wide-framing/768-before.png,
1440-before.png and their static-reference counterparts. After:
artifacts/ring-framing/768-light-ready.png and 1440-light-ready.png.
The reconstructed shape still differs from the original image in thickness
and notch detail; this is matched framing rather than recovered source CAD.

### P2 — Verified fix

The English navigation label is now "Launch video" on the homepage and the
three retained hero reference pages. The four-section order, bilingual control
styling and fixed demo-button geometry remain intact. The rendered header suite
passes 60 states from 320 to 1440px and 16 tagged Axe scans without violations.

### Verification and measured geometry

Six delayed-bundle cases cover phone/tablet/desktop in light and dark mode.
Poster and live-canvas bounds agree within 0.1 CSS pixels, at the same phase
zero pose. Mean loading-to-live pixel differences remain below 0.3/255.
Resize and reduced-motion checks pass. Desktop/tablet views were visually
compared with the original composition; phone posters remain byte-identical.

The actual rendered mesh contains 79,572 triangles across 17 mesh objects,
with six unique geometries and 1,388,568 bytes of geometry buffers. This excludes
textures, reflection maps and renderer allocations. The procedural source and
renderer setup are 8,363 bytes; the complete bundled JavaScript is 578,693 bytes
(149,034 bytes with gzip). The HDR reflection environment is 6,312,947 bytes.
There is no separate GLB download. Evidence: design-assets/mesh-report.json.

### P0 / unresolved P1

None in this scope. The existing physical-device/Safari and remote-host test
limits remain. Better Design/Superdesign hosted tools were not used.

### Verdict

All screen sizes now follow the original image's composition while preserving
the chosen silver material and real-axis rotation. The loading poster no longer
uses a different wide-screen camera.

## Mesh optimization with matched appearance — 17 October 2026

### P2 — Verified performance fix

The ring used 79,572 triangles, including 1,536 angular subdivisions around
the outer wall and 128 around every small bore. It now uses 19,562 triangles
(75.4% fewer). Broad outer arcs use 192 samples, with extra samples around each
notch's curved transitions. Central profiles retain 192 segments; the small
bores use 32. All original profile bevels, grooves and the underside remain.
Twelve repeated bores share one instanced draw rather than twelve separate
draws, reducing actual render calls from 17 to 6. Geometry buffers decrease
from 1,388,568 to 340,828 bytes, plus 768 bytes of instance transforms.

### Visual verification

The previous and optimized versions were rendered at 1100 × 1005 pixels for
eight phases (0, 3, 6, 9, 12, 15, 18 and 21 seconds), using identical camera,
materials, maps, studio reflections and lighting. Foreground mean RGB error
stays below 0.5/255, and silhouette disagreement below 0.04%. The reviewed
contact sheet is artifacts/mesh-optimization/comparison.png; full frames and
numeric reports are alongside it. The silhouette, bore rims and highlights
remain visually close at the site's display sizes. This is not pixel identity.

All six phone/wide posters are regenerated from the optimized model. Six
delayed-bundle checks cover phone, tablet and desktop in both themes; geometry
and phase zero handover remain stable. All six tagged Axe scans have no
violations. Resizing, reduced-motion behavior and automatic rotation retain
the fixed camera and original machining axis. The optimization changes no
headlines, navigation, legal names, logos, theme or booking behavior.

### Budgets and limits

This bounded change targets fewer than 24,000 triangles, fewer than 500 KB of
geometry buffers, at most six draw calls, unchanged framing and no visible
loading jump. Those targets pass. It reduces GPU vertex work, geometry memory
and draw submission; no measured physical-phone FPS gain is claimed.

The procedural source is 9,515 bytes; its full JavaScript bundle is 582,429
bytes (150,157 gzip). Download size therefore changes little. The existing
6,312,947-byte HDR remains to preserve the approved silver reflections, so the
complete loaded page remains above the general 1.5 MB marketing-page budget.
This mesh-only request does not change that lighting asset or the launch video.
The budget remains LCP <2.5s, CLS <0.1 and field INP <200ms. A fresh Lighthouse
12.8.2 mobile simulation (150ms RTT, 1,638.4 Kbps, 4× CPU slowdown) recorded
LCP 40.1s, CLS 0 and total blocking time 1.70s, with 7,925,668 transferred
bytes on the uncompressed local server. These are lab results, not p75 field
measurements or physical-device frame rate. The full report and settings are
in artifacts/mesh-optimization/lighthouse-mobile.json. This polygon change
does not solve the page's existing download/startup bottleneck; that would
require a separate lighting and startup-loading optimization.

### P0 / unresolved P1

No new geometry quality regression was found. The loading budget miss above
remains outside this polygon optimization. Better Design/Superdesign hosted
reviews were not used; local performance and design-review guidance informed
this implementation.

### Verdict

The selected appearance and motion are retained with roughly a quarter of the
triangles and geometry memory. The next substantial download saving would
require a separate optimization of the HDR reflection environment.

## 60 FPS pacing with unchanged rotation speed — 17 October 2026

The hero controller now targets 60 FPS instead of 30. It carries fractional
frame deadlines forward, avoiding skipped alternate draws when browser frame
timestamps fall slightly below an exact 16.667ms interval. Missed draws are
skipped rather than queued. Rotation still advances from elapsed seconds;
the model's unchanged angular rate is 2π/24 radians per second.

The camera, optimized 19,562-triangle mesh, first-frame posters, materials,
lighting and layout are unchanged. Offscreen, hidden-page and reduced-motion
pauses remain. The read-only QA state reports the configured frame limit and
render count; no extra controls or labels appear in the site.

Focused evidence is in artifacts/ring-60fps/: controlled 60/90/120/144 Hz
display clocks verify 60 FPS pacing and a 24-second revolution, while real
rendered phone/tablet/desktop views check cadence, fixed camera and reduction
of motion. These browser observations do not establish physical-phone FPS.

The local browser measured 60.0 FPS at 390px, 60.0 FPS at 768px and 59.7 FPS
at 1440px, with no script errors. All three reduced-motion checks stopped
rendering. Frame-clock simulations confirmed a 24-second revolution at each
tested refresh rate. The upload package contains the same verified controller.

## Password-screen footer font options — 17 October 2026

### P2 — Preference under review

The supplied crop matches the two-line tagline in hosting/php/login.php,
which currently uses Courier New at 10–11px. It is separate from the homepage
footer, whose tagline already uses Manrope. The user requested three font
samples, so the production login font remains pending their selection.

The review page dist/font-samples.html presents A: Manrope, B: Space Grotesk,
and C: IBM Plex Sans with the exact two-line wording, the login's #101719
background, a large specimen and a compact footer context. Manrope is the
recommended option for consistency with the main website. The new font files
are served locally with source URLs, hashes and OFL notices in font-options/.
The packager excludes this comparison page and its candidate assets from
future uploads; no final font choice has been applied.

### Verification

The browser confirmed all three actual font faces loaded at 320, 390, 768 and
1440px. No horizontal overflow, script errors or tagged Axe violations were
found. Desktop, tablet and phone captures were visually reviewed in
artifacts/font-samples/; three-font-options.png is the comparison sheet.
Better Design/Superdesign hosted services were not used.

## Selected C footer and FAQ scroll correction — 17 October 2026

### P1 — Scroll regression fixed

Each FAQ transition previously ended with ScrollTrigger.refresh(), which
temporarily set the document scroll position to zero twice before restoring
it. An instrumented comparison against the previous delivery reproduced those
calls at 390 and 768px, even where Chromium restored the final position. This
is an avoidable source of mobile jumps and no longer occurs on FAQ toggles.
The controller now refreshes only animation instances following the changed
row, then updates their state. No forced scroll restoration competes with the
reader's gestures. Expand/collapse motion and native disclosure semantics stay.

### P2 — Requested footer changes

The user selected C: IBM Plex Sans. The production font and OFL notice are
included locally. The password page embeds the same font before authentication;
the website loads it as a protected WOFF2. The footer tagline is the single-line
sentence "Thoughtful software for the work that matters." The website's existing
Japanese translation remains. The original image-based logos are unchanged.
The sign-out form/button was removed; "Private preview / 限定公開" remains.
Password verification, CSRF protection and session expiry are retained.

### Verification

Eighty FAQ open/close actions across 320/390/768/1440px and both languages
remain within section 04, with zero scroll-to-top calls. All eight tagged Axe
scans pass. Both password-screen and website taglines remain one line, with
IBM Plex Sans loaded and no horizontal overflow. The packaged PHP checks pass,
including authentication, protected fonts/assets, theme transitions, 3D rotation,
film byte ranges and the private-preview label without a logout control.
Captures and numeric evidence are in artifacts/footer-faq-update/.
These are rendered browser checks, not a claim of physical iPhone/Safari testing.
Better Design/Superdesign hosted services were not used.

## Faster 3D startup and centered login - 17 October 2026

### P0 - Blocking

None found in the final local PHP package. Before authentication, the model
engine and lighting asset return 401. The configured password, CSRF token,
expiry, rate limit and protected video byte ranges remain in the controller.

### P1 - Loading delay fixed

The prior environment download was 6,312,947 bytes, after the engine loaded.
The same 2048 x 1024 RGBE bytes are now stored in opaque lossless WebP panels
(2,293,464 bytes). Opaque packing avoids alpha premultiplication of exponents.
The worker reconstructs half floats with the installed Three HDRLoader math,
and synthesizes the identical metal textures away from the main UI thread.
No lighting resolution or geometry was reduced. Eight paired poses at 0, 3,
6, 9, 12, 15, 18 and 21 seconds have zero foreground and alpha difference.
See artifacts/fast-start-login/ring-before-*.png, ring-after-*.png and
lighting-diff.json. The initial 1K experiment was rejected because it altered
reflections; the final lossless version preserves the original render.

The engine is preloaded, the controller runs before the other deferred site
scripts, and the lighting fetch overlaps engine loading. The idle timeout
is removed. An early fetch-preload implementation failed a throttled browser
check and was removed; the final lighting request is consumed once by the
controller and passed as a Blob to the worker. Both worker failure and absent
OffscreenCanvas have a tested main-thread fallback.

A cache-disabled 390px local Chrome test with 10 Mbps downstream, 40ms latency
and unthrottled desktop CPU improved from 6,896ms (one baseline observation)
to a 3,647ms median (three new observations), about 47%. A fresh authenticated
PHP reload under the same network settings started in 3,711ms with one lighting
download. The unthrottled median was 422ms; the first cold GPU run was 915ms.
These observations are not phone/Safari or field measurements. The observed
render rate remains 59.9 FPS across phone, tablet and desktop lab viewports;
the time-based revolution still takes 24 seconds. Reduced motion stops it.

### P2 - Header and title fixed

Before-site captures show three header controls. The final header contains
JP・EN followed by the theme switch, with the header demo removed. The hero
and lower booking actions remain. Sixty English/Japanese/theme/breakpoint
layout checks pass from 320 to 1440px, including all four section links,
keyboard use and fixed control geometry. Sixteen tagged header/page scans
have zero violations. English/Japanese marketing dictionaries and content
outside the header match the previous delivery. The English document and
Open Graph title now use the requested plain hyphen.

### P2 - Login identity and hierarchy fixed

Before-login-390/768/1440.png show the left-aligned dark login with top status,
a separate eyebrow and footer tagline. The final login centers the original
logo above the invitation, then the bilingual introduction and password form.
The heading, label, button text, access note and copyright share the same
center line. Only the copyright remains in its footer. No top information or
SOMA / SCHEDULER eyebrow remains. The website footer is preserved.

Light mode uses the main site's white surface, dark navy text and blue/teal
accent spectrum; dark mode uses #101719. Manrope, the original light/dark
logo artwork and the same saved theme logic are embedded before authentication.
The two original ring crops rotate in opposite directions and retain their
phase during the logo crossfade. User-requested side glows are subtle at the
edges and leave the form readable; the login uses the requested centered
composition. Reduced-motion preferences remove its rotation and transitions.

### Verification and rendered review

Reviewed login captures at 390, 768 and 1440px, light/dark; website hero captures
at 390/768/1440px; full-page captures after scrolling each section into view;
and eight lighting comparison poses. The login error case is labeled with
aria-invalid and role=alert. Eight responsive login plus eight site scans,
an extra error scan, and six matched-poster scans have zero tagged Axe
violations. No overflow at 320px. Light/dark preference survives reload and
successful login; the original wordmark changes with the surface. The FAQ
still expands/collapses without scroll-to-top calls. The logo spins unless
reduced motion is enabled. No play/pause controls were added to the 3D object.

Screenshot and numeric evidence: artifacts/fast-start-login/,
artifacts/header-update/, artifacts/ring-framing/ and artifacts/ring-60fps/.
The actual packaged PHP controller was tested on port 4191. Better Design MCP
and Superdesign hosted services were not connected, and no remote review is
claimed. Installed local Design Taste typography, color, landing-page,
accessibility and review instructions were applied.

Verdict: the login now shares the site's identity and gives a clear single
entry action. The largest improvement is the faster, visually identical 3D
startup; the selected phone editorial and wide spotlight layouts are retained.

## Rings-only animated favicon - 17 October 2026

### P0 - Blocking

None found. The website, video, model, fonts and JavaScript remain password
protected. Only two explicit brand PNG routes are available without a session:
assets/favicon.png and assets/apple-touch-icon.png. The login animation is
embedded in the PHP template. No private-page or directory access was opened.

### P2 - Requested tab identity and motion

The previous website icon was a static rings crop; the login had no explicit
favicon. Both now use the original mark with no wordmark, with the outer ring
rotating clockwise every 24 seconds and the inner ring counterclockwise every
30 seconds. The supplied light and dark logo crops contain byte-identical ring
pixels, so a single shared pair of layers preserves the original colors.
The crop is centered on the same (700, 593) pivot as the page's logo animation.
No new mark, font, gradient or visual language was introduced.

A 64px transparent PNG is the initial and reduced-motion fallback. A 180px
static touch icon is included. JavaScript updates the favicon with small local
PNG frames at eight updates per second, with no per-frame network download.
This avoids depending on SVG/GIF favicon animation. Browser tab-icon display
and caching remain browser controlled; the live animation was exercised in
local Chrome, not Safari or a physical phone. Browsers that do not display live
changes retain the initial static rings icon. The controller pauses on hidden
pages and stops under prefers-reduced-motion, without changing the document
body, title, styles, main logo, 3D rendering, or marketing copy.

### Verification and rendered review

Twelve rendered checks cover login and authenticated website at 390, 768 and
1440px in both themes. Consecutive actual 64px PNG favicon frames differ. The
static mark was reviewed at 16/32/64px on light and dark tab-like backgrounds
(artifacts/animated-favicon/favicon-sizes.png); the unchanged line-art identity
remains fine at 16px. Full-page top captures retain the previous layouts.
Reduced-motion toggles freeze/resume updates on both pages. Simulated visibility
events stop/resume the update loop. JavaScript-disabled login and unavailable
favicon-script cases retain the static mark. Public PNG requests return image/png;
protected scripts/model/lighting return 401 before login. No page script errors.
See artifacts/animated-favicon/results.json and the paired frame captures.
The existing asset and both 32-second / 60 FPS video checks also pass.

Verdict: the tab now carries the requested moving brand mark on both pages,
with a static fallback and no page-layout changes. Local Design Taste brand
identity, motion and accessibility guidance was used. Better Design MCP and
Superdesign hosted workflows were not connected or claimed.

## Original stacked login logo - 17 October 2026

### P0 / P1 - Blocking and quality regressions

None found in the rendered login views. Password submission still unlocks the
website; all 77 deployed website files match the preceding delivery byte for byte.

### P2 - Requested logo composition fixed

Before: the login used a horizontal 52px ring beside a 190px wordmark (44/164px
on phones). After: the original animated rings sit above the original image-based
wordmark. The ring width is 742/1193 of the wordmark width, and their gap is
64/1193 of that width, using the supplied artwork's source coordinates. Heights
also use the original viewBox ratios; neither crop is stretched. The stacked
logo is centered at 190px overall width, or 164px on phones. Light and dark
backgrounds use their corresponding supplied logo artwork. The outer and inner
rings retain their existing 24-second and reversed 30-second loops.

### Rendered verification

Reviewed the original artwork and before captures, then the updated 390px dark,
768px light and 1440px dark renders. Eight light/dark captures at 320x568,
390x844, 768x1024 and 1440x900 have no horizontal overflow or tagged Axe
violations. Measured ring/name widths and vertical gap match the original source
proportions. Theme changes preserve the rotation phase; reduced motion stops
rotation. The main page's horizontal header logo and all marketing text remain.
Evidence: artifacts/stacked-login-logo/, including original-balance-light.png,
the per-viewport renders, brand crops and results.json. Local brand-identity,
motion, typography, layout, accessibility and review guidance was used. Better
Design MCP and Superdesign hosted workflows were not connected or claimed.

Verdict: the login now uses the supplied logo's stacked composition and balance,
while retaining its existing animation and centered invitation layout.

## Complete Plex label font, phone footer and language states - 17 October 2026

### P0 / P1 - Blocking and quality

None found in the final rendered checks. All website words remain identical to
the preceding delivery. No new assets or external dependencies were introduced.

### P2 - Remaining typewriter font corrected

The prior footer used selected option C (IBM Plex Sans), but the shared --mono
setting still selected Courier for hero categories, section captions, section
numbers, timestamps and other metadata. It now aliases the selected Plex label
family. The existing licensed local WOFF2 face is defined in the shared stylesheet
and preloaded. Metadata uses its supplied 500 weight. SVG technical labels and
the comparison-gallery status note also use Plex; no Courier/monospace reference
remains in deployed root HTML/CSS/JS. Film authoring sources and baked videos were
not edited. The primary Manrope content typography and original logo artwork stay.

### P2 - Phone footer reordered

At phone widths the tagline and Back to top occupy the first grid row. The
centered SOMA logo follows, then the centered company copyright. English and
Japanese content stays intact. The English tagline wraps with balanced lines
where required so the adjacent action remains readable at 320px; the action has
a 44px touch height. Wider footer arrangements retain their previous structure.
Before capture: artifacts/stacked-login-logo/before-footer-390.png. Final captures:
artifacts/plex-labels-footer/390-light-en-footer.png and 390-dark-ja-footer.png.

### P2 - Active and inactive language contrast

Only the selected language uses 700 weight and the existing blue accent/underline.
The inactive choice and separator use 400 weight, in black (#101719) on light
surfaces and the site's light neutral on dark surfaces. Both choices keep their
fixed 40x44px cells, so control positions do not move when language weight changes.
The neutral color also participates in the site's theme transition.

### Rendered verification

Reviewed phone, tablet and desktop hero captures, both language states, light and
dark headers, and the phone footers in English and Japanese. Sixteen authenticated
PHP views at 320/390/768/1440px pass label-font checks, control state checks, phone
footer alignment/order checks and tagged Axe scans with no overflow or script
errors. Sixty header breakpoint/theme/language checks and sixteen additional
header accessibility scans pass, preserving geometry and keyboard interaction.
Main page text matches the preceding package after normalizing whitespace.
The existing asset and both video format checks pass. No physical phone/Safari
test is claimed. Evidence: artifacts/plex-labels-footer/results.json and captures,
and artifacts/header-update/results.json. Local Design Taste typography, layout,
accessibility and review guidance was used; Better Design MCP/Superdesign hosted
workflows were not connected or claimed.

Verdict: the selected font is now consistent across all former typewriter labels,
and the phone footer and language selector reflect the requested hierarchy.

## Login fits the screen height - 17 October 2026

### P1 - Vertical overflow fixed

The stacked login previously required 870px of document height in a 1440x640
window, 758px on a 390x667 phone, 750px on a 320x568 phone, and 827px in an
844x390 landscape viewport. The password action and copyright could sit below
the visible screen. Before renders and measured heights are recorded under
artifacts/login-fit/before-* and before.json.

The login now sizes its stacked logo, heading, margins and padding according
to available viewport height. Short-height breakpoints tighten the composition;
landscape and short wide panels place the form beside the centered introduction.
The logo keeps its original ring/name proportions and opposite rotations. The
bilingual copy, colors, saved light/dark theme and favicon remain intact.

This fixes the layout rather than hiding the scrollbar: no overflow:hidden or
fixed-height clipping is used. Password text remains 16px to avoid focus zoom,
and input/button targets remain at least 44px. Error messages get room in the
compact layout. Extra content can still be scrolled when required by keyboard
or enlarged-text conditions; ordinary tested views need no scrolling.

### Rendered verification

Twenty-six light/dark views at thirteen viewport sizes fit horizontally and
vertically, with all content and the footer visible. These cover 320x480,
320x568, 375x600, 390x667, 390x844, 768x720, 768x1024, 1280x600, 1440x640,
1440x900, 568x320, 844x390 and 1024x500. Thirteen incorrect-password states also
fit. Ten additional tagged Axe scans pass. Rotation phases were checked for
scroll overflow at five angles in each representative view. Successful login
still opens the site; all 77 deployed website files are byte-identical to the
preceding delivery. No browser script errors were observed. No physical-phone
or virtual-keyboard test is claimed.

Reviewed compact portrait, tablet, short desktop and landscape renders in both
surfaces. The Japanese intro uses balanced wrapping in landscape. Evidence:
artifacts/login-fit/results.json, fit-results.json and final-*.png captures.
Local Design Taste layout, typography, brand and accessibility guidance was
used. Better Design MCP and Superdesign hosted workflows were not connected
or claimed.

Verdict: the full login is visible at the tested screen sizes, with readable
controls and the existing stacked animated identity preserved.


## Separate About page - company story

### P1 - Fixed

- First rendered pass mixed the Japanese shared navigation with English company
  content because the page dictionary was not loaded before the shared locale
  controller. The dictionary now loads first; all sixteen rendered language,
  theme and viewport combinations show the correct company copy and page title.
- Shared display heading specificity enlarged the new section captions. A scoped
  label rule now retains IBM Plex Sans at 12px, keeping the editorial hierarchy.
- A direct About URL needed the existing password screen and return destination.
  About is now an explicit page request in the PHP gate, while private assets
  still require authentication. Ten isolated PHP CLI controller checks passed.
- The five-link phone navigation now uses a five-column grid with natural text
  wrapping. All destinations retain 44px minimum height; 320px layouts do not
  overflow. The original four product links retain their order.

### P2 - Fixed

- The keyboard skip link now appears on focus rather than occupying a permanent
  line above the header. Activation focuses the main landmark.
- Shared scroll animation setup now ignores absent page triggers. The company
  page has its own restrained downward reveals and shares native, animated FAQ
  disclosures, theme transitions and the original rotating header/footer logo.

### Content awaiting the owner

The supplied customer text is "Masa company"; it is shown as text, without an
invented customer logo, testimonial, metric or web address. Founder names, the
establishment date, office location and Masa's official name/site were requested.
Until supplied, founders are described by the three confirmed areas; the date
row remains hidden and the location FAQ links to contact. Mission and vision
copy is a proposal grounded in the existing product direction. No live shop-floor
tracking or ERP integration is presented as a current Scheduler capability.

### Verification

Evidence is under artifacts/about-page/. Captures cover desktop 1440, tablet
768, phone 390 and narrow phone 320 in English/Japanese and light/dark. Sixteen
views had no document overflow and all header navigation targets were at least
44px tall. Viewed the complete phone, tablet-dark and desktop-light compositions.
Company FAQ toggles remained below the top (scroll offsets >3600px on the tested
phone); the demo dialog opened and closed; company/product navigation preserved
language and correct titles. The homepage main markup and booking dialog are
unchanged. Static asset and both launch-video checks passed.

The PHP checks use trusted CLI fixtures and do not expose the old local PHP
runtime as a web server. They verify application routing, CSRF rejection, login
return destination, authenticated/unauthenticated boundaries, secure cookie
configuration and traversal rejection. They do not verify the remote host's PHP
patch status. Delivery instructions require security-patched PHP. No remote site
was published or modified. Better Design MCP and Superdesign hosted services
remain unconnected; no remote design review is claimed.

Verdict: the company story has its own editorial page, with an original-brand
hero, mission/vision spread, restrained customer line, readable company facts and
a separate company FAQ. The remaining content work is factual company detail.

Additional accessibility evidence: 55 visible-layout text samples in the light
theme passed computed contrast thresholds; an earlier dark-theme sample also
passed. The page has one h1, no unlabeled visible buttons, a working keyboard
skip link, native disclosure semantics and reduced-motion gates. These are
DOM/keyboard checks, not a full screen-reader or physical-device certification.

## About company facts update - 24 October 2026

### P1 - Fixed

- Replaced the temporary customer name with the owner-confirmed Nippo K.K. in
  English and Japanese. No customer logo, testimonial or result was added.
- The story, lead, mission, vision, offering and company FAQ now describe SOMA
  as an AI-agentic company. This describes company operations and development;
  the current Scheduler product claims still follow the BRD.
- Added Steven Lim, CEO; Federico Martinolich, CPO; and Luis Paolino, CTO to the
  founder list, company details and company FAQ. The role descriptions localize
  while the supplied personal names remain unchanged.
- Removed em dashes and their encoded forms from first-party website copy,
  titles, request-email subjects and retained reference pages. The homepage
  sentence about a readable, changeable plan now uses natural wording without
  the punctuation. Third-party library/license text was preserved.

### P2 - Verified

- Founder rows stack role descriptions below names on smaller screens. All
  names fit at 320, 390, 768 and 1440px widths in English/Japanese and light/dark.
- Sixteen rendered views have no horizontal document overflow or clipped
  founder rows; all five header navigation links retain 44px minimum height.
- Viewed full phone, tablet and desktop captures. The new AI-agentic company
  FAQ opens and closes by keyboard and pointer without returning to the top.
- One h1, a labeled list of three founders and six native company disclosures
  are present. Browser console has no captured errors or warnings.

Evidence: artifacts/about-company-update/. Layout and interaction reports,
accessibility semantics and screenshots were captured from the real browser.
The text/metadata scan found no em dash forms or temporary customer name in
first-party deployable text, including the PHP login source.

No new P0/P1 visual issues found in the tested layouts. Establishment date and
office location remain unconfirmed, as does the customer's logo/website. No
PHP/authentication, launch-video or 3D-model changes were required for this
update. The previous isolated PHP checks remain applicable to unchanged gate
code; no remote server patch status is implied. Better Design MCP and hosted
Superdesign remain unconnected, and no remote review is claimed.
