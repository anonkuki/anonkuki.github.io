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

export const prototypeDeliveryAudit = {
  auditedAt: auditSummary.auditedAt,
  qualifiedSystemCount: auditSummary.prototypeDelivery.qualifiedSystemCount,
  activeBuildDays: auditSummary.prototypeDelivery.activeBuildDays,
  oneOrTwoSystemDays: auditSummary.prototypeDelivery.oneOrTwoSystemDays,
  averagePerActiveDay: auditSummary.prototypeDelivery.averagePerActiveDay,
}

export const featuredCases: CaseStudy[] = [
  {
    slug: 'tender-agent-harness',
    index: '01',
    title: { zh: '投标文档 Agent Harness', en: 'Tender Document Agent Harness' },
    eyebrow: { zh: '多智能体 · RAG · 文档工程', en: 'Multi-agent · RAG · Document engineering' },
    organization: { zh: '北京清研灵智', en: 'Qingyan Lingzhi, Beijing' },
    period: { zh: '2026.03 — 2026.06', en: 'Mar 2026 — Jun 2026' },
    role: { zh: 'AI 全栈开发实习生（Agent 方向）', en: 'AI Full-stack Engineering Intern · Agent Systems' },
    brand: {
      src: '/brands/qingyan-group.png',
      alt: { zh: '清研集团官方标识', en: 'Official Tsingyan Group mark' },
      className: 'qingyan',
    },
    summary: {
      zh: '作为项目负责人，把过去依赖十几人连续数周协作的投标材料生产，重构为 Agent 执行主流程、人在关键节点确认的端到端交付系统。',
      en: 'As project lead, I rebuilt a tender-production process that previously required 10+ people over several weeks into an end-to-end system where agents execute and people approve critical decisions.',
    },
    delivered: {
      zh: '完成招标解析、评分点与需求矩阵、RAG 检索、分章写作、架构图与效果图生成、合规审查、人工回写、DOCX 组装、实时进度与任务恢复，形成从输入材料到可提交文档的完整闭环。',
      en: 'Delivered tender parsing, scoring-point and requirement matrices, RAG, section drafting, diagram generation, compliance review, human edits, DOCX assembly, live progress, and task recovery.',
    },
    impact: {
      zh: '将原流程中十几人连续数周投入的机械编写、漏项排查和反复改版交给 Agent，人负责投标策略与最终判断；需求覆盖矩阵、模板对齐和审查重写共同提升响应效率、评分点覆盖率与得分表现。',
      en: 'Agents absorb weeks of mechanical drafting, omission checks, and repeated revisions previously spread across 10+ people, while humans focus on bid strategy. Coverage matrices and review-rewrite loops improve throughput, scoring-point coverage, and bid quality.',
    },
    problem: {
      zh: '长文档不只是“生成文字”：需求要完整提取，章节要服从模板，图表要落到 Word，最终结果还要经过结构与合规校验。',
      en: 'Long-form delivery is more than text generation: requirements, templates, diagrams, Word assembly, and compliance checks must stay aligned.',
    },
    architecture: {
      zh: 'FastAPI 承载任务与流式进度，LangGraph 状态图编排解析、检索、写作、图表和审查节点；ChromaDB 提供材料检索，python-docx 与 Word 后处理负责最终工件。',
      en: 'FastAPI serves tasks and streaming progress; a LangGraph state graph orchestrates parsing, retrieval, drafting, diagrams, and review; ChromaDB and the DOCX toolchain produce the final artifact.',
    },
    patterns: {
      zh: '采用状态机 + 流水线组织长任务，以 Strategy 路由不同生成路径，以 Adapter/Tool 层隔离模型、检索、渲染和文档能力，并在关键节点设置 Human-in-the-loop 检查点。',
      en: 'A state machine and pipeline organize long-running work; strategy routing selects generation paths; adapters isolate models, retrieval, rendering, and documents; HITL checkpoints guard critical decisions.',
    },
    maintainability: {
      zh: '节点、工具、Prompt、模板与校验器分层，单一能力可替换而不重写整条链路；高频验收、截图与离线交付方法进一步沉淀为可复用 Skill，减少后续项目重复开发。',
      en: 'Nodes, tools, prompts, templates, and validators are separated so one capability can change without rewriting the workflow. Repeated acceptance and delivery practices become reusable Skills.',
    },
    reliability: {
      zh: 'review-rewrite 回路、章节检查点、任务恢复、并发限流、失败重试、结构后验校验与图表降级路径共同控制长任务风险，人工可随时接管。',
      en: 'Review-rewrite loops, checkpoints, recovery, bounded concurrency, retries, structural post-validation, and rendering fallbacks control long-running task risk with human takeover available.',
    },
    performance: {
      zh: '章节、数据库表与图表采用有界并发生成；历史任务可复用已生成图表与中间工件，失败只补生成缺失项；快速骨架模式可在零 LLM 调用下先产出结构。',
      en: 'Sections, tables, and diagrams use bounded parallelism. Prior artifacts can be resumed, failures regenerate only missing items, and a zero-LLM skeleton mode produces structure first.',
    },
    stack: ['Python', 'FastAPI', 'LangGraph', 'ChromaDB', 'Vue 3', 'Playwright', 'python-docx'],
    metrics: [
      { value: '10+人', label: { zh: '原流程协作规模', en: 'people in the former workflow' }, evidence: { zh: '用户提供的业务基线', en: 'User-provided operating baseline' }, state: 'user-provided' },
      { value: '数周', label: { zh: '原流程典型周期', en: 'former cycle length' }, evidence: { zh: '用户提供的业务基线', en: 'User-provided operating baseline' }, state: 'user-provided' },
      { value: '7', label: { zh: '核心可执行阶段', en: 'core executable stages' }, evidence: { zh: '简历与当前源码链路', en: 'Resume and current source workflow' }, state: 'source-backed' },
      { value: '37套', label: { zh: '合格原型与案例系统', en: 'qualified prototype and case systems' }, evidence: { zh: '本地源码审计，排除重复与空壳', en: 'Local source audit excluding duplicates and empty shells' }, state: 'verified-current' },
    ],
    demo: 'tender',
    accent: 'blue',
  },
  {
    slug: 'regulated-report-agent',
    index: '02',
    title: { zh: '注册材料报告 Agent', en: 'Regulatory Submission Report Agent' },
    eyebrow: { zh: '确定性规则 · 受约束 LLM · 证据链', en: 'Deterministic rules · Constrained LLM · Evidence lineage' },
    organization: { zh: '北京科兴', en: 'Sinovac, Beijing' },
    period: { zh: '2026.07 — 至今', en: 'Jul 2026 — Present' },
    role: { zh: 'AI 全栈应用开发实习生（智能文档 Agent 方向）', en: 'AI Full-stack Engineering Intern · Document Agents' },
    brand: {
      src: '/brands/sinovac.svg',
      alt: { zh: 'SINOVAC 科兴官方标识', en: 'Official SINOVAC mark' },
      className: 'sinovac',
    },
    summary: {
      zh: '作为项目技术支撑，参与设计并独立开发注册材料报告智能体，把 Excel 数据到六份受控 Word 报告及 94 项审核串成可追溯的业务流水线。',
      en: 'As technical support for the project, I designed and independently developed a regulatory-report agent that connects Excel data, six controlled Word reports, and a 94-item review into one traceable workflow.',
    },
    delivered: {
      zh: '完成多类 Excel 适配、确定性预检、人工数据确认、六模板合同、正文/表格/趋势图生成、Word 自动化、94 项规则审核、法规 RAG、来源证据 JSON 与逐页验收链路。',
      en: 'Delivered Excel adapters, deterministic prechecks, human confirmation, six template contracts, narrative/table/chart generation, Word automation, 94-rule review, regulatory RAG, evidence JSON, and page-level acceptance.',
    },
    impact: {
      zh: '把人工核数、套模板、排版、逐项审核和来源追查变成可重复执行的流程，减少遗漏与格式返工；规则门禁、证据链和人工审批为提升注册材料一次审核通过率与审核效率提供直接支撑。',
      en: 'Manual reconciliation, templating, layout, item-by-item review, and source tracing become repeatable operations. Rule gates, evidence lineage, and approvals directly support a higher first-pass review rate and faster regulatory review.',
    },
    problem: {
      zh: '专业报告既要忠实读取 Excel，也要保持受控 Word 模板，还必须解释每个结论来自哪里。',
      en: 'Professional reports must faithfully ingest Excel, preserve controlled Word templates, and explain where every conclusion came from.',
    },
    architecture: {
      zh: 'FastAPI 工作流服务串联材料分类、解析、确认、生成与审核；统一领域模型承载稳定性数据，Repository 持久化任务状态，SourceRef 将关键字段绑定到文件、Sheet 与单元格。',
      en: 'A FastAPI workflow service connects classification, parsing, confirmation, generation, and review. A unified domain model carries stability data, repositories persist task state, and SourceRef binds fields to workbook cells.',
    },
    patterns: {
      zh: '使用 Adapter 统一不同 Excel 结构，Repository 隔离 SQLite，Template Contract 限定六类报告允许的结构改动，Rule Engine 与受约束 LLM 分工，显式状态机控制确认、生成、失败与重试。',
      en: 'Adapters normalize workbook variants; repositories isolate SQLite; template contracts bound six report types; a rule engine and constrained LLM divide responsibilities; an explicit state machine controls approval and retry.',
    },
    maintainability: {
      zh: '解析、领域模型、报告生成、规则审核、知识库与存储分包；六个模板合同和 94 项规则目录集中管理，支持单报告重新生成与规则独立演进，业务变化不必推翻整条链路。',
      en: 'Ingestion, domain models, reporting, rules, knowledge, and storage are modular. Six template contracts and the 94-rule catalog are centralized, enabling single-report regeneration and independent rule evolution.',
    },
    reliability: {
      zh: '确定性规则优先于模型判断；SHA-256 锁定输入身份，单元格级血缘验证事实，模板合同限制改动范围，缺图或待确认数据会阻断生成，失败可停止、重试与回到人工确认。',
      en: 'Deterministic rules outrank model judgment. SHA-256 identities, cell-level lineage, template contracts, blocking gates for missing evidence, and stop/retry/confirm states protect delivery.',
    },
    performance: {
      zh: 'Excel 一次解析后由统一领域模型复用到六份报告；法规向量索引缓存避免重复嵌入，工件按任务隔离，单份报告可独立重生成，避免整批重跑。',
      en: 'Excel is parsed once and reused across six reports. Cached regulatory embeddings avoid repeat work, artifacts remain task-isolated, and one report can regenerate without rerunning the batch.',
    },
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'SQLite', 'openpyxl', 'python-docx', 'Microsoft Word'],
    metrics: [
      { value: '6份', label: { zh: '受控 Word 报告', en: 'controlled Word reports' }, evidence: { zh: '当前模板合同与生成链路', en: 'Current template contracts and generation workflow' }, state: 'source-backed' },
      { value: '94/94', label: { zh: '注册审核目录覆盖', en: 'review catalog coverage' }, evidence: { zh: '当前规则目录与测试', en: 'Current rule catalog and tests' }, state: 'source-backed' },
      { value: 'SHA-256', label: { zh: '输入与工件锁定', en: 'input and artifact locking' }, evidence: { zh: '当前数据模型与交付脚本', en: 'Current domain model and delivery scripts' }, state: 'source-backed' },
      { value: 'Cell', label: { zh: '单元格级来源定位', en: 'cell-level source location' }, evidence: { zh: 'SourceRef 数据结构', en: 'SourceRef data structure' }, state: 'source-backed' },
    ],
    demo: 'regulated',
    accent: 'cyan',
  },
]

export const qingyanSubproject = {
  title: { zh: '跨端现场信息协同平台', en: 'Cross-platform Field Collaboration Suite' },
  label: { zh: '清研实习子项目', en: 'Additional Qingyan internship delivery' },
  summary: {
    zh: '负责 Android、Web 与本地 API 的跨端协同设计，以 Room 本地存储、上传队列和断网恢复保障现场数据可靠交付。',
    en: 'Designed collaboration across Android, web, and a local API, using Room persistence, upload queues, and offline recovery for reliable field delivery.',
  },
  tags: ['Kotlin', 'Jetpack Compose', 'Room', 'React', 'Local API'],
}

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
