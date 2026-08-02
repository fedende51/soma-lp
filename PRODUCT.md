# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Operation manager** (primary). Runs the daily schedule for a high-mix, low-volume
machine shop. Today they hold the plan on a physical whiteboard near the machines,
reserving machines by availability and re-drawing the board every time reality moves.
They are the person who decides what runs where, and the person disruption lands on.

**Senior engineer** (secondary). Holds the routing knowledge — which machines can run
each step of a part, in what sequence, how long each takes. In the reference shop only
two people hold it, it exists nowhere but their heads, and it gates every new part.

**Machine operator** (tertiary). Works from the plan; in the capture half, their machine
reports progress rather than them writing it down.

Daily users work in Japanese. The evaluating audience is Japanese SME manufacturers.

## Product Purpose

Replace the whiteboard, the spreadsheet and the paper travelers with one plan the shop
can actually follow, and keep that plan matching the floor without anyone re-entering
data. Success is the operation manager trusting it for daily use over the whiteboard —
rescheduling has to be faster and safer than erasing, or the tool gets abandoned.

## Positioning

Two things together that the category ships separately:

1. **Routing knowledge captured once and reused forever.** A part's steps, compatible
   machines, setup and cycle times, inspections and outsourced operations are recorded
   once and every future order reuses them. Incumbent schedulers take the routing as an
   input; Soma is where it gets captured. This is the durable differentiator.
2. **The plan and the floor stay reconciled.** Cameras and sensors cover machines with
   no connectivity, so reality reaches the same board the plan lives on.

Third, and the reason the tool survives contact with a real shop: **every change is
priced before it commits.** Move one order, see the full downstream consequence,
approve or not, undo anything.

## Operating Context

High-mix low-volume precision CNC. The reference shop is ~39 employees on two
production lines, machining semiconductor equipment components — shower plates,
exhaust plates, diffuser rings, lens barrels.

The real workflow is a chain of paper: an order export from the customer's own order
system, a printed process work card, an inspection check sheet, a lot-start sign-off
co-signed before each lot, and a shipping inspection form. Orders are routinely split
into lots (30 pcs → lots of 6), each tracking its own machine, NC program and dates.
Scheduling is the whiteboard step in the middle of that chain, and it is the step the
product replaces. Shifts, holidays and maintenance are real constraints on any plan.

## Capabilities and Constraints

Working today (prototype): visual planning board on a multi-week timeline, drag-and-place
onto machine rows with step-sequence and machine-type validation, ripple rescheduling
with a full impact preview and undo, auto-scheduling for one order or a whole backlog,
part/routing library, capacity and per-employee views, JA/EN throughout, local
persistence behind a repository interface, runs in a browser.

In progress, not shipping: camera and sensor capture of machine starts, stops and
progress. **Both halves are prototypes.** No future work may describe either as
deployed, in production, or in daily use at a customer.

Not modeled: lot-level sub-splitting, material/mill-sheet tracking, per-piece serialized
marking, multi-user accounts and permissions.

Terminology is plain, never scheduling jargon: "total time" not "makespan",
"one-piece flow" not "pipeline".

## Brand Commitments

Name is **Soma** — company and product. Formerly Argus; the old name and its
hundred-eyed-watchman story are retired and must not resurface.

The two halves are **not** sold as separately named products on the marketing surface.
No "Soma Scheduler" / "Soma Data Feed" split in customer-facing copy; it is one product
that plans and one that sees, presented as equal parts of a single thing.

Voice: plain, declarative, benefit-first. No narrative flourishes, no feature-backward
phrasing, no mythology. Established in `brochure/brochure-content.md` (v2) in the
Manganese project and binding on marketing copy.

Bilingual EN/JA with native-quality Japanese, English-first on the marketing site.

## Evidence on Hand

- **Design partner, describable but not nameable:** a ~39-person shop machining
  semiconductor components in Japan. Its paper trail, machine list and real production
  workbook informed the product. The company name may not appear on public surfaces.
- **Source documents** (Manganese project, outside this repo): `scheduler_brd.md` — the
  BRD, with epics, personas and the confirmed order lifecycle; `brochure/brochure-content.md`
  — approved v2 marketing copy and voice; `previsionデータ.xlsx` — the customer's real
  paper-trail workbook.
- **Team:** three people, real roles at Woven by Toyota, Capgemini Engineering and Amazon.
- **Deliberately absent — never fabricate:** customer logos, named references, quotes,
  testimonials, user counts, pricing, benchmarks, time-saved or ROI figures, press.
- **No product imagery** is to be used on the marketing site: no screenshots, no logo or
  wordmark asset, no photography. The site carries on typography and layout alone.

## Product Principles

1. **Change management first.** The whiteboard's real job is absorbing disruption.
   Anything that makes rescheduling slower or riskier than erasing is a regression.
2. **Capture the knowledge, not just the plan.** The routing decision is the asset; the
   schedule is a by-product of it.
3. **Two-click happy paths.** Repeat orders are the common case and take seconds.
   Complexity is available, never required.
4. **Plain language, in both languages.** No jargon, and Japanese that reads as though it
   were written first.
5. **Claim only what is built.** Both halves are prototypes; specificity substitutes for
   proof until real proof exists.

## Accessibility & Inclusion

Daily users work in Japanese on a shop floor. Bilingual parity is a product requirement,
not a localization afterthought: Japanese must never be a degraded rendering of the
English layout. Text contrast meets WCAG AA and interactive targets meet the 24px
minimum — the language toggle especially, since it is how the Japanese audience arrives.
