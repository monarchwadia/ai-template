# Current state

## Architecture Philosophy

- This repository is designed to provide instant feedback to GitHub Copilot and other LLMs.
- Good architecture decisions are encoded as custom ESLint rules, not just written conventions. This means LLMs get real-time lint errors when they violate project architecture — pulling them back on track automatically.
- The custom rules (e.g. visual-Tailwind-only-in-atoms, no-barrel-files) are not just style preferences — they are architectural guardrails that enforce the design system boundaries and import structure at the tooling level.
- Instructional files (`.github/instructions/`, `.github/copilot-instructions.md`) teach the LLM the rules; ESLint enforces them with immediate feedback.

## Design System Conventions

- Atomic design: atoms → molecules, all inside `frontend/src/lib/components/`.
- Atoms are self-contained: variant props only, no `className` passthrough. All visual/presentational Tailwind lives inside atoms.
- Molecules compose atoms and add their own layout/styling.
- Outside of `lib/components/`, only layout Tailwind classes are permitted. This is enforced by ESLint — not just documented.

## ESLint Rules

- `tailwind-atoms/no-visual-tailwind-outside-atoms` (warn): enforces that visual styling stays in atoms. Use `eslint-disable` with a reason for one-off page chrome.
- `project-structure/no-barrel-files` (error): bans `index.ts`/`index.tsx` files that only re-export. Route index files with actual content are allowed.
- All imports use direct paths (e.g. `from "./atoms/Heading"` not `from "./atoms"`).

## Routing

- TanStack Router with file-based routing in `frontend/src/routes/`.
- `scrollRestoration` is NOT used — it conflicts with CSS `scroll-behavior: smooth`. See [documentation/stackoverflow/scroll-to-top-tanstack-router.md](./stackoverflow/scroll-to-top-tanstack-router.md) for the full debugging writeup.
