# STATE.md

_Last updated: 2026-03-10_

## Current Position

- **Milestone**: 1 — Story6 MVP
- **Phase**: 2 — Prompt System
- **Status**: Plan-phase complete. Ready to execute.

## Completed Phases

- ✅ Phase 1 — Shell + Pipeline UI (verified 2026-03-10)
  - All 7 pipeline stages wired
  - Three-panel UI: StageList, LoadoutPanel, LoadinPanel, ManuscriptViewer, TopBar
  - projectStore.ts: flat JSON state, no DB
  - Stage advancement logic correct, chapter loop correct
  - projects/ gitignored
  - Note: Stage 6 Assembler skips building manuscript string — to fix in Phase 2

## Key Decisions (Locked)

- No LLM API calls — the tool generates prompts, user runs them in Claude, pastes output back
- Stack: Next.js App Router, TypeScript, Tailwind CSS
- State: flat `project.json` per project (no database, no ORM)
- User is always in the loop — copy/paste conveyor mechanic
- Genre/style configurable per project via setup form
- Prompts inject full project.json context every time — the V4 fix

## Active Blockers

- None

## Captured Ideas (for later / Milestone 2)

- Export to .docx
- Multiple projects support with project list screen
- Stage notes — user can annotate any stage with direction for Claude
- Genre presets that pre-fill the config form
- Reader response stage (Stage 5) toggle on/off per chapter

## Session Notes

- GSD methodology followed in Claude web chat + Antigravity/Windsurf (not Claude Code)
- Claude (this chat) = GSD orchestrator: writes all planning docs, generates PLAN.md files
- Antigravity/Windsurf = executor: receives PLAN.md, builds the code
