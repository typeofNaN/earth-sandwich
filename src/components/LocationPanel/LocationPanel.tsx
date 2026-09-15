import { Shuffle } from 'lucide-react'
import { classicPlaces } from '../../data/places'
import { useAntipodeAnimation } from '../../hooks/useAntipodeAnimation'
import { useEarthStore } from '../../store/earthStore'
import { formatLatLng } from '../../utils/coordinates'
import { randomLatLng } from '../../utils/geo'
import { Button } from '../ui/Button'
import { CoordinateInput } from '../CoordinateInput/CoordinateInput'

export function LocationPanel() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const animationState = useEarthStore((state) => state.animationState)
  const coordinateFormat = useEarthStore((state) => state.coordinateFormat)
  const setFormat = useEarthStore((state) => state.setCoordinateFormat)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const { start } = useAntipodeAnimation()
  const busy = ['focusing', 'penetrating', 'rotating', 'revealing'].includes(animationState)

  return (
    <section className="pointer-events-auto w-full max-w-sm space-y-5 rounded-lg border border-white/10 bg-black/35 p-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Selected point</p>
          <p className="mt-1 font-mono text-sm text-white/85">
            {selected ? formatLatLng(selected, coordinateFormat) : 'Click the Earth'}
          </p>
        </div>
        <div className="flex rounded-md border border-white/10 p-1 text-[10px] uppercase tracking-[0.12em]">
          <button
            onClick={() => setFormat('decimal')}
            className={
              coordinateFormat === 'decimal'
                ? 'rounded bg-white text-black px-2 py-1'
                : 'px-2 py-1 text-white/55'
            }
          >
            DD
          </button>
          <button
            onClick={() => setFormat('dms')}
            className={
              coordinateFormat === 'dms'
                ? 'rounded bg-white text-black px-2 py-1'
                : 'px-2 py-1 text-white/55'
            }
          >
            DMS
          </button>
        </div>
      </div>
      <Button variant="primary" onClick={start} disabled={!selected || busy} className="w-full">
        Find the other side
      </Button>
      <Button onClick={() => selectLocation(randomLatLng())} disabled={busy} className="w-full">
        <Shuffle size={15} />
        Surprise me
      </Button>
      <CoordinateInput />
      <div className="grid grid-cols-2 gap-2">
        {classicPlaces.map((place) => (
          <Button
            key={place.name}
            disabled={busy}
            onClick={() => selectLocation(place)}
            className="justify-between px-3 normal-case tracking-normal"
          >
            {place.name}
            <span>→</span>
          </Button>
        ))}
      </div>
    </section>
  )
}
