import { ArrowLeft, ArrowUpRight, Boxes, CircleCheckBig, ShieldCheck, TimerReset, Workflow, Wrench } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CompanyBrand } from '../components/CompanyBrand'
import { featuredCases } from '../content/projects'
import { CaseDemo } from '../features/demos/CaseDemo'
import { useLanguage } from '../i18n/LanguageContext'

export function CasePage() {
  const { slug } = useParams()
  const { language, text } = useLanguage()
  const item = featuredCases.find((candidate) => candidate.slug === slug) ?? featuredCases[0]
  const zh = language === 'zh'
  const question = item.demo === 'tender'
    ? (zh ? '如果一份复杂投标文档，能够自己追踪证据呢？' : 'What if a complex tender could trace its own evidence?')
    : (zh ? '如果每个结论，都能沿证据链回到来源呢？' : 'What if every conclusion could travel back to its source?')

  return (
    <main id="main-content" className={`case-page case-${item.accent}`}>
      <section className="case-hero section-pad">
        <Link className="back-link" to="/"><ArrowLeft size={17} />{zh ? '返回作品集' : 'Back to portfolio'}</Link>
        <div className="case-reference-board">
          <div className="case-media-stack" aria-hidden="true">
            <figure className="case-polaroid case-polaroid-primary">
              <div className="case-blueprint"><span className="blueprint-node b1" /><span className="blueprint-node b2" /><span className="blueprint-node b3" /><i /><b>{item.index}</b></div>
              <figcaption>ARCHITECTURE MAP <span>{item.index}</span></figcaption>
            </figure>
            <figure className="case-polaroid case-polaroid-secondary">
              <div className={`case-proof-sheet proof-${item.demo}`}><strong>{item.demo === 'tender' ? 'INPUT → EVIDENCE → DOCX' : item.demo === 'regulated' ? 'RULE → SOURCE → REVIEW' : 'OUTLINE → RAG → DRAFT'}</strong>{item.stack.slice(0, 4).map((tag, index) => <span style={{ '--line': index + 1 } as React.CSSProperties} key={tag}>{tag}</span>)}</div>
              <figcaption>VERIFICATION PREVIEW <span>02</span></figcaption>
            </figure>
          </div>
          <div className="case-story-copy">
            <p className="eyebrow">CASE {item.index} · {text(item.eyebrow)}</p>
            {item.organization && item.period && item.role && <div className="case-engagement case-engagement-detail">{item.brand && <CompanyBrand brand={item.brand} />}<strong>{text(item.organization)}</strong><span>{text(item.period)}</span><small>{text(item.role)}</small></div>}
            <h1>{text(item.title)}</h1>
            <p className="case-question">{question}</p>
            <p className="case-lead">{text(item.summary)}</p>
            <div className="tag-row">{item.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="metric-grid">
              {item.metrics.map((metric) => <div className="metric-card" key={metric.value}><b>{metric.value}</b><span>{text(metric.label)}</span><small>{text(metric.evidence)}</small></div>)}
            </div>
          </div>
          <div className="case-board-doodles" aria-hidden="true"><span>↘</span><i>trace<br />the work</i><b>⌁</b></div>
        </div>
      </section>

      <section className="case-impact-panel section-pad">
        <p className="eyebrow">BUSINESS OUTCOME</p>
        <h2>{zh ? '效率与业务结果' : 'Efficiency and business outcome'}</h2>
        <p>{text(item.impact)}</p>
      </section>

      <section className="case-demo-section section-pad">
        <div className="case-section-copy"><p className="eyebrow">INTERACTIVE PROOF</p><h2>{zh ? '亲手推进一次虚拟流程' : 'Advance a synthetic workflow yourself'}</h2><p>{zh ? '演示只表达系统设计，不复刻任何客户界面、材料或数据。' : 'This demo communicates system design without reproducing any client interface, material, or data.'}</p></div>
        <CaseDemo kind={item.demo} language={language} />
      </section>

      <section className="case-narrative section-pad">
        <article><span><CircleCheckBig /></span><p className="eyebrow">DELIVERED</p><h2>{zh ? '实际完成' : 'What I delivered'}</h2><p>{text(item.delivered)}</p></article>
        <article><span><Workflow /></span><p className="eyebrow">PROBLEM</p><h2>{zh ? '问题不是生成，而是闭环' : 'The problem is the loop, not generation'}</h2><p>{text(item.problem)}</p></article>
        <article><span><ArrowUpRight /></span><p className="eyebrow">ARCHITECTURE</p><h2>{zh ? '让每一步可替换、可观察' : 'Make every step replaceable and observable'}</h2><p>{text(item.architecture)}</p></article>
        <article><span><Boxes /></span><p className="eyebrow">DESIGN PATTERNS</p><h2>{zh ? '设计模式' : 'Design patterns'}</h2><p>{text(item.patterns)}</p></article>
        <article><span><Wrench /></span><p className="eyebrow">MAINTAINABILITY</p><h2>{zh ? '可维护性' : 'Maintainability'}</h2><p>{text(item.maintainability)}</p></article>
        <article><span><ShieldCheck /></span><p className="eyebrow">RELIABILITY</p><h2>{zh ? '不把概率输出当作事实' : 'Never treat probabilistic output as fact'}</h2><p>{text(item.reliability)}</p></article>
        <article><span><TimerReset /></span><p className="eyebrow">PERFORMANCE</p><h2>{zh ? '为重复工作设计复用路径' : 'Design reuse paths for repeated work'}</h2><p>{text(item.performance)}</p></article>
      </section>

      <section className="case-next section-pad">
        <p className="eyebrow">NEXT CASE</p>
        {(() => { const next = featuredCases[(featuredCases.indexOf(item) + 1) % featuredCases.length]; return <Link to={`/work/${next.slug}`}><span>{text(next.title)}</span><ArrowUpRight /></Link> })()}
      </section>
    </main>
  )
}
