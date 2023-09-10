import seen from 'seen'
import { useEffect, useRef } from 'preact/hooks'
import {
  CanvasClipLayer,
  CubeStormScene,
  LogoScene,
  scaleCanvas,
} from './scripts/logo'

export default function HeroLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const cubesScene = CubeStormScene()
    cubesScene.camera.bake()
    const logoScene = LogoScene()
    logoScene.camera.bake()
    const context = seen.Context(canvas)
    context.layer(new CanvasClipLayer(logoScene, cubesScene))
    let setupViewport = false

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.round(entry.contentBoxSize[0].blockSize)
        const height = Math.round(entry.contentBoxSize[0].inlineSize)

        if (!scaleCanvas(canvas, width, height).updated && setupViewport) {
          // if no size change, skip viewport updating.
          return
        }

        // default canvas size is 475. this is fairly arbitrary, derived via
        // massaging the numbers until things fit.
        const scaling = Math.min(canvas.height, canvas.width) / 525
        cubesScene.viewport = logoScene.viewport = seen.Viewports.center(
          canvas.width,
          canvas.height,
        )
        cubesScene.camera.reset().scale(scaling)
        logoScene.camera.reset().scale(scaling)
        context.render()
        setupViewport = true
      }
    })
    resizeObserver.observe(canvas)

    const baseSpeed = 2
    const maxSpeed = 1000
    let av = baseSpeed * 10
    let startTime = Date.now()
    let timeout: number
    let queuedFrame: number

    function frame() {
      // skip frame if we're in a hidden tab
      if (!canvas || document.hidden) {
        timeout = window.setTimeout(frame, 100)
        return
      }

      // skip frame if scrolled down
      const belowFold = window.scrollY > canvas.clientHeight
      if (belowFold) {
        timeout = window.setTimeout(frame, 100)
        return
      }

      const lastStart = startTime
      startTime = Date.now()
      const step = startTime - lastStart

      // scale framerate based on rotational velocity
      const targetFPS = Math.min(60, Math.max(12, Math.abs(av / 6) * 60))

      // threshold rotation
      av = Math.min(maxSpeed, Math.max(-maxSpeed, av))

      // drag
      if (Math.abs(av) > 1) {
        av = 0.99 * av
      }

      // slowly rotate if idling
      if (av < baseSpeed) {
        av += 0.1
      }

      // rotate and render based on the frame's time step
      const rot = (av * step) / 100000
      cubesScene.model
        .roty(rot)
        .rotx(rot / 5)
        .rotz(rot / 5)
      logoScene.model.roty(rot)
      context.render()

      clearTimeout(timeout)
      if (targetFPS >= 60) {
        queuedFrame = requestAnimationFrame(frame)
      } else {
        const targetWait = 1000 / targetFPS
        timeout = window.setTimeout(frame, targetWait)
      }
    }

    // hack! seen's mouse events helper indiscriminately swallows the event.
    // we need to prevent it here to allow for scrolling :(
    const oldMouseMove = seen.MouseEvents.prototype._onMouseMove
    seen.MouseEvents.prototype._onMouseMove = function (e: any) {
      e.preventDefault = function () {}
      oldMouseMove.call(this, e)
    }

    const dragger = new seen.Drag(canvas)
    dragger.on('drag', function (e: any) {
      const dx = e.offsetRelative[0] * 20
      av = (av * 2 + dx) / 3
    })

    // fade-in
    canvas.style.opacity = '1'

    // initial spin
    for (let i = 1; i <= 10; i++) {
      setTimeout(
        function (i: number) {
          av = baseSpeed + i * baseSpeed * 10
        }.bind(null, i),
        500 + i * 25,
      )
    }

    frame()

    return () => {
      resizeObserver.disconnect()
      clearTimeout(timeout)
      cancelAnimationFrame(queuedFrame)
    }
  })

  return <canvas ref={canvasRef} id="logo" />
}
