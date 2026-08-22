import type { PublicProject } from '../content/types'

export function ProjectVisual({ project }: { project: PublicProject }) {
  return (
    <div className={`project-visual visual-${project.visual}`} aria-hidden="true">
      {project.visual === 'writer' && <><span className="writer-sheet" /><span className="writer-cursor">AI</span><span className="writer-line l1" /><span className="writer-line l2" /><span className="writer-line l3" /></>}
      {project.visual === 'space' && <><span className="planet p1" /><span className="planet p2" /><span className="planet p3" /><span className="space-path" /><span className="ship">◇</span></>}
      {project.visual === 'rank' && <><span className="rank-card r1">01</span><span className="rank-card r2">02</span><span className="rank-card r3">03</span></>}
      {project.visual === 'manchu' && <><span className="paper-glyph">ᠮ</span><span className="grain" /></>}
      {project.visual === 'audit' && <><span className="audit-node n1">IN</span><span className="audit-line" /><span className="audit-node n2">QA</span><span className="audit-check">✓</span></>}
      {project.visual === 'guild' && <><span className="pixel-cloud c1" /><span className="pixel-cloud c2" /><span className="guild-tower">♜</span><span className="guild-stars">✦ ✧ ✦</span></>}
    </div>
  )
}
