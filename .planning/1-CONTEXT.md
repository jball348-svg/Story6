# Phase 1 — Context (discuss-phase output)

Locked implementation decisions for Phase 1: Shell + Pipeline UI.

---

## What Phase 1 Delivers

A working Next.js app shell with:
- Project creation screen (config form)
- Pipeline view (loadout panel + loadin panel + manuscript viewer)
- JSON-based state persistence
- Stage progression logic
- No real prompts yet — placeholder loadout text is fine for this phase

---

## Locked Decisions

### Stack
- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- No database — state stored as `projects/{id}/project.json` on the filesystem via API routes
- No external LLM API calls anywhere in Phase 1

### Layout
- Three-panel layout:
  - **Left** (~20%): Pipeline stage list — vertical, current stage highlighted, completed checked, future locked
  - **Centre** (~50%): Top half = loadout (generated prompt, read-only, big Copy button). Bottom half = loadin (paste area + Submit button)
  - **Right** (~30%): Manuscript viewer — assembled chapters so far, scrollable, read-only
- **Top bar**: project title, genre badge, running word count
- Dark mode, minimal/brutalist aesthetic (consistent with John's other projects)

### State Shape (`project.json`)
```json
{
  "id": "uuid",
  "created_at": "ISO timestamp",
  "config": {
    "title": "string",
    "genre": "string",
    "logline": "string",
    "tone": "string",
    "length_target": "short_story | novella | novel"
  },
  "current_stage": 1,
  "current_chapter": null,
  "foundation": null,
  "outline": null,
  "chapters": []
}
```

### Stage List (Phase 1 must model all of these)
| Stage ID | Name | Type | Repeating? |
|---|---|---|---|
| 1 | Architect | loadout/loadin | No |
| 2 | Cartographer | loadout/loadin | No |
| 3 | Writer | loadout/loadin | Yes — once per chapter |
| 4 | Sharpener | loadout/loadin | Yes — once per chapter |
| 5 | Reader | loadout/loadin | Yes — optional per chapter |
| 6 | Assembler | auto (no loadin) | No |
| 7 | Closer | loadout/loadin | No |

### Interaction Model
- "Copy" button copies loadout text to clipboard
- "Submit" button saves loadin text → updates `project.json` → advances `current_stage` → generates next loadout
- Stage list updates reactively
- Manuscript viewer updates when a chapter reaches Stage 4 (Sharpener) complete

### Validation
- Loadin field cannot be submitted empty
- No other validation in Phase 1 (prompt output validation is Phase 3)

### Project Creation
- Simple form: title, genre (dropdown), logline (textarea), tone (text), length target (radio)
- On submit: creates `/projects/{uuid}/project.json`, redirects to pipeline view
- No project list screen in Phase 1 — direct URL only

### Loadout Content (Phase 1)
- Placeholder text: `"[Stage {N} prompt will appear here]"` — real prompts are Phase 2
- This is explicitly fine for Phase 1 milestone
