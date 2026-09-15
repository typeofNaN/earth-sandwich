import { AdditiveBlending, BackSide } from 'three'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.2);
    float halo = smoothstep(0.05, 0.95, fresnel);
    gl_FragColor = vec4(glowColor, halo * 0.42);
  }
`

export function Atmosphere() {
  return (
    <mesh scale={1.075}>
      <sphereGeometry args={[2, 96, 96]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ glowColor: { value: [0.16, 0.68, 1] } }}
        transparent
        depthWrite={false}
        side={BackSide}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
