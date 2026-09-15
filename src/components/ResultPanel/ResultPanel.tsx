import { Copy, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import type { Translation } from '../../i18n/translations'
import { useEarthStore } from '../../store/earthStore'
import type { SurfaceInfo } from '../../types/geo'
import { formatLatLng } from '../../utils/coordinates'
import { EARTH_DIAMETER_KM } from '../../utils/geo'
import { copyShareLink } from '../../utils/share'
import { Button } from '../ui/Button'

function surfaceKindLabel(surface: SurfaceInfo | null, t: Translation) {
  return t[surface?.kind ?? 'unknown']
}

function surfaceName(surface: SurfaceInfo | null, t: Translation) {
  if (!surface || surface.kind === 'unknown') return t.surfaceUnknown
  if (surface.kind === 'ocean') return t.openOcean
  return t.regions[surface.label as keyof typeof t.regions] ?? surface.label
}

export function ResultPanel() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const antipode = useEarthStore((state) => state.antipode)
  const selectedSurface = useEarthStore((state) => state.selectedSurface)
  const antipodeSurface = useEarthStore((state) => state.antipodeSurface)
  const coordinateFormat = useEarthStore((state) => state.coordinateFormat)
  const animationState = useEarthStore((state) => state.animationState)
  const reset = useEarthStore((state) => state.reset)
  const { t } = useTranslation()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'unavailable'>('idle')

  if (!selected || !antipode || animationState !== 'result') return null
  const pathLabel = `${surfaceKindLabel(selectedSurface, t)} → ${surfaceKindLabel(antipodeSurface, t)}`
  const rare = selectedSurface?.kind === 'land' && antipodeSurface?.kind === 'land'
  const copyLabel =
    copyStatus === 'copied'
      ? t.copied
      : copyStatus === 'unavailable'
        ? t.copyUnavailable
        : t.copyLink

  async function copy() {
    if (!selected) return
    setCopyStatus((await copyShareLink(selected)) ? 'copied' : 'unavailable')
  }

  return (
    <section className="instrument-panel result-panel pointer-events-auto w-full overflow-hidden">
      <div className="border-b border-white/[0.08] px-5 py-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.9)]" />
          <p className="text-[9px] uppercase tracking-[0.24em] text-cyan-100/55">{t.otherSide}</p>
        </div>
        <p className="font-mono text-base text-cyan-50">
          {formatLatLng(antipode, coordinateFormat)}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-5">
        <div>
          <p className="mb-1 text-[8px] uppercase tracking-[0.14em] text-white/28">
            {t.startedHere}
          </p>
          <p className="font-mono text-[10px] leading-4 text-white/60">
            {formatLatLng(selected, coordinateFormat)}
          </p>
        </div>
        <div className="grid place-items-center">
          <span className="h-5 w-px bg-gradient-to-b from-transparent to-cyan-200/50" />
          <span className="my-1 h-2 w-2 rounded-full border border-cyan-100/70" />
          <span className="h-5 w-px bg-gradient-to-b from-cyan-200/50 to-transparent" />
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-white/90">{EARTH_DIAMETER_KM.toLocaleString()} km</p>
          <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/28">
            {t.throughEarth}
          </p>
        </div>
      </div>

      <div className="mx-3 border border-white/[0.08] bg-white/[0.025] px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/42">
            {rare ? t.landToLand : pathLabel}
          </p>
          {rare && <span className="text-[9px] text-cyan-100/55">{t.rareOne}</span>}
        </div>
        <p className="mt-2 text-xs text-white/68">
          {antipodeSurface?.kind === 'land' ? t.emergeNear : t.emergeIn}
          {surfaceName(antipodeSurface, t)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        <Button onClick={copy}>
          <Copy size={14} />
          {copyLabel}
        </Button>
        <Button onClick={reset}>
          <RotateCcw size={14} />
          {t.tryAnother}
        </Button>
      </div>
    </section>
  )
}
