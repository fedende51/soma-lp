import { Reveal } from './Reveal'
import { useI18n } from '../i18n'

const PHOTOS = [
  'https://fedende51.github.io/manganese-landing/steven.png',
  'https://fedende51.github.io/manganese-landing/luis.jpeg',
  'https://fedende51.github.io/manganese-landing/fede.png',
]

export function Team() {
  const { t } = useI18n()

  return (
    <section className="bg-paper py-24 md:py-32 px-6 border-t border-line">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <p className="font-mono uppercase tracking-widest text-[#8A929B] text-[12px]">
            {t.team.eyebrow}
          </p>
          <h2 className="font-display text-[32px] md:text-[44px] font-bold tracking-tight text-ink mt-4 leading-[1.12]">
            {t.team.heading}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {t.team.members.map((member, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <img
                src={PHOTOS[i]}
                alt={member.name}
                width={72}
                height={72}
                loading="lazy"
                className="w-[72px] h-[72px] rounded-[10px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <h3 className="font-display text-[17px] font-bold text-ink mt-5">
                {member.name}
              </h3>
              <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">
                {member.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
