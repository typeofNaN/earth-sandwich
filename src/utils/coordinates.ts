import type { CoordinateFormat, LatLng } from '../types/geo'
import { roundCoordinate } from './geo'

function formatSigned(value: number, positive: string, negative: string): string {
  const direction = value >= 0 ? positive : negative
  return Math.abs(roundCoordinate(value, 4)).toFixed(4) + '° ' + direction
}

function formatDmsValue(value: number, positive: string, negative: string): string {
  const direction = value >= 0 ? positive : negative
  const absolute = Math.abs(value)
  const degrees = Math.floor(absolute)
  const minutesFloat = (absolute - degrees) * 60
  const minutes = Math.floor(minutesFloat)
  const seconds = (minutesFloat - minutes) * 60
  return `${degrees}°${String(minutes).padStart(2, '0')}'${seconds.toFixed(1).padStart(4, '0')}"${direction}`
}

export function formatLatLng(location: LatLng, format: CoordinateFormat): string {
  if (format === 'dms') {
    return `${formatDmsValue(location.lat, 'N', 'S')} · ${formatDmsValue(location.lng, 'E', 'W')}`
  }
  return `${formatSigned(location.lat, 'N', 'S')} · ${formatSigned(location.lng, 'E', 'W')}`
}

export function parseCoordinate(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}
