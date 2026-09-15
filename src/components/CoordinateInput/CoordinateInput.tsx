import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import { useEarthStore } from '../../store/earthStore'
import { parseCoordinate } from '../../utils/coordinates'
import { isValidLatLng, roundCoordinate } from '../../utils/geo'
import { Button } from '../ui/Button'

export function CoordinateInput() {
  const selected = useEarthStore((state) => state.selectedLocation)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const { t } = useTranslation()
  const [lat, setLat] = useState(selected?.lat.toString() ?? '')
  const [lng, setLng] = useState(selected?.lng.toString() ?? '')
  const [error, setError] = useState(false)

  function submit() {
    const parsedLat = parseCoordinate(lat)
    const parsedLng = parseCoordinate(lng)
    if (parsedLat === null || parsedLng === null || !isValidLatLng(parsedLat, parsedLng)) {
      setError(true)
      return
    }
    setError(false)
    selectLocation({ lat: roundCoordinate(parsedLat, 4), lng: roundCoordinate(parsedLng, 4) })
  }

  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
        <label className="group">
          <span className="mb-1.5 block text-[8px] uppercase tracking-[0.18em] text-white/28">
            {t.latitude}
          </span>
          <input
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            className="h-9 w-full rounded-sm border border-white/10 bg-black/35 px-2.5 font-mono text-[12px] text-white/78 outline-none transition placeholder:text-white/18 focus:border-cyan-200/45"
            placeholder="23.1291"
            inputMode="decimal"
          />
        </label>
        <label className="group">
          <span className="mb-1.5 block text-[8px] uppercase tracking-[0.18em] text-white/28">
            {t.longitude}
          </span>
          <input
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            className="h-9 w-full rounded-sm border border-white/10 bg-black/35 px-2.5 font-mono text-[12px] text-white/78 outline-none transition placeholder:text-white/18 focus:border-cyan-200/45"
            placeholder="113.2644"
            inputMode="decimal"
          />
        </label>
        <Button onClick={submit} aria-label={t.goAria} className="mt-[22px] h-9 min-h-9 w-10 px-0">
          <LocateFixed size={14} />
        </Button>
      </div>
      {error && <p className="mt-2 text-[10px] leading-4 text-rose-200/85">{t.coordinateError}</p>}
    </div>
  )
}
