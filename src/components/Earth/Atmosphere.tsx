export function Atmosphere() {
  return (
    <mesh scale={1.035}>
      <sphereGeometry args={[2, 96, 96]} />
      <meshBasicMaterial color="#55c8ff" transparent opacity={0.12} side={2} />
    </mesh>
  )
}
