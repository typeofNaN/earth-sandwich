export type LatLng = {
  lat: number
  lng: number
}

export type CoordinateFormat = 'decimal' | 'dms'

export type AnimationState =
  'idle' | 'selected' | 'focusing' | 'penetrating' | 'rotating' | 'revealing' | 'result'

export type SurfaceKind = 'land' | 'ocean' | 'unknown'

export type SurfaceInfo = {
  kind: SurfaceKind
  label: string
}

export type Place = LatLng & {
  name: string
}
