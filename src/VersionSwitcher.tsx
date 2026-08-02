import { VERSIONS, type VersionId } from './versions/registry'
import { cn } from './lib/cn'

/**
 * Comparison-only chrome. This is scaffolding for choosing a direction, not part
 * of any world — it is removed with the two losing versions.
 */
export function VersionSwitcher({
  active,
  onSelect,
}: {
  active: VersionId
  onSelect: (id: VersionId) => void
}) {
  return (
    <div className="fixed z-[100] bottom-3 left-1/2 -translate-x-1/2 print:hidden">
      <div className="flex items-stretch gap-1 rounded-lg bg-neutral-900/95 p-1 shadow-[0_10px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/15 backdrop-blur">
        {VERSIONS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            aria-pressed={active === v.id}
            title={v.note}
            className={cn(
              'rounded px-3 py-2 text-[11px] font-medium leading-none tracking-wide transition-colors',
              active === v.id
                ? 'bg-white text-neutral-900'
                : 'text-neutral-300 hover:bg-white/10 hover:text-white',
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
