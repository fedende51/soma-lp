import { Hero } from '../../components/Hero'
import { HowItWorks } from '../../components/HowItWorks'
import { Pillars } from '../../components/Pillars'
import { Team } from '../../components/Team'
import { Cta } from '../../components/Cta'
import { Footer } from '../../components/Footer'

/** The retired Argus-derived page, kept only as a comparison baseline. */
export function Page() {
  return (
    <>
      <Hero />
      <main>
        <Pillars />
        <HowItWorks />
        <Team />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
