import { rm } from 'node:fs/promises'
import path from 'node:path'

const dist = path.join(process.cwd(), 'dist')
await rm(dist, { recursive: true, force: true })
console.log(`Cleaned ${dist}`)
