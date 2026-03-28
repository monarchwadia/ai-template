---
applyTo: "**"
---

## Package Management

- Never run package install, add, remove, or update commands (e.g. `pnpm add`, `npm install`) yourself. Always ask the human to do it.
- Use `pnpm` instead of `npx` (e.g. `pnpm exec`, `pnpm dlx`).

## Tailwind CSS Usage

- Visual/presentational Tailwind classes (typography, color, shadow, border-color, font, etc.) must only be used inside atoms (`src/lib/components/atoms/`).
- Outside of atoms, only layout Tailwind classes are permitted (e.g. `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `max-w-*`, `items-*`, `justify-*`, `col-span-*`, `space-*`, `overflow-*`).
- This is enforced by the `tailwind-atoms/no-visual-tailwind-outside-atoms` ESLint rule. For one-off exceptions (page chrome, bespoke elements), use `eslint-disable` comments with a reason.

## Barrel Files

- Barrel files (`index.ts` that only re-export) are banned. Import directly from source modules (e.g. `from "./atoms/Heading"` not `from "./atoms"`).
- This is enforced by the `project-structure/no-barrel-files` ESLint rule.

## Documentation

- [documentation/index.md](../../documentation/index.md) is the operating record for the project. Read it and its linked files at the start of every session.
