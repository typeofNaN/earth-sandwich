import { Languages } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useEarthStore } from '../../store/earthStore'

export function Header() {
  const { language, t } = useTranslation()
  const setLanguage = useEarthStore((state) => state.setLanguage)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 text-white md:px-8">
      <div className="text-sm font-semibold uppercase tracking-[0.28em]">Earth Sandwich</div>
      <div className="pointer-events-auto flex items-center gap-4">
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          aria-label={t.languageLabel}
          className="flex items-center gap-1.5 text-xs uppercase text-white/60 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
        >
          <Languages size={15} aria-hidden="true" />
          {language === 'zh' ? 'EN' : '中文'}
        </button>
        <a
          className="text-xs uppercase tracking-[0.12em] text-white/55 transition hover:text-white"
          href={
            language === 'zh'
              ? 'https://zh.wikipedia.org/wiki/%E5%AF%B9%E8%B7%96%E7%82%B9'
              : 'https://en.wikipedia.org/wiki/Antipodes'
          }
          target="_blank"
          rel="noreferrer"
        >
          {t.about}
        </a>
      </div>
    </header>
  )
}
