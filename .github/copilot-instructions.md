# Project Guidelines

## Session Workflow

At the **start** of every session:

1. Read [documentation/current_state.md](../documentation/current_state.md) to understand what exists now.
2. Read recent entries in [documentation/changelog/](../documentation/changelog/) to understand what changed recently and why.

At the **end** of every session:

1. Add a new entry to [documentation/changelog/](../documentation/changelog/) for today's date (format: `YYYY-MM-DD.md`). If an entry for today already exists, append to it. Use bullet points describing what was done.
2. Update [documentation/current_state.md](../documentation/current_state.md) to reflect the new reality. This should be a complete snapshot — not a diff, but the full current state after changes.

During a session, make decisions consistent with the changelog history — don't undo or contradict previous deliberate choices without discussion.

## Formatting Conventions

- Changelog files are named by date: `YYYY-MM-DD.md`, with a heading of `# YYYY-MM-DD` and bullet points beneath.
- `current_state.md` is a flat bullet list of what is true about the platform right now.
