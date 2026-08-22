export function HeroArtwork() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="hero-stamp">TRACE<br />SHIP<br />LEARN</div>
      <div className="portrait-frame">
        <img src="/avatar-line.webp" width="620" height="760" alt="" />
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
