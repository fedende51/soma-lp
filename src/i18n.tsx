/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'ja'

export interface StatementSegment {
  text: string
  accent?: boolean
}

const en = {
  nav: {
    product: 'Product',
    how: 'How it works',
    demo: 'Start a pilot',
  },
  hero: {
    kicker: 'ARGUS — CALCULATED PRODUCTION FOR HIGH-MIX MANUFACTURERS',
    headline1: 'Deliver every order on time —',
    headline2: 'and know it before you promise.',
    sub: 'Argus combines live floor tracking, a schedule that recalculates itself, and the analytics to quote delivery dates you can keep.',
    cta: 'Start a pilot',
  },
  marquee: [
    'LIVE FLOOR MODEL',
    'SETUP-AWARE SEQUENCING',
    'DELIVERY RISK FLAGGED EARLY',
    'BOTTLENECK DETECTION',
    'SCENARIO PLANNING',
    '日本語 / ENGLISH',
  ],
  statement: {
    splitBy: 'word' as 'word' | 'char',
    segments: [
      {
        text: 'Every machine. Every job. Every queue. One live model — and when reality disagrees with the plan, ',
      },
      { text: 'the plan updates.', accent: true },
    ] as StatementSegment[],
    captionPre:
      'ARGUS — in the old story, the watchman with a hundred eyes who never slept. On your floor: ',
    captionBold: 'every machine seen, all the time.',
  },
  how: {
    eyebrow: 'How Argus works',
    heading: 'The schedule follows the floor.',
    nodes: ['LATHE-03', 'MILL-07', '5AX-01', 'GRIND-01', 'CMM-02', 'DOCK'],
    steps: [
      {
        label: '01 — SEE',
        title: 'A live model of your floor',
        body: "Networked machines feed data directly. Cameras and IoT sensors cover the ones that don't. Every machine state, every active job, every queue — in one place.",
      },
      {
        label: '02 — RECALCULATE',
        title: 'A schedule that updates itself',
        body: 'As actual times come in, the schedule recalculates. Orders at risk of missing their due date are flagged early, with the cause — not discovered at the end of the week.',
      },
      {
        label: '03 — DECIDE',
        title: 'Decisions with the impact calculated',
        body: "Resequence, reassign, reprioritize. The downstream effect of each change is calculated before you commit — so a rush order doesn't quietly cost you three others.",
      },
    ],
  },
  pillars: {
    eyebrow: 'What Argus does',
    heading: 'Four capabilities. One live model.',
    cards: [
      {
        tag: 'PRODUCTION SCHEDULING',
        title: 'A schedule the floor can actually follow.',
        bullets: [
          'Setup time scheduled as part of every job — not hidden between bars',
          'Similar setups sequenced back-to-back, so machines spend more time producing',
        ],
      },
      {
        tag: 'FLOOR TRACKING',
        title: 'Every machine. Networked or not.',
        bullets: [
          'Direct machine data where connectivity exists',
          'Cameras and IoT sensors cover the machines that have none',
        ],
      },
      {
        tag: 'DELIVERY ANALYTICS',
        title: 'See risk weeks before the due date.',
        bullets: [
          'Every order tracked against its date as the floor changes',
          'Lead times calculated from actuals, not estimates',
        ],
      },
      {
        tag: 'SCENARIO PLANNING',
        title: 'Test the change before you make it.',
        bullets: [
          'A new machine, a second shift, a different product mix',
          'Projections calibrated against your own production data',
        ],
      },
    ],
  },
  team: {
    eyebrow: 'About us',
    heading: 'The team behind Argus.',
    members: [
      {
        name: 'Steven L.',
        role: 'Senior Product Manager, AI, Simulation & Developer Tooling @ Woven by Toyota',
      },
      {
        name: 'Luis P.',
        role: 'Head of Experience Engineering Japan @ Capgemini Engineering',
      },
      {
        name: 'Fede M.',
        role: 'Sr. Technical Product Manager, Automation & AI @ Amazon',
      },
    ],
  },
  cta: {
    heading: 'See Argus on your own jobs.',
    body: "Send us a week of orders and your machine list. We'll walk you through a live schedule built from your actual floor — and show you where the capacity is hiding.",
    button: 'Start a pilot',
  },
  footer: {
    tagline: 'Calculated production for high-mix manufacturers.',
    contact: 'Contact',
  },
}

export type Strings = typeof en

const ja: Strings = {
  nav: {
    product: 'プロダクト',
    how: '仕組み',
    demo: 'パイロット導入',
  },
  hero: {
    kicker: 'ARGUS — 多品種少量の現場のための、計算された生産',
    headline1: 'すべてのオーダーを納期どおりに —',
    headline2: '約束する前に、それが分かる。',
    sub: 'Argusは、ライブフロアトラッキング、自動で再計算されるスケジュール、そして守れる納期回答のためのアナリティクスを一つにします。',
    cta: 'パイロット導入を始める',
  },
  marquee: [
    'ライブフロアモデル',
    '段取りを考慮した順序付け',
    '納期リスクの早期検知',
    'ボトルネック検知',
    'シナリオプランニング',
    '日本語 / ENGLISH',
  ],
  statement: {
    splitBy: 'char',
    segments: [
      {
        text: 'すべての機械。すべてのジョブ。すべての待ち行列。一つのライブモデル — 現実が計画とずれたとき、',
      },
      { text: '更新されるのは計画のほう。', accent: true },
    ],
    captionPre:
      'ARGUS — 神話に登場する、百の目を持ち決して眠らない番人。あなたの現場では：',
    captionBold: 'すべての機械が、常に見えている。',
  },
  how: {
    eyebrow: 'Argusの仕組み',
    heading: 'スケジュールが、現場に追従する。',
    nodes: ['LATHE-03', 'MILL-07', '5AX-01', 'GRIND-01', 'CMM-02', 'DOCK'],
    steps: [
      {
        label: '01 — 見る',
        title: '現場のライブモデル',
        body: 'ネットワーク対応機はデータを直接送信。非対応機はカメラとIoTセンサーでカバーします。すべての機械状態・ジョブ・待ち行列を一箇所で把握できます。',
      },
      {
        label: '02 — 再計算',
        title: '自動で更新されるスケジュール',
        body: '実績時間が入るたびにスケジュールが再計算され、納期遅延リスクのあるオーダーが原因とともに早期に表示されます。週末になって初めて気づく、ということがなくなります。',
      },
      {
        label: '03 — 決める',
        title: '影響を計算した上での意思決定',
        body: '並べ替え、機械の再割り当て、優先度変更。確定する前に下流への影響が計算されるので、特急対応が他の3件を静かに遅らせる、という事態を防げます。',
      },
    ],
  },
  pillars: {
    eyebrow: 'Argusの機能',
    heading: '四つの機能。一つのライブモデル。',
    cards: [
      {
        tag: '生産スケジューリング',
        title: '現場が実際に守れるスケジュール。',
        bullets: [
          '段取り時間をすべてのジョブの一部としてスケジュールに組み込み',
          '似た段取りを連続させ、機械の稼働時間を最大化',
        ],
      },
      {
        tag: 'フロアトラッキング',
        title: 'すべての機械を。接続の有無を問わず。',
        bullets: [
          'ネットワーク対応機からは直接データを取得',
          '非対応機はカメラとIoTセンサーでカバー',
        ],
      },
      {
        tag: '納期アナリティクス',
        title: '納期の数週間前に、リスクが見える。',
        bullets: [
          '現場の変化に合わせて、すべてのオーダーを納期に対して追跡',
          'リードタイムは見積もりではなく実績から算出',
        ],
      },
      {
        tag: 'シナリオプランニング',
        title: '変更は、実行する前に検証。',
        bullets: [
          '機械の追加、二交代制、製品ミックスの変更',
          '自社の生産データで校正された予測',
        ],
      },
    ],
  },
  team: {
    eyebrow: 'チーム',
    heading: 'Argusのチーム',
    members: [
      {
        name: 'Steven L.',
        role: 'シニアプロダクトマネージャー（AI・シミュレーション・開発ツール）@ Woven by Toyota',
      },
      {
        name: 'Luis P.',
        role: 'エクスペリエンスエンジニアリング日本責任者 @ Capgemini Engineering',
      },
      {
        name: 'Fede M.',
        role: 'シニアテクニカルプロダクトマネージャー（自動化・AI）@ Amazon',
      },
    ],
  },
  cta: {
    heading: '御社のジョブで、Argusを。',
    body: '1週間分のオーダーと機械リストをお送りください。御社の現場データから構築したライブスケジュールをお見せし、どこに生産能力が眠っているかをご説明します。',
    button: 'パイロット導入を始める',
  },
  footer: {
    tagline: '多品種少量の現場のための、計算された生産',
    contact: 'お問い合わせ',
  },
}

const dictionaries: Record<Lang, Strings> = { en, ja }

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Strings
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({ lang, setLang, t: dictionaries[lang] }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
