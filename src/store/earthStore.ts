import { create } from 'zustand'
import type { AnimationState, CoordinateFormat, LatLng, SurfaceInfo } from '../types/geo'
import { getSurfaceInfo } from '../data/land'
import { getAntipode } from '../utils/geo'
import type { Language } from '../i18n/translations'

type EarthStore = {
  selectedLocation: LatLng | null
  antipode: LatLng | null
  selectedSurface: SurfaceInfo | null
  antipodeSurface: SurfaceInfo | null
  animationState: AnimationState
  coordinateFormat: CoordinateFormat
  reducedMotion: boolean
  language: Language
  selectLocation: (location: LatLng) => void
  setAnimationState: (state: AnimationState) => void
  setCoordinateFormat: (format: CoordinateFormat) => void
  setReducedMotion: (reduced: boolean) => void
  setLanguage: (language: Language) => void
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
  language: 'zh',
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
  setLanguage: (language) => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    window.localStorage.setItem('earth-sandwich-language', language)
    set({ language })
  },
  reset: () =>
    set({
      selectedLocation: null,
      antipode: null,
      selectedSurface: null,
      antipodeSurface: null,
      animationState: 'idle',
    }),
}))
