# Lessons From Previous Versions

This document captures what went wrong in V1-V4 so we don't repeat it.

## V1 — Story Architect Hub
- Manual copy-paste with no real state tracking
- No pipeline — just a UI wrapper around prompting
- Lesson: the conveyor mechanic (loadout → loadin → advance) is the right idea, but needs state

## V2
- Early iteration — similar issues to V1
- Lesson: n/a (not enough signal)

## V3 — Human Writing State Engine
- The most ambitious version. Simulated author psychology: confidence, fatigue, doubt, cognitive load, narrative resistance, pattern pressure.
- Produced elaborate machinery for *simulating a writer struggling* rather than machinery for *producing good prose*
- The system optimised for human-like failure modes rather than human-like quality
- Detection evasion was a first-class goal — this was a mistake. A story is either good or it isn't. Gameable metrics are not a proxy for quality.
- Lesson: **complexity of infrastructure does not correlate with quality of output**. The bottleneck is always prompt design.

## V4 — Multi-Agent Conveyor (StoryV4)
- Best architecture of any version. Specialist agents, conveyor mechanic, persistent state.
- Critical failure: state was persisted to SQLite but NOT re-injected into prompts. Agents were flying blind. The database was a graveyard of context that never got used.
- Secondary failure: agents were still tuned around detection evasion, not prose quality.
- DEBUG_NOTES.md documented this clearly but it was never fixed.
- Lesson: **state must be injected into every prompt wholesale**. A prompt that doesn't have full context will produce a response that doesn't fit the story.

## What V6 Does Instead

- State lives in `project.json` — injected completely into every prompt
- No database, no ORM, no complex schema
- No psychological simulation
- No detection evasion
- Prompts designed around craft questions: what makes a scene work? what makes a character feel real?
- User is in the loop — copy/paste model, same as V4 but simpler
- Genre/style is configurable per project
