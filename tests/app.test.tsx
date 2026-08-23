import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { PortfolioApp } from '../src/App'
import { LanguageProvider } from '../src/i18n/LanguageContext'

function renderRoute(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <PortfolioApp />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('portfolio experience', () => {
  it('presents the original hand-drawn intro as a decorative loading beat', () => {
    renderRoute()
    expect(screen.getByLabelText('作品集加载动画')).toBeInTheDocument()
    expect(screen.getByText('assembling selected work')).toBeInTheDocument()
  })

  it('renders four cover-led cards without GitHub star counts', () => {
    const { container } = renderRoute()
    expect(screen.getByText('北京交通大学 · 人工智能专业 · 2027届')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '让 AI 不止会回答，而是真的完成工作。' })).toBeInTheDocument()
    expect(screen.getByText(/真实业务系统从 0→1 开发并落地/)).toBeInTheDocument()
    expect(screen.getByText('200亿+', { selector: '.hero-proof b' })).toBeInTheDocument()
    expect(screen.getByText('累计 AI 协作 Token')).toBeInTheDocument()
    expect(screen.getByText('Skills', { selector: '.hero-proof b' })).toBeInTheDocument()
    expect(screen.getByText('设计 · 验证 · 沉淀')).toBeInTheDocument()
    expect(screen.getAllByTestId('public-project')).toHaveLength(4)
    expect(container.querySelector('.featured-collage')).toBeInTheDocument()
    expect(container.querySelectorAll('.featured-polaroid')).toHaveLength(3)
    expect(container.querySelectorAll('.case-blueprint-mini')).toHaveLength(3)
    expect(Array.from(container.querySelectorAll('.case-blueprint-mini')).map((node) => node.getAttribute('data-scene'))).toEqual(['tender', 'regulated', 'writing'])
    expect(container.querySelector('.scrapbook-stage')).toBeInTheDocument()
    expect(container.querySelectorAll('.project-polaroid')).toHaveLength(4)
    expect(container.querySelector('.scrapbook-doodles')).toBeInTheDocument()
    expect(screen.getAllByText('北京清研灵智').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2026.03 — 2026.06').length).toBeGreaterThan(0)
    expect(screen.getAllByText('北京科兴').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2026.07 — 至今').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '多邻班 · AI 校园题库共创平台' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '佐佑动漫社 · 双站作品集' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '年度星际报告 GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '冒险者公会 GitHub' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '多邻班 GitHub' })).not.toBeInTheDocument()
    expect(screen.getByText(/本地完整项目/)).toBeInTheDocument()
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
    expect(screen.queryByText('可审计数字员工材料包')).not.toBeInTheDocument()
    expect(screen.queryByText('动画作品个人排行')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '做过的项目，沉淀成可复用的工程能力。' })).toBeInTheDocument()
    expect(screen.getByText('从 Agent、文档智能到跨端交付，这里按六类能力整理我参与和完成的项目实践。')).toBeInTheDocument()
    expect(screen.queryByText(/不展示秘密/)).not.toBeInTheDocument()
    expect(container.querySelector('.scroll-companion')).not.toBeInTheDocument()
    expect(container.querySelector('.capability-constellation')).toBeInTheDocument()
    expect(container.querySelector('.constellation-links')).toBeInTheDocument()
    expect(container.querySelector('.constellation-core img')).toHaveAttribute('src', '/avatar-line.webp')
    expect(container.querySelectorAll('.constellation-node')).toHaveLength(6)
    expect(screen.getByText('AI 协作与 Skill 工程')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'AI Copilot 智能写作平台' }).length).toBeGreaterThan(0)
    expect(container.querySelector('.experience-subproject')).toHaveTextContent('跨端现场信息协同平台')
    expect(container.querySelector('.experience-subproject')).toHaveTextContent('清研实习子项目')
    expect(screen.getByText('求职方向：AI工程应用开发/agent开发')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '期待与你共事。' })).toBeInTheDocument()
    expect(screen.queryByText('复杂问题，可以从一封邮件开始。')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '下载简历' })).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')
  })

  it('copies email, phone, and WeChat contact cards while keeping GitHub as a link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderRoute()

    await user.click(screen.getByRole('button', { name: '复制邮箱 gujianleng@gmail.com' }))
    expect(writeText).toHaveBeenLastCalledWith('gujianleng@gmail.com')
    expect(screen.getByText('邮箱已复制')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '复制电话 17808200776' }))
    expect(writeText).toHaveBeenLastCalledWith('17808200776')

    await user.click(screen.getByRole('button', { name: '复制微信 ace123456787' }))
    expect(writeText).toHaveBeenLastCalledWith('ace123456787')
    expect(screen.getByRole('link', { name: 'GitHub github.com/anonkuki' })).toHaveAttribute('href', 'https://github.com/anonkuki')
  })

  it('switches the full interface to English', async () => {
    const user = userEvent.setup()
    renderRoute()
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(screen.getByText('BJTU · ARTIFICIAL INTELLIGENCE · CLASS OF 2027')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI should do more than answer. It should finish the work.' })).toBeInTheDocument()
    expect(screen.getByText('20B+', { selector: '.hero-proof b' })).toBeInTheDocument()
    expect(screen.getByText('Immersive writing workspace')).toBeInTheDocument()
    expect(screen.queryByText('沉浸式写作工作台')).not.toBeInTheDocument()
    expect(screen.getAllByText(/01 repository$/)).toHaveLength(2)
    expect(screen.queryByText(/01 repositories$/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects become reusable engineering capabilities.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download resume' })).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')
  })

  it('opens a flagship case with a working deterministic demo', async () => {
    const user = userEvent.setup()
    const { container } = renderRoute('/work/tender-agent-harness')
    expect(screen.getByRole('heading', { name: '投标文档 Agent Harness' })).toBeInTheDocument()
    expect(screen.getByText('北京清研灵智')).toBeInTheDocument()
    expect(screen.getByText('2026.03 — 2026.06')).toBeInTheDocument()
    expect(screen.getByText('AI 全栈开发实习生（Agent 方向）')).toBeInTheDocument()
    expect(container.querySelector('.case-reference-board')).toBeInTheDocument()
    expect(container.querySelectorAll('.case-polaroid')).toHaveLength(2)
    expect(container.querySelector('.case-story-copy')).toBeInTheDocument()
    expect(container.querySelector('.case-polaroid-primary figcaption span')).toHaveTextContent(/^01$/)
    await user.click(screen.getByRole('button', { name: '运行虚拟流程' }))
    expect(screen.getByText('解析输入')).toHaveAttribute('data-active', 'true')
    await user.click(screen.getByRole('button', { name: '推进一步' }))
    expect(screen.getByText('需求结构化')).toHaveAttribute('data-active', 'true')
  })
})
