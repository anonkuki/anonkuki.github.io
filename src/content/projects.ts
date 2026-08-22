import type { CapabilityGroup, CaseStudy, PublicProject } from './types'
import auditSummary from './audit-summary.json'
import githubSnapshot from './github-snapshot.json'

interface GitHubSnapshotItem {
  repo: string
  language: string
  stars: number
  demoUrl?: string
}

const githubByRepo = new Map(githubSnapshot.repositories.map((item) => [item.repo, item as GitHubSnapshotItem]))
const publicMetadata = (repo: string, fallback: { language: string; stars: number; demoUrl?: string }) => {
  const synced = githubByRepo.get(repo)
  return {
    language: synced?.language || fallback.language,
    stars: synced?.stars ?? fallback.stars,
    demoUrl: synced?.demoUrl || fallback.demoUrl,
  }
}

const auditedCount = (id: keyof typeof auditSummary.groupCounts) => auditSummary.groupCounts[id]

export const featuredCases: CaseStudy[] = [
  {
    slug: 'tender-agent-harness',
    index: '01',
    title: { zh: '投标文档 Agent Harness', en: 'Tender Document Agent Harness' },
    eyebrow: { zh: '多智能体 · RAG · 文档工程', en: 'Multi-agent · RAG · Document engineering' },
    summary: {
      zh: '把高规范、长流程的投标响应工作拆成可观察、可恢复、可人工接管的执行图。',
      en: 'Turning a regulated, long-running tender workflow into an observable, recoverable execution graph with human checkpoints.',
    },
    problem: {
      zh: '长文档不只是“生成文字”：需求要完整提取，章节要服从模板，图表要落到 Word，最终结果还要经过结构与合规校验。',
      en: 'Long-form delivery is more than text generation: requirements, templates, diagrams, Word assembly, and compliance checks must stay aligned.',
    },
    architecture: {
      zh: '以 LangGraph 状态图组织解析、检索、写作、图表与审查节点；工具层隔离文档、检索和渲染能力；持久化状态支持分步确认与任务恢复。',
      en: 'A LangGraph state graph orchestrates parsing, retrieval, writing, diagrams, and review. Tool adapters isolate document, retrieval, and rendering concerns.',
    },
    reliability: {
      zh: 'review-rewrite 回路、输入签名缓存、结构后验校验与图表降级路径共同控制长任务风险。',
      en: 'Review-rewrite loops, signature-based caching, structural post-validation, and rendering fallbacks control long-running task risk.',
    },
    performance: {
      zh: '重复解析与生成结果按关键输入签名复用；页面与演示按路由懒加载。',
      en: 'Repeated parsing and generation reuse signature-keyed results; case UI and demos are route-lazy-loaded.',
    },
    stack: ['Python', 'FastAPI', 'LangGraph', 'ChromaDB', 'Vue 3', 'Playwright', 'python-docx'],
    metrics: [
      { value: '7', label: { zh: '可执行阶段', en: 'executable stages' }, evidence: { zh: '简历与当前源码链路', en: 'Resume and current source workflow' }, state: 'source-backed' },
      { value: 'HITL', label: { zh: '人工确认与接管', en: 'human checkpoints' }, evidence: { zh: '交互式工作流', en: 'Interactive workflow' }, state: 'source-backed' },
    ],
    demo: 'tender',
    accent: 'blue',
  },
  {
    slug: 'regulated-report-agent',
    index: '02',
    title: { zh: '受监管报告智能体', en: 'Regulated Report Agent' },
    eyebrow: { zh: '确定性规则 · 受约束 LLM · 证据链', en: 'Deterministic rules · Constrained LLM · Evidence lineage' },
    summary: {
      zh: '让事实、数值与模板由程序控制，让模型只在证据边界内表达和辅助审核。',
      en: 'Keeping facts, values, and templates deterministic while constraining the model to evidence-grounded writing and review.',
    },
    problem: {
      zh: '专业报告既要忠实读取 Excel，也要保持受控 Word 模板，还必须解释每个结论来自哪里。',
      en: 'Professional reports must faithfully ingest Excel, preserve controlled Word templates, and explain where every conclusion came from.',
    },
    architecture: {
      zh: '自研工作流串联解析、预检、人工确认、模板组装、规则审核与证据输出；SourceRef 将字段绑定到文件、Sheet 与单元格位置。',
      en: 'A custom workflow connects ingestion, prechecks, confirmation, template assembly, review, and evidence output. SourceRef binds fields to workbook locations.',
    },
    reliability: {
      zh: '确定性规则优先于模型判断；哈希锁定输入，模板合同限制改动范围，失败可停止、重试与重新生成。',
      en: 'Deterministic rules outrank model judgment; input hashes, template contracts, and stop/retry/regenerate states guard delivery.',
    },
    performance: {
      zh: '统一领域模型减少重复解析；检索索引与报告工件按任务隔离。',
      en: 'A unified domain model avoids repeated parsing while retrieval indexes and report artifacts remain task-isolated.',
    },
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'SQLite', 'openpyxl', 'python-docx', 'Microsoft Word'],
    metrics: [
      { value: 'SHA-256', label: { zh: '输入与工件锁定', en: 'input and artifact locking' }, evidence: { zh: '当前数据模型与交付脚本', en: 'Current domain model and delivery scripts' }, state: 'source-backed' },
      { value: 'Cell', label: { zh: '单元格级来源定位', en: 'cell-level source location' }, evidence: { zh: 'SourceRef 数据结构', en: 'SourceRef data structure' }, state: 'source-backed' },
    ],
    demo: 'regulated',
    accent: 'cyan',
  },
  {
    slug: 'cross-platform-field-suite',
    index: '03',
    title: { zh: '跨端现场信息协同平台', en: 'Cross-platform Field Suite' },
    eyebrow: { zh: 'Android · Web · Local API', en: 'Android · Web · Local API' },
    summary: {
      zh: '同一业务对象在移动采集、离线队列、Web 态势视图和本地接口之间保持一致。',
      en: 'Keeping one business object consistent across mobile capture, offline queues, web situational views, and a local API.',
    },
    problem: {
      zh: '现场网络不稳定、附件体积不一、移动端与大屏关注点不同，数据仍需可靠汇聚和追踪状态。',
      en: 'Field connectivity is unreliable, attachments vary in size, and mobile and desktop users need different views without losing data consistency.',
    },
    architecture: {
      zh: 'Kotlin Compose 客户端使用 Room 和 Repository 隔离本地数据，React Web 通过服务层与 Zustand 管理视图，本地 API 提供统一契约。',
      en: 'The Kotlin Compose client isolates Room persistence through repositories, while the React web app uses service adapters and Zustand over a shared local API contract.',
    },
    reliability: {
      zh: '本地优先写入、上传队列状态机、失败重试、端点发现与提交后回查共同降低弱网丢单风险。',
      en: 'Local-first writes, an upload-queue reducer, retry states, endpoint discovery, and post-submit verification reduce weak-network loss.',
    },
    performance: {
      zh: '路由懒加载与图表依赖分包降低 Web 首屏负担；附件按体积策略决定内联或外部传输。',
      en: 'Route lazy loading and chart chunking reduce the web entry cost; attachment payload policy adapts to file size.',
    },
    stack: ['Kotlin', 'Jetpack Compose', 'Room', 'React', 'TypeScript', 'Zustand', 'ECharts', 'Python'],
    metrics: [
      { value: '3', label: { zh: '协同运行端', en: 'cooperating runtimes' }, evidence: { zh: 'Android、Web、本地 API', en: 'Android, web, and local API' }, state: 'source-backed' },
      { value: '17', label: { zh: 'Android 测试文件', en: 'Android test files' }, evidence: { zh: '当前源码扫描', en: 'Current source inventory' }, state: 'verified-current' },
    ],
    demo: 'field',
    accent: 'ink',
  },
]

export const publicProjects: PublicProject[] = [
  {
    repo: 'AI-Copilot-Writing-Platform',
    title: { zh: 'AI Copilot 智能写作平台', en: 'AI Copilot Writing Platform' },
    description: { zh: '多智能体编排、结构化长篇写作、RAG 与一致性检查。', en: 'Multi-agent orchestration, structured long-form writing, RAG, and consistency checks.' },
    url: 'https://github.com/anonkuki/AI-Copilot-Writing-Platform', ...publicMetadata('AI-Copilot-Writing-Platform', { language: 'TypeScript', stars: 13 }),
    tags: ['Multi-Agent', 'RAG', 'Electron'], visual: 'writer',
  },
  {
    repo: 'Zuoyou-Anime-Club-2025-Annual-Summary',
    title: { zh: '佐佑动漫社年度星际报告', en: 'Zuoyou Annual Space Report' },
    description: { zh: '为每位社员生成专属星际旅程的交互式年度总结。', en: 'A personalized interactive annual journey through a 3D club galaxy.' },
    url: 'https://github.com/anonkuki/Zuoyou-Anime-Club-2025-Annual-Summary',
    ...publicMetadata('Zuoyou-Anime-Club-2025-Annual-Summary', { demoUrl: 'https://anonkuki.github.io/Zuoyou-Anime-Club-2025-Annual-Summary/', language: 'JavaScript', stars: 5 }),
    tags: ['Three.js', 'GSAP', 'Storytelling'], visual: 'space',
  },
  {
    repo: 'my-anime-rank',
    title: { zh: '动画作品个人排行', en: 'My Anime Rank' },
    description: { zh: '轻量、可分享的动画作品排序与展示实验。', en: 'A lightweight, shareable experiment for ranking and presenting anime.' },
    url: 'https://github.com/anonkuki/my-anime-rank', ...publicMetadata('my-anime-rank', { demoUrl: 'https://anonkuki.github.io/my-anime-rank/', language: 'HTML', stars: 3 }),
    tags: ['HTML', 'Visual list', 'Static'], visual: 'rank',
  },
  {
    repo: 'manchu-degradation-simulator',
    title: { zh: '古籍文字退化模拟器', en: 'Manchu Degradation Simulator' },
    description: { zh: '面向古籍 OCR 研究的数据退化与合成样本工具。', en: 'A degradation and synthetic-sample toolkit for historical-text OCR research.' },
    url: 'https://github.com/anonkuki/manchu-degradation-simulator', ...publicMetadata('manchu-degradation-simulator', { language: 'Python', stars: 1 }),
    tags: ['Python', 'OCR', 'Computer Vision'], visual: 'manchu',
  },
  {
    repo: 'OPC-TEST',
    title: { zh: '可审计数字员工材料包', en: 'Auditable Digital-worker Package' },
    description: { zh: '以输入锁定、隔离执行和证据清单支撑可复核的 Agent 协作。', en: 'Repository-backed agent collaboration with locked inputs, isolated execution, and evidence manifests.' },
    url: 'https://github.com/anonkuki/OPC-TEST', ...publicMetadata('OPC-TEST', { language: 'Evidence package', stars: 0 }),
    tags: ['Agent Ops', 'Audit', 'SHA-256'], visual: 'audit',
  },
  {
    repo: 'zuoyou_web',
    title: { zh: '佐佑冒险者公会', en: 'Zuoyou Adventurer Guild' },
    description: { zh: '像素叙事、社团档案与内容管理结合的全栈公会站点。', en: 'A pixel-storytelling guild site combining club archives and content management.' },
    url: 'https://github.com/anonkuki/zuoyou_web', ...publicMetadata('zuoyou_web', { language: 'TypeScript', stars: 0 }),
    tags: ['React', 'Pixel Art', 'Playwright'], visual: 'guild',
  },
]

export const capabilityGroups: CapabilityGroup[] = [
  { id: 'agent-docs', title: { zh: 'Agent 与文档智能', en: 'Agents & document intelligence' }, summary: { zh: '工作流编排、RAG、模板生成与证据追溯。', en: 'Workflow orchestration, RAG, templated generation, and evidence lineage.' }, count: auditedCount('agent-docs'), tags: ['Agent', 'RAG', 'DOCX'], color: '#245bff' },
  { id: 'data-gis', title: { zh: '数据与 GIS 可视化', en: 'Data & GIS visualization' }, summary: { zh: '多源数据、地图态势、预警和大屏分析。', en: 'Multi-source data, geospatial views, alerts, and analytical dashboards.' }, count: auditedCount('data-gis'), tags: ['GIS', 'ECharts', 'Dashboard'], color: '#39b8e8' },
  { id: 'enterprise', title: { zh: '企业管理与工作流', en: 'Enterprise workflow systems' }, summary: { zh: 'CMS、项目管理、数据治理与业务闭环。', en: 'CMS, project management, data governance, and operational loops.' }, count: auditedCount('enterprise'), tags: ['Vue', 'React', 'Workflow'], color: '#0b1f42' },
  { id: 'cross-offline', title: { zh: '跨端与离线交付', en: 'Cross-platform & offline delivery' }, summary: { zh: 'Android、Web、本地服务与 Windows 一键运行包。', en: 'Android, web, local services, and one-click Windows delivery.' }, count: auditedCount('cross-offline'), tags: ['Android', 'Offline', 'Packaging'], color: '#5479ff' },
  { id: 'science-visual', title: { zh: '科学计算与视觉实验', en: 'Scientific & visual experiments' }, summary: { zh: 'OCR、退化模拟、机器学习与交互叙事。', en: 'OCR, degradation simulation, machine learning, and interactive stories.' }, count: auditedCount('science-visual'), tags: ['Python', 'CV', 'Creative Code'], color: '#6ed5ff' },
  { id: 'qa-delivery', title: { zh: '质量与验收工程', en: 'Quality & acceptance engineering' }, summary: { zh: '回归测试、浏览器验收、文档目检与可追溯交付。', en: 'Regression testing, browser acceptance, document QA, and traceable delivery.' }, count: auditedCount('qa-delivery'), tags: ['Playwright', 'Evidence', 'QA'], color: '#173c8f' },
]
