import { useI18n } from '../i18n'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-graphite border-t border-line-dark px-6 py-8">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8A929B]">
        <p>
          <span className="font-semibold text-[#E8EBE7]">Argus</span>
          {' · '}
          {t.footer.tagline}
        </p>
        <p>
          <a
            href="mailto:hello@argus.app"
            className="hover:text-white transition-colors"
          >
            {t.footer.contact}
          </a>
          {' · © 2026 Argus'}
        </p>
      </div>
    </footer>
  )
}
