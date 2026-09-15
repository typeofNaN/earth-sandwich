import { Vector3 } from 'three'
import type { LatLng } from '../types/geo'

export const EARTH_RADIUS = 2
export const EARTH_DIAMETER_KM = 12_742
const EPSILON = 1e-10

export function clampLatitude(lat: number): number {
  return Math.min(90, Math.max(-90, lat))
}

export function normalizeLongitude(lng: number): number {
  if (Object.is(lng, -0)) return 0
  const normalized = ((((lng + 180) % 360) + 360) % 360) - 180
  return Math.abs(normalized + 180) < EPSILON && lng > 0 ? 180 : normalized
}

export function roundCoordinate(value: number, decimals = 4): number {
  const rounded = Number(value.toFixed(decimals))
  return Object.is(rounded, -0) ? 0 : rounded
}

export function getAntipode(lat: number, lng: number): LatLng {
  return {
    lat: roundCoordinate(-clampLatitude(lat), 6),
    lng: roundCoordinate(lng > 0 ? lng - 180 : lng + 180, 6),
  }
}

export function latLngToVector3(lat: number, lng: number, radius = EARTH_RADIUS): Vector3 {
  const phi = (90 - clampLatitude(lat)) * (Math.PI / 180)
  const theta = (normalizeLongitude(lng) + 180) * (Math.PI / 180)
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

export function vector3ToLatLng(position: Vector3): LatLng {
  const normalized = position.clone().normalize()
  const lat = 90 - (Math.acos(normalized.y) * 180) / Math.PI
  const lng = (Math.atan2(normalized.z, -normalized.x) * 180) / Math.PI - 180
  return {
    lat: roundCoordinate(clampLatitude(lat), 6),
    lng: roundCoordinate(normalizeLongitude(lng), 6),
  }
}

export function randomLatLng(): LatLng {
  const u = Math.random() * 2 - 1
  const theta = Math.random() * Math.PI * 2
  return {
    lat: roundCoordinate((Math.asin(u) * 180) / Math.PI, 4),
    lng: roundCoordinate(normalizeLongitude((theta * 180) / Math.PI - 180), 4),
  }
}

export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}
