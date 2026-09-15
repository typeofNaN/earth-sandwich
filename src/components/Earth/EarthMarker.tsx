import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group } from 'three'
import type { LatLng } from '../../types/geo'
import { formatLatLng } from '../../utils/coordinates'
import { EARTH_RADIUS, latLngToVector3 } from '../../utils/geo'

type Props = { location: LatLng; tone: 'start' | 'antipode'; visible?: boolean }

export function EarthMarker({ location, tone, visible = true }: Props) {
  const ref = useRef<Group>(null)
  const position = useMemo(
    () => latLngToVector3(location.lat, location.lng, EARTH_RADIUS + 0.035),
    [location],
  )
  useFrame(({ clock }) => {
    if (!ref.current) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.12
    ref.current.scale.setScalar(pulse)
  })
  if (!visible) return null
  const color = tone === 'start' ? '#f8fafc' : '#67e8f9'
  return (
    <group ref={ref} position={position} lookAt={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.08, 0.004, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
      <pointLight color={color} intensity={1.8} distance={1} />
      <Html center distanceFactor={9} className="pointer-events-none select-none">
        <div className="rounded border border-white/15 bg-black/40 px-2 py-1 font-mono text-[10px] text-white/85 shadow-[0_0_24px_rgba(103,232,249,0.22)] backdrop-blur-md">
          {tone === 'start' ? 'START' : 'OTHER SIDE'}
          <br />
          {formatLatLng(location, 'decimal')}
        </div>
      </Html>
    </group>
  )
}
