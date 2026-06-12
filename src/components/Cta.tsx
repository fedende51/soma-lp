import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from './Reveal'
import { useI18n } from '../i18n'

export function Cta() {
  const { t } = useI18n()
  const reduced = useReducedMotion()

  return (
    <section id="cta" className="bg-graphite py-28 md:py-36 px-6">
      <div className="max-w-[760px] mx-auto text-center flex flex-col items-center">
        <Reveal className="flex flex-col items-center">
          <h2 className="font-display text-[34px] md:text-[48px] font-bold tracking-tight text-[#E8EBE7] leading-[1.1]">
            {t.cta.heading}
          </h2>
          <p className="text-[15px] text-[#A7AFA9] mt-6 leading-relaxed max-w-[560px]">
            {t.cta.body}
          </p>
          <motion.a
            href="mailto:hello@argus.app"
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className="mt-10 inline-block bg-[#27A567] text-[#06281A] rounded-full px-7 py-3.5 text-[13px] font-semibold"
          >
            {t.cta.button}
          </motion.a>
        </Reveal>
      </div>
    </section>
  )
}
