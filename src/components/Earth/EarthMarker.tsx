import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Group } from 'three'
import { useTranslation } from '../../i18n/useTranslation'
import type { LatLng } from '../../types/geo'
import { formatLatLng } from '../../utils/coordinates'
import { EARTH_RADIUS, latLngToVector3 } from '../../utils/geo'

type Props = { location: LatLng; tone: 'start' | 'antipode'; visible?: boolean }

export function EarthMarker({ location, tone, visible = true }: Props) {
  const ref = useRef<Group>(null)
  const { t } = useTranslation()
  const position = useMemo(
    () => latLngToVector3(location.lat, location.lng, EARTH_RADIUS + 0.045),
    [location],
  )

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 3.2) * 0.1
    ref.current.scale.setScalar(pulse)
  })

  if (!visible) return null
  const color = tone === 'start' ? '#f8fafc' : '#72e8ff'

  return (
    <group ref={ref} position={position} lookAt={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.026, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {[0.07, 0.105].map((radius, index) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, index === 0 ? 0.005 : 0.0025, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={index === 0 ? 0.85 : 0.34}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight color={color} intensity={2.4} distance={0.8} decay={2} />
      <Html
        center
        distanceFactor={8.5}
        position={[0, 0.2, 0]}
        className="pointer-events-none select-none"
      >
        <div className="marker-label">
          <span>{tone === 'start' ? t.startedHere : t.otherSide}</span>
          <strong>{formatLatLng(location, 'decimal')}</strong>
        </div>
      </Html>
    </group>
  )
}
