import type { CaseStudy } from '../content/types'
import type { CSSProperties } from 'react'

export function CaseBlueprint({ demo }: { demo: CaseStudy['demo'] }) {
  const scene = demo === 'field' ? 'cross-platform' : demo

  if (demo === 'tender') {
    return (
      <figure className="case-blueprint-mini blueprint-tender" data-scene={scene} aria-hidden="true">
        <svg viewBox="0 0 600 250">
          <path className="blueprint-flow" d="M60 125H540" />
          {[72, 186, 300, 414, 528].map((x, index) => <g className="blueprint-stop" style={{ '--delay': `${index * .14}s` } as CSSProperties} key={x}><circle cx={x} cy="125" r="27" /><text x={x} y="131">{String(index + 1).padStart(2, '0')}</text></g>)}
          <path className="blueprint-loop" d="M300 92C350 20 492 30 520 91" />
        </svg>
        <span className="blueprint-caption">PARSE → RETRIEVE → GENERATE → REVIEW → SHIP</span>
        <i className="blueprint-signal">↺</i>
      </figure>
    )
  }

  if (demo === 'regulated') {
    return (
      <figure className="case-blueprint-mini blueprint-regulated" data-scene={scene} aria-hidden="true">
        <svg viewBox="0 0 600 250">
          <rect className="blueprint-sheet" x="56" y="38" width="195" height="174" rx="3" />
          <path className="blueprint-sheet-lines" d="M82 76H222M82 106H202M82 136H216M82 166H182" />
          <circle className="blueprint-rule-core" cx="402" cy="124" r="67" />
          <path className="blueprint-rule-tick" d="m369 125 24 25 47-57" />
          <path className="blueprint-evidence" d="M252 86C301 86 314 109 334 115M252 173C302 173 314 145 334 138" />
        </svg>
        <span className="blueprint-caption">DETERMINISTIC DATA / RULE GATE / SOURCE TRACE</span>
        <i className="blueprint-signal">✓</i>
      </figure>
    )
  }

  return (
    <figure className="case-blueprint-mini blueprint-field" data-scene={scene} aria-hidden="true">
      <svg viewBox="0 0 600 250">
        <rect className="device-phone" x="58" y="43" width="108" height="170" rx="18" />
        <rect className="device-web" x="374" y="53" width="174" height="132" rx="4" />
        <path className="device-stand" d="M430 205H492M461 185V205" />
        <circle className="device-api" cx="279" cy="124" r="48" />
        <path className="device-sync sync-a" d="M173 102C204 68 231 71 247 90" />
        <path className="device-sync sync-b" d="M326 158C347 184 366 176 387 158" />
        <path className="device-recovery" d="M185 164C231 218 350 220 411 187" />
        <text x="279" y="131">API</text>
      </svg>
      <span className="blueprint-caption">OFFLINE FIRST / QUEUE / RECOVER / SYNC</span>
      <i className="blueprint-signal">⇄</i>
    </figure>
  )
}
