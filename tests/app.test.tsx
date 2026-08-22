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
  it('renders the Chinese hero and all six public repositories', () => {
    renderRoute()
    expect(screen.getByRole('heading', { name: '把复杂行业流程，做成可执行、可追溯、可交付的 AI 系统。' })).toBeInTheDocument()
    expect(screen.getAllByTestId('public-project')).toHaveLength(6)
  })

  it('switches the full interface to English', async () => {
    const user = userEvent.setup()
    renderRoute()
    await user.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(screen.getByRole('heading', { name: 'I turn complex domain workflows into traceable, shippable AI systems.' })).toBeInTheDocument()
  })

  it('opens a flagship case with a working deterministic demo', async () => {
    const user = userEvent.setup()
    renderRoute('/work/tender-agent-harness')
    expect(screen.getByRole('heading', { name: '投标文档 Agent Harness' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '运行虚拟流程' }))
    expect(screen.getByText('解析输入')).toHaveAttribute('data-active', 'true')
    await user.click(screen.getByRole('button', { name: '推进一步' }))
    expect(screen.getByText('需求结构化')).toHaveAttribute('data-active', 'true')
  })
})
