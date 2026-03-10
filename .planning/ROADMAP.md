# Story6 — Roadmap

## Milestone 1: Shell + Pipeline UI (Windsurf task)

Build the Next.js app shell with:
- [ ] Project creation screen (config form: genre, logline, tone, length)
- [ ] Pipeline view: vertical stage list (left), loadout/loadin panels (centre), manuscript viewer (right)
- [ ] `project.json` read/write (via API routes, stored in `/projects/{id}/project.json`)
- [ ] "Copy" button on loadout panel
- [ ] "Submit" button on loadin panel (saves output, advances stage)
- [ ] Stage progress indicators (locked / current / complete)
- [ ] Basic manuscript viewer (concatenated complete chapters)

**Deliverable**: A working UI shell that advances through stages and persists state to JSON. No prompts yet — dummy placeholder text in the loadout panel is fine.

---

## Milestone 2: Prompt System (Claude + Windsurf task)

Build the prompt generator:
- [ ] Stage 1 prompt (Architect) — foundation generation
- [ ] Stage 2 prompt (Cartographer) — outline generation
- [ ] Stage 3 prompt (Writer) — per-chapter draft, takes chapter N spec + previous chapter tail
- [ ] Stage 4 prompt (Sharpener) — targeted refinement of weakest moments
- [ ] Stage 5 prompt (Reader) — reader response, optional
- [ ] Stage 6: Assembler logic (no prompt — just concatenation)
- [ ] Stage 7 prompt (Closer) — ending + title + blurb

Each prompt is a TypeScript function: `generateLoadout(stage, projectJson) => string`

**Deliverable**: Fully working pipeline from config → foundation → outline → chapters → manuscript. Prompts are the core value — time should be spent here.

---

## Milestone 3: Quality Pass (Claude review task)

- [ ] Test the full pipeline end-to-end with a real story
- [ ] Evaluate prompt quality at each stage — does the output actually do what the stage intends?
- [ ] Iterate on the weakest prompts
- [ ] Add loadin validation (basic: is the output long enough? Does it contain expected structure?)
- [ ] Add ability to "redo" a stage (regenerate the loadout, clear the loadin, re-submit)

**Deliverable**: First complete manuscript produced by the pipeline.

---

## Milestone 4: Polish (optional)

- [ ] Multiple projects support (project list screen)
- [ ] Export to .docx
- [ ] Stage notes — user can add a note to any stage ("go darker here", "make her funnier")
- [ ] Genre presets — pre-fill config form for thriller / literary / horror etc.
