# SOMA / precision in motion

Audience: owners, operation managers, and senior engineers in precision machining. Product truth: replace the whiteboard with a planner-maintained schedule, capture reusable routing knowledge, and make rescheduling understandable. Live shop-floor tracking is future scope.

The current direction is a precise, readable industrial editorial: a white opening, deep-blue typography, blue/cyan accents, the illustrative machined ring, with the owner-selected Editorial phone crop and Spotlight tablet/desktop composition, and a dark film section immediately after the hero. A single grotesk display/body family and separate mono metadata voice connect the site and film. No imitation customer proof or invented adoption numbers. The illustrative ring expresses the industry; it is not a customer's CAD asset.

Typography: Manrope variable 400/500/600; 16px marketing body, 12px metadata floor, 14px product interface, fluid 56–104px hero. Deliberate line breaks; modest negative headline tracking. Spacing: 4/8/12/16/24/32/48/64/96.

Token chain: primitives → semantic colors/spacing → component tokens. Main surfaces: white #ffffff, deep blue #003c5b, dark blue #052e46, white product surfaces. Sky blue #0b79a9 accents light surfaces; pale cyan #61dedb supports dark-surface actions. Muted text #536976 on white must pass 4.5:1. Text and component contrasts are measured in QA.

Motion: premium/corporate personality per LottieFiles. One counter-rotating ring entrance, followed by the SOMA wordmark at 0.96 seconds. Content enters with opacity 0→1 and 16px downward travel, with 90ms hierarchy staggering; section entrances happen once. GSAP matchMedia disables choreography under prefers-reduced-motion. A schedule change explains cause and effect. No ambient looping decoration, cursor replacements, or bounce.

Performance budget: <1.5 MB initial page transfer, local font and motion runtime, no video preload. Target LCP <2.5s, CLS <0.1, interaction latency <200ms. Report lab measurements separately from real-user performance.


Current identity correction: crop the exact supplied wordmark from `logo_soma_light.png` on white and `logo_soma_dark.png` on dark. No replacement font and no `Logo.png` asset. Use the complete ring graduation across key headings, actions and illustration accents, with accessible darker/lighter variants for each surface. Measured minimum contrast at gradient stops: 4.33:1 for headline text on white, 5.55:1 for button labels, 5.21:1 for muted copy on dark sections.


The latest palette follows the owner's five-stop screenshot reference, with positions/values in `design-assets/brand-gradient.json`. The website uses a horizontal graduation. Corporate references use SOMA Co., Ltd. in English and 株式会社SOMA in Japanese, including the footer copyright, demo-request heading, page title and company invitation copy. SOMA Scheduler and Soma Data Feed remain product names. The original wordmark artwork is preserved.


Selected homepage composition, 17 October 2026: Editorial at widths through 640px; Spotlight above 640px. The phone has the approved stacked headline, asymmetric ring crop and 60%-white frosted knowledge note. Tablet/desktop use the approved left sculpture, fine orbital accent, right copy and compact expertise caption. One heading, description and image support the responsive composition. CSS switches visible copy and captions; no device-detection script or second image is needed. Film playback stays in its dedicated inline section.


Owner refinement: the routing note uses 60% white opacity, an 18px backdrop blur, subtle border/shadow and 18–20px rounded corners. Keep its plain label/title/copy; it is informational rather than a simulated control. A 94% white fallback preserves legibility in browsers without backdrop-filter. Minimum calculated text contrast is 4.98:1 even over an underlying black pixel.


Film player refinement: the poster has one play invitation. Playback controls are overlaid inside the picture, hidden on the initial poster, and fade after 2.2 seconds of inactive playback. Touch reveals them without pausing; keyboard focus and paused playback keep them available. There is no permanent strip or download link below the video. Preserve captions, seeking, sound, fullscreen and a native no-JavaScript fallback. The encoded films are unchanged.


Transparency refinement: reduce the routing note's white alpha from 0.70 to 0.60. Keep its existing blur and radii, and use the deeper navy routing-note ink token (#062e43) so normal text remains above 4.5:1 even against a worst-case black backdrop.


Hero direction study, 17 October 2026: three standalone alternatives share the approved original light logo, five-stop spectrum, white canvas and current site below the opening. Editorial uses oversized stacked typography and an asymmetric sculpture crop. Spotlight puts the component first, with a thin brand orbit and a compact frosted expertise caption. Flow pairs the part with a static illustrative route; it is neither a scheduler sample nor live shop-floor status. The original homepage is untouched while the owner compares them. `hero-directions.html` provides phone/tablet/desktop previews; `hero-{editorial,spotlight,flow}.html` opens each full page.


The owner has selected the responsive combination on the main homepage. The three standalone study pages remain available as references. The selected component is isolated in `dist/hero-selected.css`; bilingual responsive copy lives in the normal translation dictionary.
