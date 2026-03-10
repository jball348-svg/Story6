# STATE.md

_Last updated: 2026-03-10_

## Current Position

- **Milestone**: 1 — Story6 MVP
- **Phase**: 3 — Quality Pass
- **Status**: In progress — requires real story run-through

## Completed Phases

- ✅ Phase 1 — Shell + Pipeline UI (verified 2026-03-10)
- ✅ Phase 2 — Prompt System (verified 2026-03-10)
  - All 6 stage prompts live
  - DIAGNOSIS stripped from chapter.sharp
  - Reader response feeds into next chapter Writer prompt
  - Length options expanded (5 tiers + custom)
  - Custom genre supported
  - Chapter count parsing made robust

## Key Decisions (Locked)

- No LLM API calls — copy/paste conveyor mechanic
- Stack: Next.js App Router, TypeScript, Tailwind CSS
- State: flat `project.json` per project
- Prompts inject full project context every time
- Quality of prose is the goal — not detection evasion

## Active Blockers

- None

## Captured Ideas (Milestone 2)

- Export to .docx
- Multiple projects / project list screen
- Stage notes — user can annotate any stage with direction
- Genre presets that pre-fill the config form
- Reader stage toggle on/off per project
