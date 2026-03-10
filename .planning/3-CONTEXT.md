# Phase 3 — Context

## What Phase 3 Is

Phase 3 has no Antigravity/Windsurf component. It is a human-in-the-loop quality evaluation.

The process:
1. John runs a complete story through the pipeline using real Claude output at each stage
2. We review the output at each stage against quality criteria
3. We identify which prompts are underperforming and why
4. We patch those prompts directly (surgical edits to promptGenerator.ts)

This phase is complete when a full story has been run through all 7 stages and the output is genuinely good — not just technically correct.

## Quality Criteria Per Stage

### Stage 1 (Architect) — good if:
- The premise identifies something beneath the surface logline — an irony, a gap between want and need
- Characters have genuine contradictions, not just traits
- The dramatic question feels impossible to predict
- The structure description has shape — not just "tension builds"

### Stage 2 (Cartographer) — good if:
- Each chapter entry states its *function*, not just its content
- There is a real midpoint reversal and a genuine character choice somewhere
- The withheld information column creates actual suspense
- Chapter count matches the length target

### Stage 3 (Writer) — good if:
- The prose has a distinct voice and rhythm
- There is at least one moment of unexpected specificity per chapter
- Characters behave according to their contradictions, not just their roles
- The chapter doesn't resolve too cleanly

### Stage 4 (Sharpener) — good if:
- The DIAGNOSIS identifies genuinely weak moments (not just nitpicks)
- The REVISED CHAPTER is meaningfully better, not just reshuffled
- The opening and closing lines are strong
- Voice is preserved — not homogenised

### Stage 5 (Reader) — good if:
- The response reads like a real reader reaction, not a critique
- It identifies something to worry about
- It creates anticipation for the next chapter

### Stage 7 (Closer) — good if:
- The blurb creates genuine tension in 80-120 words
- The opening/ending assessment is honest, not just complimentary
- Title options feel considered, not generic
