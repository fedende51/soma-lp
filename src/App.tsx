import { useEffect, useState } from 'react'
import { I18nProvider } from './i18n'
import { VersionSwitcher } from './VersionSwitcher'
import { readVersion, type VersionId } from './versions/registry'
import { Page as CurrentPage } from './versions/current/Page'
import { Page as ConsolePage } from './versions/console/Page'
import { Page as PressPage } from './versions/press/Page'
import { Page as SplitPage } from './versions/split/Page'
import { Page as SignalPage } from './versions/signal/Page'
import { Page as NightSplitPage } from './versions/nightsplit/Page'
import { Page as StudioPage } from './versions/studio/Page'

const PAGES: Record<VersionId, React.ComponentType> = {
  current: CurrentPage,
  console: ConsolePage,
  press: PressPage,
  split: SplitPage,
  signal: SignalPage,
  nightsplit: NightSplitPage,
  studio: StudioPage,
  'studio-signal': () => <StudioPage palette="signal" />,
  'studio-current': () => <StudioPage palette="current" />,
  'studio-split': () => <StudioPage palette="split" />,
}

export default function App() {
  const [version, setVersion] = useState<VersionId>(readVersion)

  // Keep the URL shareable so a specific version can be sent to someone.
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('v', version)
    window.history.replaceState(null, '', url)
    window.scrollTo(0, 0)
  }, [version])

  const Active = PAGES[version]

  return (
    <I18nProvider>
      <Active />
      <VersionSwitcher active={version} onSelect={setVersion} />
    </I18nProvider>
  )
}
