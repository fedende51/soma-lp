import { I18nProvider } from './i18n'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Statement } from './components/Statement'
import { HowItWorks } from './components/HowItWorks'
import { Pillars } from './components/Pillars'
import { Team } from './components/Team'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <I18nProvider>
      <Hero />
      <main>
        <Marquee />
        <div className="mt-16 md:mt-24">
          <Statement />
        </div>
        <Pillars />
        <HowItWorks />
        <Team />
        <Cta />
      </main>
      <Footer />
    </I18nProvider>
  )
}
