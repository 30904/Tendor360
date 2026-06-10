import React, { useEffect, useState } from 'react'

const AnimatedCounter = ({ value = 0, duration = 700, suffix = '' }) => {
  const target = Number(value) || 0
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()
    const from = display

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const next = Math.round(from + (target - from) * progress)
      setDisplay(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return (
    <span className="intel-animated-counter">
      {display}
      {suffix}
    </span>
  )
}

export default AnimatedCounter
