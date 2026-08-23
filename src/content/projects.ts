import type { CapabilityGroup, CaseStudy, PublicProject } from './types'
import auditSummary from './audit-summary.json'
import githubSnapshot from './github-snapshot.json'

interface GitHubSnapshotItem {
  repo: string
  language: string
  demoUrl?: string
}

const githubByRepo = new Map(githubSnapshot.repositories.map((item) => [item.repo, item as GitHubSnapshotItem]))
const publicMetadata = (repo: string, fallback: { language: string; demoUrl?: string }) => {
  const synced = githubByRepo.get(repo)
  return {
    language: synced?.language || fallback.language,
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
    organization: { zh: '北京清研灵智', en: 'Qingyan Lingzhi, Beijing' },
    period: { zh: '2026.03 — 2026.06', en: 'Mar 2026 — Jun 2026' },
    role: { zh: 'AI 全栈开发实习生（Agent 方向）', en: 'AI Full-stack Engineering Intern · Agent Systems' },
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
    organization: { zh: '北京科兴', en: 'Sinovac, Beijing' },
    period: { zh: '2026.07 — 至今', en: 'Jul 2026 — Present' },
    role: { zh: 'AI 全栈应用开发实习生（智能文档 Agent 方向）', en: 'AI Full-stack Engineering Intern · Document Agents' },
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
    repositories: ['AI-Copilot-Writing-Platform'],
    visibility: 'public',
    title: { zh: 'AI Copilot 智能写作平台', en: 'AI Copilot Writing Platform' },
    description: { zh: '多智能体编排、结构化长篇写作、RAG 与一致性检查。', en: 'Multi-agent orchestration, structured long-form writing, RAG, and consistency checks.' },
    ...publicMetadata('AI-Copilot-Writing-Platform', { language: 'TypeScript' }),
    tags: ['Multi-Agent', 'RAG', 'Electron'],
    covers: [{ src: '/project-covers/ai-writing.webp', label: { zh: '沉浸式写作工作台', en: 'Immersive writing workspace' } }],
    links: [{ repo: 'AI-Copilot-Writing-Platform', label: { zh: '智能写作平台', en: 'Writing platform' }, url: 'https://github.com/anonkuki/AI-Copilot-Writing-Platform' }],
  },
  {
    repo: 'zuoyou-club-sites',
    repositories: ['Zuoyou-Anime-Club-2025-Annual-Summary', 'zuoyou_web'],
    visibility: 'public',
    title: { zh: '佐佑动漫社 · 双站作品集', en: 'Zuoyou Anime Club · Two Web Experiences' },
    description: { zh: '同一社团的两种数字叙事：面向个人记忆的星际年度报告，以及承载社团档案与运营的像素冒险者公会。', en: 'Two digital narratives for one club: a personal galactic annual report and a pixel guild for archives and operations.' },
    language: 'JavaScript + TypeScript',
    tags: ['Three.js', 'Pixel Art', 'Storytelling', 'Full-stack'],
    covers: [
      { src: '/project-covers/club-space.webp', label: { zh: '年度星际报告', en: 'Annual space report' } },
      { src: '/project-covers/club-guild.webp', label: { zh: '冒险者公会', en: 'Adventurer guild' } },
    ],
    links: [
      { repo: 'Zuoyou-Anime-Club-2025-Annual-Summary', label: { zh: '年度星际报告', en: 'Annual report' }, url: 'https://github.com/anonkuki/Zuoyou-Anime-Club-2025-Annual-Summary', demoUrl: 'https://anonkuki.github.io/Zuoyou-Anime-Club-2025-Annual-Summary/' },
      { repo: 'zuoyou_web', label: { zh: '冒险者公会', en: 'Adventurer guild' }, url: 'https://github.com/anonkuki/zuoyou_web' },
    ],
  },
  {
    repo: 'manchu-degradation-simulator',
    repositories: ['manchu-degradation-simulator'],
    visibility: 'public',
    title: { zh: '古籍文字退化模拟器', en: 'Manchu Degradation Simulator' },
    description: { zh: '面向古籍 OCR 研究的数据退化与合成样本工具。', en: 'A degradation and synthetic-sample toolkit for historical-text OCR research.' },
    ...publicMetadata('manchu-degradation-simulator', { language: 'Python' }),
    tags: ['Python', 'OCR', 'Computer Vision'],
    covers: [{ src: '/project-covers/manchu.webp', label: { zh: '古籍退化样本', en: 'Degraded manuscript sample' } }],
    links: [{ repo: 'manchu-degradation-simulator', label: { zh: '古籍退化模拟器', en: 'Degradation simulator' }, url: 'https://github.com/anonkuki/manchu-degradation-simulator' }],
  },
  {
    repo: 'duolinban-campus',
    repositories: ['duolinban-campus'],
    visibility: 'local',
    title: { zh: '多邻班 · AI 校园题库共创平台', en: 'Duolinban · AI Campus Question Commons' },
    description: { zh: '把 PDF/OCR 学习资料转成可练习、可开源、可协作改进的校园题库，并串联判题、错题重练与学习打卡。', en: 'Turning PDF/OCR materials into practice-ready, open, collaborative campus question banks with grading, retries, and study streaks.' },
    language: 'TypeScript',
    tags: ['Next.js', 'AI Question Agent', 'PDF/OCR', 'Supabase'],
    covers: [{ src: '/project-covers/duolinban.webp', label: { zh: '多邻班学习助手', en: 'Duolinban learning companion' } }],
    links: [],
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
