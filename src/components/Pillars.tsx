import { Reveal } from './Reveal'
import { useI18n } from '../i18n'

export function Pillars() {
  const { t } = useI18n()

  return (
    <section id="pillars" className="bg-paper py-24 md:py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <p className="font-mono uppercase tracking-widest text-[#8A929B] text-[12px]">
            {t.pillars.eyebrow}
          </p>
          <h2 className="font-display text-[32px] md:text-[44px] font-bold tracking-tight text-ink mt-4 leading-[1.12]">
            {t.pillars.heading}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-14">
          {t.pillars.cards.map((card, i) => (
            <Reveal key={i} delay={(i % 2) * 0.1}>
              <article className="h-full bg-white border border-line rounded-[14px] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_rgba(14,17,21,0.18)]">
                <p className="font-mono uppercase text-[11px] tracking-[0.14em] text-ink-soft flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 bg-run inline-block"
                  />
                  {card.tag}
                </p>
                <h3 className="font-display text-[22px] font-bold text-ink mt-5 leading-snug">
                  {card.title}
                </h3>
                <ul className="mt-6 list-none m-0 p-0">
                  {card.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="text-[14px] text-ink-soft leading-relaxed py-3 border-t border-line first:border-t-0 first:pt-0 last:pb-0"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
