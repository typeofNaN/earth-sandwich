import { CanvasTexture, SRGBColorSpace } from 'three'

function canvas(size = 1024): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const element = document.createElement('canvas')
  element.width = size * 2
  element.height = size
  const context = element.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')
  return [element, context]
}

export function createEarthTexture(): CanvasTexture {
  const [element, ctx] = canvas()
  const gradient = ctx.createLinearGradient(0, 0, 0, element.height)
  gradient.addColorStop(0, '#0a1e32')
  gradient.addColorStop(0.5, '#12385a')
  gradient.addColorStop(1, '#061526')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, element.width, element.height)

  const land = '#385c48'
  const ice = '#d7edf4'
  const shapes: Array<[number, number, number, number, number]> = [
    [0.18, 0.36, 0.2, 0.25, -0.2],
    [0.28, 0.58, 0.11, 0.25, 0.35],
    [0.45, 0.39, 0.15, 0.14, 0.1],
    [0.51, 0.55, 0.16, 0.26, -0.2],
    [0.67, 0.35, 0.25, 0.22, 0.08],
    [0.74, 0.55, 0.16, 0.1, -0.1],
    [0.82, 0.68, 0.12, 0.09, 0.05],
    [0.5, 0.93, 0.55, 0.08, 0],
    [0.5, 0.06, 0.22, 0.05, 0],
  ]
  ctx.fillStyle = land
  for (const [x, y, rx, ry, rotation] of shapes) {
    ctx.save()
    ctx.translate(x * element.width, y * element.height)
    ctx.rotate(rotation)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx * element.width, ry * element.height, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.fillStyle = ice
  ctx.fillRect(0, 0, element.width, 35)
  ctx.fillRect(0, element.height - 42, element.width, 42)

  ctx.globalAlpha = 0.18
  ctx.strokeStyle = '#89d7ff'
  for (let i = 0; i < 220; i += 1) {
    const x = Math.random() * element.width
    const y = Math.random() * element.height
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  const texture = new CanvasTexture(element)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export function createCloudTexture(): CanvasTexture {
  const [element, ctx] = canvas(512)
  ctx.clearRect(0, 0, element.width, element.height)
  ctx.fillStyle = 'rgba(255,255,255,0.38)'
  for (let i = 0; i < 90; i += 1) {
    const x = Math.random() * element.width
    const y = Math.random() * element.height
    ctx.beginPath()
    ctx.ellipse(
      x,
      y,
      30 + Math.random() * 90,
      4 + Math.random() * 13,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }
  return new CanvasTexture(element)
}

export function createNightTexture(): CanvasTexture {
  const [element, ctx] = canvas(512)
  ctx.fillStyle = '#020508'
  ctx.fillRect(0, 0, element.width, element.height)
  ctx.fillStyle = '#ffd27a'
  for (let i = 0; i < 360; i += 1) {
    const x = Math.random() * element.width
    const y = Math.random() * element.height
    ctx.globalAlpha = Math.random() * 0.65
    ctx.fillRect(x, y, 1.2, 1.2)
  }
  ctx.globalAlpha = 1
  return new CanvasTexture(element)
}
