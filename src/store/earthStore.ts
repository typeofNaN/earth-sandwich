import { create } from 'zustand'
import type { AnimationState, CoordinateFormat, LatLng, SurfaceInfo } from '../types/geo'
import { getSurfaceInfo } from '../data/land'
import { getAntipode } from '../utils/geo'

type EarthStore = {
  selectedLocation: LatLng | null
  antipode: LatLng | null
  selectedSurface: SurfaceInfo | null
  antipodeSurface: SurfaceInfo | null
  animationState: AnimationState
  coordinateFormat: CoordinateFormat
  reducedMotion: boolean
  selectLocation: (location: LatLng) => void
  setAnimationState: (state: AnimationState) => void
  setCoordinateFormat: (format: CoordinateFormat) => void
  setReducedMotion: (reduced: boolean) => void
  reset: () => void
}

export const useEarthStore = create<EarthStore>((set) => ({
  selectedLocation: null,
  antipode: null,
  selectedSurface: null,
  antipodeSurface: null,
  animationState: 'idle',
  coordinateFormat: 'decimal',
  reducedMotion: false,
  selectLocation: (location) => {
    const antipode = getAntipode(location.lat, location.lng)
    set({
      selectedLocation: location,
      antipode,
      selectedSurface: getSurfaceInfo(location),
      antipodeSurface: getSurfaceInfo(antipode),
      animationState: 'selected',
    })
  },
  setAnimationState: (animationState) => set({ animationState }),
  setCoordinateFormat: (coordinateFormat) => set({ coordinateFormat }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  reset: () =>
    set({
      selectedLocation: null,
      antipode: null,
      selectedSurface: null,
      antipodeSurface: null,
      animationState: 'idle',
    }),
}))
