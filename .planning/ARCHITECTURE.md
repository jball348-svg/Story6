# Story6 — Architecture

## Mental Model

Think of it as a **conveyor belt with stages**. Each stage:
1. Reads state from previous stages
2. Generates a prompt (the "loadout")
3. You paste the prompt into Claude → copy the output back (the "loadin")
4. State is saved. Next stage unlocks.

The app's job is to be a perfect **prompt engineer** and **state manager**. The LLM (you + Claude) does the actual writing.

---

## The Pipeline Stages

### PHASE 0 — SETUP (run once per project)

**Stage 0: Project Config**
- USER fills in a short form in the UI:
  - Genre (literary / thriller / horror / romance / sci-fi / custom)
  - Logline (1-2 sentences: who, what's at stake, what's in the way)
  - Tone (e.g. bleak, warm, darkly comic, etc.)
  - Rough length target (short story / novella / novel)
  - Optional: a character name, a setting, a first line — whatever spark exists
- This creates `project.json` with a `config` block
- No LLM involved yet

---

### PHASE 1 — FOUNDATION (2 stages)

**Stage 1: The Architect**
- Generates a prompt asking Claude to produce:
  - A refined premise (what the story is *really* about underneath the surface)
  - 3-4 characters with: want, wound, secret, contradiction
  - The central dramatic question (what the reader is waiting to find out)
  - A structural shape: how the story moves (e.g. spiral inward, escalating crises, slow reveal)
  - 3 thematic oppositions (e.g. loyalty vs survival, memory vs presence)
- Output stored as `foundation.json`
- **Key prompt design**: forces Claude to make the premise *earn* its tension — not just describe a situation but identify what's at stake and for whom

**Stage 2: The Cartographer**
- Generates a prompt asking Claude to produce:
  - A chapter-by-chapter outline (based on foundation + config)
  - Each chapter gets: POV character, location, 3-5 beats, emotional start/end state, what the reader learns, what the reader *doesn't* learn yet
  - The outline must include: a false resolution midpoint, a reversal, a moment of genuine character choice
- Output stored as `outline.json`
- **Key prompt design**: the outline is a *contract* — it specifies what each chapter must do narratively, not just what happens

---

### PHASE 2 — DRAFT (repeating per chapter)

**Stage 3: The Writer** (runs N times, once per chapter)
- Generates a prompt containing:
  - The full foundation (premise, characters, themes)
  - The full outline (so context is never lost)
  - The specific chapter's beat sheet
  - The final paragraph of the previous chapter (continuity anchor)
  - A "voice note" — a short instruction about tone/pace for this chapter specifically
- Asks Claude to write the full chapter (~1500-2500 words)
- Output stored as `chapters/ch{N}_draft.txt`
- **Key prompt design**: Claude is told to treat the beat sheet as a floor, not a ceiling — what's listed must happen, but the *texture* around it is where the prose lives

---

### PHASE 3 — REFINEMENT (repeating per chapter)

**Stage 4: The Sharpener** (runs per chapter after draft)
- Generates a prompt asking Claude to:
  - Identify the 2-3 weakest moments in the draft (flat dialogue, on-the-nose emotion, over-explained beats)
  - Rewrite *only those moments* — not the whole chapter
  - Tighten the opening line and closing line specifically
  - Check: does every scene do at least two things at once? If not, fix the one that doesn't.
- Output stored as `chapters/ch{N}_sharp.txt`
- **This is the quality multiplier** — targeted surgery, not a full rewrite

**Stage 5: The Reader** (optional, runs per chapter)
- Generates a prompt asking Claude to:
  - Read the sharpened chapter as a reader, not an editor
  - Report: what question are you left with? What do you want to know next? Did anything pull you out?
  - Output is a short reader response — not a rewrite instruction
- Output stored as `chapters/ch{N}_reader.txt`
- This is read by YOU and used to decide whether to proceed or loop back to Stage 4

---

### PHASE 4 — ASSEMBLY (run once at end)

**Stage 6: The Assembler**
- No LLM — pure tool logic
- Concatenates all `ch{N}_sharp.txt` files in order
- Adds chapter breaks, title page, basic formatting
- Outputs `output/manuscript.txt` and `output/manuscript.docx`

**Stage 7: The Closer** (optional)
- Generates a single prompt asking Claude to:
  - Read the first and last chapter together
  - Check: does the ending recontextualise the opening? Is the central dramatic question answered (or deliberately not)?
  - Suggest a title and 3 alternative titles
  - Write a one-paragraph back-cover blurb
- Output stored as `output/closer.txt`

---

## State Management

All state lives in a single `project.json` per project:

```json
{
  "id": "uuid",
  "config": { ... },
  "current_stage": 3,
  "current_chapter": 2,
  "foundation": { ... },
  "outline": { ... },
  "chapters": [
    { "number": 1, "draft": "...", "sharp": "...", "reader": "...", "status": "complete" },
    { "number": 2, "draft": "...", "sharp": null, "reader": null, "status": "in_progress" }
  ]
}
```

**This is the V4 bug fix**: every prompt generated at every stage has access to the complete project.json — nothing is ever missing from context.

---

## UI Shape

- **Left panel**: pipeline progress — stages as a vertical list, current stage highlighted, completed stages checked
- **Centre**: the current loadout (prompt to copy into Claude) — big copyable text area with a "Copy" button
- **Centre below**: the loadin (paste Claude's output here) — big text area with a "Submit" button
- **Right panel**: manuscript viewer — assembled text so far, updating as chapters complete
- **Top bar**: project name, genre, word count so far

---

## What V6 Does Differently From All Previous Versions

| Problem in previous versions | V6 solution |
|---|---|
| State persisted but not injected into prompts (V4) | `project.json` injected wholesale into every prompt |
| Over-engineered psychology simulation (V3) | Deleted entirely — not relevant to quality |
| Detection evasion as primary goal | Deleted — quality of prose is the goal |
| Prompts not designed around what makes stories good | Every prompt stage is designed around a specific craft question |
| Complexity that obscured the actual bottleneck | Minimal infrastructure, maximum prompt craft |
| No user sense of progress or control | Clear pipeline UI, user can see/edit everything |
