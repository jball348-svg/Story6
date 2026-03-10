# STATE.md

_Last updated: 2026-03-10_

## Current Position

- **Milestone**: 1 — Story6 MVP
- **Phase**: 1 — Shell + Pipeline UI
- **Status**: Plan-phase complete. Ready to execute.

## Key Decisions (Locked)

- No LLM API calls — the tool generates prompts, user runs them in Claude, pastes output back
- Stack: Next.js App Router, TypeScript, Tailwind CSS
- State: flat `project.json` per project (no database, no ORM)
- User is always in the loop — copy/paste conveyor mechanic (same as V4)
- Genre/style configurable per project via a setup form
- V4's scaffolding is the baseline reference — same repo owner has access

## Active Blockers

- None

## Captured Ideas (for later)

- Export to .docx (Milestone 2)
- Multiple projects support with project list screen (Milestone 2)
- Stage notes — user can annotate any stage with direction for Claude (Milestone 2)
- Genre presets that pre-fill the config form (Milestone 2)
- Optional: Reader response stage (Stage 5) can be toggled on/off per chapter

## Session Notes

- GSD methodology being followed in Claude web chat + Windsurf (not Claude Code)
- Claude (this chat) acts as the GSD orchestrator: writes planning docs, generates PLAN.md files
- Windsurf acts as the executor: receives PLAN.md, builds the code
- Verified against actual GSD README on 2026-03-10
