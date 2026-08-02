/**
 * K · Studio is one layout in four colourways. Only these values change between the
 * variants; composition, copy and motion are identical, so a comparison isolates
 * colour.
 *
 * The three coloured variants commit colour at page scale rather than sprinkling it:
 * the ground itself is tinted, cards are a deeper tint of the same hue, tags sit in
 * filled chips, and the closing section is a saturated field that owns the whole
 * region. `mono` stays restrained on purpose, as the control.
 *
 * Every text/ground pairing below clears 4.5:1, and every large-display pairing 3:1.
 */
export interface Palette {
  ink: string
  muted: string
  line: string
  /** Page ground. Tinted on the coloured variants. */
  tint: string
  /** Card fill: a deeper step of the ground hue. */
  panel: string
  /** Tag chip fill and its text. */
  chipBg: string
  chipText: string
  /** Headline accent, group labels and marks. Readable on `tint`. */
  accent: string
  /** Live-status dot. Free to be brighter since it carries no text. */
  dot: string
  ctaBg: string
  ctaText: string
  /** Saturated closing region, owning the full width. */
  field: string
  onField: string
  onFieldMuted: string
}

export const PALETTES = {
  /** The control: near-monochrome, black pills, one green dot. */
  mono: {
    ink: '#101112',
    muted: '#5A6169',
    line: '#E7E7E5',
    tint: '#FFFFFF',
    panel: '#F6F6F4',
    chipBg: '#ECECE8',
    chipText: '#101112',
    accent: '#101112',
    dot: '#16A34A',
    ctaBg: '#101112',
    ctaText: '#FFFFFF',
    field: '#101112',
    onField: '#FFFFFF',
    onFieldMuted: '#A9ACAE',
  },
  /** From I · Signal: teal ground, spring green marks, deep teal field. */
  signal: {
    ink: '#12201E',
    muted: '#4E5F5B',
    line: '#D3E4DE',
    tint: '#F2F8F6',
    panel: '#E6F2EE',
    chipBg: '#D2EFE3',
    chipText: '#0A5C43',
    accent: '#0A7A57',
    dot: '#25C08A',
    ctaBg: '#0E7A5F',
    ctaText: '#FFFFFF',
    field: '#0E3A33',
    onField: '#E9F5F1',
    onFieldMuted: '#A6C4BC',
  },
  /** From 0 · Current: paper ground, Argus green, graphite field. */
  current: {
    ink: '#15181C',
    muted: '#4A5158',
    line: '#D3DFD1',
    tint: '#F1F5EF',
    panel: '#E5EEE4',
    chipBg: '#D8EDDF',
    chipText: '#17643F',
    accent: '#1B7A4B',
    dot: '#27A567',
    ctaBg: '#27A567',
    ctaText: '#06281A',
    field: '#0E1115',
    onField: '#E8EBE7',
    onFieldMuted: '#A7AFA9',
  },
  /** From H · Split: cool blue ground, saturated blue, deep navy field. */
  split: {
    ink: '#121722',
    muted: '#53607A',
    line: '#D5DFEE',
    tint: '#F2F5FA',
    panel: '#E7EEF9',
    chipBg: '#DCE7FA',
    chipText: '#1746A8',
    accent: '#1D63D8',
    dot: '#1D63D8',
    ctaBg: '#1D63D8',
    ctaText: '#FFFFFF',
    field: '#10214A',
    onField: '#EAF0FB',
    onFieldMuted: '#A6B6D4',
  },
} satisfies Record<string, Palette>

export type PaletteName = keyof typeof PALETTES
