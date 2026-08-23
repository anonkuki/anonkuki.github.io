import type { Language, PublicProject } from '../content/types'

export function ProjectVisual({ project, language }: { project: PublicProject; language: Language }) {
  return (
    <div className={`project-visual cover-count-${project.covers.length}`} aria-hidden="true">
      {project.covers.map((cover, index) => (
        <figure className="cover-frame" key={cover.src}>
          <img src={cover.src} alt="" width="1200" height="720" loading="lazy" decoding="async" />
          <figcaption>{cover.label[language]}<span>0{index + 1}</span></figcaption>
        </figure>
      ))}
      <span className="cover-scribble">selected<br />project</span>
    </div>
  )
}
