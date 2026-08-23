# Public content manifest

Status: awaiting final privacy approval before the first public push.

## Identity and contact

- Public brand: `lenggujian`
- Public email: `gujianleng@gmail.com`
- Public profile: `github.com/anonkuki`
- Education, internship organizations, internship date ranges, and listed awards are included.
- The user-uploaded resume is published unchanged by explicit approval; it includes the contact details already present in that document.
- Portrait, age, gender, local paths, and private network details remain excluded from the website source and interface.

## Project content

- Three flagship case studies use anonymous product names and synthetic front-end demonstrations.
- Five user-approved public repositories are named and linked exactly once; metadata is synchronized at build time.
- The capability atlas publishes only aggregate counts across six engineering domains.
- Private project names, client names, internal screenshots, business data, and the local audit ledger are excluded.

## Public assets

- User-drawn transparent mascot, optimized as WebP.
- One user-uploaded resume PDF, copied byte-for-byte without generated replacements.
- Code-native abstract project covers; no client screenshots or separate copy of the original resume photo outside the approved PDF.

## Release verification

- `pnpm verify`: TypeScript, ESLint, unit tests, production build, and privacy scan.
- `pnpm test:e2e`: desktop/mobile navigation, route, interaction, resume-link, and menu checks.
- `pnpm links:check`: production preview, resume, robots, public demo, and five build-time GitHub snapshot links.
- Lighthouse and visual-capture evidence are run separately for accessibility, performance, reduced motion, responsive layout, keyboard focus, and media dimensions.
