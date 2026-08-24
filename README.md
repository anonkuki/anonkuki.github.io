# lenggujian portfolio

An original bilingual portfolio for an AI full-stack / Agent engineer. The site uses an immersive blueprint-notebook visual language, two deterministic internship-case demos, a build-time GitHub metadata snapshot, and an anonymous capability atlas generated from a local project audit.

## Local development

```bash
pnpm install
pnpm audit:projects
pnpm sync:github
pnpm dev
```

The audit writes private project names and dispositions only to the Git-ignored `.private` directory. Only aggregate counts are committed.

## Quality gates

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm privacy:scan
```

The privacy gate scans source, static assets, the approved resume, and the production build for private IPs, absolute Windows paths, and locally generated confidential-title guards. Only the explicitly approved public phone number is allowlisted.

## Deployment

The GitHub Pages workflow publishes `dist` from `main`. Hash routing keeps every case study route compatible with static hosting.
