# Phase 2 — Research

## What makes each stage prompt work

### Stage 1 (Architect) — Foundation
The risk is Claude produces a shallow logline expansion. The prompt must push past surface to subtext.
Key technique: ask for the *gap* between what the protagonist wants and what they need. Ask for the story's central irony. Force character contradictions (what they believe vs what they do).
Reference: Story's dramatic question should be answerable with yes/no but feel impossible to predict.

### Stage 2 (Cartographer) — Outline
The risk is a flat scene-by-scene summary with no dramatic shape.
Key technique: each chapter entry must state its *function* in the story (not just content). Force a midpoint reversal, a false resolution, and a moment of genuine character choice in the outline structure.
Chapter count: derive from `project.outline` chapter count detection (already in submit route) — but the Cartographer prompt should ask Claude to decide on chapter count based on length_target:
- short_story: 5-8 chapters
- novella: 10-14 chapters  
- novel: 16-24 chapters

### Stage 3 (Writer) — Chapter Draft
The risk is generic competent prose that hits the beats but has no texture.
Key technique: give Claude the *emotional state* of the POV character at the start of the chapter (from the outline's emotional arc), and ask for one moment of unexpected specificity — a detail that could only exist in this story.
Also: inject the final paragraph of the previous chapter as a continuity anchor. Pull this from `project.chapters[n-2].sharp ?? project.chapters[n-2].draft`.

### Stage 4 (Sharpener) — Targeted Edit
The risk is Claude rewrites the whole chapter and loses the voice.
Explicit constraint: DO NOT rewrite the whole chapter. Identify the 2-3 weakest moments specifically (quote them), explain why they're weak, then provide the rewritten version. Deliver the full chapter with only those moments replaced.
Also: check the opening line and closing line specifically — these are the highest-leverage words.

### Stage 5 (Reader) — Reader Response
This is a *feeling* check, not an editorial check.
Prompt Claude to respond as an engaged reader, not an editor. No suggestions, no critique — just: what are you feeling? what are you worried about? what do you want to happen?

### Stage 7 (Closer) — End Assessment
Inject both the first chapter (sharp) and the last chapter (sharp) so Claude can see the full arc.
Ask: does the ending recontextualise the opening? Is the dramatic question answered or deliberately withheld?

## promptGenerator.ts structure

```typescript
// src/lib/promptGenerator.ts

export function generateLoadout(stage: number, project: Project): string {
  switch (stage) {
    case 1: return stage1Prompt(project);
    case 2: return stage2Prompt(project);
    case 3: return stage3Prompt(project);
    case 4: return stage4Prompt(project);
    case 5: return stage5Prompt(project);
    case 7: return stage7Prompt(project);
    default: return '';
  }
}

function buildProjectHeader(project: Project): string {
  // Returns a consistent context block injected into every prompt
  // Includes: title, genre, logline, tone, length_target
  // Plus whatever accumulated context is relevant to the stage
}
```

## LoadoutPanel wiring

Currently LoadoutPanel shows static placeholder text. It needs to:
1. Receive the full `project` object as a prop (not just stage + chapter number)
2. Call `generateLoadout(project.current_stage, project)` to get the real prompt
3. Display that in the textarea

This is a small change to `PipelineClient.tsx` and `LoadoutPanel.tsx`.
