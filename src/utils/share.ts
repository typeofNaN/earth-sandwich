import type { LatLng } from '../types/geo'
import { isValidLatLng, roundCoordinate } from './geo'

export function readLocationFromUrl(): LatLng | null {
  const params = new URLSearchParams(window.location.search)
  const lat = Number(params.get('lat'))
  const lng = Number(params.get('lng'))
  if (!isValidLatLng(lat, lng)) return null
  return { lat: roundCoordinate(lat, 4), lng: roundCoordinate(lng, 4) }
}

export function writeLocationToUrl(location: LatLng | null): void {
  const url = new URL(window.location.href)
  if (!location) {
    url.searchParams.delete('lat')
    url.searchParams.delete('lng')
  } else {
    url.searchParams.set('lat', roundCoordinate(location.lat, 4).toString())
    url.searchParams.set('lng', roundCoordinate(location.lng, 4).toString())
  }
  window.history.replaceState({}, '', url)
}

export async function copyShareLink(location: LatLng): Promise<boolean> {
  const url = new URL(window.location.href)
  url.searchParams.set('lat', roundCoordinate(location.lat, 4).toString())
  url.searchParams.set('lng', roundCoordinate(location.lng, 4).toString())
  if (!navigator.clipboard?.writeText) return false
  await navigator.clipboard.writeText(url.toString())
  return true
}
