# Phase 2 — Plan 1 of 1: Prompt System

## Goal
Replace placeholder loadout text with real, craft-focused prompts for all 7 pipeline stages. Wire LoadoutPanel to call promptGenerator. Fix Stage 6 Assembler to build the actual manuscript string.

## Reference
- Decisions: `.planning/2-CONTEXT.md`
- Prompt design rationale: `.planning/2-RESEARCH.md`
- Architecture: `.planning/ARCHITECTURE.md`
- Types: `src/types/project.ts`
- Current LoadoutPanel: `src/components/LoadoutPanel.tsx`
- Current PipelineClient: `src/app/project/[id]/PipelineClient.tsx`
- Submit route (for Stage 6 fix): `src/app/api/project/[id]/submit/route.ts`

---

## Tasks

```xml
<tasks>

  <task type="auto">
    <n>Add manuscript field to Project type + fix Stage 6 assembler</n>
    <files>
      src/types/project.ts
      src/app/api/project/[id]/submit/route.ts
    </files>
    <action>
      In src/types/project.ts:
        Add optional field to Project type: `manuscript?: string`

      In submit/route.ts, fix the Stage 6 block:
        Currently it just auto-advances. Replace with:
        - Build manuscript string: iterate project.chapters in order
        - For each chapter, use chapter.sharp if present, else chapter.draft
        - Join with: `\n\n---\n\nChapter ${chapter.number}\n\n` as separator
        - Store result in project.manuscript
        - Then advance to stage 7 as before
    </action>
    <verify>
      After submitting through all chapters and triggering Stage 6,
      project.json contains a `manuscript` field with assembled chapter text.
    </verify>
    <done>Stage 6 builds and stores the manuscript string correctly.</done>
  </task>

  <task type="auto">
    <n>Create promptGenerator.ts</n>
    <files>
      src/lib/promptGenerator.ts
    </files>
    <action>
      Create src/lib/promptGenerator.ts with the following exported function and internal helpers.

      export function generateLoadout(stage: number, project: Project): string
        — Switch on stage, call the relevant internal function.
        — For stage 6 (Assembler): return empty string (auto-advance, no prompt needed).

      Internal helper: buildProjectHeader(project: Project): string
        Returns a context block used at the top of every prompt:
        ```
        PROJECT CONTEXT
        Title: {title}
        Genre: {genre}
        Tone: {tone}
        Length target: {length_target}
        Logline: {logline}
        ```

      --- STAGE 1: Architect ---
      function stage1Prompt(project: Project): string

      Prompt text (write this exactly, with project values interpolated):

      ```
      You are working on a new {genre} story.

      {buildProjectHeader(project)}

      Your task is to develop the full creative foundation for this story. Go beyond the logline — find what the story is really about underneath the surface.

      Produce the following sections:

      PREMISE
      Expand the logline into a 2-3 sentence premise. Identify the central irony: the gap between what the protagonist wants and what they actually need. What do they believe about the world that this story will test?

      CHARACTERS
      Define 3-4 characters. For each provide:
      - Name and role
      - What they want (surface goal)
      - What they need (deeper, often opposite to what they want)
      - Their wound (what shaped them before the story begins)
      - Their contradiction (what they believe vs how they actually behave)
      - One secret they're keeping

      DRAMATIC QUESTION
      State the single question the entire story is building toward. It must be answerable with yes or no, but feel genuinely impossible to predict from the start.

      STRUCTURE
      Describe the shape of the story in 3-5 sentences. Not a chapter breakdown — the emotional and dramatic arc. How does tension escalate? Where does the story turn? What does the ending do to everything that came before?

      THEMES
      List 2-3 thematic oppositions the story explores (e.g. loyalty vs survival, memory vs presence). For each, note which side the story ultimately comes down on — or whether it refuses to choose.

      Do not add any preamble, sign-off, or meta-commentary. Respond with the five sections only.
      ```

      --- STAGE 2: Cartographer ---
      function stage2Prompt(project: Project): string

      Target chapter count based on length_target:
      - short_story → 5-8 chapters
      - novella → 10-14 chapters
      - novel → 16-24 chapters

      Prompt text:

      ```
      You are outlining a {genre} story.

      {buildProjectHeader(project)}

      FOUNDATION
      {project.foundation}

      Your task is to produce a full chapter-by-chapter outline. Target {N} chapters for a {length_target}.

      For each chapter provide:
      - Chapter number and title
      - POV character
      - Location
      - Beats (3-5 bullet points of what happens)
      - Emotional arc (where the POV character starts emotionally and where they end)
      - What the reader learns in this chapter
      - What the reader does NOT learn yet (what is being withheld)
      - The chapter's narrative function (e.g. "establishes false safety", "forces the first real choice", "reveals the cost of the protagonist's flaw")

      The outline as a whole must include:
      - A moment of false resolution at or near the midpoint
      - A reversal that recontextualises earlier events
      - At least one moment of genuine character choice (where the outcome is not inevitable)

      Do not add any preamble or sign-off. Respond with the chapter outline only.
      ```

      --- STAGE 3: Writer ---
      function stage3Prompt(project: Project): string

      Find current chapter spec from outline (use project.current_chapter to identify it).
      Find previous chapter tail: if current_chapter > 1, use last 3 sentences of project.chapters[current_chapter-2].sharp ?? project.chapters[current_chapter-2].draft. If chapter 1, no tail.

      Prompt text:

      ```
      You are writing Chapter {current_chapter} of a {genre} story.

      {buildProjectHeader(project)}

      FOUNDATION
      {project.foundation}

      FULL OUTLINE (for context)
      {project.outline}

      YOUR CHAPTER
      {the chapter's section from the outline — search for "Chapter {N}" in the outline text and extract it}

      {if chapter > 1:}
      CONTINUITY — final lines of Chapter {current_chapter - 1}:
      {previousChapterTail}

      Write Chapter {current_chapter} in full. Target 1,500-2,500 words.

      Guidelines:
      - Write in the tone established in the project ({tone})
      - Honour the beats in your chapter outline — they are a floor, not a ceiling. The texture around them is where the prose lives.
      - Include at least one moment of unexpected specificity: a detail, image, or observation that could only exist in this story
      - Let characters speak and behave in ways that are true to their contradictions and wounds
      - Do not resolve the chapter too cleanly — leave something open

      Respond with the chapter prose only. No title header, no commentary, no sign-off.
      ```

      --- STAGE 4: Sharpener ---
      function stage4Prompt(project: Project): string

      Prompt text:

      ```
      You are editing Chapter {current_chapter} of a {genre} story.

      {buildProjectHeader(project)}

      CHAPTER DRAFT
      {project.chapters[current_chapter-1].draft}

      Your task is targeted surgical editing — not a full rewrite.

      Step 1: Identify the 2-3 weakest moments in this draft. For each:
      - Quote the passage (as written)
      - Explain in one sentence why it is weak (on-the-nose emotion, flat dialogue, over-explained beat, missed opportunity, etc.)

      Step 2: Rewrite each identified passage. Keep everything else exactly as it is.

      Step 3: Check the opening line and the closing line specifically. If either can be stronger, rewrite them.

      Step 4: Deliver the full chapter with your improvements applied. Do not summarise what you changed — just give the chapter.

      Format your response as:
      DIAGNOSIS
      [your 2-3 identified weak moments with quotes and one-line explanations]

      REVISED CHAPTER
      [the full chapter with improvements applied]
      ```

      --- STAGE 5: Reader ---
      function stage5Prompt(project: Project): string

      Prompt text:

      ```
      You have just read Chapter {current_chapter} of a {genre} story.

      {buildProjectHeader(project)}

      CHAPTER
      {project.chapters[current_chapter-1].sharp ?? project.chapters[current_chapter-1].draft}

      Respond as an engaged reader — not an editor, not a critic. No suggestions, no craft analysis.

      Tell me:
      - What you are feeling right now
      - What you are worried about (for a character, for the outcome, for something unresolved)
      - What you want to happen next

      2-3 paragraphs. No headers. Pure reader response.
      ```

      --- STAGE 7: Closer ---
      function stage7Prompt(project: Project): string

      Prompt text:

      ```
      You have just finished reading a {genre} story.

      {buildProjectHeader(project)}

      FOUNDATION
      {project.foundation}

      FIRST CHAPTER
      {project.chapters[0]?.sharp ?? project.chapters[0]?.draft ?? ''}

      FINAL CHAPTER
      {project.chapters[project.chapters.length-1]?.sharp ?? project.chapters[project.chapters.length-1]?.draft ?? ''}

      Produce the following:

      TITLE OPTIONS
      Four possible titles. For each, one sentence on what it emphasises.

      BLURB
      A back-cover blurb of 80-120 words. Establish the world and protagonist in the first sentence. Create tension. Do not reveal the ending.

      OPENING / ENDING ASSESSMENT
      Does the ending recontextualise the opening? Is the dramatic question answered, deliberately withheld, or complicated? 2-3 sentences.

      VERDICT
      One sentence. What kind of reader is this story for?

      Do not add any preamble or sign-off.
      ```
    </action>
    <verify>
      Import generateLoadout in a test file or the browser console.
      Call generateLoadout(1, mockProject) — output should be a long, coherent Stage 1 prompt with project values interpolated.
      No TypeScript errors.
    </verify>
    <done>promptGenerator.ts exports generateLoadout. All 6 stage functions exist and return correctly interpolated prompt strings.</done>
  </task>

  <task type="auto">
    <n>Wire LoadoutPanel to promptGenerator</n>
    <files>
      src/components/LoadoutPanel.tsx
      src/app/project/[id]/PipelineClient.tsx
    </files>
    <action>
      In LoadoutPanel.tsx:
        - Change props to accept `project: Project` instead of just `current_stage` and `current_chapter`
        - Import generateLoadout from @/lib/promptGenerator
        - Call generateLoadout(project.current_stage, project) to get the loadout text
        - Display this in the textarea (replacing the placeholder)
        - Keep the Copy button behaviour exactly as-is

      In PipelineClient.tsx:
        - Pass the full `project` object to LoadoutPanel instead of individual stage/chapter props
        - Update any TypeScript prop types accordingly
    </action>
    <verify>
      Open a project at Stage 1 — the loadout panel shows the full Architect prompt with real project values.
      After submitting Stage 1 and advancing to Stage 2 — the loadout panel updates to show the Cartographer prompt with foundation injected.
      After advancing to Stage 3 — Writer prompt shows with full outline injected.
    </verify>
    <done>LoadoutPanel displays real prompts. Prompts update correctly as stages advance. Project context is visible in every prompt.</done>
  </task>

</tasks>
```

---

## Notes for executor

- The prompt strings in stage3Prompt, stage4Prompt, stage5Prompt, stage7Prompt contain conditional logic (e.g. "if chapter > 1"). Implement these as TypeScript template logic, not literal text in the prompt.
- When extracting the current chapter section from the outline text in stage3Prompt, do a simple string search for `Chapter {N}` and take text up to `Chapter {N+1}` or end of string. Don't over-engineer this.
- All prompts are client-side safe — no secrets, no API keys involved.
- Commit after each task.
