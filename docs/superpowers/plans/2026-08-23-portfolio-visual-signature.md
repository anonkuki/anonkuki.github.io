# Portfolio Visual Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the portfolio a memorable hand-drawn visual narrative without copying the referenced sites or adding a heavy 3D runtime.

**Architecture:** Keep project content data-driven and add three code-native presentation components: a scroll companion using the user's cat artwork, distinct blueprint scenes for flagship cases, and a responsive capability constellation. Motion uses a browser-native scroll timeline plus transform/opacity effects and degrades under `prefers-reduced-motion`.

**Tech Stack:** React, TypeScript, Vite, CSS, Vitest, Testing Library, Playwright.

---

### Task 1: Page-wide cat guide

**Files:**
- Create: `src/components/ScrollCompanion.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/styles.css`
- Test: `tests/app.test.tsx`

- [x] Add a failing test that expects one `.scroll-companion`, the approved cat asset, and six chapter markers.
- [x] Run `pnpm vitest run tests/app.test.tsx` and confirm the companion assertion fails because the component does not exist.
- [x] Implement a decorative fixed guide that maps document scroll progress to the cat's path with a native CSS scroll timeline.
- [x] Hide the guide on narrow viewports and freeze it under reduced motion.
- [x] Run the focused test and verify the passing change.

### Task 2: Flagship blueprint scenes

**Files:**
- Create: `src/components/CaseBlueprint.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/styles.css`
- Test: `tests/app.test.tsx`

- [x] Add a failing test that expects three `.case-blueprint-mini` figures with `tender`, `regulated`, and `cross-platform` variants.
- [x] Run the focused test and confirm it fails because the figures are absent.
- [x] Implement three semantic-free SVG/CSS scenes: document pipeline, rules-and-evidence loop, and cross-device sync graph.
- [x] Add restrained transform-based motion with a reduced-motion fallback.
- [x] Run the focused test and verify the passing change.

### Task 3: Capability constellation

**Files:**
- Create: `src/components/CapabilityConstellation.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/styles.css`
- Test: `tests/app.test.tsx`
- Test: `tests/release-contract.test.ts`

- [x] Replace the existing atlas-grid expectation with a failing constellation contract: one center cat, six mapped nodes, and a connecting SVG.
- [x] Run the focused tests and confirm failure because the constellation is absent.
- [x] Render the existing typed capability data around a central cat illustration without changing counts or public claims.
- [x] Use an absolute radial composition on desktop and a one-column card flow on mobile.
- [x] Run `pnpm verify`, `pnpm test:e2e`, `pnpm visual:capture`, and inspect desktop/mobile/reduced-motion screenshots before committing.

### Self-review

- [x] Confirm the visual language remains original blue-white hand drawing rather than copying any reference composition.
- [x] Confirm no new network runtime, tracking, private content, or unverified metric is introduced.
- [x] Confirm motion avoids continuous SVG paint work and has a reduced-motion fallback.
