import { useCallback, useRef } from 'react'
import { useEarthStore } from '../store/earthStore'

const states = ['focusing', 'penetrating', 'rotating', 'revealing', 'result'] as const
const normalDurations = [650, 1200, 1400, 650, 0]
const reducedDurations = [60, 80, 80, 60, 0]

export function useAntipodeAnimation() {
  const timeoutRef = useRef<number | null>(null)
  const selectedLocation = useEarthStore((state) => state.selectedLocation)
  const animationState = useEarthStore((state) => state.animationState)
  const reducedMotion = useEarthStore((state) => state.reducedMotion)
  const setAnimationState = useEarthStore((state) => state.setAnimationState)

  const start = useCallback(() => {
    if (!selectedLocation || !['selected', 'result'].includes(animationState)) return
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    const durations = reducedMotion ? reducedDurations : normalDurations
    let index = 0
    const next = () => {
      setAnimationState(states[index])
      const duration = durations[index]
      index += 1
      if (index < states.length) timeoutRef.current = window.setTimeout(next, duration)
    }
    next()
  }, [animationState, reducedMotion, selectedLocation, setAnimationState])

  return { start }
}
