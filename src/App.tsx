import { useEffect, useState } from 'react'
import { Earth } from './components/Earth/Earth'
import { Header } from './components/Header/Header'
import { LocationPanel } from './components/LocationPanel/LocationPanel'
import { ResultPanel } from './components/ResultPanel/ResultPanel'
import { useEarthStore } from './store/earthStore'
import { formatLatLng } from './utils/coordinates'
import { readLocationFromUrl, writeLocationToUrl } from './utils/share'
import { useTranslation } from './i18n/useTranslation'

export default function App() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const animationState = useEarthStore((state) => state.animationState)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const setReducedMotion = useEarthStore((state) => state.setReducedMotion)
  const setLanguage = useEarthStore((state) => state.setLanguage)
  const { language, t } = useTranslation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(preference.matches)
    const storedLanguage = window.localStorage.getItem('earth-sandwich-language')
    setLanguage(storedLanguage === 'en' ? 'en' : 'zh')
    const initial = readLocationFromUrl()
    if (initial) selectLocation(initial)
    const timer = window.setTimeout(() => setReady(true), 550)
    return () => window.clearTimeout(timer)
  }, [selectLocation, setLanguage, setReducedMotion])

  useEffect(() => writeLocationToUrl(selected), [selected])

  return (
    <main
      lang={language === 'zh' ? 'zh-CN' : 'en'}
      className="relative min-h-dvh overflow-hidden bg-[#050505] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.12),transparent_36%),linear-gradient(180deg,#080808,#050505)]" />
      <Header />
      {!ready && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-[#050505] text-center transition-opacity">
          <div>
            <div className="mx-auto mb-4 h-3 w-3 animate-pulse rounded-full bg-cyan-100 shadow-[0_0_30px_rgba(103,232,249,0.9)]" />
            <p className="text-xs uppercase tracking-[0.32em] text-white/60">{t.loadingPlanet}</p>
          </div>
        </div>
      )}
      <section className="relative z-10 grid min-h-dvh grid-rows-[auto_1fr_auto] px-4 pb-4 pt-20 md:px-8 md:pb-8">
        <div className="pointer-events-none mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-semibold uppercase leading-[0.95] tracking-normal text-white md:text-6xl lg:text-7xl">
            {t.heroLineOne}
            <br />
            {t.heroLineTwo}
          </h1>
          <p className="mt-4 text-sm text-white/55 md:text-base">{t.subtitle}</p>
        </div>
        <div className="relative min-h-[390px] md:min-h-[520px]">
          <Earth />
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
            <p className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] text-white/55 backdrop-blur-md">
              {selected ? formatLatLng(selected, 'decimal') : t.clickEarth}
            </p>
          </div>
        </div>
        <div className="pointer-events-none mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-[minmax(280px,360px)_1fr_minmax(280px,360px)] md:items-end">
          <div className={selected ? 'opacity-100' : 'opacity-0 md:opacity-100'}>
            <LocationPanel />
          </div>
          <div />
          <ResultPanel />
        </div>
      </section>
      <div className="pointer-events-none fixed bottom-4 left-4 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/25 md:block">
        {t.state}: {animationState}
      </div>
    </main>
  )
}
