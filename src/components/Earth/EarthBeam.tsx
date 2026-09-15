import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, TubeGeometry, Vector3, type Mesh } from 'three'
import type { LatLng } from '../../types/geo'
import { EARTH_RADIUS, latLngToVector3 } from '../../utils/geo'

type Props = { start: LatLng; end: LatLng; active: boolean }

export function EarthBeam({ start, end, active }: Props) {
  const ref = useRef<Mesh>(null)
  const geometry = useMemo(() => {
    const a = latLngToVector3(start.lat, start.lng, EARTH_RADIUS + 0.02)
    const b = latLngToVector3(end.lat, end.lng, EARTH_RADIUS + 0.02)
    return new TubeGeometry(
      new CatmullRomCurve3([a, new Vector3(0, 0, 0), b]),
      96,
      0.012,
      12,
      false,
    )
  }, [start, end])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const material = Array.isArray(ref.current.material)
      ? ref.current.material[0]
      : ref.current.material
    material.opacity = active ? 0.35 + Math.sin(clock.elapsedTime * 8) * 0.18 : 0
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color="#8bf6ff" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
