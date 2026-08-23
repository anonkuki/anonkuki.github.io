import { useEffect, useState } from 'react'

export function IntroOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(() => setVisible(false), reduced ? 1 : 1450)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div className="intro-overlay" aria-label="作品集加载动画">
      <div className="intro-mark">
        <img src="/avatar-line.webp" alt="" width="210" height="236" />
        <span className="intro-orbit" />
      </div>
      <p>assembling selected work</p>
      <div className="intro-progress"><i /></div>
    </div>
  )
}
