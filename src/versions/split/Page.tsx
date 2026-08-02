/**
 * H · SPLIT — the pattern the category converges on: copy left, product bleeding off
 * the right edge, so the first viewport carries both the claim and the proof. Light
 * neutral ground, one blue accent, soft depth only under the screen.
 */
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { CONTACT_HREF } from '../../lib/contact'
import { Analytics, TeamAndTestimonial, type Theme } from '../_shared/Sections'

const INK = '#14171B'
const MUTED = '#596570'
const LINE = '#E4E7E9'
const ACCENT = '#1D63D8'
const WASH = '#F5F7F8'

const theme: Theme = {
  ink: INK,
  muted: MUTED,
  line: LINE,
  accent: ACCENT,
  panel: WASH,
  onAccent: '#FFFFFF',
}

export function Page() {
  const { t, lang, setLang } = useI18n()
  const v = t.v2
  const ja = lang === 'ja'

  const display = ja
    ? 'text-[28px] sm:text-[36px] md:text-[46px] leading-[1.3]'
    : 'text-[34px] sm:text-[42px] md:text-[46px] leading-[1.06] tracking-[-0.03em]'
  const h2 = ja
    ? 'text-[23px] md:text-[32px] leading-[1.3]'
    : 'text-[27px] md:text-[38px] leading-[1.1] tracking-[-0.02em]'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', color: INK }}>
      <header style={{ borderBottom: `1px solid ${LINE}` }}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3.5">
          <span className="text-[16px] font-bold tracking-tight">Soma</span>
          <nav className="hidden items-center gap-1 text-[13.5px] md:flex" style={{ color: MUTED }}>
            <a href="#product" className="rounded-md px-3 py-2 hover:text-[#14171B]">
              {v.nav.product}
            </a>
            <a href="#live" className="rounded-md px-3 py-2 hover:text-[#14171B]">
              {v.nav.live}
            </a>
            <a href="#pilot" className="rounded-md px-3 py-2 hover:text-[#14171B]">
              {v.nav.pilot}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(ja ? 'en' : 'ja')}
              className="rounded-md px-3 py-2 text-[12.5px]"
              style={{ color: MUTED }}
            >
              {ja ? 'EN' : '日本語'}
            </button>
            <a
              href={CONTACT_HREF}
              className="rounded-md px-4 py-2 text-[13px] font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {v.nav.demo}
            </a>
          </div>
        </div>
      </header>

      {/* Hero: copy left, product bleeding right */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-14 lg:grid-cols-[minmax(0,470px)_1fr] lg:gap-12 lg:py-20">
          <div>
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.14em] u-latin-tight"
              style={{ color: ACCENT }}
            >
              {v.kicker}
            </p>
            <h1 className={cn('mt-5 font-display font-bold u-latin-tight', display)}>
              {v.h1} <span style={{ color: ACCENT }}>{v.h1accent}</span>
            </h1>
            <p className="mt-6 text-[15.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
              {v.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CONTACT_HREF}
                className="rounded-lg px-6 py-3.5 text-[14px] font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {v.ctaPrimary}
              </a>
              <a
                href="#live"
                className="rounded-lg px-6 py-3.5 text-[14px] font-semibold"
                style={{ border: `1px solid ${LINE}`, color: INK }}
              >
                {v.ctaSecondary}
              </a>
            </div>
            <p className="mt-6 text-[13px] leading-relaxed" style={{ color: MUTED }}>
              {v.status}
            </p>
          </div>

          <figure className="relative overflow-x-auto lg:mr-[-22vw] lg:overflow-visible">
            <img
              src="./ui/board.png"
              alt={v.shot.alt}
              width={3000}
              height={1880}
              className="block w-full min-w-[820px] rounded-xl lg:min-w-0"
              style={{
                border: `1px solid ${LINE}`,
                boxShadow: '0 30px 70px -30px rgba(20,23,27,0.32)',
              }}
            />
          </figure>
        </div>
        <p
          className="mx-auto max-w-[1280px] px-5 pb-12 text-[13px] leading-relaxed"
          style={{ color: MUTED }}
        >
          {v.shot.caption}
        </p>
      </section>

      {/* Outcomes */}
      <section id="product" className="px-5 py-20" style={{ backgroundColor: WASH, borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.outcomes.heading}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {v.outcomes.items.map((o, i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-7"
                style={{ border: `1px solid ${LINE}` }}
              >
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

      {/* Live data — the mechanism, with the proposal crop as evidence */}
      <section id="live" className="px-5 py-20" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.live.heading}</h2>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed" style={{ color: MUTED }}>
            {v.live.lede}
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {v.live.items.map((it, i) => (
              <div key={i} className="pt-5" style={{ borderTop: `2px solid ${ACCENT}` }}>
                <p className="text-[13px] font-semibold uppercase tracking-[0.1em]">{it.tag}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
                  {it.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[76ch] text-[16px] leading-relaxed text-pretty">{v.live.close}</p>

          <figure className="mt-10 overflow-hidden rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <img
              src="./ui/proposal.png"
              alt={v.shot.caption}
              width={2450}
              height={260}
              loading="lazy"
              className="block w-full min-w-[820px] md:min-w-0"
            />
          </figure>
        </div>
      </section>

      <Analytics theme={theme} />

      {/* Capabilities */}
      <section className="px-5 py-20" style={{ backgroundColor: WASH, borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className={cn('font-display font-bold u-latin-tight', h2)}>{v.capabilities.heading}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {v.capabilities.items.map((c, i) => (
              <div key={i} className="rounded-xl bg-white p-7" style={{ border: `1px solid ${LINE}` }}>
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
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
          <p className="mx-auto mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-pretty" style={{ color: MUTED }}>
            {v.pilot.body}
          </p>
          <a
            href={CONTACT_HREF}
            className="mt-9 inline-block rounded-lg px-7 py-3.5 text-[14px] font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            {v.pilot.cta}
          </a>
        </div>
      </section>

      <footer className="px-5 py-8" style={{ borderTop: `1px solid ${LINE}` }}>
        <div
          className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 text-[12.5px] sm:flex-row"
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
