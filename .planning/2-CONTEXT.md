# Phase 2 — Context (discuss-phase output)

Locked implementation decisions for Phase 2: Prompt System.

---

## What Phase 2 Delivers

Real prompts replace the Phase 1 placeholder text. The `generateLoadout(stage, project)` function returns a fully-formed, copy-ready prompt for each stage that:
- Injects the full project context (config, foundation, outline, previous chapter tail)
- Asks Claude to produce exactly what that stage needs
- Is crafted around craft questions, not detection metrics

Also fixes the Stage 6 Assembler (build the actual manuscript string).

---

## Locked Decisions

### Where prompts live
- `src/lib/promptGenerator.ts` — single file, one exported function per stage
- Entry point: `generateLoadout(stage: number, project: Project): string`
- Called by the LoadoutPanel component (client-side is fine — no secrets involved)
- Each stage gets its own internal function: `stage1Prompt()`, `stage2Prompt()` etc.

### What every prompt must include
- A role/context preamble: what Claude is doing in this stage
- The full project config (genre, logline, tone, length target)
- All previously generated content relevant to this stage (foundation, outline, previous chapter)
- A precise output instruction: exactly what format/length/content is expected back
- A reminder NOT to add meta-commentary, preamble, or sign-off — just the content

### The V4 fix — context injection
Every prompt receives the full project object and injects what's relevant. Nothing is ever missing. This is the single most important improvement over V4.

### Prompt design philosophy (the quality lever)
Each stage prompt is designed around a specific craft question:
- Stage 1 (Architect): What is this story *really* about? What's at stake and for whom?
- Stage 2 (Cartographer): What must each chapter *do* narratively — not just what happens in it?
- Stage 3 (Writer): What is the texture of this scene, not just its plot beats?
- Stage 4 (Sharpener): Where is the prose doing the minimum, and what would it look like at its best?
- Stage 5 (Reader): As a reader, what do you *want* to happen next — and are you worried?
- Stage 7 (Closer): Does the ending earn the opening?

### Stage 6 Assembler (code fix)
- No prompt — auto-advance logic in the submit route
- Must actually build `manuscript` string: join all `chapters[].sharp` with `\n\n---\n\nChapter N\n\n`
- Store assembled string in `project.manuscript` (add this field to the Project type)
- ManuscriptViewer should prefer `project.manuscript` if present

### Output format guidance per stage
- Stage 1: Prose + structured sections (not JSON). Sections: PREMISE, CHARACTERS, DRAMATIC QUESTION, STRUCTURE, THEMES.
- Stage 2: Chapter-by-chapter outline. Each chapter: number, title, POV, location, beats (bullet list), emotional arc, what reader learns, what reader doesn't learn yet.
- Stage 3: Pure prose. No headers, no meta. Just the chapter.
- Stage 4: Rewritten prose only — the full chapter with targeted improvements applied.
- Stage 5: Short reader response in prose. 2-3 paragraphs. No headers.
- Stage 7: Four sections — TITLE OPTIONS, BLURB, OPENING/ENDING ASSESSMENT, one-line VERDICT.
