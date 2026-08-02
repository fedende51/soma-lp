/**
 * G · PRESS — white ground, black type, one red accent. Editorial and quiet: the
 * headline does the work, the screen sits in a plain ruled frame, sections are
 * separated by rules rather than cards.
 */
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { CONTACT_HREF } from '../../lib/contact'
import { Analytics, TeamAndTestimonial, type Theme } from '../_shared/Sections'

const INK = '#111214'
const MUTED = '#5A6067'
const LINE = '#E1E3E0'
const ACCENT = '#D33A2C'

const theme: Theme = {
  ink: INK,
  muted: MUTED,
  line: LINE,
  accent: ACCENT,
  panel: '#FAFAF8',
  onAccent: '#FFFFFF',
}

export function Page() {
  const { t, lang, setLang } = useI18n()
  const v = t.v2
  const ja = lang === 'ja'

  const display = ja
    ? 'text-[31px] sm:text-[42px] md:text-[58px] leading-[1.26]'
    : 'text-[38px] sm:text-[54px] md:text-[60px] leading-[1.0] tracking-[-0.035em]'
  const h2 = ja
    ? 'text-[23px] md:text-[32px] leading-[1.3]'
    : 'text-[27px] md:text-[38px] leading-[1.1] tracking-[-0.02em]'

  return (
    <div className="min-h-screen bg-white" style={{ color: INK }}>
      <header style={{ borderBottom: `1px solid ${LINE}` }}>
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4">
          <span className="text-[16px] font-bold tracking-tight">Soma</span>
          <nav className="hidden items-center gap-6 text-[13.5px] md:flex" style={{ color: MUTED }}>
            <a href="#product" className="px-2 py-2 hover:text-[#111214]">
              {v.nav.product}
            </a>
            <a href="#live" className="px-2 py-2 hover:text-[#111214]">
              {v.nav.live}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(ja ? 'en' : 'ja')}
              className="px-2 py-2 text-[12.5px]"
              style={{ color: MUTED }}
            >
              {ja ? 'EN' : '日本語'}
            </button>
            <a
              href={CONTACT_HREF}
              className="px-4 py-2 text-[13px] font-semibold text-white"
              style={{ backgroundColor: INK }}
            >
              {v.nav.demo}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-5 pt-16 md:pt-24">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] u-latin-tight" style={{ color: ACCENT }}>
          {v.kicker}
        </p>
        <h1 className={cn('mt-6 max-w-[20ch] font-display font-bold u-latin-tight', display)}>
          {v.h1}
          <br />
          {v.h1accent}
        </h1>

        <div className="mt-10 grid gap-8 border-t pt-8 md:grid-cols-[1.15fr_1fr]" style={{ borderColor: LINE }}>
          <p className="text-[16px] leading-relaxed md:text-[17px] text-pretty" style={{ color: MUTED }}>
            {v.sub}
          </p>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-3">
              <a
                href={CONTACT_HREF}
                className="px-6 py-3.5 text-[14px] font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {v.ctaPrimary}
              </a>
              <a
                href="#live"
                className="px-6 py-3.5 text-[14px] font-semibold"
                style={{ border: `1.5px solid ${INK}` }}
              >
                {v.ctaSecondary}
              </a>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: MUTED }}>
              {v.status}
            </p>
          </div>
        </div>
      </section>

      {/* Product */}
      <section id="product" className="mx-auto max-w-[1320px] px-5 py-14">
        <figure className="overflow-x-auto" style={{ border: `1px solid ${LINE}` }}>
          <img
            src="./ui/board.png"
            alt={v.shot.alt}
            width={3000}
            height={1880}
            className="block w-full min-w-[820px] md:min-w-0"
          />
        </figure>
        <figcaption className="mt-4 max-w-[80ch] text-[13.5px] leading-relaxed" style={{ color: MUTED }}>
          {v.shot.caption}
        </figcaption>
      </section>

      {/* Outcomes */}
      <section className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1180px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.outcomes.heading}</h2>
          <div className="mt-10 grid md:grid-cols-3">
            {v.outcomes.items.map((o, i) => (
              <div
                key={i}
                className={cn('py-6 md:px-8', i === 0 && 'md:pl-0')}
                style={{ borderTop: `2px solid ${INK}`, borderLeft: i > 0 ? `1px solid ${LINE}` : undefined }}
              >
                <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={cn(
                    'mt-3 font-display font-bold u-latin-tight',
                    ja ? 'text-[18px] leading-[1.44]' : 'text-[20px] leading-[1.2]',
                  )}
                >
                  {o.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live data */}
      <section id="live" className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: '#FAFAF8' }}>
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.live.heading}</h2>
              <p className="mt-4 text-[15.5px] leading-relaxed" style={{ color: MUTED }}>
                {v.live.lede}
              </p>
            </div>
            <div>
              <dl className="m-0">
                {v.live.items.map((it, i) => (
                  <div
                    key={i}
                    className="grid gap-2 py-5 md:grid-cols-[190px_1fr] md:gap-6"
                    style={{ borderTop: `1px solid ${LINE}` }}
                  >
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: INK }}>
                      {it.tag}
                    </dt>
                    <dd className="m-0 text-[14.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
                      {it.body}
                    </dd>
                  </div>
                ))}
              </dl>
              <p
                className="mt-6 border-l-2 pl-4 text-[15px] leading-relaxed text-pretty"
                style={{ borderColor: ACCENT, color: INK }}
              >
                {v.live.close}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Analytics theme={theme} />

      {/* Capabilities */}
      <section className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1180px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.capabilities.heading}</h2>
          <div className="mt-10 grid gap-x-14 gap-y-10 md:grid-cols-3">
            {v.capabilities.items.map((c, i) => (
              <div key={i} className="pt-5" style={{ borderTop: `1px solid ${LINE}` }}>
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  {c.tag}
                </p>
                <h3
                  className={cn(
                    'mt-3 font-display font-bold u-latin-tight',
                    ja ? 'text-[18px] leading-[1.44]' : 'text-[21px] leading-[1.2]',
                  )}
                >
                  {c.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamAndTestimonial theme={theme} />

      {/* Pilot */}
      <section className="px-5 py-24" style={{ borderTop: `2px solid ${INK}` }}>
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.pilot.heading}</h2>
            <p className="mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
              {v.pilot.body}
            </p>
          </div>
          <div className="md:justify-self-end">
            <a
              href={CONTACT_HREF}
              className="inline-block px-8 py-4 text-[15px] font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {v.pilot.cta}
            </a>
          </div>
        </div>
      </section>

      <footer className="px-5 py-8" style={{ borderTop: `1px solid ${LINE}` }}>
        <div
          className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 text-[12.5px] sm:flex-row"
          style={{ color: MUTED }}
        >
          <p>
            <span className="font-semibold" style={{ color: INK }}>
              Soma
            </span>
            {' · '}
            {v.kicker}
          </p>
          <p>
            <a href={CONTACT_HREF} className="underline underline-offset-2">
              {t.footer.contact}
            </a>
            {' · © 2026 Soma'}
          </p>
        </div>
      </footer>
    </div>
  )
}
