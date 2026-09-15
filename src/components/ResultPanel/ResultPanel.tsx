import { Copy, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useEarthStore } from '../../store/earthStore'
import { formatLatLng } from '../../utils/coordinates'
import { EARTH_DIAMETER_KM } from '../../utils/geo'
import { copyShareLink } from '../../utils/share'
import { Button } from '../ui/Button'

export function ResultPanel() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const antipode = useEarthStore((state) => state.antipode)
  const selectedSurface = useEarthStore((state) => state.selectedSurface)
  const antipodeSurface = useEarthStore((state) => state.antipodeSurface)
  const coordinateFormat = useEarthStore((state) => state.coordinateFormat)
  const animationState = useEarthStore((state) => state.animationState)
  const reset = useEarthStore((state) => state.reset)
  const [copyState, setCopyState] = useState('Copy link')

  if (!selected || !antipode || animationState !== 'result') return null
  const pathLabel =
    `${selectedSurface?.kind ?? 'unknown'} → ${antipodeSurface?.kind ?? 'unknown'}`.toUpperCase()
  const rare = selectedSurface?.kind === 'land' && antipodeSurface?.kind === 'land'

  async function copy() {
    if (!selected) return
    setCopyState((await copyShareLink(selected)) ? 'Copied' : 'Copy unavailable')
  }

  return (
    <section className="pointer-events-auto w-full max-w-sm space-y-4 rounded-lg border border-cyan-100/15 bg-black/45 p-5 text-white shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/65">The other side</p>
      <div className="space-y-3 font-mono text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">You started here</p>
          <p>{formatLatLng(selected, coordinateFormat)}</p>
        </div>
        <div className="text-center text-white/45">
          ↓<br />
          <span className="text-base text-white">{EARTH_DIAMETER_KM.toLocaleString()} km</span>
          <br />
          THROUGH THE EARTH
          <br />↓
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">The other side</p>
          <p className="text-cyan-100">{formatLatLng(antipode, coordinateFormat)}</p>
        </div>
      </div>
      <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          {rare ? 'LAND TO LAND' : pathLabel}
        </p>
        <p className="mt-1 text-sm text-white/78">
          You would emerge {antipodeSurface?.kind === 'land' ? 'near' : 'in'}{' '}
          {antipodeSurface?.label ?? 'an unknown surface'}.
        </p>
        {rare && <p className="mt-1 text-xs text-cyan-100/70">Rare one.</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={copy}>
          <Copy size={15} />
          {copyState}
        </Button>
        <Button onClick={reset}>
          <RotateCcw size={15} />
          Try another
        </Button>
      </div>
    </section>
  )
}
