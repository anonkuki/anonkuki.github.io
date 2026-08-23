import type { CapabilityGroup, LocalizedText } from '../content/types'
import type { CSSProperties } from 'react'

export function CapabilityConstellation({ groups, text, zh }: { groups: CapabilityGroup[]; text: (value: LocalizedText) => string; zh: boolean }) {
  return (
    <div className="capability-constellation reveal">
      <svg className="constellation-links" viewBox="0 0 1000 720" preserveAspectRatio="none" aria-hidden="true">
        <path d="M500 360C382 264 274 183 150 128M500 360C538 219 651 136 790 120M500 360C642 330 767 324 888 360M500 360C618 460 708 558 802 626M500 360C424 486 320 574 195 628M500 360C351 371 231 389 112 384" />
        <circle cx="500" cy="360" r="145" />
        <circle cx="500" cy="360" r="207" />
      </svg>
      <div className="constellation-core">
        <span>{zh ? '我的工程工具箱' : 'MY ENGINEERING KIT'}</span>
        <img src="/avatar-line.webp" alt="" width="1243" height="1400" />
        <i>build → verify → ship</i>
      </div>
      {groups.map((group, index) => (
        <article className={`constellation-node constellation-node-${index + 1}`} style={{ '--group-color': group.color } as CSSProperties} key={group.id}>
          <header><span>A{index + 1}</span><b>{String(group.count).padStart(2, '0')}</b></header>
          <h3>{text(group.title)}</h3>
          <p>{text(group.summary)}</p>
          <div className="tag-row">{group.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        </article>
      ))}
      <span className="constellation-note constellation-note-a" aria-hidden="true">systems<br />that hold up</span>
      <span className="constellation-note constellation-note-b" aria-hidden="true">↗ connected<br />by delivery</span>
    </div>
  )
}
