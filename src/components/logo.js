import seen from 'seen'

const PI2 = 2 * Math.PI

function scaleCanvas(el, width, height) {
  const dpr = window.devicePixelRatio || 1
  if (el.width == width * dpr && el.height == height * dpr) {
    return { dpr, updated: false }
  }

  el.width = width * dpr
  el.style.width = width + 'px'
  el.height = height * dpr
  el.style.height = height + 'px'
  return { dpr, updated: true }
}

function CubeStormScene() {
  const model = new seen.Model()
  model.add(
    seen.Lights.directional({
      normal: seen.P(0, -200, 0).normalize(),
      intensity: 0.01,
    }),
  )

  const black = new seen.Material(seen.Colors.rgb(30, 30, 30, 200))

  const c = 5
  const d = 200
  const m = d / c
  for (let x = -c; x < c; x++) {
    for (let y = -c; y < c; y++) {
      const shape = seen.Shapes.cube()
        .scale(3 + Math.random() * m)
        .translate(x * m, y * m, Math.random() * 2 * d - d)
      shape.fill(black)
      model.add(shape)
    }
  }

  const scene = new seen.Scene({
    model: model,
    fractionalPoints: true,
    shader: seen.Shaders.diffuse(),
  })

  scene.camera.translate(20, 0)

  return scene
}

function LogoScene() {
  function CirclePainter() {}
  CirclePainter.prototype.paint = function (renderModel, context) {
    // circles are represented as two points, one at the origin, and one a
    // radius distance away. we measure the projected radius by calculating
    // the distance between the points.
    //
    // this painter creates paths but does not fill or complete them, since
    // CanvasClipLayer requires a complete path of the shapes to do the
    // composite operation.
    const ps = renderModel.projected.points
    const diff = ps[0].copy().subtract(ps[1])
    const radius = Math.sqrt(diff.dot(diff))
    const painter = context.circle()
    const p = ps[0]
    context.ctx.moveTo(p.x + radius, p.y)
    context.ctx.arc(p.x, p.y, radius, 0, PI2, true)
  }

  const circlePainter = new CirclePainter()
  const model = new seen.Model()

  function makeSphere(r, x, y, z) {
    const surface = new seen.Surface(
      [seen.P(x, y, z), seen.P(x, y + r, z)],
      circlePainter,
    )
    const shape = new seen.Shape('body', [surface])
    model.add(shape)
  }

  const size = 74
  const dist = 157
  makeSphere(size, 0, 0, 0)
  for (let step = 1; step <= 6; step++) {
    const a = PI2 / (6 / step)
    makeSphere(size, dist * Math.cos(a), dist * Math.sin(a), 0)
  }

  const scene = new seen.Scene({
    model: model,
    cullBackfaces: false,
    fractionalPoints: true,
    shader: seen.Shaders.flat(),
  })

  // flatten the perspective effect a bit on the spheres.
  //
  // I found this resource very helpful for grokking perspective transform
  // matrices:
  // http://www.scratchapixel.com/lessons/3d-advanced-lessons/perspective-and-orthographic-projection-matrix/perspective-projection-matrix/
  scene.camera.projection = scene.camera.projection.copy()
  scene.camera.projection.m[14] = -0.5
  scene.camera.projection.m[15] = 0.5

  return scene
}

function CanvasClipLayer(clipScene, insideScene) {
  this.clipScene = new seen.SceneLayer(clipScene)
  this.insideScene = new seen.SceneLayer(insideScene)
}
CanvasClipLayer.prototype.render = function (context) {
  const ctx = context.ctx
  this.insideScene.render(context)
  ctx.save()
  ctx.beginPath()
  this.clipScene.render(context)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fill()
  ctx.restore()
}

function cubeSpinner() {
  const parentEl = document.getElementById('spinner')
  const logoEl = document.getElementById('logo')

  const cubesScene = CubeStormScene()
  cubesScene.camera.bake()
  const logoScene = LogoScene()
  logoScene.camera.bake()
  const context = seen.Context(logoEl)
  context.layer(new CanvasClipLayer(logoScene, cubesScene))

  const baseSpeed = 2
  const maxSpeed = 1000
  let av = baseSpeed * 10

  // initial spin
  for (let i = 1; i <= 10; i++) {
    setTimeout(
      function (i) {
        av = baseSpeed + i * baseSpeed * 10
      }.bind(null, i),
      500 + i * 25,
    )
  }

  function resize() {
    const width = parentEl.clientWidth
    const height = Math.min(width, parentEl.clientHeight)

    if (!scaleCanvas(logoEl, width, height).updated) {
      // if no size change, skip viewport updating.
      return
    }

    // default canvas size is 475. this is fairly arbitrary, derived via
    // massaging the numbers until things fit.
    const scaling = Math.min(logoEl.height, logoEl.width) / 525
    cubesScene.viewport = logoScene.viewport = seen.Viewports.center(
      logoEl.width,
      logoEl.height,
    )
    cubesScene.camera.reset().scale(scaling)
    logoScene.camera.reset().scale(scaling)
    context.render()
  }
  resize()
  window.addEventListener('resize', resize, false)

  let startTime = Date.now()
  let timeout

  function frame() {
    // skip frame if we're in a hidden tab
    if (document.hidden) {
      timeout = setTimeout(frame, 100)
      return
    }

    document.body.classList.toggle('scrolled', window.scrollY > 50)

    // skip frame if scrolled down
    const belowFold = window.scrollY > logoEl.clientHeight
    document.body.classList.toggle('below-fold', belowFold)
    if (belowFold) {
      timeout = setTimeout(frame, 100)
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

    if (timeout) {
      clearTimeout(timeout)
    }
    if (targetFPS >= 60) {
      requestAnimationFrame(frame)
    } else {
      const targetWait = 1000 / targetFPS
      timeout = setTimeout(frame, targetWait)
    }
  }

  // hack! seen's mouse events helper indiscriminately swallows the event.
  // we need to prevent it here to allow for scrolling :(
  const oldMouseMove = seen.MouseEvents.prototype._onMouseMove
  seen.MouseEvents.prototype._onMouseMove = function (e) {
    e.preventDefault = function () {}
    oldMouseMove.call(this, e)
  }

  const dragger = new seen.Drag(document.getElementById('spinner'))
  dragger.on('drag', function (e) {
    const dx = e.offsetRelative[0] * 20
    av = (av * 2 + dx) / 3
  })

  frame()
  logoEl.style.opacity = '1'
}

function sideLogo() {
  const el = document.getElementById('side-logo')
  const canvas = document.createElement('canvas')
  el.appendChild(canvas)

  // force a fade-in
  el.style.transition = 'none'
  el.style.opacity = '0'
  el.offsetHeight
  el.style.transition = null
  el.style.opacity = null

  const logoScene = LogoScene()
  const context = seen.Context(canvas, logoScene)

  const width = el.clientWidth
  const height = el.clientHeight
  const { dpr } = scaleCanvas(canvas, width, height)
  logoScene.viewport = seen.Viewports.center(canvas.width, canvas.height)
  logoScene.camera.scale(canvas.width / 518)

  const targetFPS = 12
  const ctx = context.ctx
  setInterval(function () {
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
}

function sizePage() {
  if (window.scrollY > 0) {
    return
  }

  // Use min height of viewport (excluding address bar, unlike vh which includes
  // it) -- someday maybe svh will be usable here.
  // https://stackoverflow.com/a/69367449
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('spinner')) {
    cubeSpinner()
  }
  sideLogo()
})

sizePage()
window.addEventListener('resize', sizePage)
