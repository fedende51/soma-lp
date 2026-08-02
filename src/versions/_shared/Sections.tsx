/**
 * Sections shared by the v2 candidates (F–J). Each takes a theme so a section keeps
 * its host world's palette instead of importing a look of its own.
 */
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'

export interface Theme {
  ink: string
  muted: string
  line: string
  accent: string
  /** Card/panel fill. Use the page ground when the world has no panel. */
  panel: string
  /** Readable text colour on top of `accent`. */
  onAccent: string
  dark?: boolean
}

function useHeads(ja: boolean) {
  return {
    h2: ja
      ? 'text-[23px] md:text-[32px] leading-[1.3]'
      : 'text-[27px] md:text-[38px] leading-[1.1] tracking-[-0.02em]',
    h3: ja ? 'text-[18px] leading-[1.44]' : 'text-[20px] leading-[1.2]',
  }
}

/** Planned vs actual, and the bottleneck that falls out of comparing them. */
export function Analytics({ theme, className }: { theme: Theme; className?: string }) {
  const { t, lang } = useI18n()
  const a = t.v2.analytics
  const ja = lang === 'ja'
  const h = useHeads(ja)

  return (
    <section
      id="analytics"
      className={cn('px-5 py-20', className)}
      style={{ borderTop: `1px solid ${theme.line}` }}
    >
      <div className="mx-auto max-w-[1200px]">
        <h2 className={cn('font-display font-bold u-latin-tight', h.h2)}>{a.heading}</h2>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed" style={{ color: theme.muted }}>
          {a.lede}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {a.items.map((it, i) => (
            <div key={i} className="pt-5" style={{ borderTop: `2px solid ${theme.accent}` }}>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em]">{it.tag}</p>
              <p
                className="mt-3 text-[14.5px] leading-relaxed text-pretty"
                style={{ color: theme.muted }}
              >
                {it.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-[76ch] text-[16px] leading-relaxed text-pretty">{a.close}</p>
      </div>
    </section>
  )
}

/**
 * The testimonial is deliberately, visibly a placeholder: dashed rule, a PLACEHOLDER
 * chip and a note underneath. It must be impossible to ship this by accident.
 */
export function TeamAndTestimonial({ theme, className }: { theme: Theme; className?: string }) {
  const { t, lang } = useI18n()
  const team = t.v2.team
  const q = t.v2.testimonial
  const ja = lang === 'ja'
  const h = useHeads(ja)

  return (
    <section
      id="team"
      className={cn('px-5 py-20', className)}
      style={{ borderTop: `1px solid ${theme.line}` }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Testimonial placeholder */}
        <figure
          className="m-0 rounded-xl p-7 md:p-10"
          style={{ border: `2px dashed ${theme.line}`, backgroundColor: theme.panel }}
        >
          <span
            className="inline-block rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ backgroundColor: theme.accent, color: theme.onAccent }}
          >
            {q.label}
          </span>
          <blockquote
            className={cn(
              'mt-5 max-w-[46ch] font-display font-bold u-latin-tight',
              ja ? 'text-[19px] leading-[1.5]' : 'text-[22px] leading-[1.32]',
            )}
          >
            {q.quote}
          </blockquote>
          <figcaption className="mt-5 text-[13.5px]" style={{ color: theme.muted }}>
            <span className="font-semibold" style={{ color: theme.ink }}>
              {q.name}
            </span>
            {' · '}
            {q.role}
          </figcaption>
          <p className="mt-4 text-[12px] leading-relaxed" style={{ color: theme.muted }}>
            {q.note}
          </p>
        </figure>

        {/* Team */}
        <div className="mt-16">
          <h2 className={cn('font-display font-bold u-latin-tight', h.h2)}>{team.heading}</h2>
          <p
            className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed"
            style={{ color: theme.muted }}
          >
            {team.lede}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {t.team.members.map((m, i) => (
              <div key={i}>
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-lg text-[14px] font-bold"
                  style={{ backgroundColor: theme.accent, color: theme.onAccent }}
                >
                  {m.name
                    .replace(/\./g, '')
                    .split(/\s+/)
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold">{m.name}</h3>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed text-pretty"
                  style={{ color: theme.muted }}
                >
                  {m.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
