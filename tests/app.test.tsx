import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
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
    expect(screen.getByRole('heading', { name: '把复杂行业流程，做成可执行、可追溯、可交付的 AI 系统。' })).toBeInTheDocument()
    expect(screen.getAllByTestId('public-project')).toHaveLength(4)
    expect(container.querySelector('.featured-collage')).toBeInTheDocument()
    expect(container.querySelectorAll('.featured-polaroid')).toHaveLength(3)
    expect(container.querySelector('.scrapbook-stage')).toBeInTheDocument()
    expect(container.querySelectorAll('.project-polaroid')).toHaveLength(4)
    expect(container.querySelector('.scrapbook-doodles')).toBeInTheDocument()
    expect(screen.getByText('04', { selector: '.hero-proof b' })).toBeInTheDocument()
    expect(screen.getByText('张精选项目卡')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '多邻班 · AI 校园题库共创平台' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '佐佑动漫社 · 双站作品集' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '年度星际报告 GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '冒险者公会 GitHub' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '多邻班 GitHub' })).not.toBeInTheDocument()
    expect(screen.getByText(/本地完整项目/)).toBeInTheDocument()
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
    expect(screen.queryByText('可审计数字员工材料包')).not.toBeInTheDocument()
    expect(screen.queryByText('动画作品个人排行')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '下载简历' })).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')
  })

  it('switches the full interface to English', async () => {
    const user = userEvent.setup()
    renderRoute()
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(screen.getByRole('heading', { name: 'I turn complex domain workflows into traceable, shippable AI systems.' })).toBeInTheDocument()
    expect(screen.getByText('Immersive writing workspace')).toBeInTheDocument()
    expect(screen.queryByText('沉浸式写作工作台')).not.toBeInTheDocument()
    expect(screen.getAllByText(/01 repository$/)).toHaveLength(2)
    expect(screen.queryByText(/01 repositories$/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download resume' })).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')
  })

  it('opens a flagship case with a working deterministic demo', async () => {
    const user = userEvent.setup()
    const { container } = renderRoute('/work/tender-agent-harness')
    expect(screen.getByRole('heading', { name: '投标文档 Agent Harness' })).toBeInTheDocument()
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
