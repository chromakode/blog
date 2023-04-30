import { useEffect, useState } from 'preact/hooks'

export type ABs = Array<{ a: string; b: string }>

export default function ABImageGrid({
  abs,
  width,
}: {
  abs: ABs
  width: number
}) {
  const [isShowingB, setShowingB] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowingB((val) => !val)
    }, 750)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div class="wide grid-4" style="gap: 10px">
      {abs.map(({ a, b }) => (
        <img
          src={isShowingB ? b : a}
          width={width}
          style="outline: 2px solid black"
        />
      ))}
    </div>
  )
}
