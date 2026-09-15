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
    <section className="pointer-events-auto w-full max-w-sm space-y-4 rounded-lg border border-cyan-100/15 bg-black/45 p-5 text-white shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100/65">{t.otherSide}</p>
      <div className="space-y-3 font-mono text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">{t.startedHere}</p>
          <p>{formatLatLng(selected, coordinateFormat)}</p>
        </div>
        <div className="text-center text-white/45">
          ↓<br />
          <span className="text-base text-white">{EARTH_DIAMETER_KM.toLocaleString()} km</span>
          <br />
          {t.throughEarth.toUpperCase()}
          <br />↓
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">{t.otherSide}</p>
          <p className="text-cyan-100">{formatLatLng(antipode, coordinateFormat)}</p>
        </div>
      </div>
      <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-white/50">
          {rare ? t.landToLand : pathLabel}
        </p>
        <p className="mt-1 text-sm text-white/78">
          {antipodeSurface?.kind === 'land' ? t.emergeNear : t.emergeIn}
          {surfaceName(antipodeSurface, t)}
        </p>
        {rare && <p className="mt-1 text-xs text-cyan-100/70">{t.rareOne}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={copy}>
          <Copy size={15} />
          {copyLabel}
        </Button>
        <Button onClick={reset}>
          <RotateCcw size={15} />
          {t.tryAnother}
        </Button>
      </div>
    </section>
  )
}
