# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the corporate-looking portfolio surface with an art-directed cobalt-on-paper editorial experience, remove `my-anime-rank`, and serve the user's uploaded resume unchanged.

**Architecture:** Preserve the existing React routes, typed case data, deterministic demos, and build-time metadata pipeline. Replace the homepage presentation layer and global design tokens, add a short reduced-motion-aware intro overlay, reduce the public repository contract to five entries, and allowlist exactly one user-approved resume artifact in the privacy gate.

**Tech Stack:** React 19, TypeScript, Vite, CSS animations, IntersectionObserver, Vitest, Playwright, Lighthouse.

---

### Task 1: Lock the revised public-content contract

**Files:**
- Modify: `tests/content.test.ts`
- Modify: `tests/app.test.tsx`
- Modify: `e2e/portfolio.spec.ts`

- [x] Change the repository expectation from six entries to the five approved names and assert `my-anime-rank` is absent.
- [x] Assert both language states link to `/resume/lenggujian-resume.pdf`.
- [x] Run `pnpm test` and confirm failure against the old six-project and bilingual-resume behavior.

### Task 2: Update content, resume, and privacy policy

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/content/github-snapshot.json`
- Modify: `scripts/sync-github.mjs`
- Modify: `scripts/check-links.mjs`
- Modify: `scripts/privacy-scan.mjs`
- Modify: `PUBLICATION_MANIFEST.md`
- Replace: `public/resume/lenggujian-resume.pdf`
- Remove: generated bilingual resume artifacts and generation scripts

- [x] Remove the rejected repository from content and synchronization inputs.
- [x] Copy the uploaded PDF byte-for-byte to the public resume path and verify matching SHA-256 hashes.
- [x] Allow a phone number only inside that exact approved PDF while retaining all other path, IP, and confidential-title checks.
- [x] Run unit tests and privacy scan until the revised contract passes.

### Task 3: Rebuild the visual language

**Files:**
- Create: `src/components/IntroOverlay.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx`
- Replace: `src/styles.css`

- [x] Add a brief mascot-led intro that disappears immediately for reduced-motion users.
- [x] Recompose the hero as a restrained editorial spread with large whitespace, fine cobalt typography, and the user's drawing at a smaller scale.
- [x] Turn flagship cases into staggered pinned sheets and open-source work into an irregular scrapbook grid without conventional SaaS cards.
- [x] Restyle case pages and demos in the same grid-paper, tape, thin-line, and offset-photo language.
- [x] Preserve keyboard focus, responsive navigation, semantic headings, and deterministic demo controls.

### Task 4: Verify the redesign

**Files:**
- Modify: `scripts/capture-visuals.mjs` only if evidence coverage needs adjustment

- [x] Run TypeScript, ESLint, unit tests, build, privacy scan, and link checks.
- [x] Run Playwright on desktop and mobile for navigation, five-project count, resume URL, all case routes, demos, and menu behavior.
- [x] Capture desktop, mobile, tablet, reduced-motion, and full-page screenshots and visually inspect overflow, hierarchy, and collage alignment.
- [x] Run Lighthouse and require Performance at least 90 and the other categories at least 95.
- [x] Commit the redesign locally without publishing.
