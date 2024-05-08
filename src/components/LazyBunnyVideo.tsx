import Hls from 'hls.js'
import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { useInView } from 'react-intersection-observer'

function HLSVideo({
  width,
  height,
  hlsSrc,
  ...props
}: { hlsSrc: string } & JSX.HTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: videoEl } = ref
    if (videoEl == null) {
      return
    }

    if (Hls.isSupported()) {
      var hls = new Hls({
        // Set quality automatically from first chunk bw estimate
        startLevel: -1,
      })
      hls.loadSource(hlsSrc)
      hls.attachMedia(videoEl)
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = hlsSrc
    }
  })

  return <video ref={ref} width={width} height={height} {...props} />
}

export default function LazyBunnyVideo({
  width,
  height,
  url,
  poster,
  ...props
}: {
  url: string
} & JSX.HTMLAttributes<HTMLVideoElement>) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '800px' })

  return inView ? (
    <HLSVideo
      hlsSrc={`${url}/playlist.m3u8`}
      width={width}
      height={height}
      poster={poster ?? `${url}/thumbnail.jpg`}
      {...props}
    />
  ) : (
    <img
      ref={ref}
      width={width}
      height={height}
      src={poster ?? `${url}/thumbnail.jpg`}
    />
  )
}
