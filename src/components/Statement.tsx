import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useI18n } from '../i18n'
import { cn } from '../lib/cn'

interface Token {
  text: string
  accent: boolean
}

function Word({
  token,
  index,
  total,
  progress,
}: {
  token: Token
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = (index / total) * 0.85
  const opacity = useTransform(progress, [start, start + 0.15], [0.12, 1])

  return (
    <motion.span
      style={{ opacity }}
      className={cn(token.accent ? 'text-[#34D58A]' : 'text-[#E8EBE7]')}
    >
      {token.text}
    </motion.span>
  )
}

export function Statement() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  })

  // EN illuminates per word, JA per character.
  const tokens: Token[] = t.statement.segments.flatMap((segment) => {
    if (t.statement.splitBy === 'word') {
      return segment.text
        .split(' ')
        .filter(Boolean)
        .map((word) => ({ text: word + ' ', accent: !!segment.accent }))
    }
    return Array.from(segment.text).map((char) => ({
      text: char,
      accent: !!segment.accent,
    }))
  })

  return (
    <section ref={ref} className="bg-graphite py-[120px] md:py-[160px] px-6">
      <p className="font-display font-bold tracking-tight text-[clamp(30px,4.5vw,58px)] leading-[1.18] max-w-[980px] mx-auto">
        {reduced
          ? tokens.map((token, i) => (
              <span
                key={i}
                className={cn(
                  token.accent ? 'text-[#34D58A]' : 'text-[#E8EBE7]',
                )}
              >
                {token.text}
              </span>
            ))
          : tokens.map((token, i) => (
              <Word
                key={i}
                token={token}
                index={i}
                total={tokens.length}
                progress={scrollYProgress}
              />
            ))}
      </p>
      <p className="font-mono text-[11px] tracking-[0.04em] text-[#8A929B] max-w-[980px] mx-auto mt-14 leading-relaxed">
        <span className="block max-w-[60ch]">
          {t.statement.captionPre}
          <strong className="text-[#34D58A] font-medium">
            {t.statement.captionBold}
          </strong>
        </span>
      </p>
    </section>
  )
}
