import { Shuffle } from 'lucide-react'
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
    <section className="pointer-events-auto w-full max-w-sm space-y-5 rounded-lg border border-white/10 bg-black/35 p-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{t.selectedPoint}</p>
          <p className="mt-1 font-mono text-sm text-white/85">
            {selected ? formatLatLng(selected, coordinateFormat) : t.clickTheEarth}
          </p>
        </div>
        <div className="flex rounded-md border border-white/10 p-1 text-[10px] uppercase tracking-[0.12em]">
          {(['decimal', 'dms'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setFormat(format)}
              className={
                coordinateFormat === format
                  ? 'rounded bg-white px-2 py-1 text-black'
                  : 'px-2 py-1 text-white/55'
              }
            >
              {format === 'decimal' ? 'DD' : 'DMS'}
            </button>
          ))}
        </div>
      </div>
      <Button variant="primary" onClick={start} disabled={!selected || busy} className="w-full">
        {t.findOtherSide}
      </Button>
      <Button onClick={() => selectLocation(randomLatLng())} disabled={busy} className="w-full">
        <Shuffle size={15} />
        {t.surpriseMe}
      </Button>
      <CoordinateInput key={selected ? selected.lat + ':' + selected.lng : 'empty'} />
      <div className="grid grid-cols-2 gap-2">
        {classicPlaces.map((place) => (
          <Button
            key={place.name}
            disabled={busy}
            onClick={() => selectLocation(place)}
            className="justify-between px-3 normal-case tracking-normal"
          >
            {t.places[place.name as keyof typeof t.places]}
            <span>→</span>
          </Button>
        ))}
      </div>
    </section>
  )
}
