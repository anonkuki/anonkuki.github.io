import { describe, expect, it } from 'vitest'
import { findPrivacyViolations } from '../src/lib/privacy'

describe('privacy scanner', () => {
  it('flags phone numbers, private paths, private IPs, and blocked terms', () => {
    const phone = ['138', '0013', '8000'].join('')
    const localPath = ['D:', 'secret', 'work'].join('\\')
    const privateIp = ['192', '168', '1', '9'].join('.')
    const value = `call ${phone} from ${localPath} at ${privateIp} for CLIENT-X`
    const violations = findPrivacyViolations(value, ['CLIENT-X'])
    expect(violations.map((item) => item.kind)).toEqual([
      'phone',
      'windows-path',
      'private-ip',
      'blocked-term',
    ])
  })

  it('allows the approved public email and GitHub URL', () => {
    expect(findPrivacyViolations('gujianleng@gmail.com https://github.com/anonkuki', [])).toEqual([])
  })
})
