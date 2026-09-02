import type { CaseStudy } from '../content/types'
import type { CSSProperties } from 'react'

export function CaseBlueprint({ demo }: { demo: CaseStudy['demo'] }) {
  const scene = demo

  if (demo === 'tender') {
    return (
      <figure className="case-blueprint-mini blueprint-tender" data-scene={scene} aria-hidden="true">
        <span className="blueprint-runner" />
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
        <span className="blueprint-runner" />
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
    <figure className="case-blueprint-mini blueprint-writing" data-scene={scene} aria-hidden="true">
      <span className="blueprint-runner" />
      <svg viewBox="0 0 600 250">
        <rect className="writing-sheet" x="54" y="35" width="170" height="180" rx="3" />
        <path className="writing-lines" d="M80 72H198M80 104H180M80 136H194M80 168H165" />
        <circle className="writing-node" cx="318" cy="72" r="29" />
        <circle className="writing-node" cx="318" cy="174" r="29" />
        <rect className="writing-output" x="414" y="48" width="132" height="150" rx="3" />
        <path className="writing-links" d="M224 90C257 90 273 75 289 72M224 158C257 158 273 170 289 174M347 72C379 72 390 96 414 105M347 174C379 174 390 151 414 142" />
        <text x="318" y="78">PLAN</text><text x="318" y="180">RAG</text>
      </svg>
      <span className="blueprint-caption">OUTLINE → RETRIEVE → DRAFT → REVIEW → EXPORT</span>
      <i className="blueprint-signal">✎</i>
    </figure>
  )
}
