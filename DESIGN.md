# Design

Marketing surface for Soma. Mode: **Persuade**. Four candidate visual worlds are
built in parallel under `src/versions/` so they can be compared live; **exactly one
survives selection** and the rest are deleted along with this note.

The retired Argus system (graphite `#0E1115` + paper `#F6F7F4` + green `#27A567`,
Archivo display, IBM Plex Mono labels, eyebrow over every section, four equal cards)
is kept at `src/versions/current/` as the anti-reference and comparison baseline. It
is not the baseline any new world negotiates with.

## Rules that hold across all three worlds

1. **Typography only.** No screenshots, no logo asset, no photography, no stock
   imagery. Every graphic is drawn in the world's own grammar from CSS or SVG.
2. **Both languages are first-class.** Japanese never renders as a degraded copy of
   the Latin layout. Negative tracking is Latin-only; JA display type gets its own
   scale, its own leading, and `word-break: auto-phrase`.
3. **Contrast floor is WCAG AA** (4.5:1 body, 3:1 large). Interactive targets ≥24px,
   the language toggle included.
4. **No invented proof.** No logos, counts, quotes, prices, benchmarks or ROI. The
   design partner may be described ("a 39-person shop machining semiconductor
   components in Japan") but never named.
5. **Motion is one authored moment per page**, not an entrance on every section, and
   it must survive `prefers-reduced-motion` by rendering the finished state.
6. **Every atom is rebuilt in the committed world.** A default button, card or nav
   inside a committed world is a lapse.

## World A — Whiteboard (`versions/whiteboard`)

The board the product replaces, as a flat graphic language — marker, magnet, tape,
aluminium rail. Not a photographic or 3D render; no gloss, no bevel, no paper texture.

- Ground: enamelled steel white `#F1F3EF`, faint cool sheen, aluminium trim `#B9BEC2`.
- Marks: marker black `#22262B`, marker red `#C8392B`, marker blue `#2E5C8A`,
  erased-ghost `#DDE2DD`. Magnets carry the mark colors as fills.
- Type: heavy grotesk for written headlines, set with a ≤1.5° rotation so lines read
  as hand-placed; mono only on tape labels and machine IDs, where it is lettering on
  a physical label rather than a costume.
- Motion: one order magnet moves and the magnets after it re-flow, leaving a dashed
  ghost at the old position.

## World B — Teletext (`versions/teletext`)

A broadcast information service, not a marketing page. Strict character-cell grid.

- Palette: the fixed broadcast eight on flat black `#000`. White body, yellow section
  headers, cyan live figures, red for actions and alerts, green for confirmed state.
- Type: one mono face on a rigid cell lattice sized in `ch`; double-height rows for
  headers; all graphics drawn as block mosaics from the same cells.
- Topology: sections are numbered pages (100, 200, …) addressable by keying digits.
- The 40-column row is the unit: small screens scale the cell, never reflow the grid.
- Motion: bars build cell by cell; the header clock ticks. Both stop under
  reduced-motion with the finished grid shown.

## World C — Engineering drawing (`versions/drawing`)

The routing knowledge as JIS-style drafting notation, where the notation carries real
information rather than decorating.

- Ground: drafting vellum `#E9ECE6` — a cool gray-green, explicitly **not** cream.
- Lines: iron-blue print `#1B3A5C` for all linework and body, revision red `#B4291F`
  for callouts and the primary action, 45° section hatching, dimension lines with
  proper arrowheads and extension-line gaps.
- Structure: sheet border with zone letters and numbers, a title block bottom-right
  carrying a revision table; sections are drawing views.
- Dimension lines must measure something true (a real duration, a real count). A
  dimension line with a decorative value is a defect.
- Motion: linework draws in once along its own path, title block last.

## World D — Wash (`versions/wash`)

The pale-wash product register, pinned by the user as a reference (chorus.com). The
pin supplies register and composition only; palette, content, fragments and type
choices are Soma's own. No borrowed marks, copy or assets.

- Ground: sage-to-sky vertical gradient `#EFF4E9 → #E3EEF7`, never cream.
- Ink `#14171A`, muted `#55605C`, accent `#0E7A5F` on field `#DCF0E6`.
- Soft geometric sans throughout; large centred display with tight tracking.
- Signature: a swap token in the display sentence cycling the three things that
  actually break a plan (rush order, machine down, late material). It pauses under
  reduced-motion on the first value.
- Structure: the "today → Soma" column pairs, sourced from the BRD's stated pains.
- Floating fragments are authored, never screenshots, and carry an illustrative label.

## World E — Plant (`versions/plant`)

World D's composition rebuilt in World C's materials, with shop-floor hardware. The
arrangement is D's (centred display sentence with a swap token, paired actions, margin
fragments, today/Soma column grid); the surface is C's.

- Palette is C's exactly: vellum `#E9ECE6`, iron `#1B3A5C`, body `#2C4763`,
  lettering `#4A6080`, hairlines `#5E7591`, revision red `#B4291F`.
- Squared corners and 1.5px rules replace D's soft shadows and rounded surfaces
  everywhere. No `border-radius` anywhere in this world.
- 45-degree hatching is the only fill, and it carries the today→Soma transition in
  place of D's arrow. Each instance needs its own pattern id.
- Condensed gothic for every label, uppercase and tracked, as stencilled plant signage.
  Display type is the grotesk, not the condensed face.
- The swap token is a solid iron chip with white lettering — a machine tag, not a
  tinted pill.
- Section boundaries are full-width 1.5px iron rules; sections do not float on cards.
- The machine hall carries a true dimension (5 machines, 10 days) matching what it
  draws, and is labelled illustrative.

## Shared tokens

Only these are global; each world defines its own palette locally so the three cannot
bleed into each other.

- `--contact-email` lives in `src/lib/contact.ts` (currently a placeholder).
- Type loading, reduced-motion handling and the JA typography rules live in
  `src/index.css` and apply to every world.
