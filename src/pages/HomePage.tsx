import { ArrowDownRight, ArrowRight, Check, Code2, Copy, ExternalLink, Mail, MessageCircle, Phone, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CapabilityConstellation } from '../components/CapabilityConstellation'
import { CaseBlueprint } from '../components/CaseBlueprint'
import { HeroArtwork } from '../components/HeroArtwork'
import { ProjectVisual } from '../components/ProjectVisual'
import { SectionHeading } from '../components/SectionHeading'
import { capabilityGroups, featuredCases, prototypeDeliveryAudit, publicProjects, qingyanSubproject } from '../content/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { copyText } from '../utils/copyText'

export function HomePage() {
  const { language, text } = useLanguage()
  const mainRef = useRef<HTMLElement>(null)
  const [copiedContact, setCopiedContact] = useState<string | null>(null)
  const zh = language === 'zh'
  const contacts = [
    { id: 'email', label: zh ? '邮箱' : 'Email', value: 'gujianleng@gmail.com', icon: Mail },
    { id: 'phone', label: zh ? '电话' : 'Phone', value: '17808200776', icon: Phone },
    { id: 'wechat', label: zh ? '微信' : 'WeChat', value: 'ace123456787', icon: MessageCircle },
  ]

  const copyContact = async (id: string, value: string) => {
    await copyText(value)
    setCopiedContact(id)
  }

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
            <span>AI-Native Builder</span><span>Agent Harness</span><span>Skill Designer</span>
          </div>
          <p className="hero-kicker">{zh ? '北京交通大学 · 人工智能专业 · 2027届' : 'BJTU · ARTIFICIAL INTELLIGENCE · CLASS OF 2027'}</p>
          <h1>{zh ? <><span className="title-line">让 AI 不止会回答，</span><span className="title-line">而是真的</span><span className="title-line">完成工作。</span></> : 'AI should do more than answer. It should finish the work.'}</h1>
          <p className="hero-lead">{zh ? '我是冷家健，北京交通大学人工智能专业 2027 届本科生。我用 AI 贯穿需求、架构、编码、测试与交付，独立推进真实业务系统从 0→1 开发并落地；累计 AI 协作 Token 200亿+，也把验证过的工程方法设计、沉淀为可复用 Skills。' : 'I am lenggujian, a 2027 AI undergraduate at Beijing Jiaotong University. I use AI across requirements, architecture, implementation, verification, and delivery to take real systems from zero to launch. My cumulative AI-assisted workload exceeds 20B tokens, and I turn proven engineering methods into reusable Skills.'}</p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>{zh ? '查看精选作品' : 'Explore selected work'}<ArrowDownRight size={18} /></button>
            <a className="button ghost" href="/resume/lenggujian-resume.pdf" download>{zh ? '下载简历' : 'Download resume'}<ArrowRight size={18} /></a>
          </div>
          <div className="hero-proof">
            <span><b>{zh ? '200亿+' : '20B+'}</b>{zh ? '累计 AI 协作 Token' : 'cumulative AI-assisted tokens'}</span>
            <span><b>0→1</b>{zh ? 'AI 系统开发与落地' : 'AI systems built and shipped'}</span>
            <span><b>Skills</b>{zh ? '设计 · 验证 · 沉淀' : 'designed · validated · reused'}</span>
          </div>
        </div>
        <HeroArtwork />
      </section>

      <div className="ticker" aria-hidden="true"><div>AGENT HARNESS · RAG · HUMAN IN THE LOOP · DOCX ENGINEERING · CROSS-PLATFORM · EVIDENCE BEFORE CLAIMS ·&nbsp;</div></div>

      <section className="work-section section-pad" id="work">
        <SectionHeading index="01" eyebrow="SELECTED WORK" title={zh ? '两套真实落地 Agent，重构高成本业务流程' : 'Two production agents, rebuilding high-cost workflows'} />
        <div className="featured-list featured-collage">
          <div className="featured-board-notes" aria-hidden="true"><span>systems / proof / delivery</span><i>↘</i><b>02 real-world agent systems</b></div>
          {featuredCases.map((item, index) => (
            <article className={`featured-card featured-polaroid reveal accent-${item.accent}`} key={item.slug}>
              <Link className="featured-card-link" to={`/work/${item.slug}`} aria-label={`${text(item.title)} - ${zh ? '查看案例' : 'View case'}`}>
                <div className="case-number">{item.index}</div>
                <div className="case-copy">
                  <p className="eyebrow">{text(item.eyebrow)}</p>
                  {item.organization && item.period && <div className="case-engagement"><strong>{text(item.organization)}</strong><span>{text(item.period)}</span></div>}
                  <h3>{text(item.title)}</h3>
                  <p className="case-summary">{text(item.summary)}</p>
                  <p className="case-impact"><span>IMPACT</span>{text(item.impact)}</p>
                  <div className="tag-row">{item.stack.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
                <CaseBlueprint demo={item.demo} />
                <span className="case-link" aria-hidden="true"><ArrowRight /></span>
              </Link>
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
        <SectionHeading index="03" eyebrow="DELIVERY ATLAS" title={zh ? '做过的项目，沉淀成可复用的工程能力。' : 'Projects become reusable engineering capabilities.'} />
        <p className="section-intro reveal">{zh ? '从 Agent、文档智能到跨端交付，这里按六类能力整理我参与和完成的项目实践。' : 'From agents and document intelligence to cross-platform delivery, this atlas groups my work into six engineering capabilities.'}</p>
        <CapabilityConstellation groups={capabilityGroups} text={text} zh={zh} />
      </section>

      <section className="experience-section section-pad" id="experience">
        <SectionHeading index="04" eyebrow="EXPERIENCE" title={zh ? '从原型，到可验证的系统' : 'From prototypes to verifiable systems'} />
        <div className="timeline">
          <article className="timeline-item reveal"><time>{zh ? '2026.07 — 至今' : 'JUL 2026 — PRESENT'}</time><div><span className="timeline-pin" /><h3>{zh ? '北京科兴 · AI 全栈应用开发实习' : 'Sinovac · AI Full-stack Engineering Intern'}</h3><p>{zh ? '参与设计并独立开发注册材料报告 Agent，聚焦确定性数据链、Word 模板工程、94 项规则审核与来源追溯。' : 'Designed and independently developed a regulatory submission report agent around deterministic data, Word template engineering, a 94-item review, and provenance.'}</p></div></article>
          <article className="timeline-item reveal"><time>{zh ? '2026.03 — 2026.06' : 'MAR 2026 — JUN 2026'}</time><div><span className="timeline-pin" /><h3>{zh ? '北京清研灵智 · AI 全栈开发实习' : 'Qingyan Lingzhi · AI Full-stack Engineering Intern'}</h3><p>{zh ? '负责投标文档 Agent Harness，并将高频开发与验收流程沉淀为可复用 Skill，持续交付业务原型、案例系统和前端验收证据。' : 'Led a tender-document Agent Harness, turned recurring development and acceptance practices into reusable Skills, and continuously delivered prototypes, case systems, and acceptance evidence.'}</p><aside className="delivery-audit"><header><span>{zh ? '原型与案例系统交付' : 'PROTOTYPE & CASE DELIVERY'}</span><b>SOURCE AUDITED</b></header><div className="delivery-stats"><div className="delivery-stat"><strong>{prototypeDeliveryAudit.qualifiedSystemCount}{zh ? '套' : ''}</strong><span>{zh ? '合格系统' : 'qualified systems'}</span></div><div className="delivery-stat"><strong>{prototypeDeliveryAudit.oneOrTwoSystemDays} / {prototypeDeliveryAudit.activeBuildDays}</strong><span>{zh ? '活跃构建日保持 1–2 套' : 'build days at 1–2 systems'}</span></div><div className="delivery-stat"><strong>{prototypeDeliveryAudit.averagePerActiveDay}{zh ? '套' : ''}</strong><span>{zh ? '每个活跃构建日' : 'per active build day'}</span></div></div><p>{zh ? '按本地源码与目录首建时间重新审计：只计入有维护源码或完整演示的系统，备份、重复版本、空目录和纯构建包均排除。' : 'Re-audited from local source and directory creation dates. Only maintained source or complete demos count; backups, duplicates, empty folders, and build-only packages are excluded.'}</p></aside><aside className="experience-subproject"><header><span>{text(qingyanSubproject.label)}</span><b>OTHER DELIVERY</b></header><h4>{text(qingyanSubproject.title)}</h4><p>{text(qingyanSubproject.summary)}</p><div className="tag-row">{qingyanSubproject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></aside></div></article>
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
            ['07', zh ? 'AI 协作与 Skill 工程' : 'AI Collaboration & Skill Engineering', zh ? '任务拆解 · Skill/Tool 抽象 · 触发设计 · 验证与复用' : 'Task Decomposition · Skill/Tool Abstraction · Triggers · Validation & Reuse'],
          ].map(([index, title, detail]) => <div className="skill-row" key={index}><span>{index}</span><h3>{title}</h3><p>{detail}</p><i>↗</i></div>)}
        </div>
      </section>

      <footer className="contact-section section-pad" id="contact">
        <div className="contact-doodle" aria-hidden="true"><Sparkles /><span>let's build<br />something<br />reliable</span></div>
        <p className="eyebrow">{zh ? '求职方向：AI工程应用开发/agent开发' : 'TARGET ROLES: AI APPLICATION ENGINEERING / AGENT DEVELOPMENT'}</p>
        <h2>Thank you</h2>
        <div className="contact-actions">
          {contacts.map(({ id, label, value, icon: Icon }) => {
            const copied = copiedContact === id
            return <button className={`contact-card ${copied ? 'is-copied' : ''}`} type="button" aria-label={`${zh ? '复制' : 'Copy'}${label} ${value}`} onClick={() => void copyContact(id, value)} key={id}><Icon /><span>{label}</span><strong>{value}</strong><small>{copied ? `${label}${zh ? '已复制' : ' copied'}` : (zh ? '点击复制' : 'Click to copy')}</small>{copied ? <Check className="contact-copy-icon" /> : <Copy className="contact-copy-icon" />}</button>
          })}
          <a className="contact-card contact-github" href="https://github.com/anonkuki" target="_blank" rel="noreferrer" aria-label="GitHub github.com/anonkuki"><Code2 /><span>GitHub</span><strong>github.com/anonkuki</strong><small>{zh ? '查看公开仓库' : 'View public repositories'}</small><ExternalLink className="contact-copy-icon" /></a>
        </div>
        <button className="back-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ {zh ? '回到顶部' : 'Back to top'}</button>
        <div className="footer-line"><span>lenggujian © 2026</span><span>{zh ? '用确定性工程约束不确定性' : 'Engineering certainty around model uncertainty'}</span></div>
      </footer>
    </main>
  )
}
