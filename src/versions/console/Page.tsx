/**
 * F · CONSOLE — near-black ground, one signal accent, the product screen large and early.
 * Modern and simple: no ornament, one accent, generous space, real UI carrying the proof.
 */
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { CONTACT_HREF } from '../../lib/contact'
import { Analytics, TeamAndTestimonial, type Theme } from '../_shared/Sections'

const BG = '#0B0C0E'
const PANEL = '#131519'
const LINE = '#23262C'
const TEXT = '#F2F4F3'
const MUTED = '#9AA2A9'
const ACCENT = '#5CE07A'

const theme: Theme = {
  ink: TEXT,
  muted: MUTED,
  line: LINE,
  accent: ACCENT,
  panel: PANEL,
  onAccent: '#08210F',
}

export function Page() {
  const { t, lang, setLang } = useI18n()
  const v = t.v2
  const ja = lang === 'ja'

  const display = ja
    ? 'text-[30px] sm:text-[40px] md:text-[54px] leading-[1.28]'
    : 'text-[36px] sm:text-[50px] md:text-[58px] leading-[1.04] tracking-[-0.03em]'
  const h2 = ja
    ? 'text-[24px] md:text-[34px] leading-[1.3]'
    : 'text-[28px] md:text-[42px] leading-[1.08] tracking-[-0.022em]'

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{ borderBottom: `1px solid ${LINE}`, backgroundColor: 'rgba(11,12,14,0.86)' }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3.5">
          <span className="text-[16px] font-bold tracking-tight">Soma</span>
          <nav className="hidden items-center gap-1 text-[13px] md:flex" style={{ color: MUTED }}>
            <a href="#product" className="rounded-md px-3 py-2 hover:text-white">
              {v.nav.product}
            </a>
            <a href="#live" className="rounded-md px-3 py-2 hover:text-white">
              {v.nav.live}
            </a>
            <a href="#pilot" className="rounded-md px-3 py-2 hover:text-white">
              {v.nav.pilot}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(ja ? 'en' : 'ja')}
              className="rounded-md px-3 py-2 text-[12px] hover:text-white"
              style={{ color: MUTED }}
            >
              {ja ? 'EN' : '日本語'}
            </button>
            <a
              href={CONTACT_HREF}
              className="rounded-md px-4 py-2 text-[13px] font-semibold"
              style={{ backgroundColor: ACCENT, color: '#08210F' }}
            >
              {v.nav.demo}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-5 pt-16 pb-10 md:pt-24">
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.16em] u-latin-tight"
          style={{ color: ACCENT }}
        >
          {v.kicker}
        </p>
        <h1 className={cn('mt-6 max-w-[22ch] font-display font-bold u-latin-tight', display)}>
          {v.h1}
          <br />
          <span style={{ color: MUTED }}>{v.h1accent}</span>
        </h1>
        <p
          className="mt-7 max-w-[68ch] text-[15px] leading-relaxed md:text-[17px] text-pretty"
          style={{ color: MUTED }}
        >
          {v.sub}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={CONTACT_HREF}
            className="rounded-md px-6 py-3.5 text-[14px] font-semibold"
            style={{ backgroundColor: ACCENT, color: '#08210F' }}
          >
            {v.ctaPrimary}
          </a>
          <a
            href="#live"
            className="rounded-md px-6 py-3.5 text-[14px] font-semibold"
            style={{ border: `1px solid ${LINE}`, color: TEXT }}
          >
            {v.ctaSecondary}
          </a>
        </div>
      </section>

      {/* The product, large and early */}
      <section id="product" className="mx-auto max-w-[1320px] px-5 pb-20">
        <figure
          className="overflow-x-auto rounded-xl"
          style={{ border: `1px solid ${LINE}`, backgroundColor: PANEL }}
        >
          <img
            src="./ui/board.png"
            alt={v.shot.alt}
            width={3000}
            height={1880}
            className="block w-full min-w-[820px] md:min-w-0"
          />
        </figure>
        <figcaption className="mt-4 text-[13px] leading-relaxed" style={{ color: MUTED }}>
          {v.shot.caption}
        </figcaption>
      </section>

      {/* Outcomes — for the person who signs */}
      <section className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1200px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.outcomes.heading}</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {v.outcomes.items.map((o, i) => (
              <div key={i} style={{ borderTop: `1px solid ${LINE}` }} className="pt-5">
                <h3
                  className={cn(
                    'font-display font-bold u-latin-tight',
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

      {/* Live data mechanism */}
      <section id="live" className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1200px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.live.heading}</h2>
          <p className="mt-4 text-[16px]" style={{ color: MUTED }}>
            {v.live.lede}
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {v.live.items.map((it, i) => (
              <div
                key={i}
                className="rounded-xl p-6"
                style={{ backgroundColor: PANEL, border: `1px solid ${LINE}` }}
              >
                <span
                  className="inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{ backgroundColor: 'rgba(92,224,122,0.14)', color: ACCENT }}
                >
                  {it.tag}
                </span>
                <p className="mt-4 text-[14.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
                  {it.body}
                </p>
              </div>
            ))}
          </div>
          <p
            className="mt-8 max-w-[76ch] text-[15px] leading-relaxed text-pretty"
            style={{ color: TEXT }}
          >
            {v.live.close}
          </p>
        </div>
      </section>

      <Analytics theme={theme} />

      {/* Capabilities — for the daily user */}
      <section className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1200px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>
            {v.capabilities.heading}
          </h2>
          <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-3">
            {v.capabilities.items.map((c, i) => (
              <div key={i}>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: ACCENT }}
                >
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
      <section id="pilot" className="px-5 py-24" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.pilot.heading}</h2>
          <p
            className="mx-auto mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-pretty"
            style={{ color: MUTED }}
          >
            {v.pilot.body}
          </p>
          <a
            href={CONTACT_HREF}
            className="mt-9 inline-block rounded-md px-7 py-3.5 text-[14px] font-semibold"
            style={{ backgroundColor: ACCENT, color: '#08210F' }}
          >
            {v.pilot.cta}
          </a>
          <p className="mt-6 text-[13px]" style={{ color: MUTED }}>
            {v.status}
          </p>
        </div>
      </section>

      <footer className="px-5 py-8" style={{ borderTop: `1px solid ${LINE}` }}>
        <div
          className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 text-[12.5px] sm:flex-row"
          style={{ color: MUTED }}
        >
          <p>
            <span className="font-semibold" style={{ color: TEXT }}>
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
