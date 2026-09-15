import { Languages } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useEarthStore } from '../../store/earthStore'

export function Header() {
  const { language, t } = useTranslation()
  const setLanguage = useEarthStore((state) => state.setLanguage)

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.07] px-5 text-white md:h-20 md:px-8">
      <a
        href={import.meta.env.BASE_URL}
        className="group flex items-center gap-3"
        aria-label="Earth Sandwich"
      >
        <span className="relative grid h-7 w-7 place-items-center rounded-full border border-white/25">
          <span className="h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_14px_rgba(165,243,252,0.75)]" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/88">
          Earth Sandwich
        </span>
      </a>
      <div className="flex items-center gap-5">
        <a
          className="hidden text-[10px] uppercase tracking-[0.18em] text-white/38 transition hover:text-white sm:block"
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
        <span className="hidden h-4 w-px bg-white/10 sm:block" />
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          aria-label={t.languageLabel}
          className="flex min-h-9 items-center gap-2 rounded-sm border border-white/10 bg-white/[0.035] px-3 text-[10px] uppercase tracking-[0.14em] text-white/65 transition hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <Languages size={14} aria-hidden="true" />
          {language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>
    </header>
  )
}
