# Story6 — Project Brief

## What We're Building

A local web app (Next.js) that acts as a **story production pipeline**.

It does NOT call any LLM API. Instead, it:
1. Generates a perfectly-crafted prompt for each pipeline stage
2. You copy that prompt → paste into Claude (or any LLM) → paste the output back
3. It stores the output, assembles state, and generates the next stage's prompt
4. Repeat until you have a complete, compelling novel

This is the V4 conveyor mechanic, but rebuilt with:
- **Simpler infrastructure** (flat JSON state, no DB required)
- **Better-designed prompts** (the actual quality lever)
- **Genre/style configurable at the start of each project**
- **No wasted complexity** (no psychological state engines, no detection evasion apparatus)

## The Core Thesis

Every previous version tried to engineer quality *indirectly* — through resistance modules, doubt engines, detection metrics.

V6 engineers quality *directly*: by obsessing over what makes a story good to read, and designing each pipeline stage to contribute exactly that.

## What Good Actually Means

- A premise that creates genuine tension and stakes
- Characters with wants, contradictions, and secrets
- Scenes that do more than one thing at a time
- Prose that has rhythm — it speeds up and slows down
- Surprises that feel inevitable in retrospect
- An ending that recontextualises what came before

The prompts are designed to produce *these things*, not to game a detector.

## Output
- `output/manuscript.txt` — assembled novel
- `output/chapters/` — individual chapter files
- State stored in `project.json` per project

## Stack
- Next.js App Router (same as V4 baseline)
- No external DB — JSON file state per project
- No LLM API keys required
- Runs locally: `npm run dev`

## Owner
- John (jball348-svg)
