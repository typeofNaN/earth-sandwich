import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'
import type { LatLng, SurfaceInfo } from '../types/geo'

type LandPolygon = {
  name: string
  coordinates: [number, number][]
}

const landPolygons: LandPolygon[] = [
  {
    name: 'North America',
    coordinates: [
      [-168, 15],
      [-140, 72],
      [-52, 72],
      [-50, 42],
      [-80, 8],
      [-118, 14],
      [-168, 15],
    ],
  },
  {
    name: 'South America',
    coordinates: [
      [-82, 13],
      [-35, 10],
      [-35, -55],
      [-73, -56],
      [-82, 13],
    ],
  },
  {
    name: 'Greenland',
    coordinates: [
      [-74, 59],
      [-12, 59],
      [-18, 84],
      [-72, 84],
      [-74, 59],
    ],
  },
  {
    name: 'Europe',
    coordinates: [
      [-11, 36],
      [42, 36],
      [60, 70],
      [-10, 72],
      [-11, 36],
    ],
  },
  {
    name: 'Africa',
    coordinates: [
      [-18, 36],
      [52, 32],
      [50, -35],
      [12, -35],
      [-18, 5],
      [-18, 36],
    ],
  },
  {
    name: 'Asia',
    coordinates: [
      [26, 5],
      [180, 5],
      [180, 77],
      [45, 77],
      [26, 5],
    ],
  },
  {
    name: 'Southeast Asia',
    coordinates: [
      [92, -12],
      [155, -12],
      [155, 24],
      [92, 24],
      [92, -12],
    ],
  },
  {
    name: 'Australia',
    coordinates: [
      [112, -44],
      [154, -44],
      [154, -10],
      [112, -10],
      [112, -44],
    ],
  },
  {
    name: 'Antarctica',
    coordinates: [
      [-180, -90],
      [180, -90],
      [180, -62],
      [-180, -62],
      [-180, -90],
    ],
  },
]

function contains(location: LatLng, land: LandPolygon): boolean {
  return booleanPointInPolygon(
    point([location.lng, location.lat]),
    polygon([[...land.coordinates, land.coordinates[0]]]),
  )
}

export function getSurfaceInfo(location: LatLng): SurfaceInfo {
  try {
    const match = landPolygons.find((land) => contains(location, land))
    if (!match) return { kind: 'ocean', label: 'Open ocean' }
    return { kind: 'land', label: match.name }
  } catch {
    return { kind: 'unknown', label: 'Surface unknown' }
  }
}
