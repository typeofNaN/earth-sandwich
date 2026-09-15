import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState } from 'react'
import { AdditiveBlending, Mesh, MeshStandardMaterial } from 'three'
import { useEarthStore } from '../../store/earthStore'
import { useTranslation } from '../../i18n/useTranslation'
import { EARTH_RADIUS, vector3ToLatLng } from '../../utils/geo'
import { Atmosphere } from './Atmosphere'
import { EarthBeam } from './EarthBeam'
import { EarthControls } from './EarthControls'
import { EarthMarker } from './EarthMarker'
import { createCloudTexture, createEarthTexture, createNightTexture } from './textures'

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const starPositions = new Float32Array(900)
for (let i = 0; i < starPositions.length; i += 3) {
  const radius = 15 + seededRandom(i + 1) * 22
  const theta = seededRandom(i + 2) * Math.PI * 2
  const phi = Math.acos(seededRandom(i + 3) * 2 - 1)
  starPositions[i] = radius * Math.sin(phi) * Math.cos(theta)
  starPositions[i + 1] = radius * Math.cos(phi)
  starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta)
}

function Stars() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#dbeafe" transparent opacity={0.72} sizeAttenuation />
    </points>
  )
}

function Globe() {
  const globe = useRef<Mesh>(null)
  const clouds = useRef<Mesh>(null)
  const selected = useEarthStore((state) => state.selectedLocation)
  const antipode = useEarthStore((state) => state.antipode)
  const animationState = useEarthStore((state) => state.animationState)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const textures = useMemo(
    () => ({
      earth: createEarthTexture(),
      clouds: createCloudTexture(),
      night: createNightTexture(),
    }),
    [],
  )
  const isXray = ['penetrating', 'rotating'].includes(animationState)

  useFrame(({ clock }) => {
    if (clouds.current) clouds.current.rotation.y = clock.elapsedTime * 0.025
    if (globe.current) {
      const material = globe.current.material as MeshStandardMaterial
      material.opacity = isXray ? 0.48 : 1
      material.transparent = isXray
    }
  })

  function handleClick(event: ThreeEvent<MouseEvent>) {
    if (!['idle', 'selected', 'result'].includes(animationState)) return
    event.stopPropagation()
    selectLocation(vector3ToLatLng(event.point))
  }

  return (
    <group>
      <mesh ref={globe} onClick={handleClick} castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={textures.earth}
          roughness={0.82}
          metalness={0.04}
          bumpMap={textures.earth}
          bumpScale={0.018}
        />
      </mesh>
      <mesh scale={1.006}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshBasicMaterial
          map={textures.night}
          transparent
          opacity={0.2}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={clouds} scale={1.012}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial map={textures.clouds} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <Atmosphere />
      {selected && <EarthMarker location={selected} tone="start" />}
      {selected && antipode && (
        <EarthBeam
          start={selected}
          end={antipode}
          active={['penetrating', 'rotating', 'revealing', 'result'].includes(animationState)}
        />
      )}
      {antipode && (
        <EarthMarker
          location={antipode}
          tone="antipode"
          visible={['revealing', 'result'].includes(animationState)}
        />
      )}
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 2.5, 3]} intensity={2.2} />
      <pointLight position={[-4, -2, -3]} color="#38bdf8" intensity={0.4} />
      <Stars />
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
      <EarthControls />
    </>
  )
}

export function Earth() {
  const [webglLost, setWebglLost] = useState(false)
  const { t } = useTranslation()
  if (webglLost) {
    return (
      <div className="grid h-full place-items-center text-center text-sm text-white/70">
        {t.webglPaused}
      </div>
    )
  }
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.35, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          setWebglLost(true)
        })
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Scene />
    </Canvas>
  )
}
