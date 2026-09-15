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
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="space-y-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
          {t.latitude}
          <input
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white outline-none focus:border-cyan-200/60"
            placeholder="23.1291"
            inputMode="decimal"
          />
        </label>
        <label className="space-y-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
          {t.longitude}
          <input
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white outline-none focus:border-cyan-200/60"
            placeholder="113.2644"
            inputMode="decimal"
          />
        </label>
      </div>
      {error && <p className="text-xs text-rose-200">{t.coordinateError}</p>}
      <Button onClick={submit} aria-label={t.goAria} className="w-full">
        <LocateFixed size={15} />
        {t.go}
      </Button>
    </div>
  )
}
