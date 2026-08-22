import type { ReactNode } from 'react'

export function SectionHeading({ index, eyebrow, title, action }: { index: string; eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-heading reveal">
      <div>
        <span className="section-index">{index}</span>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  )
}
