import { useRef, useState, useSyncExternalStore } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useI18n } from '../i18n'
import { cn } from '../lib/cn'

const NODE_POSITIONS: Array<[number, number]> = [
  [80, 70],
  [340, 130],
  [100, 230],
  [350, 310],
  [120, 410],
  [340, 490],
]

const PATH_D =
  'M80,70 C180,40 280,70 340,130 C400,190 200,180 100,230 C10,275 250,250 350,310 C450,370 220,355 120,410 C25,460 240,440 340,490'

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

function ProcessGraph({
  labels,
  litCount,
  drawOffset,
  animated,
}: {
  labels: string[]
  litCount: number
  drawOffset?: MotionValue<number>
  animated: boolean
}) {
  return (
    <svg
      viewBox="0 0 440 560"
      role="img"
      aria-label={labels.join(' → ')}
      className="w-full max-w-[440px] h-auto"
    >
      <motion.path
        d={PATH_D}
        fill="none"
        stroke="#252B33"
        strokeWidth="1.5"
      />
      <motion.path
        d={PATH_D}
        fill="none"
        stroke="#27A567"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray="1"
        style={animated && drawOffset ? { strokeDashoffset: drawOffset } : { strokeDashoffset: 0 }}
      />
      {NODE_POSITIONS.map(([x, y], i) => {
        const lit = i < litCount
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="11"
              fill={lit ? 'rgba(52,213,138,0.12)' : '#151A20'}
              stroke={lit ? '#34D58A' : '#252B33'}
              strokeWidth="1.5"
              className="transition-all duration-500"
            />
            <circle
              cx={x}
              cy={y}
              r="3.5"
              fill={lit ? '#34D58A' : '#252B33'}
              className="transition-all duration-500"
            />
            <text
              x={x}
              y={y + 30}
              textAnchor="middle"
              fill={lit ? '#E8EBE7' : '#8A929B'}
              className="font-mono transition-all duration-500"
              style={{ fontSize: 11, letterSpacing: '0.1em' }}
            >
              {labels[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function HowItWorks() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 901px)')
  const pinned = isDesktop && !reduced

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const drawOffset = useTransform(scrollYProgress, [0.02, 0.95], [1, 0])

  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(2, Math.max(0, Math.floor(v * 3))))
  })

  const header = (
    <>
      <p className="font-mono uppercase tracking-widest text-[#8A929B] text-[12px]">
        {t.how.eyebrow}
      </p>
      <h2 className="font-display text-[32px] md:text-[44px] font-bold tracking-tight text-[#E8EBE7] mt-4 leading-[1.12]">
        {t.how.heading}
      </h2>
    </>
  )

  if (!pinned) {
    // Mobile / reduced motion: no pin, path fully drawn, steps stacked.
    return (
      <section id="how" ref={ref} className="bg-graphite py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          {header}
          <div className="mt-12 flex justify-center">
            <ProcessGraph labels={t.how.nodes} litCount={6} animated={false} />
          </div>
          <div className="mt-12 space-y-12 max-w-[560px]">
            {t.how.steps.map((step, i) => (
              <div key={i}>
                <p className="font-mono text-[12px] tracking-[0.14em] text-[#34D58A]">
                  {step.label}
                </p>
                <h3 className="font-display text-[22px] font-bold text-[#E8EBE7] mt-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#A7AFA9] mt-3 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="how" ref={ref} className="bg-graphite h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1200px] mx-auto w-full px-6 grid grid-cols-2 gap-16 items-center">
          {/* Left: heading + crossfading active step */}
          <div>
            {header}
            <div className="grid mt-12 min-h-[220px]">
              {t.how.steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="col-start-1 row-start-1"
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    y: active === i ? 0 : 14,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ pointerEvents: active === i ? 'auto' : 'none' }}
                  aria-hidden={active !== i}
                >
                  <p className="font-mono text-[12px] tracking-[0.14em] text-[#34D58A]">
                    {step.label}
                  </p>
                  <h3 className="font-display text-[26px] font-bold text-[#E8EBE7] mt-3">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-[#A7AFA9] mt-4 leading-relaxed max-w-[460px]">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Progress dots */}
            <div className="flex gap-2.5 mt-12" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors duration-300',
                    i <= active ? 'bg-[#34D58A]' : 'bg-[#252B33]',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: process graph drawing itself */}
          <div className="flex justify-center">
            <ProcessGraph
              labels={t.how.nodes}
              litCount={(active + 1) * 2}
              drawOffset={drawOffset}
              animated
            />
          </div>
        </div>
      </div>
    </section>
  )
}
