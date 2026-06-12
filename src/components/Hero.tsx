import { motion, useReducedMotion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '../i18n'
import { cn } from '../lib/cn'

// Abstract schedule motif for the hero background: machine rows with job bars,
// one bar highlighted green. Widths/offsets in % of the row.
const GANTT_ROWS: Array<Array<{ x: number; w: number; hot?: boolean }>> = [
  [{ x: 0, w: 22 }, { x: 26, w: 30 }, { x: 60, w: 34 }],
  [{ x: 4, w: 34 }, { x: 42, w: 18, hot: true }, { x: 64, w: 30 }],
  [{ x: 0, w: 14 }, { x: 18, w: 44 }, { x: 66, w: 22 }],
  [{ x: 8, w: 26 }, { x: 38, w: 12 }, { x: 54, w: 38 }],
  [{ x: 0, w: 40 }, { x: 44, w: 26 }, { x: 74, w: 20 }],
  [{ x: 6, w: 18 }, { x: 28, w: 36 }, { x: 68, w: 26 }],
]

export function Hero() {
  const { t, lang, setLang } = useI18n()
  const reduced = useReducedMotion()

  const enter = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }

  return (
    <header className="px-4 pt-4 md:px-6 md:pt-6">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-[#0E1115] border border-slate-800/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden h-[600px] flex flex-col max-md:h-auto max-md:min-h-[600px]">
        {/* Background: blueprint grid + glow + abstract schedule */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(232,235,231,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(232,235,231,0.045) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          <div
            className="absolute -top-48 -right-32 w-[700px] h-[700px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(39,165,103,0.16), transparent 65%)',
            }}
          />
          {/* Abstract schedule: machine rows, job bars, a "now" line */}
          <div className="absolute right-[-70px] top-1/2 -translate-y-1/2 w-[600px] hidden md:flex flex-col gap-4 opacity-70">
            {GANTT_ROWS.map((row, i) => (
              <div key={i} className="relative h-8">
                {row.map((bar, j) => (
                  <div
                    key={j}
                    className={cn(
                      'absolute top-0 h-full rounded-[6px]',
                      bar.hot
                        ? 'bg-[#27A567]/25 border border-[#34D58A]/50'
                        : 'bg-[#1A2129] border border-[#252B33]',
                    )}
                    style={{ left: `${bar.x}%`, width: `${bar.w}%` }}
                  />
                ))}
              </div>
            ))}
            <div className="absolute inset-y-[-24px] left-[38%] border-l border-dashed border-[#34D58A]/40" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1115]/95 via-[#0E1115]/60 to-[#0E1115]/10" />
        </div>

        {/* Copy */}
        <motion.div
          {...enter}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start max-md:pb-36"
        >
          <p className="font-mono text-[11px] tracking-[0.16em] text-[#27A567]">
            {t.hero.kicker}
          </p>
          <h1 className="font-display text-[42px] md:text-[56px] font-bold tracking-tight text-[#E8EBE7] leading-[1.08] mt-5 max-w-[860px]">
            {t.hero.headline1}
            <br />
            <span className="text-[#34D58A]">{t.hero.headline2}</span>
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-[#A7AFA9] mt-5 max-w-[520px] leading-relaxed">
            {t.hero.sub}
          </p>
          <motion.a
            href="mailto:hello@argus.app"
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className="mt-8 inline-flex items-center gap-2 bg-[#27A567] text-[#06281A] rounded-full px-6 py-3 text-[13px] font-semibold"
          >
            {t.hero.cta}
            <ChevronRight size={15} aria-hidden="true" />
          </motion.a>
        </motion.div>

        {/* Floating bottom navbar */}
        <motion.nav
          {...enter}
          transition={{ duration: 0.7, delay: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Main"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center bg-[#151A20]/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-slate-700/40"
        >
          <span
            aria-hidden="true"
            className="w-9 h-9 bg-[#0E1115] border border-slate-700 shadow-sm rounded-full flex items-center justify-center text-[#27A567] text-[15px]"
          >
            ◉
          </span>
          <span className="font-display font-bold text-[13px] tracking-tight text-[#E8EBE7] pl-2.5 pr-1">
            Argus
          </span>
          <a
            href="#pillars"
            className="hidden sm:block px-4 py-2 text-[12px] font-semibold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {t.nav.product}
          </a>
          <a
            href="#how"
            className="hidden sm:block px-4 py-2 text-[12px] font-semibold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {t.nav.how}
          </a>
          <div
            className="font-mono text-[11px] text-slate-400 px-3 flex items-center gap-1.5"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={cn(
                'hover:text-white transition-colors',
                lang === 'en' && 'text-white',
              )}
            >
              EN
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => setLang('ja')}
              aria-pressed={lang === 'ja'}
              className={cn(
                'hover:text-white transition-colors whitespace-nowrap',
                lang === 'ja' && 'text-white',
              )}
            >
              日本語
            </button>
          </div>
          <a
            href="#cta"
            className="bg-[#151A20] px-5 py-2 rounded-full text-[12px] font-semibold text-[#34D58A] border border-slate-700/60 shadow-sm hover:border-[#27A567] transition-all flex items-center gap-1 whitespace-nowrap"
          >
            {t.nav.demo}
            <ChevronRight size={13} aria-hidden="true" />
          </a>
        </motion.nav>
      </div>
    </header>
  )
}
