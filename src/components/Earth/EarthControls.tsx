import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'

import { useEarthStore } from '../../store/earthStore'
import { latLngToVector3 } from '../../utils/geo'

function cameraTargetFor(location: { lat: number; lng: number } | null, distance: number) {
  if (!location) return new Vector3(0, 0.25, 5.2)
  return latLngToVector3(location.lat, location.lng, distance)
}

export function EarthControls() {
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null)
  const { camera } = useThree()
  const selected = useEarthStore((state) => state.selectedLocation)
  const antipode = useEarthStore((state) => state.antipode)
  const animationState = useEarthStore((state) => state.animationState)
  const reducedMotion = useEarthStore((state) => state.reducedMotion)
  const desired = useMemo(() => {
    if (['rotating', 'revealing', 'result'].includes(animationState))
      return cameraTargetFor(antipode, 5)
    if (['selected', 'focusing', 'penetrating'].includes(animationState))
      return cameraTargetFor(selected, 4.8)
    return cameraTargetFor(null, 5.2)
  }, [animationState, antipode, selected])

  useEffect(() => {
    if (!controls.current) return
    controls.current.target.set(0, 0, 0)
    controls.current.update()
  }, [])

  useFrame(() => {
    const factor = reducedMotion ? 0.35 : 0.045
    camera.position.lerp(desired, factor)
    camera.lookAt(0, 0, 0)
    controls.current?.update()
  })

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      minDistance={3.5}
      maxDistance={7.5}
      rotateSpeed={0.42}
      zoomSpeed={0.62}
      touches={{ ONE: 0, TWO: 2 }}
      autoRotate={animationState === 'idle'}
      autoRotateSpeed={0.35}
      minPolarAngle={MathUtils.degToRad(8)}
      maxPolarAngle={MathUtils.degToRad(172)}
      makeDefault
    />
  )
}
