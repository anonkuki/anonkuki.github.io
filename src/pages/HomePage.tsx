import { ArrowDownRight, ArrowRight, Code2, ExternalLink, Mail, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HeroArtwork } from '../components/HeroArtwork'
import { ProjectVisual } from '../components/ProjectVisual'
import { SectionHeading } from '../components/SectionHeading'
import { capabilityGroups, featuredCases, publicProjects } from '../content/projects'
import { useLanguage } from '../i18n/LanguageContext'

export function HomePage() {
  const { language, text } = useLanguage()
  const mainRef = useRef<HTMLElement>(null)
  const zh = language === 'zh'

  useEffect(() => {
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = Array.from(mainRef.current?.querySelectorAll('.reveal') ?? [])
    if (typeof window.IntersectionObserver !== 'function') {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <main id="main-content" ref={mainRef}>
      <section className="hero section-pad">
        <div className="hero-copy">
          <div className="role-chips">
            <span>AI Full-stack</span><span>Agent Engineer</span><span className="strike">just prompt</span>
          </div>
          <p className="hero-kicker">BJTU · Artificial Intelligence · 2027</p>
          <h1>{zh ? <><span className="title-line">把复杂行业流程，</span><span className="title-line">做成可执行、可追溯、</span><span className="title-line">可交付的 AI 系统。</span></> : 'I turn complex domain workflows into traceable, shippable AI systems.'}</h1>
          <p className="hero-lead">{zh ? '我是冷家健，专注 Agent Harness、智能文档与真实业务系统。把模型能力放进确定性工程边界，让复杂任务真的走到交付。' : 'I am lenggujian. I build Agent harnesses, intelligent document workflows, and real business systems—placing model capability inside deterministic engineering boundaries.'}</p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>{zh ? '查看精选作品' : 'Explore selected work'}<ArrowDownRight size={18} /></button>
            <a className="button ghost" href="/resume/lenggujian-resume.pdf" download>{zh ? '下载简历' : 'Download resume'}<ArrowRight size={18} /></a>
          </div>
          <div className="hero-proof">
            <span><b>02</b>{zh ? '段行业实习' : 'domain internships'}</span>
            <span><b>04</b>{zh ? '张精选项目卡' : 'selected project cards'}</span>
            <span><b>03</b>{zh ? '个可交互案例' : 'interactive cases'}</span>
          </div>
        </div>
        <HeroArtwork />
      </section>

      <div className="ticker" aria-hidden="true"><div>AGENT HARNESS · RAG · HUMAN IN THE LOOP · DOCX ENGINEERING · CROSS-PLATFORM · EVIDENCE BEFORE CLAIMS ·&nbsp;</div></div>

      <section className="work-section section-pad" id="work">
        <SectionHeading index="01" eyebrow={zh ? 'SELECTED WORK' : 'SELECTED WORK'} title={zh ? '三个复杂系统，三种可靠性答案' : 'Three complex systems, three reliability answers'} />
        <div className="featured-list featured-collage">
          <div className="featured-board-notes" aria-hidden="true"><span>systems / proof / delivery</span><i>↘</i><b>03 selected cases</b></div>
          {featuredCases.map((item, index) => (
            <article className={`featured-card featured-polaroid reveal accent-${item.accent}`} key={item.slug}>
              <div className="case-number">{item.index}</div>
              <div className="case-copy">
                <p className="eyebrow">{text(item.eyebrow)}</p>
                <h3>{text(item.title)}</h3>
                <p>{text(item.summary)}</p>
                <div className="tag-row">{item.stack.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <div className={`case-sketch sketch-${item.demo}`} aria-hidden="true">
                <span className="sketch-grid" />
                <b>{item.demo === 'tender' ? '01→07' : item.demo === 'regulated' ? 'RULE / AI' : 'APP ⇄ WEB'}</b>
                <i>{item.demo === 'tender' ? '⌁' : item.demo === 'regulated' ? '✓' : '↯'}</i>
              </div>
              <Link className="case-link" to={`/work/${item.slug}`} aria-label={`${text(item.title)} - ${zh ? '查看案例' : 'View case'}`}><ArrowRight /></Link>
              <span className="tape" style={{ rotate: `${index % 2 ? 3 : -3}deg` }} />
            </article>
          ))}
        </div>
      </section>

      <section className="open-section section-pad">
        <SectionHeading
          index="02"
          eyebrow="SELECTED BUILDS"
          title={zh ? '公开代码，也展示完整作品' : 'Open code, complete work'}
          action={<a className="text-link" href="https://github.com/anonkuki" target="_blank" rel="noreferrer"><Code2 size={18} />GitHub<ExternalLink size={14} /></a>}
        />
        <div className="masonry-grid scrapbook-stage">
          <div className="scrapbook-doodles" aria-hidden="true">
            <span className="doodle-loop">⌁</span><span className="doodle-arrow">↳</span><span className="doodle-note">code<br />story<br />systems</span><span className="doodle-star">✦</span>
          </div>
          {publicProjects.map((project, index) => (
            <article className={`public-card project-polaroid reveal card-${index + 1}`} data-testid="public-project" key={project.repo}>
              <ProjectVisual project={project} language={language} />
              <div className="public-card-copy">
                <span className="repo-meta">{project.language} · {project.visibility === 'local' ? (zh ? '本地完整项目' : 'complete local project') : `${String(project.repositories.length).padStart(2, '0')} ${zh ? '个仓库' : project.repositories.length === 1 ? 'repository' : 'repositories'}`}</span>
                <h3>{text(project.title)}</h3>
                <p>{text(project.description)}</p>
                <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="public-actions">
                  {project.links.map((link) => <span className="project-link-set" key={link.repo}>
                    <a href={link.url} target="_blank" rel="noreferrer" aria-label={`${text(link.label)} GitHub`}><Code2 size={15} />{text(link.label)}<ExternalLink size={13} /></a>
                    {link.demoUrl && <a href={link.demoUrl} target="_blank" rel="noreferrer" aria-label={`${text(link.label)} ${zh ? '在线演示' : 'live demo'}`}><Sparkles size={15} />{zh ? '在线演示' : 'Live demo'}<ExternalLink size={13} /></a>}
                  </span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="atlas-section section-pad" id="atlas">
        <SectionHeading index="03" eyebrow="DELIVERY ATLAS" title={zh ? '涉密经历，不展示秘密；展示方法。' : 'Confidential work stays private. The engineering method does not.'} />
        <p className="section-intro reveal">{zh ? '匿名聚合仅用于说明本人覆盖过的工程问题。数量来自本地项目审计，重复版本、数据集和第三方骨架不计入。' : 'These anonymous clusters describe engineering problems I have handled. Counts come from a local audit that excludes duplicates, datasets, and third-party starters.'}</p>
        <div className="atlas-grid">
          {capabilityGroups.map((group, index) => (
            <article className="atlas-card reveal" style={{ '--group-color': group.color } as React.CSSProperties} key={group.id}>
              <div className="atlas-count"><b>{String(group.count).padStart(2, '0')}</b><span>{zh ? '个经历映射' : 'mapped experiences'}</span></div>
              <div><span className="atlas-index">A{index + 1}</span><h3>{text(group.title)}</h3><p>{text(group.summary)}</p><div className="tag-row">{group.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-section section-pad" id="experience">
        <SectionHeading index="04" eyebrow="EXPERIENCE" title={zh ? '从原型，到可验证的系统' : 'From prototypes to verifiable systems'} />
        <div className="timeline">
          <article className="timeline-item reveal"><time>2026.07 — NOW</time><div><span className="timeline-pin" /><h3>{zh ? '北京科兴 · AI 全栈应用开发实习' : 'Sinovac · AI Full-stack Engineering Intern'}</h3><p>{zh ? '参与并独立开发受监管报告智能体，聚焦确定性数据链、Word 模板工程、规则审核与来源追溯。' : 'Building regulated-report agents around deterministic data, Word template engineering, rule-based review, and provenance.'}</p></div></article>
          <article className="timeline-item reveal"><time>2026.03 — 06</time><div><span className="timeline-pin" /><h3>{zh ? '北京清研灵智 · AI 全栈开发实习' : 'Qingyan Lingzhi · AI Full-stack Engineering Intern'}</h3><p>{zh ? '负责投标文档 Agent Harness，并持续交付多类业务原型、案例系统与前端验收。' : 'Led a tender-document Agent Harness and delivered business prototypes, case systems, and front-end acceptance work.'}</p></div></article>
          <article className="timeline-item reveal"><time>2023.09 — 2027.06</time><div><span className="timeline-pin" /><h3>{zh ? '北京交通大学 · 人工智能' : 'Beijing Jiaotong University · Artificial Intelligence'}</h3><p>{zh ? '计算机科学与技术学院；计算机设计大赛北京市三等奖、京彩大创 OPC 大赛北京市一等奖。' : 'School of Computer Science and Technology; Beijing awards in computer design and OPC innovation competitions.'}</p></div></article>
        </div>
      </section>

      <section className="skills-section section-pad">
        <SectionHeading index="05" eyebrow="HOW I BUILD" title={zh ? '能力不是标签，是一条条交付链' : 'Capabilities are delivery chains, not labels'} />
        <div className="skill-board reveal">
          {[
            ['01', zh ? 'Agent Runtime' : 'Agent Runtime', 'LangGraph · State Graph · Tool Calling · HITL'],
            ['02', zh ? '知识与证据' : 'Knowledge & Evidence', 'RAG · FTS5 · Vector Search · SourceRef'],
            ['03', zh ? '文档智能' : 'Document Intelligence', 'PDF · Excel · DOCX · Template Contract'],
            ['04', zh ? '全栈系统' : 'Full-stack Systems', 'FastAPI · React · Vue · SQLite · SSE'],
            ['05', zh ? '跨端交付' : 'Cross-platform Delivery', 'Android · Electron · Windows Offline'],
            ['06', zh ? '验证工程' : 'Verification Engineering', 'Vitest · Pytest · Playwright · Visual QA'],
          ].map(([index, title, detail]) => <div className="skill-row" key={index}><span>{index}</span><h3>{title}</h3><p>{detail}</p><i>↗</i></div>)}
        </div>
      </section>

      <footer className="contact-section section-pad" id="contact">
        <div className="contact-doodle" aria-hidden="true"><Sparkles /><span>let's build<br />something<br />reliable</span></div>
        <p className="eyebrow">{zh ? '秋招 / 2027' : 'OPEN TO OPPORTUNITIES / 2027'}</p>
        <h2>{zh ? '复杂问题，可以从一封邮件开始。' : 'A complex problem can start with one email.'}</h2>
        <div className="contact-actions">
          <a className="button primary" href="mailto:gujianleng@gmail.com"><Mail size={18} />gujianleng@gmail.com</a>
          <a className="button ghost" href="https://github.com/anonkuki" target="_blank" rel="noreferrer"><Code2 size={18} />github.com/anonkuki</a>
        </div>
        <button className="back-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ {zh ? '回到顶部' : 'Back to top'}</button>
        <div className="footer-line"><span>lenggujian © 2026</span><span>{zh ? '用确定性工程约束不确定性' : 'Engineering certainty around model uncertainty'}</span></div>
      </footer>
    </main>
  )
}
