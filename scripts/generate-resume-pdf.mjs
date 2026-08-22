import { spawnSync } from 'node:child_process'
import path from 'node:path'

const python = process.env.PORTFOLIO_PYTHON || 'python'
const script = path.join(process.cwd(), 'scripts', 'generate_resume_pdf.py')
const result = spawnSync(python, ['-X', 'utf8', script], { stdio: 'inherit' })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
