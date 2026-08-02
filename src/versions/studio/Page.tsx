/**
 * K · STUDIO — white, near-monochrome, big centred type, a floating pill nav that
 * gains its CTA once you leave the hero, a large rounded product panel, and one
 * horizontal card rail instead of three stacked sections.
 *
 * Deliberately the shortest candidate: six sections. The live-data, capability and
 * analytics content is not cut, it is collapsed into a single swipeable rail, so the
 * page is shorter without losing anything or inventing filler to scroll past.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { CONTACT_HREF } from '../../lib/contact'
import { PALETTES, type Palette } from './palette'

const PaletteContext = createContext<Palette>(PALETTES.mono)
const usePalette = () => useContext(PaletteContext)

/** Restrained entrance: content is visible by default and only lifts if motion is on. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The one authored moment: the board settles as it arrives, rising and scaling up
 * slightly, so the screen resolves into place rather than simply appearing.
 */
function ProductPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.35'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <div ref={ref}>
      <motion.div
        style={reduced ? undefined : { scale, y }}
        className="origin-top will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Three boxes, all visible. This was a scrolling rail; the sets now fit across, so
 * the carousel (and its arrows, snapping and wheel-latching) is gone entirely.
 */
function Group({
  label,
  note,
  children,
}: {
  label: string
  note?: string
  children: ReactNode
}) {
  const p = usePalette()
  return (
    <div className="mx-auto max-w-[1240px] px-5">
      <h2
        className="text-[13px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: p.accent }}
      >
        {label}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{children}</div>
      {note && (
        <p className="mt-6 max-w-[76ch] text-[15px] leading-relaxed text-pretty">{note}</p>
      )}
    </div>
  )
}

function Card({
  tag,
  title,
  body,
  dot,
  index = 0,
}: {
  tag?: string
  title?: string
  body: string
  dot?: boolean
  index?: number
}) {
  const p = usePalette()
  const reduced = useReducedMotion()
  const enter = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 as const },
        transition: { duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] as const },
      }
  return (
    <motion.article
      {...enter}
      className="h-full rounded-2xl p-6"
      style={{ backgroundColor: p.panel, border: `1px solid ${p.line}` }}
    >
      {tag && (
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
          {dot && (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: p.dot }}
            />
          )}
          {tag}
        </p>
      )}
      {title && (
        <h3 className={cn('text-[18px] font-bold leading-snug u-latin-tight', tag && 'mt-3')}>
          {title}
        </h3>
      )}
      <p className="mt-3 text-[14.5px] leading-relaxed text-pretty" style={{ color: p.muted }}>
        {body}
      </p>
    </motion.article>
  )
}

function StudioBody() {
  const p = usePalette()
  const { t, lang, setLang } = useI18n()
  const v = t.v2
  const ja = lang === 'ja'
  const [past, setPast] = useState(false)

  // The nav gains its action once the hero's own CTAs are off screen.
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const display = ja
    ? 'text-[32px] sm:text-[44px] md:text-[60px] leading-[1.26]'
    : 'text-[40px] sm:text-[56px] md:text-[62px] leading-[0.98] tracking-[-0.04em]'

  return (
    <div className="min-h-screen" style={{ backgroundColor: p.tint, color: p.ink }}>
      {/* Floating pill nav */}
      <div className="sticky top-4 z-50 px-4">
        <nav
          className="mx-auto flex max-w-[760px] items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 backdrop-blur"
          style={{ backgroundColor: p.panel, border: `1px solid ${p.line}` }}
        >
          <span className="text-[15px] font-bold tracking-tight">Soma</span>
          <div className="flex items-center gap-1 text-[13.5px]" style={{ color: p.muted }}>
            <a href="#product" className="hidden rounded-full px-3 py-2 hover:text-[#101112] sm:block">
              {v.nav.product}
            </a>
            <a href="#inside" className="hidden rounded-full px-3 py-2 hover:text-[#101112] sm:block">
              {v.nav.live}
            </a>
            <button
              type="button"
              onClick={() => setLang(ja ? 'en' : 'ja')}
              className="rounded-full px-3 py-2 hover:text-[#101112]"
            >
              {ja ? 'EN' : '日本語'}
            </button>
            <a
              href={CONTACT_HREF}
              className={cn(
                'overflow-hidden whitespace-nowrap rounded-full text-[13px] font-semibold transition-all duration-300',
                past ? 'ml-1 max-w-[180px] px-5 py-2 opacity-100' : 'max-w-0 px-0 py-2 opacity-0',
              )}
              style={{ backgroundColor: p.ctaBg, color: p.ctaText }}
              aria-hidden={!past}
              tabIndex={past ? 0 : -1}
            >
              {v.nav.demo}
            </a>
          </div>
        </nav>
      </div>

      {/* 1 · Hero */}
      <section className="mx-auto max-w-[1000px] px-5 pb-14 pt-20 text-center md:pt-28">
        <Reveal>
          <span
            className="inline-block rounded-full px-3.5 py-1.5 text-[12px] font-semibold u-latin-tight"
            style={{ backgroundColor: p.chipBg, color: p.chipText }}
          >
            {v.kicker}
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className={cn('mx-auto mt-7 max-w-[22ch] font-display font-bold u-latin-tight', display)}>
            {v.h1} <span style={{ color: p.accent }}>{v.h1accent}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p
            className="mx-auto mt-7 max-w-[58ch] text-[16px] leading-relaxed md:text-[18px] text-pretty"
            style={{ color: p.muted }}
          >
            {v.sub}
          </p>
        </Reveal>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={CONTACT_HREF}
            className="rounded-full px-7 py-3.5 text-[14.5px] font-semibold"
            style={{ backgroundColor: p.ctaBg, color: p.ctaText }}
          >
            {v.ctaPrimary}
          </a>
          <a
            href="#inside"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14.5px] font-semibold"
            style={{ border: `1px solid ${p.line}` }}
          >
            {v.ctaSecondary}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="mt-5 text-[12.5px]" style={{ color: p.muted }}>
          {v.status}
        </p>
      </section>

      {/* 2 · Product */}
      <section id="product" className="mx-auto max-w-[1240px] px-5 pb-16">
        <ProductPanel>
        <figure
          className="overflow-x-auto rounded-3xl p-2 md:p-3"
          style={{ backgroundColor: p.panel, border: `1px solid ${p.line}` }}
        >
          <img
            src="./ui/board.png"
            alt={v.shot.alt}
            width={3000}
            height={1880}
            className="block w-full min-w-[820px] rounded-2xl md:min-w-0"
            style={{ border: `1px solid ${p.line}` }}
          />
        </figure>
        </ProductPanel>
        <figcaption className="mx-auto mt-4 max-w-[70ch] text-center text-[13px] leading-relaxed" style={{ color: p.muted }}>
          {v.shot.caption}
        </figcaption>
      </section>

      {/* 3 · Outcomes */}
      <section className="mx-auto max-w-[1140px] px-5 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {v.outcomes.items.map((o, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <h2
                className={cn(
                  'font-display font-bold u-latin-tight',
                  ja ? 'text-[19px] leading-[1.44]' : 'text-[21px] leading-[1.18] tracking-[-0.01em]',
                )}
              >
                {o.title}
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-pretty" style={{ color: p.muted }}>
                {o.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 · One rail: live data, capabilities, planned-vs-actual */}
      <section id="inside" className="py-14" style={{ borderTop: `1px solid ${p.line}` }}>
        <div className="space-y-12 pt-6">
          <Group label={v.live.heading} note={v.live.close}>
            {v.live.items.map((it, i) => (
              <Card key={i} index={i} tag={it.tag} body={it.body} dot />
            ))}
          </Group>

          <Group label={v.capabilities.heading}>
            {v.capabilities.items.map((c, i) => (
              <Card key={i} index={i} tag={c.tag} title={c.title} body={c.body} />
            ))}
          </Group>

          <Group label={v.analytics.heading} note={v.analytics.close}>
            {v.analytics.items.map((a, i) => (
              <Card key={i} index={i} tag={a.tag} body={a.body} />
            ))}
          </Group>
        </div>
      </section>

      {/* 5 · Testimonial placeholder + team, side by side */}
      <section id="team" className="mx-auto max-w-[1140px] px-5 py-16" style={{ borderTop: `1px solid ${p.line}` }}>
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <figure
            className="m-0 rounded-2xl p-7"
            style={{ border: `2px dashed ${p.line}`, backgroundColor: p.panel }}
          >
            <span
              className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: p.ctaBg, color: p.ctaText }}
            >
              {v.testimonial.label}
            </span>
            <blockquote
              className={cn(
                'mt-4 font-display font-bold u-latin-tight',
                ja ? 'text-[18px] leading-[1.5]' : 'text-[20px] leading-[1.32]',
              )}
            >
              {v.testimonial.quote}
            </blockquote>
            <figcaption className="mt-4 text-[13px]" style={{ color: p.muted }}>
              <span className="font-semibold" style={{ color: p.ink }}>
                {v.testimonial.name}
              </span>
              {' · '}
              {v.testimonial.role}
            </figcaption>
            <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: p.muted }}>
              {v.testimonial.note}
            </p>
          </figure>

          <div>
            <h2
              className={cn(
                'font-display font-bold u-latin-tight',
                ja ? 'text-[22px] leading-[1.32]' : 'text-[26px] leading-[1.16] tracking-[-0.015em]',
              )}
            >
              {v.team.heading}
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: p.muted }}>
              {v.team.lede}
            </p>
            <ul className="m-0 mt-6 list-none space-y-4 p-0">
              {t.team.members.map((m, i) => (
                <li key={i} className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: p.ctaBg, color: p.ctaText }}
                  >
                    {m.name.replace(/\./g, '').split(/\s+/).map((p) => p[0]).join('').slice(0, 2)}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-bold">{m.name}</span>
                    <span className="block text-[12.5px] leading-relaxed text-pretty" style={{ color: p.muted }}>
                      {m.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* 6 · Close */}
      <section className="mx-auto max-w-[1140px] px-5 pb-20">
        <Reveal>
        <div
          className="rounded-3xl px-6 py-16 text-center"
          style={{ backgroundColor: p.field, color: p.onField }}
        >
          <h2
            className={cn(
              'mx-auto max-w-[18ch] font-display font-bold u-latin-tight',
              ja ? 'text-[26px] md:text-[36px] leading-[1.3]' : 'text-[30px] md:text-[46px] leading-[1.08] tracking-[-0.025em]',
            )}
          >
            {v.pilot.heading}
          </h2>
          <p
            className="mx-auto mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-pretty"
            style={{ color: p.onFieldMuted }}
          >
            {v.pilot.body}
          </p>
          <a
            href={CONTACT_HREF}
            className="mt-8 inline-block rounded-full px-8 py-4 text-[15px] font-semibold"
            style={{ backgroundColor: p.ctaBg, color: p.ctaText }}
          >
            {v.pilot.cta}
          </a>
        </div>
        </Reveal>
        <div
          className="mt-8 flex flex-col items-center justify-between gap-3 text-[12.5px] sm:flex-row"
          style={{ color: p.muted }}
        >
          <p>
            <span className="font-semibold" style={{ color: p.ink }}>
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
      </section>
    </div>
  )
}

export function Page({ palette = 'mono' }: { palette?: keyof typeof PALETTES }) {
  return (
    <PaletteContext.Provider value={PALETTES[palette]}>
      <StudioBody />
    </PaletteContext.Provider>
  )
}
