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

/**
 * Copy is design-agnostic on purpose: the visual worlds render these same strings.
 * Voice is set by brochure-content.md v2 — plain, declarative, benefit-first.
 *
 * `v2` is the shipping copy for every candidate, version 0 included, so the versions
 * differ in design and not in words. It names the category in the first line (APS),
 * leads for the owner and then goes deep for the operation manager, and explains the
 * live-data mechanism concretely instead of asserting it.
 */
const en = {
  v2: {
    nav: {
      product: 'Product',
      live: 'Live data',
      pilot: 'Pilot',
      demo: 'Book a demo',
    },
    kicker: 'Digitize your factory floor',
    h1: 'Advanced planning & scheduling',
    h1accent: 'for high-mix machine shops.',
    sub: 'Soma schedules every order across every machine against real capacity, including shifts, holidays, setups and maintenance. Cameras and IoT sensors report what each machine actually started and finished, so the schedule on screen matches the floor without anyone typing it in.',
    ctaPrimary: 'Book a demo',
    ctaSecondary: 'See how it works',
    status:
      'In development with a 39-person shop in Japan machining semiconductor equipment components.',

    shot: {
      alt: 'The Soma scheduling board: machine rows grouped by turning, milling and drilling, with an auto-schedule proposal across three orders.',
      caption:
        'Auto-scheduling three orders: 35 operations placed across the shop, each order checked against its due date before the plan is applied.',
    },

    outcomes: {
      heading: 'What it changes',
      items: [
        {
          title: 'Get more out of the machines you already own',
          body: 'A precise schedule keeps spindles cutting instead of waiting. Similar setups run back to back, and every machine is loaded to its real limit rather than to a guess.',
        },
        {
          title: 'Quote dates you can keep',
          body: 'Every order is scheduled against real capacity, so the completion date you see is one the floor can actually hit.',
        },
        {
          title: 'Know where every job is',
          body: 'Machine status comes from the machines themselves, not from a clipboard collected at the end of the shift.',
        },
      ],
    },

    analytics: {
      heading: 'Planned against actual',
      lede: 'Every schedule and every machine report is kept, so the two can be compared over time.',
      items: [
        {
          tag: 'Where the estimate was wrong',
          body: 'Cycle and setup times drift from what the routing says. Soma shows which parts and which machines run long, so the next quote uses measured numbers instead of the original estimate.',
        },
        {
          tag: 'Where the queue builds',
          body: 'Planned start against actual start, across weeks, shows which machine work consistently waits in front of. That is your bottleneck, measured rather than argued about.',
        },
        {
          tag: 'Where the capacity went',
          body: 'Cutting, setup, waiting and downtime separated per machine, so a decision to add a shift or buy a machine rests on a record.',
        },
      ],
      close:
        'The schedule is the plan and the record at the same time, so there is nothing extra to collect.',
    },

    team: {
      heading: 'Meet the team',
      lede: 'Product and engineering people who have shipped manufacturing and automation systems.',
    },

    testimonial: {
      label: 'Placeholder',
      quote:
        '[Placeholder. Customer quote to be supplied by Nippo KK and approved before launch.]',
      name: 'Nippo KK',
      role: 'Precision CNC machining, Japan',
      note: 'Not a real quote. This block is a layout placeholder and must be replaced or removed before the site goes live.',
    },

    live: {
      heading: 'How the live data works',
      lede: 'Three ways in, depending on what the machine can do.',
      items: [
        {
          tag: 'Connected machines',
          body: 'Machines whose controls can already report their state send it straight to Soma. Nothing to mount, nothing to wire.',
        },
        {
          tag: 'Cameras',
          body: 'A camera pointed at the status lamp and the control screen reads what an operator reads: running, stopped, in setup, in alarm.',
        },
        {
          tag: 'IoT sensors',
          body: 'For older machines with neither, a sensor on the spindle or the power line detects when metal is actually being cut.',
        },
      ],
      close:
        'All three arrive in the same place. The block on the schedule turns from planned to actual, and anything downstream re-plans against it.',
    },

    capabilities: {
      heading: 'For the person running the board',
      items: [
        {
          tag: 'Scheduling',
          title: 'Place one order, or the whole backlog.',
          body: 'Drag an order onto a machine, or let Soma place everything at once. Step sequence and machine capability are checked as each operation lands.',
        },
        {
          tag: 'Change management',
          title: 'See what a change costs before it commits.',
          body: 'Move one order and everything downstream re-plans. The full impact is shown for approval first, and any change can be undone.',
        },
        {
          tag: 'Library and record',
          title: 'Record a part once. The schedule keeps the rest.',
          body: 'Steps, capable machines, setup and cycle times, inspections and outsourced operations are stored per part and reused by every future order. The schedule doubles as the history: scroll back to any past day and see what ran, on which machine, for which order.',
        },
      ],
    },

    pilot: {
      heading: 'See it on your own jobs.',
      body: 'Send your machine list and a week of orders. We build the board from your data and walk you through it: scheduling, a change, and where your capacity is actually going.',
      cta: 'Book a demo',
    },
  },

  /** The people. Shared by every version's team block. */
  team: {
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
  footer: {
    contact: 'Contact',
  },
}

export type Strings = typeof en

const ja: Strings = {
  v2: {
    nav: {
      product: '製品',
      live: '実績データ',
      pilot: '導入',
      demo: 'デモを依頼',
    },
    kicker: '製造現場をデジタル化する',
    h1: '多品種少量の機械加工現場のための',
    h1accent: '生産スケジューラ。',
    sub: 'Somaは、シフト・休日・段取り・メンテナンスを織り込んだ実際の能力に対して、すべてのオーダーをすべての機械に割り付けます。各機械が実際にいつ着手し、いつ終えたかはカメラとIoTセンサーが報告するため、画面上の計画と現場が、誰も入力しないままで一致します。',
    ctaPrimary: 'デモを依頼する',
    ctaSecondary: '仕組みを見る',
    status: '半導体装置部品を加工する従業員39名の工場と共同開発中。',

    shot: {
      alt: 'Somaのスケジューリング画面。旋盤・フライス・穴あけごとに機械行が並び、3件のオーダーの自動スケジュール案が表示されている。',
      caption:
        '3件のオーダーを自動スケジューリング。35工程を現場全体に配置し、確定前に各オーダーを納期と照合します。',
    },

    outcomes: {
      heading: '何が変わるか',
      items: [
        {
          title: '今ある機械から、もっと引き出せる',
          body: '精度の高い計画は、主軸を待たせずに削らせます。似た段取りを連続させ、勘ではなく実際の限界まで機械を積みます。',
        },
        {
          title: '守れる納期を回答できる',
          body: '実際の能力に対して割り付けるため、画面に出る完了予定は現場がそのまま達成できる日付になります。',
        },
        {
          title: 'どのジョブがどこにあるか分かる',
          body: '機械の状態は機械自身から届きます。終業後に紙を集めて回る必要がありません。',
        },
      ],
    },

    analytics: {
      heading: '計画と実績を突き合わせる',
      lede: 'すべての計画と機械からの報告を蓄積するため、両者を時系列で比較できます。',
      items: [
        {
          tag: '見積もりのずれが分かる',
          body: '加工時間や段取り時間は工程情報からずれていきます。どの部品・どの機械が長引くかを提示するので、次回の見積もりは当初の想定ではなく実測値を使えます。',
        },
        {
          tag: '滞留している場所が分かる',
          body: '計画上の開始時刻と実際の開始時刻を数週間分並べると、どの機械の手前で仕掛かりが待ち続けているかが見えます。これが、議論ではなく実測で特定したボトルネックです。',
        },
        {
          tag: '能力の使われ方が分かる',
          body: '切削・段取り・待ち・停止を機械ごとに切り分けます。交代制の追加や設備投資の判断を、記録に基づいて下せます。',
        },
      ],
      close: 'スケジュールがそのまま計画であり記録でもあるため、別途集める手間はありません。',
    },

    team: {
      heading: 'チーム紹介',
      lede: '製造・自動化領域のシステムを実際に世に出してきたプロダクトとエンジニアリングのメンバーです。',
    },

    testimonial: {
      label: 'プレースホルダー',
      quote: '［プレースホルダー。Nippo KK様より頂戴し、公開前に承認を得たうえで差し替えます。］',
      name: 'Nippo KK',
      role: '精密切削加工・日本',
      note: '実際のコメントではありません。このブロックはレイアウト確認用であり、公開前に差し替えるか削除する必要があります。',
    },

    live: {
      heading: '実績データの取り込み方',
      lede: '機械の対応状況に応じて、三つの経路があります。',
      items: [
        {
          tag: 'ネットワーク対応機',
          body: '状態を出力できる制御装置を持つ機械は、そのままSomaへ送信します。取り付けも配線も不要です。',
        },
        {
          tag: 'カメラ',
          body: '積層信号灯と制御画面にカメラを向けると、稼働・停止・段取り・アラームを、作業者が読むのと同じように読み取ります。',
        },
        {
          tag: 'IoTセンサー',
          body: 'どちらも持たない旧型機は、主軸や電源線に付けたセンサーが、実際に切削しているかどうかを検知します。',
        },
      ],
      close:
        '三つとも行き先は同じです。スケジュール上のブロックが計画から実績に変わり、後工程はそれに合わせて再計画されます。',
    },

    capabilities: {
      heading: 'ボードを預かる人のために',
      items: [
        {
          tag: 'スケジューリング',
          title: '1件でも、バックログ全体でも。',
          body: 'オーダーを機械にドラッグするか、Somaにまとめて任せます。工程順と機械の対応可否は、各工程を置いた時点で照合されます。',
        },
        {
          tag: '変更管理',
          title: '変更の代償は、確定する前に見える。',
          body: 'オーダーを一つ動かせば後工程がまとめて再計画されます。影響をすべて提示したうえで承認でき、どの操作も取り消せます。',
        },
        {
          tag: 'ライブラリと記録',
          title: '部品は一度登録すれば、あとはスケジュールが覚えている。',
          body: '工程、対応機械、段取り・加工時間、検査、外注工程を部品ごとに保存し、以降のすべてのオーダーで再利用します。スケジュールはそのまま履歴にもなり、過去のどの日に何を・どの機械で・どのオーダーのために流したかを遡って確認できます。',
        },
      ],
    },

    pilot: {
      heading: '御社のジョブで確かめてください。',
      body: '機械リストと1週間分のオーダーをお送りください。そのデータでボードを構築し、スケジューリング、変更への対応、生産能力の使われ方までご案内します。',
      cta: 'デモを依頼する',
    },
  },

  team: {
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
  footer: {
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
