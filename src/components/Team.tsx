import { Reveal } from './Reveal'
import { useI18n } from '../i18n'

/** "Steven L." → "SL". Names are authored in the dictionaries, so two parts is the shape. */
function initials(name: string) {
  return name
    .replace(/\./g, '')
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Team() {
  const { t } = useI18n()

  return (
    <section className="bg-paper py-24 md:py-32 px-6 border-t border-line">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <p className="font-mono uppercase tracking-widest text-ink-muted text-[12px]">
            {t.v2.nav.pilot}
          </p>
          <h2 className="font-display text-[32px] md:text-[44px] font-bold tracking-tight text-ink mt-4 leading-[1.12] text-balance">
            {t.v2.team.heading}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {t.team.members.map((member, i) => (
            <Reveal key={i} delay={i * 0.1}>
              {/* Monogram, not a portrait: the page is typography-led and the
                  previous photo host is gone. Swap in real images here if wanted. */}
              <span
                aria-hidden="true"
                className="w-[72px] h-[72px] rounded-[10px] bg-graphite text-run-bright font-mono text-[19px] tracking-[0.08em] flex items-center justify-center select-none"
              >
                {initials(member.name)}
              </span>
              <h3 className="font-display text-[17px] font-bold text-ink mt-5">
                {member.name}
              </h3>
              <p className="text-[13px] text-ink-soft mt-2 leading-relaxed text-pretty">
                {member.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
