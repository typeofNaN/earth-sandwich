import { useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState } from 'react'
import {
  AdditiveBlending,
  Color,
  Mesh,
  MeshPhongMaterial,
  NoColorSpace,
  SRGBColorSpace,
  Texture,
} from 'three'
import cloudsUrl from '../../assets/textures/earth-clouds.png'
import dayUrl from '../../assets/textures/earth-day.jpg'
import lightsUrl from '../../assets/textures/earth-lights.png'
import normalUrl from '../../assets/textures/earth-normal.jpg'
import specularUrl from '../../assets/textures/earth-specular.jpg'
import { useTranslation } from '../../i18n/useTranslation'
import { useEarthStore } from '../../store/earthStore'
import { EARTH_RADIUS, vector3ToLatLng } from '../../utils/geo'
import { Atmosphere } from './Atmosphere'
import { EarthBeam } from './EarthBeam'
import { EarthControls } from './EarthControls'
import { EarthMarker } from './EarthMarker'

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const starPositions = new Float32Array(1500)
const starColors = new Float32Array(1500)
for (let i = 0; i < starPositions.length; i += 3) {
  const radius = 13 + seededRandom(i + 1) * 27
  const theta = seededRandom(i + 2) * Math.PI * 2
  const phi = Math.acos(seededRandom(i + 3) * 2 - 1)
  starPositions[i] = radius * Math.sin(phi) * Math.cos(theta)
  starPositions[i + 1] = radius * Math.cos(phi)
  starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta)
  const brightness = 0.45 + seededRandom(i + 4) * 0.55
  starColors.set([brightness * 0.82, brightness * 0.9, brightness], i)
}

function Stars() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        transparent
        opacity={0.78}
        sizeAttenuation
        vertexColors
        depthWrite={false}
      />
    </points>
  )
}

function EarthInterior({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#d75a2d" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.67, 48, 48]} />
        <meshBasicMaterial color="#ffb34f" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.31, 40, 40]} />
        <meshBasicMaterial color="#fff1b6" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Globe() {
  const globe = useRef<Mesh>(null)
  const clouds = useRef<Mesh>(null)
  const selected = useEarthStore((state) => state.selectedLocation)
  const antipode = useEarthStore((state) => state.antipode)
  const animationState = useEarthStore((state) => state.animationState)
  const selectLocation = useEarthStore((state) => state.selectLocation)
  const { gl } = useThree()
  const loadedTextures = useTexture([dayUrl, normalUrl, specularUrl, cloudsUrl, lightsUrl])
  const [day, normal, specular, cloudsMap, lights] = useMemo(() => {
    const copies = loadedTextures.map((texture) => texture.clone()) as [
      Texture,
      Texture,
      Texture,
      Texture,
      Texture,
    ]
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    copies[0].colorSpace = SRGBColorSpace
    copies[1].colorSpace = NoColorSpace
    copies[2].colorSpace = NoColorSpace
    copies[3].colorSpace = SRGBColorSpace
    copies[4].colorSpace = SRGBColorSpace
    for (const texture of copies) texture.anisotropy = anisotropy
    return copies
  }, [gl, loadedTextures])
  const isXray = ['penetrating', 'rotating'].includes(animationState)

  useFrame(({ clock }) => {
    if (clouds.current) clouds.current.rotation.y = clock.elapsedTime * 0.009
    if (globe.current) {
      const material = globe.current.material as MeshPhongMaterial
      material.opacity += ((isXray ? 0.27 : 1) - material.opacity) * 0.08
      material.transparent = material.opacity < 0.99
      material.depthWrite = material.opacity > 0.75
    }
  })

  function handleClick(event: ThreeEvent<MouseEvent>) {
    if (event.delta > 4) return
    if (!['idle', 'selected', 'result'].includes(animationState)) return
    event.stopPropagation()
    selectLocation(vector3ToLatLng(event.point))
  }

  return (
    <group rotation={[0, -Math.PI * 0.08, -Math.PI * 0.035]}>
      <mesh ref={globe} onClick={handleClick}>
        <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
        <meshPhongMaterial
          map={day}
          normalMap={normal}
          normalScale={[0.72, 0.72]}
          specularMap={specular}
          specular={new Color('#6aa9c8')}
          shininess={18}
          emissiveMap={lights}
          emissive={new Color('#ffc36b')}
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh scale={1.009}>
        <sphereGeometry args={[EARTH_RADIUS, 112, 112]} />
        <meshBasicMaterial
          map={lights}
          color="#ffd08a"
          transparent
          opacity={isXray ? 0.04 : 0.09}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={clouds} scale={1.013}>
        <sphereGeometry args={[EARTH_RADIUS, 112, 112]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={isXray ? 0.08 : 0.42}
          depthWrite={false}
          shininess={4}
        />
      </mesh>
      <Atmosphere />
      <EarthInterior visible={isXray} />
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
      <color attach="background" args={['#030405']} />
      <ambientLight intensity={0.06} />
      <hemisphereLight args={['#6aaee8', '#020304', 0.13]} />
      <directionalLight position={[-4.5, 2.5, 5]} intensity={3.5} color="#fff7e9" />
      <pointLight position={[4, -2, -4]} color="#247ea6" intensity={0.22} />
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
      <div className="grid h-full place-items-center px-8 text-center text-sm text-white/60">
        {t.webglPaused}
      </div>
    )
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.18, 5.65], fov: 38 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace
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

useTexture.preload([dayUrl, normalUrl, specularUrl, cloudsUrl, lightsUrl])
