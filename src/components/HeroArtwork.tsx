import type { PointerEvent } from 'react'

export function HeroArtwork() {
  function updateParallax(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14
    event.currentTarget.style.setProperty('--pointer-x', `${x.toFixed(2)}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${y.toFixed(2)}px`)
  }

  function resetParallax(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty('--pointer-x', '0px')
    event.currentTarget.style.setProperty('--pointer-y', '0px')
  }

  return (
    <div className="hero-art" data-motion-surface="pointer-parallax" aria-hidden="true" onPointerMove={updateParallax} onPointerLeave={resetParallax}>
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="hero-stamp">TRACE<br />SHIP<br />LEARN</div>
      <div className="portrait-frame">
        <img src="/avatar-line.webp" width="1243" height="1400" alt="" />
        <span className="portrait-tag">agent<br />builder</span>
      </div>
      <svg className="hero-arrow" viewBox="0 0 180 120">
        <path d="M8 93C50 11 110 108 163 28" />
        <path d="m143 30 22-3-5 21" />
      </svg>
      <div className="floating-note note-a">human<br />in the loop</div>
      <div className="floating-note note-b">evidence<br />before claims</div>
    </div>
  )
}
