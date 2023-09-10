import seen from 'seen'

export const PI2 = 2 * Math.PI

export const getDevicePixelRatio = () => window.devicePixelRatio || 1

export function scaleCanvas(el, width, height) {
  const dpr = getDevicePixelRatio()

  if (el.width == width * dpr && el.height == height * dpr) {
    return { dpr, updated: false }
  }

  el.width = width * dpr
  el.height = height * dpr

  return { dpr, updated: true }
}

export function CubeStormScene() {
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

export function LogoScene() {
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

export function CanvasClipLayer(clipScene, insideScene) {
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

  function resize() {
    const width = parentEl.clientWidth
    const height = Math.min(width, parentEl.clientHeight)
  }
  resize()
  window.addEventListener('resize', resize, false)

  frame()
  logoEl.style.opacity = '1'
}

/*
if (document.getElementById('spinner')) {
  cubeSpinner()
}
sideLogo()
*/
