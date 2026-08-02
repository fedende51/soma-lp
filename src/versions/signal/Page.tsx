/**
 * I · SIGNAL — centred and calm. One dark field carries the hero, the product screen
 * breaks out of it and overlaps into the white below, and everything after is plain
 * white with wide measure. Simple, modern, one accent.
 */
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { CONTACT_HREF } from '../../lib/contact'
import { Analytics, TeamAndTestimonial, type Theme } from '../_shared/Sections'

const INK = '#15181C'
const MUTED = '#5C666E'
const LINE = '#E6E9E8'
const FIELD = '#12303A'
const ACCENT = '#25C08A'

const theme: Theme = {
  ink: INK,
  muted: MUTED,
  line: LINE,
  accent: '#0A5C43',
  panel: '#F5F8F7',
  onAccent: '#FFFFFF',
}

export function Page() {
  const { t, lang, setLang } = useI18n()
  const v = t.v2
  const ja = lang === 'ja'

  const display = ja
    ? 'text-[29px] sm:text-[38px] md:text-[52px] leading-[1.3]'
    : 'text-[35px] sm:text-[46px] md:text-[54px] leading-[1.05] tracking-[-0.03em]'
  const h2 = ja
    ? 'text-[23px] md:text-[32px] leading-[1.3]'
    : 'text-[27px] md:text-[38px] leading-[1.1] tracking-[-0.02em]'

  return (
    <div className="min-h-screen bg-white" style={{ color: INK }}>
      {/* Hero field */}
      <div style={{ backgroundColor: FIELD, color: '#F1F5F3' }}>
        <header>
          <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-4">
            <span className="text-[16px] font-bold tracking-tight">Soma</span>
            <nav className="hidden items-center gap-6 text-[13.5px] md:flex" style={{ color: '#A9BDBB' }}>
              <a href="#product" className="px-2 py-2 hover:text-white">
                {v.nav.product}
              </a>
              <a href="#live" className="px-2 py-2 hover:text-white">
                {v.nav.live}
              </a>
              <a href="#pilot" className="px-2 py-2 hover:text-white">
                {v.nav.pilot}
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLang(ja ? 'en' : 'ja')}
                className="rounded-full px-3 py-2 text-[12.5px]"
                style={{ color: '#A9BDBB' }}
              >
                {ja ? 'EN' : '日本語'}
              </button>
              <a
                href={CONTACT_HREF}
                className="rounded-full px-4 py-2 text-[13px] font-semibold"
                style={{ backgroundColor: ACCENT, color: '#06251A' }}
              >
                {v.nav.demo}
              </a>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1000px] px-5 pt-16 text-center md:pt-24">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] u-latin-tight"
            style={{ color: ACCENT }}
          >
            {v.kicker}
          </p>
          <h1 className={cn('mx-auto mt-6 max-w-[22ch] font-display font-bold u-latin-tight', display)}>
            {v.h1} <span style={{ color: ACCENT }}>{v.h1accent}</span>
          </h1>
          <p
            className="mx-auto mt-7 max-w-[64ch] text-[15.5px] leading-relaxed md:text-[17px] text-pretty"
            style={{ color: '#B7C7C6' }}
          >
            {v.sub}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={CONTACT_HREF}
              className="rounded-full px-7 py-3.5 text-[14px] font-semibold"
              style={{ backgroundColor: ACCENT, color: '#06251A' }}
            >
              {v.ctaPrimary}
            </a>
            <a
              href="#live"
              className="rounded-full px-7 py-3.5 text-[14px] font-semibold"
              style={{ border: '1px solid rgba(255,255,255,0.28)', color: '#F1F5F3' }}
            >
              {v.ctaSecondary}
            </a>
          </div>
          <p className="mt-6 text-[13px]" style={{ color: '#93A9A8' }}>
            {v.status}
          </p>
        </section>

        {/* the screen breaks out of the field */}
        <div className="mx-auto max-w-[1240px] px-5 pt-14">
          <figure
            className="overflow-x-auto rounded-2xl"
            style={{
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 40px 80px -40px rgba(0,0,0,0.6)',
              marginBottom: '-8rem',
            }}
          >
            <img
              src="./ui/board.png"
              alt={v.shot.alt}
              width={3000}
              height={1880}
              className="block w-full min-w-[820px] md:min-w-0"
            />
          </figure>
        </div>
        <div className="h-32 bg-white" />
      </div>

      <p
        className="mx-auto max-w-[1240px] px-5 pt-6 text-center text-[13px] leading-relaxed"
        style={{ color: MUTED }}
      >
        {v.shot.caption}
      </p>

      {/* Outcomes */}
      <section id="product" className="px-5 py-20">
        <div className="mx-auto max-w-[1140px]">
          <h2 className={cn('text-center font-display font-bold u-latin-tight', h2)}>
            {v.outcomes.heading}
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {v.outcomes.items.map((o, i) => (
              <div key={i} className="text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto block h-1 w-10 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <h3
                  className={cn(
                    'mt-5 font-display font-bold u-latin-tight',
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
      <section id="live" className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1140px]">
          <h2 className={cn('text-center font-display font-bold u-latin-tight', h2)}>
            {v.live.heading}
          </h2>
          <p
            className="mx-auto mt-4 max-w-[52ch] text-center text-[16px] leading-relaxed"
            style={{ color: MUTED }}
          >
            {v.live.lede}
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {v.live.items.map((it, i) => (
              <div
                key={i}
                className="rounded-2xl p-7"
                style={{ backgroundColor: '#F5F8F7', border: `1px solid ${LINE}` }}
              >
                <span
                  className="inline-block rounded-full px-3 py-1 text-[11.5px] font-semibold"
                  style={{ backgroundColor: '#DBF3EA', color: '#0A5C43' }}
                >
                  {it.tag}
                </span>
                <p className="mt-4 text-[14.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
                  {it.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-[72ch] text-center text-[16px] leading-relaxed text-pretty">
            {v.live.close}
          </p>
        </div>
      </section>

      <Analytics theme={theme} />

      {/* Capabilities */}
      <section className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1140px]">
          <h2 className={cn('text-center font-display font-bold u-latin-tight', h2)}>
            {v.capabilities.heading}
          </h2>
          <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-3">
            {v.capabilities.items.map((c, i) => (
              <div key={i}>
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#0A5C43' }}>
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
      <section id="pilot" className="px-5 pb-24 pt-4">
        <div
          className="mx-auto max-w-[1140px] rounded-3xl px-6 py-16 text-center"
          style={{ backgroundColor: FIELD, color: '#F1F5F3' }}
        >
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.pilot.heading}</h2>
          <p
            className="mx-auto mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-pretty"
            style={{ color: '#B7C7C6' }}
          >
            {v.pilot.body}
          </p>
          <a
            href={CONTACT_HREF}
            className="mt-9 inline-block rounded-full px-8 py-4 text-[15px] font-semibold"
            style={{ backgroundColor: ACCENT, color: '#06251A' }}
          >
            {v.pilot.cta}
          </a>
        </div>
      </section>

      <footer className="px-5 pb-10">
        <div
          className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-3 pt-8 text-[12.5px] sm:flex-row"
          style={{ color: MUTED, borderTop: `1px solid ${LINE}` }}
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
