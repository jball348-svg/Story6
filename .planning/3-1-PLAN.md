# Phase 3 — Plan: Quality Pass

## This is not a build task

No Antigravity/Windsurf needed. This phase is John + Claude.

## Process

### Step 1: Run a real story
Use the pipeline with a real premise. Commit to running all the way through at least:
- Stage 1 (Architect) — with real Claude output
- Stage 2 (Cartographer) — with real Claude output
- Stage 3 (Writer) — at least 2 chapters
- Stage 4 (Sharpener) — on those 2 chapters
- Stage 5 (Reader) — on at least 1 chapter

Paste each output back here in Claude chat so we can review it together.

### Step 2: Evaluate per stage
For each stage output, Claude will assess against the quality criteria in 3-CONTEXT.md and flag:
- What's working
- What's weak and why
- Whether the prompt needs changing or whether it's a Claude variance issue

### Step 3: Patch weak prompts
For any prompt identified as structurally weak (not just a bad Claude run), Claude will push a targeted fix to promptGenerator.ts directly.

### Step 4: Re-run the weak stage
If a prompt was patched, re-run that stage with the new prompt and compare.

## Done When
- At least one full story arc has been run through the pipeline
- No stage prompt is producing structurally poor output
- The manuscript viewer contains readable, compelling prose

## Note on Variance
LLM output varies. A single bad chapter doesn't mean the prompt is broken — it may just be a bad run. We're looking for *structural* failures: prompts that consistently produce flat characters, generic premises, over-resolved chapters, etc.
