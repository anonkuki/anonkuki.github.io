import { ArrowLeft, ArrowUpRight, ShieldCheck, TimerReset, Workflow } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { featuredCases } from '../content/projects'
import { CaseDemo } from '../features/demos/CaseDemo'
import { useLanguage } from '../i18n/LanguageContext'

export function CasePage() {
  const { slug } = useParams()
  const { language, text } = useLanguage()
  const item = featuredCases.find((candidate) => candidate.slug === slug) ?? featuredCases[0]
  const zh = language === 'zh'

  return (
    <main id="main-content" className={`case-page case-${item.accent}`}>
      <section className="case-hero section-pad">
        <Link className="back-link" to="/"><ArrowLeft size={17} />{zh ? '返回作品集' : 'Back to portfolio'}</Link>
        <div className="case-hero-grid">
          <div>
            <p className="eyebrow">CASE {item.index} · {text(item.eyebrow)}</p>
            <h1>{text(item.title)}</h1>
            <p className="case-lead">{text(item.summary)}</p>
            <div className="tag-row">{item.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="case-blueprint" aria-hidden="true"><span className="blueprint-node b1" /><span className="blueprint-node b2" /><span className="blueprint-node b3" /><i /><b>{item.index}</b></div>
        </div>
        <div className="metric-grid">
          {item.metrics.map((metric) => <div className="metric-card" key={metric.value}><b>{metric.value}</b><span>{text(metric.label)}</span><small>{text(metric.evidence)}</small></div>)}
        </div>
      </section>

      <section className="case-demo-section section-pad">
        <div className="case-section-copy"><p className="eyebrow">INTERACTIVE PROOF</p><h2>{zh ? '亲手推进一次虚拟流程' : 'Advance a synthetic workflow yourself'}</h2><p>{zh ? '演示只表达系统设计，不复刻任何客户界面、材料或数据。' : 'This demo communicates system design without reproducing any client interface, material, or data.'}</p></div>
        <CaseDemo kind={item.demo} language={language} />
      </section>

      <section className="case-narrative section-pad">
        <article><span><Workflow /></span><p className="eyebrow">PROBLEM</p><h2>{zh ? '问题不是生成，而是闭环' : 'The problem is the loop, not generation'}</h2><p>{text(item.problem)}</p></article>
        <article><span><ArrowUpRight /></span><p className="eyebrow">ARCHITECTURE</p><h2>{zh ? '让每一步可替换、可观察' : 'Make every step replaceable and observable'}</h2><p>{text(item.architecture)}</p></article>
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
