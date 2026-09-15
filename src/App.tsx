import { useEffect, useState } from 'react'
import { Earth } from './components/Earth/Earth'
import { Header } from './components/Header/Header'
import { LocationPanel } from './components/LocationPanel/LocationPanel'
import { ResultPanel } from './components/ResultPanel/ResultPanel'
import { useTranslation } from './i18n/useTranslation'
import { useEarthStore } from './store/earthStore'
import { formatLatLng } from './utils/coordinates'
import { readLocationFromUrl, writeLocationToUrl } from './utils/share'

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
    const timer = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(timer)
  }, [selectLocation, setLanguage, setReducedMotion])

  useEffect(() => writeLocationToUrl(selected), [selected])

  return (
    <main
      lang={language === 'zh' ? 'zh-CN' : 'en'}
      className="relative min-h-dvh overflow-x-hidden bg-[#030405] text-white md:h-dvh md:overflow-hidden"
    >
      <Header />
      <div className="star-vignette pointer-events-none fixed inset-0 z-[1]" />

      <section className="relative z-10 flex min-h-dvh flex-col pt-20 md:block md:h-dvh md:pt-0">
        <div className="relative z-10 mx-auto w-full max-w-xl px-6 text-center md:absolute md:left-[6vw] md:top-[18vh] md:w-[390px] md:px-0 md:text-left lg:w-[460px]">
          <div className="mb-5 flex items-center justify-center gap-3 md:justify-start">
            <span className="h-px w-8 bg-cyan-100/55" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-100/55">
              01 · ANTIPODE EXPLORER
            </span>
          </div>
          <h1 className="text-balance text-[2.55rem] font-medium leading-[0.98] tracking-normal text-white md:text-[4.25rem]">
            {t.heroLineOne}
            <br />
            <span className="text-white/52">{t.heroLineTwo}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-white/48 md:mx-0 md:text-[15px]">
            {t.subtitle}
          </p>
        </div>

        <div className="relative mt-2 h-[53dvh] min-h-[390px] w-full md:absolute md:inset-0 md:mt-0 md:h-full">
          <div className="earth-reticle pointer-events-none absolute left-1/2 top-1/2 z-[2] aspect-square w-[min(82vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full md:w-[min(54vw,720px)]" />
          <Earth />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[3] flex justify-center md:bottom-7">
            <div className="coordinate-readout">
              <span className={selected ? 'bg-cyan-200' : 'animate-pulse bg-white/55'} />
              <p>{selected ? formatLatLng(selected, 'decimal') : t.clickEarth}</p>
            </div>
          </div>
        </div>

        <div
          className={
            selected
              ? 'relative z-20 mx-auto w-full max-w-md px-4 pb-6 opacity-100 transition duration-500 md:absolute md:bottom-7 md:left-7 md:w-[360px] md:px-0 md:pb-0'
              : 'pointer-events-none h-0 translate-y-4 overflow-hidden opacity-0 md:absolute'
          }
        >
          <LocationPanel />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-md px-4 pb-8 md:absolute md:bottom-7 md:right-7 md:w-[360px] md:px-0 md:pb-0">
          <ResultPanel />
        </div>

        <div className="pointer-events-none absolute bottom-8 right-8 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/24 md:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-200/60" />
          {t.state} / {animationState}
        </div>
      </section>

      {!ready && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#030405] text-center">
          <div>
            <div className="loading-orbit mx-auto mb-6 h-14 w-14 rounded-full border border-white/10">
              <span />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/48">
              EARTH / {t.loadingPlanet}
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
