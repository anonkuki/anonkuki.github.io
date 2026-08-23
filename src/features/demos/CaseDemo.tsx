import { Check, CircleAlert, Play, RotateCcw, StepForward } from 'lucide-react'
import { useReducer, useState } from 'react'
import type { Language } from '../../content/types'
import type { CaseStudy } from '../../content/types'
import { initialDemoState, reduceDemo, type DemoDefinition } from './demo-machine'

type DemoKind = CaseStudy['demo']

const definitions: Record<DemoKind, DemoDefinition> = {
  tender: { stages: ['parse', 'structure', 'retrieve', 'compose', 'diagram', 'review', 'deliver'], failureStage: 'review' },
  regulated: { stages: ['ingest', 'precheck', 'confirm', 'template', 'lineage', 'audit'], failureStage: 'template' },
  writing: { stages: ['brief', 'outline', 'retrieve', 'draft', 'review', 'export'], failureStage: 'review' },
}
const labels: Record<DemoKind, Record<string, { zh: string; en: string }>> = {
  tender: {
    parse: { zh: '解析输入', en: 'Parse input' }, structure: { zh: '需求结构化', en: 'Structure requirements' }, retrieve: { zh: '证据检索', en: 'Retrieve evidence' },
    compose: { zh: '章节生成', en: 'Compose sections' }, diagram: { zh: '图表渲染', en: 'Render diagrams' }, review: { zh: '审查重写', en: 'Review & rewrite' }, deliver: { zh: 'DOCX 交付', en: 'Deliver DOCX' },
  },
  regulated: {
    ingest: { zh: '读取虚拟 Excel', en: 'Read synthetic Excel' }, precheck: { zh: '确定性预检', en: 'Deterministic precheck' }, confirm: { zh: '人工确认', en: 'Human confirmation' },
    template: { zh: '模板组装', en: 'Assemble template' }, lineage: { zh: '来源绑定', en: 'Bind lineage' }, audit: { zh: '证据审核', en: 'Evidence review' },
  },
  writing: {
    brief: { zh: '明确写作目标', en: 'Define the brief' }, outline: { zh: '生成结构大纲', en: 'Build the outline' }, retrieve: { zh: '检索参考资料', en: 'Retrieve sources' },
    draft: { zh: '分章生成', en: 'Draft chapters' }, review: { zh: '一致性检查', en: 'Check consistency' }, export: { zh: '整理导出', en: 'Prepare export' },
  },
}

export function CaseDemo({ kind, language }: { kind: DemoKind; language: Language }) {
  const definition = definitions[kind]
  const [state, dispatch] = useReducer((current: ReturnType<typeof initialDemoState>, action: Parameters<typeof reduceDemo>[1]) => reduceDemo(current, action, definition), initialDemoState(definition))
  const [simulateFailure, setSimulateFailure] = useState(false)
  const copy = language === 'zh'

  return (
    <section className={`case-demo demo-${kind}`} aria-label={copy ? '交互式虚拟演示' : 'Interactive synthetic demo'}>
      <div className="demo-toolbar">
        <div>
          <span className="live-dot" />
          <strong>{copy ? '纯前端虚拟流程' : 'Synthetic front-end workflow'}</strong>
          <small>{copy ? '不上传文件 · 不调用真实服务' : 'No uploads · No live services'}</small>
        </div>
        <label className="failure-toggle">
          <input type="checkbox" checked={simulateFailure} onChange={(event) => setSimulateFailure(event.target.checked)} />
          {copy ? '模拟一次故障' : 'Simulate one failure'}
        </label>
      </div>

      <div className="demo-canvas">
        <div className="demo-flow">
          {definition.stages.map((stage, index) => {
            const done = state.completedStages.includes(stage)
            const active = state.activeStage === stage
            const failed = active && state.status === 'failed'
            return (
              <div className={`demo-stage ${done ? 'is-done' : ''} ${active ? 'is-active' : ''} ${failed ? 'is-failed' : ''}`} key={stage}>
                <span className="stage-number">{done ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
                <span data-active={active ? 'true' : 'false'}>{labels[kind][stage][language]}</span>
                {index < definition.stages.length - 1 && <span className="stage-connector" />}
              </div>
            )
          })}
        </div>
        <DemoPreview kind={kind} language={language} status={state.status} completed={state.completedStages.length} />
      </div>

      <div className="demo-actions">
        {state.status === 'idle' && <button className="button primary" type="button" onClick={() => dispatch({ type: 'start', simulateFailure })}><Play size={17} />{copy ? '运行虚拟流程' : 'Run synthetic flow'}</button>}
        {state.status === 'running' && <button className="button primary" type="button" onClick={() => dispatch({ type: 'advance' })}><StepForward size={17} />{copy ? '推进一步' : 'Advance one step'}</button>}
        {state.status === 'failed' && <button className="button danger" type="button" onClick={() => dispatch({ type: 'retry' })}><CircleAlert size={17} />{copy ? '从检查点重试' : 'Retry from checkpoint'}</button>}
        {state.status !== 'idle' && <button className="button ghost" type="button" onClick={() => dispatch({ type: 'reset' })}><RotateCcw size={16} />{copy ? '重置' : 'Reset'}</button>}
        <span className={`demo-status status-${state.status}`}>{copy ? ({ idle: '等待运行', running: '执行中', failed: '已拦截', completed: '可交付' } as const)[state.status] : state.status}</span>
      </div>
    </section>
  )
}

function DemoPreview({ kind, language, status, completed }: { kind: DemoKind; language: Language; status: string; completed: number }) {
  if (kind === 'regulated') return (
    <div className="demo-preview regulated-preview">
      <div className="preview-title"><span>synthetic_stability.xlsx</span><b>{status === 'completed' ? 'PASS' : 'CHECK'}</b></div>
      <div className="sheet-row head"><span>Batch</span><span>Month</span><span>Result</span></div>
      <div className="sheet-row"><span>DEMO-01</span><span>06</span><span>98.7</span></div>
      <div className="sheet-row"><span>DEMO-02</span><span>12</span><span>98.3</span></div>
      <div className="lineage-chip">↳ Sheet 1 · C12 · SHA-256</div>
    </div>
  )
  if (kind === 'writing') return (
    <div className="demo-preview writing-preview">
      <div className="writing-outline"><b>{language === 'zh' ? '项目大纲' : 'Project outline'}</b><span>01 / SETUP</span><span>02 / CONFLICT</span><span>03 / RESOLUTION</span></div>
      <div className="writing-draft"><b>{status === 'failed' ? 'REVIEW' : 'DRAFT'}</b><i /><i /><i /><small>{completed}/6 stages</small></div>
      <div className="writing-source">RAG · 03 SOURCES</div>
    </div>
  )
  return (
    <div className="demo-preview tender-preview">
      <div className="doc-page"><span /><span /><span /><b>9.3</b></div>
      <div className="agent-orbit"><i>A</i><i>R</i><i>Q</i></div>
      <div className="delivery-box"><b>{completed}/7</b><span>{language === 'zh' ? '可追溯工件' : 'traceable artifacts'}</span></div>
    </div>
  )
}
