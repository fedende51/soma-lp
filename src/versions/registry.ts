export type VersionId =
  | 'current'
  | 'console'
  | 'press'
  | 'split'
  | 'signal'
  | 'nightsplit'
  | 'studio'
  | 'studio-signal'
  | 'studio-current'
  | 'studio-split'

export interface VersionMeta {
  id: VersionId
  label: string
  note: string
}

/** Selection order in the switcher. `current` is the anti-reference, not a candidate. */
export const VERSIONS: VersionMeta[] = [
  { id: 'studio', label: 'K1 \u00b7 Mono', note: 'Studio layout, near-monochrome' },
  { id: 'studio-signal', label: 'K2 \u00b7 Signal', note: 'Studio layout, teal + spring green' },
  { id: 'studio-current', label: 'K3 \u00b7 Current', note: 'Studio layout, paper + Argus green' },
  { id: 'studio-split', label: 'K4 \u00b7 Split', note: 'Studio layout, cool neutral + blue' },
  { id: 'nightsplit', label: 'J \u00b7 Night Split', note: 'H layout, F palette' },
  { id: 'console', label: 'F \u00b7 Console', note: 'Dark, one signal accent' },
  { id: 'press', label: 'G \u00b7 Press', note: 'White, editorial, red accent' },
  { id: 'split', label: 'H \u00b7 Split', note: 'Copy left, product bleeding right' },
  { id: 'signal', label: 'I \u00b7 Signal', note: 'Centred, dark field, breakout screen' },
  { id: 'current', label: '0 · Current', note: 'Today’s page, for comparison' },
]

export const DEFAULT_VERSION: VersionId = 'studio'

export function readVersion(): VersionId {
  if (typeof window === 'undefined') return DEFAULT_VERSION
  const v = new URLSearchParams(window.location.search).get('v')
  return VERSIONS.some((x) => x.id === v) ? (v as VersionId) : DEFAULT_VERSION
}
