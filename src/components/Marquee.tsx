import { useI18n } from '../i18n'
import { cn } from '../lib/cn'

type Tint = 'green' | 'amber' | 'blue'

const TINTS: Tint[] = ['green', 'green', 'amber', 'blue', 'blue', 'green']

const TINT_GRADIENT: Record<Tint, string> = {
  green: 'bg-gradient-to-br from-[#27A567] to-transparent',
  amber: 'bg-gradient-to-br from-[#DFA12B] to-transparent',
  blue: 'bg-gradient-to-br from-[#3B82F6] to-transparent',
}

export function Marquee() {
  const { t } = useI18n()

  return (
    <div
      className="marquee mt-10 overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      {/* 4 copies (2 per loop half) keep the half-track wider than large viewports */}
      <div className="marquee-track flex w-max gap-4 pr-4">
        {[0, 1, 2, 3].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0}
            className="flex gap-4 list-none m-0 p-0"
          >
            {t.marquee.map((label, i) => (
              <li key={i}>
                <div className="group relative h-24 w-48 shrink-0 flex items-center justify-center rounded-full bg-[#151A20] border border-slate-700/60 shadow-sm hover:border-[#27A567] transition-all overflow-hidden">
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-20 transition-all duration-500',
                      TINT_GRADIENT[TINTS[i]],
                    )}
                  />
                  <span className="font-mono text-[11px] tracking-[0.12em] text-slate-400 group-hover:text-white text-center px-4 transition-colors">
                    {label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
