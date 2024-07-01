import { useEffect, useRef, useState } from 'preact/hooks'
import { type JSX } from 'preact'

export default function ImageSlideshow({
  imgURLs,
  alt,
  width,
  height,
}: {
  imgURLs: string[]
  alt: string
  width: number
  height: number
}) {
  const ref = useRef<HTMLImageElement | null>(null)
  const [imgs] = useState(() =>
    import.meta.env.SSR
      ? []
      : imgURLs.map((src) => {
          const img = new Image()
          img.src = src
          img.width = width
          img.height = height
          img.alt = alt
          return img
        }),
  )

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      const { current: el } = ref
      if (!el) {
        return
      }
      idx = (idx + 1) % imgs.length
      const nextEl = imgs[idx].complete
        ? imgs[idx]
        : imgs.find((img) => img.complete) ?? imgs[0]
      el.replaceWith(nextEl)
      ref.current = nextEl
    }, 150)
    return () => {
      clearInterval(interval)
    }
  }, [imgs])

  return (
    <img ref={ref} alt={alt} src={imgURLs[0]} width={width} height={height} />
  )
}
