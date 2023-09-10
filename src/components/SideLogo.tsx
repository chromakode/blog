import seen from 'seen'
import { useEffect, useRef } from 'preact/hooks'
import {
  LogoScene,
  PI2,
  getDevicePixelRatio,
  scaleCanvas,
} from './scripts/logo'

export default function SideLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const logoScene = LogoScene()
    const context = seen.Context(canvas, logoScene)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.round(entry.contentBoxSize[0].blockSize)
        const height = Math.round(entry.contentBoxSize[0].inlineSize)
        scaleCanvas(canvas, width, height)
        logoScene.viewport = seen.Viewports.center(canvas.width, canvas.height)
        logoScene.camera.scale(canvas.width / 518)
      }
    })
    resizeObserver.observe(canvas)

    const targetFPS = 12
    const ctx = context.ctx
    const interval = setInterval(() => {
      const dpr = getDevicePixelRatio()
      logoScene.model.roty(PI2 / (60 * targetFPS))
      ctx.save()
      ctx.beginPath()
      context.render()
      ctx.closePath()
      ctx.fillStyle = 'rgba(40, 40, 40, .95)'
      ctx.fill()
      ctx.restore()
      ctx.strokeStyle = 'rgba(255, 255, 255, .15)'
      ctx.lineWidth = 1 * dpr
      ctx.stroke()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 6 * dpr
      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
    }, 1000 / targetFPS)

    // fade-in
    canvas.style.opacity = '1'

    return () => {
      resizeObserver.disconnect()
      clearInterval(interval)
    }
  })

  return <canvas ref={canvasRef} />
}
