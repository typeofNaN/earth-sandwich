import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { useEarthStore } from '../../store/earthStore'
import { isValidLatLng, roundCoordinate } from '../../utils/geo'
import { parseCoordinate } from '../../utils/coordinates'
import { Button } from '../ui/Button'

export function CoordinateInput() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const [lat, setLat] = useState(selected?.lat.toString() ?? '')
  const [lng, setLng] = useState(selected?.lng.toString() ?? '')
  const [error, setError] = useState('')

  function submit() {
    const parsedLat = parseCoordinate(lat)
    const parsedLng = parseCoordinate(lng)
    if (parsedLat === null || parsedLng === null || !isValidLatLng(parsedLat, parsedLng)) {
      setError('Latitude must be -90 to 90. Longitude must be -180 to 180.')
      return
    }
    setError('')
    selectLocation({ lat: roundCoordinate(parsedLat, 4), lng: roundCoordinate(parsedLng, 4) })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="space-y-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
          Latitude
          <input
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white outline-none focus:border-cyan-200/60"
            placeholder="23.1291"
            inputMode="decimal"
          />
        </label>
        <label className="space-y-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
          Longitude
          <input
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white outline-none focus:border-cyan-200/60"
            placeholder="113.2644"
            inputMode="decimal"
          />
        </label>
      </div>
      {error && <p className="text-xs text-rose-200">{error}</p>}
      <Button onClick={submit} aria-label="Go to typed coordinates" className="w-full">
        <LocateFixed size={15} />
        Go
      </Button>
    </div>
  )
}
