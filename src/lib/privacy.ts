export type PrivacyViolationKind = 'phone' | 'windows-path' | 'private-ip' | 'blocked-term'

export interface PrivacyViolation {
  kind: PrivacyViolationKind
  match: string
}
const patterns: Array<{ kind: Exclude<PrivacyViolationKind, 'blocked-term'>; pattern: RegExp }> = [
  { kind: 'phone', pattern: /(?<!\d)1[3-9]\d{9}(?!\d)/g },
  { kind: 'windows-path', pattern: /\b[A-Za-z]:\\[^\s"'<>]+/g },
  { kind: 'private-ip', pattern: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g },
]

export function findPrivacyViolations(value: string, blockedTerms: string[]): PrivacyViolation[] {
  const violations: PrivacyViolation[] = []
  for (const { kind, pattern } of patterns) {
    for (const match of value.matchAll(pattern)) violations.push({ kind, match: match[0] })
  }
  for (const term of blockedTerms.filter(Boolean)) {
    if (value.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
      violations.push({ kind: 'blocked-term', match: term })
    }
  }
  return violations
}
