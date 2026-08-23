const chapters = ['00', '01', '02', '03', '04', '05']

export function ScrollCompanion() {
  return (
    <aside className="scroll-companion" aria-hidden="true">
      <span className="scroll-companion-note">keep<br />scrolling</span>
      <svg className="scroll-companion-line" viewBox="0 0 78 520" preserveAspectRatio="none">
        <path d="M39 4C12 74 67 129 38 199C15 254 61 318 37 383C20 429 44 473 39 516" />
      </svg>
      <div className="scroll-companion-markers">
        {chapters.map((chapter) => <span className="scroll-companion-marker" key={chapter}>{chapter}</span>)}
      </div>
      <div className="scroll-companion-cat">
        <img src="/avatar-line.webp" alt="" width="1243" height="1400" />
      </div>
    </aside>
  )
}
