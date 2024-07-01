import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import styles from './FadeOverlayImage.module.css'
import { clamp, throttle } from 'lodash-es'
import { useInView } from 'react-intersection-observer'
import { type JSX } from 'preact'

const maxOpacity = 0.65

export default function MaskEyePreview({
  baseImgURL,
  overlayImgURL,
  ...rest
}: {
  baseImgURL: string
  overlayImgURL: string
} & JSX.HTMLAttributes<HTMLImageElement>) {
  const overlayRef = useRef<HTMLImageElement>(null)
  const { ref, inView } = useInView()
  const [isHovering, setIsHovering] = useState(false)
  const [isPressing, setIsPressing] = useState(false)

  const handlePointerEnter = useCallback((ev: PointerEvent) => {
    if (ev.pointerType !== 'mouse') {
      return
    }
    setIsHovering(true)
  }, [])
  const handlePointerLeave = useCallback(() => setIsHovering(false), [])
  const handleTouchStart = useCallback(() => setIsPressing(true), [])
  const handleTouchEnd = useCallback(() => setIsPressing(false), [])

  useEffect(() => {
    const { current: el } = overlayRef
    if (!el) {
      return
    }

    if (isHovering || isPressing) {
      el.style.opacity = String(maxOpacity)
      return
    }

    if (!inView) {
      return
    }

    const handleScroll = throttle(() => {
      const rect = el.getBoundingClientRect()
      const rectCenterY = rect.top + rect.height / 2
      const winHalfHeight = window.innerHeight / 2
      const centerDistance = clamp(
        Math.abs(winHalfHeight - rectCenterY) / winHalfHeight,
        0,
        maxOpacity,
      )
      requestAnimationFrame(() => {
        el.style.opacity = String(centerDistance)
      })
    }, 30 / 1000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [inView, isHovering, isPressing])

  return (
    <div
      class={styles.container}
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <img
        ref={overlayRef}
        class={styles.overlay}
        src={overlayImgURL}
        {...rest}
        alt=""
      />
      <img src={baseImgURL} {...rest} />
    </div>
  )
}
