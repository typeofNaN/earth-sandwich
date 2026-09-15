import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'

import { useEarthStore } from '../../store/earthStore'
import { latLngToVector3 } from '../../utils/geo'

const cinematicStates = ['focusing', 'penetrating', 'rotating', 'revealing'] as const

function cameraTargetFor(location: { lat: number; lng: number } | null, distance: number) {
  if (!location) return new Vector3(0, 0.25, 5.2)
  return latLngToVector3(location.lat, location.lng, distance)
}

export function EarthControls() {
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null)
  const selectionFocusActive = useRef(false)
  const previousSelectionKey = useRef<string | null>(null)
  const { camera } = useThree()
  const selected = useEarthStore((state) => state.selectedLocation)
  const antipode = useEarthStore((state) => state.antipode)
  const animationState = useEarthStore((state) => state.animationState)
  const reducedMotion = useEarthStore((state) => state.reducedMotion)
  const isCinematic = cinematicStates.some((state) => state === animationState)

  const selectedKey = selected ? `${selected.lat}:${selected.lng}` : null
  useEffect(() => {
    if (!selectedKey || selectedKey === previousSelectionKey.current) return
    previousSelectionKey.current = selectedKey
    selectionFocusActive.current = true
  }, [selectedKey])

  const desired = useMemo(() => {
    if (animationState === 'rotating' || animationState === 'revealing') {
      return cameraTargetFor(antipode, 5)
    }
    return cameraTargetFor(selected, 4.8)
  }, [animationState, antipode, selected])

  useEffect(() => {
    if (!controls.current) return
    controls.current.target.set(0, 0, 0)
    controls.current.update()
  }, [])

  useFrame(() => {
    if (!isCinematic && !selectionFocusActive.current) return

    const factor = reducedMotion ? 0.35 : 0.055
    camera.position.lerp(desired, factor)
    camera.lookAt(0, 0, 0)
    controls.current?.update()

    if (!isCinematic && camera.position.distanceToSquared(desired) < 0.0004) {
      selectionFocusActive.current = false
    }
  })

  return (
    <OrbitControls
      ref={controls}
      enabled={!isCinematic}
      enableDamping
      dampingFactor={0.07}
      enablePan={false}
      minDistance={3.5}
      maxDistance={7.5}
      rotateSpeed={0.42}
      zoomSpeed={0.62}
      touches={{ ONE: 0, TWO: 2 }}
      autoRotate={animationState === 'idle'}
      autoRotateSpeed={0.28}
      minPolarAngle={MathUtils.degToRad(8)}
      maxPolarAngle={MathUtils.degToRad(172)}
      onStart={() => {
        selectionFocusActive.current = false
      }}
      makeDefault
    />
  )
}
