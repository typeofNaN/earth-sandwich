import { ArrowUpRight, Shuffle } from 'lucide-react'
import { classicPlaces } from '../../data/places'
import { useAntipodeAnimation } from '../../hooks/useAntipodeAnimation'
import { useTranslation } from '../../i18n/useTranslation'
import { useEarthStore } from '../../store/earthStore'
import { formatLatLng } from '../../utils/coordinates'
import { randomLatLng } from '../../utils/geo'
import { CoordinateInput } from '../CoordinateInput/CoordinateInput'
import { Button } from '../ui/Button'

export function LocationPanel() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const animationState = useEarthStore((state) => state.animationState)
  const coordinateFormat = useEarthStore((state) => state.coordinateFormat)
  const setFormat = useEarthStore((state) => state.setCoordinateFormat)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const { start } = useAntipodeAnimation()
  const { t } = useTranslation()
  const busy = ['focusing', 'penetrating', 'rotating', 'revealing'].includes(animationState)

  return (
    <section className="instrument-panel pointer-events-auto w-full overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-4 py-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,0.8)]" />
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/38">
              {t.selectedPoint}
            </p>
          </div>
          <p className="font-mono text-[13px] text-white/86">
            {selected ? formatLatLng(selected, coordinateFormat) : t.clickTheEarth}
          </p>
        </div>
        <div className="flex rounded-sm border border-white/10 bg-black/30 p-0.5">
          {(['decimal', 'dms'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setFormat(format)}
              className={
                coordinateFormat === format
                  ? 'rounded-[1px] bg-white px-2 py-1 font-mono text-[9px] text-black'
                  : 'px-2 py-1 font-mono text-[9px] text-white/38'
              }
            >
              {format === 'decimal' ? 'DD' : 'DMS'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2 p-3">
        <Button variant="primary" onClick={start} disabled={!selected || busy}>
          {t.findOtherSide}
          <ArrowUpRight size={14} />
        </Button>
        <Button
          onClick={() => selectLocation(randomLatLng())}
          disabled={busy}
          aria-label={t.surpriseMe}
          className="w-11 px-0"
        >
          <Shuffle size={15} />
        </Button>
      </div>

      <div className="border-t border-white/[0.08] p-3">
        <CoordinateInput />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.08] px-4 py-3">
        {classicPlaces.map((place) => (
          <button
            key={place.name}
            disabled={busy}
            onClick={() => selectLocation(place)}
            className="text-[10px] text-white/38 transition hover:text-cyan-100 disabled:opacity-30"
          >
            {t.places[place.name as keyof typeof t.places]} ↗
          </button>
        ))}
      </div>
    </section>
  )
}
