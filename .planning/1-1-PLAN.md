# Phase 1 — Plan 1 of 1: Shell + Pipeline UI

## Goal
Build a working Next.js app that scaffolds a story project, persists state to JSON, and renders a three-panel pipeline UI with loadout/loadin conveyor mechanic. No real prompts yet.

## Reference
- Architecture: `.planning/ARCHITECTURE.md`
- Decisions: `.planning/1-CONTEXT.md`
- Research: `.planning/1-RESEARCH.md`
- Prior art: `jball348-svg/StoryV4` (same owner — review `src/hooks/useConveyor.ts` and `src/app/story/[id]/StoryClient.tsx`)

---

## Tasks

```xml
<tasks>

  <task type="auto">
    <name>Project scaffold</name>
    <files>
      package.json
      tsconfig.json
      next.config.js
      tailwind.config.js
      postcss.config.js
      .gitignore
      .env.example
    </files>
    <action>
      Scaffold a fresh Next.js 14 App Router project with TypeScript and Tailwind CSS.
      .gitignore must include: node_modules/, .env.local, projects/ (the JSON state directory).
      .env.example: no variables needed for Phase 1 — create it empty with a comment.
    </action>
    <verify>npm run build completes without errors</verify>
    <done>Clean Next.js 14 project runs locally on port 3000</done>
  </task>

  <task type="auto">
    <name>Project state types</name>
    <files>
      src/types/project.ts
    </files>
    <action>
      Define TypeScript types matching the state shape in 1-CONTEXT.md exactly:

      - ProjectConfig: title, genre, logline, tone, length_target (union: 'short_story' | 'novella' | 'novel')
      - ChapterStatus: 'not_started' | 'draft' | 'sharp' | 'complete'
      - Chapter: number, draft, sharp, reader (all string | null), status (ChapterStatus)
      - Project: id, created_at, config (ProjectConfig), current_stage (number), current_chapter (number | null), foundation (string | null), outline (string | null), chapters (Chapter[])

      Export all types. This file is the single source of truth for state shape.
    </action>
    <verify>No TypeScript errors. Types are imported cleanly in other files.</verify>
    <done>src/types/project.ts exports all required types with no errors</done>
  </task>

  <task type="auto">
    <name>API routes — project CRUD</name>
    <files>
      src/app/api/project/create/route.ts
      src/app/api/project/[id]/route.ts
      src/app/api/project/[id]/submit/route.ts
      src/lib/projectStore.ts
    </files>
    <action>
      Create src/lib/projectStore.ts with three functions:
      - getProject(id: string): Project — reads projects/{id}/project.json
      - saveProject(project: Project): void — writes projects/{id}/project.json
      - createProject(config: ProjectConfig): Project — creates new project with crypto.randomUUID(), current_stage: 1, current_chapter: null, all other fields null/empty

      Create API routes:

      POST /api/project/create
        - Body: { config: ProjectConfig }
        - Creates project via projectStore.createProject()
        - Returns: { id: string }

      GET /api/project/[id]
        - Returns: Project JSON

      POST /api/project/[id]/submit
        - Body: { loadin_text: string }
        - Reads current project state
        - Saves loadin_text to the correct field based on current_stage and current_chapter
        - Advances current_stage (and current_chapter if applicable) using advanceStage() logic below
        - Saves updated project
        - Returns: updated Project JSON

      Stage advancement logic (advanceStage):
        - Stage 1 (Architect): save loadin to foundation. Advance to stage 2.
        - Stage 2 (Cartographer): save loadin to outline. Parse chapter count from outline length or default to 10. Create chapters array with that many Chapter objects (status: not_started). Advance to stage 3, current_chapter: 1.
        - Stage 3 (Writer): save loadin to chapters[current_chapter-1].draft, set status: draft. Advance to stage 4.
        - Stage 4 (Sharpener): save loadin to chapters[current_chapter-1].sharp, set status: sharp. Advance to stage 5.
        - Stage 5 (Reader): save loadin to chapters[current_chapter-1].reader, set status: complete. If more chapters remain, advance to stage 3 and increment current_chapter. If all chapters complete, advance to stage 6.
        - Stage 6 (Assembler): no loadin — auto-advances. Assembles manuscript string from all chapters[].sharp joined with chapter break markers. Advance to stage 7.
        - Stage 7 (Closer): save loadin. Stage complete — no further advancement.

      Note: Stage 5 (Reader) is optional. The UI will handle skipping it — the API just needs to support receiving a submit at stage 5.
    </action>
    <verify>
      POST /api/project/create returns a valid id.
      GET /api/project/{id} returns the project.
      POST /api/project/{id}/submit with loadin_text advances the stage correctly.
      projects/{id}/project.json exists and contains valid JSON after each operation.
    </verify>
    <done>All three API routes work. State persists to filesystem. Stage advancement logic is correct.</done>
  </task>

  <task type="auto">
    <name>Project creation screen</name>
    <files>
      src/app/page.tsx
      src/app/new/page.tsx
      src/components/CreateProjectForm.tsx
    </files>
    <action>
      src/app/page.tsx: Simple landing page. Title "Story6". Single button: "New Project" → links to /new.

      src/app/new/page.tsx: Renders CreateProjectForm.

      src/components/CreateProjectForm.tsx:
        - Fields:
          - Title (text input, required)
          - Genre (select: Literary Fiction, Thriller, Horror, Romance, Sci-Fi, Fantasy, Custom)
          - Logline (textarea, required, placeholder: "Who is the protagonist, what do they want, what's in the way?")
          - Tone (text input, placeholder: "e.g. bleak, darkly comic, warm, tense")
          - Length (radio: Short Story ~10k words, Novella ~30k words, Novel ~80k words)
        - On submit: POST /api/project/create, redirect to /project/{id}
        - Styling: dark background, minimal/brutalist. No rounded corners. Monospace font for inputs if possible.
        - No client-side validation beyond HTML required attributes.
    </action>
    <verify>Filling out the form and submitting redirects to /project/{id} and the project.json exists.</verify>
    <done>Create project form works end-to-end. Project created and user redirected to pipeline view.</done>
  </task>

  <task type="auto">
    <name>Pipeline view — three-panel layout</name>
    <files>
      src/app/project/[id]/page.tsx
      src/app/project/[id]/PipelineClient.tsx
      src/components/StageList.tsx
      src/components/LoadoutPanel.tsx
      src/components/LoadinPanel.tsx
      src/components/ManuscriptViewer.tsx
      src/components/TopBar.tsx
    </files>
    <action>
      src/app/project/[id]/page.tsx:
        - Server component. Fetches project from GET /api/project/[id].
        - Renders PipelineClient with project as initial prop.

      src/app/project/[id]/PipelineClient.tsx:
        - Client component. Holds project state (useState with initial value from props).
        - Three-panel layout: flex h-screen. Left 20% StageList, centre flex-1 (LoadoutPanel top half, LoadinPanel bottom half), right 30% ManuscriptViewer.
        - TopBar fixed at top.
        - On loadin submit: POST /api/project/[id]/submit, update local project state from response.

      src/components/StageList.tsx:
        - Receives current_stage and current_chapter.
        - Renders a vertical list of all 7 stages by name.
        - Completed stages: checkmark + dimmed. Current stage: highlighted (white text, left border accent). Future stages: locked + greyed.
        - For repeating stages (Writer, Sharpener, Reader): show "Chapter N" next to stage name when active.

      src/components/LoadoutPanel.tsx:
        - Receives current_stage and current_chapter.
        - Displays a large read-only textarea with placeholder loadout text: "[Stage {stageName} prompt — Chapter {N} — will appear here in Phase 2]"
        - Big "Copy to Clipboard" button. On click: copies loadout text, button briefly shows "Copied!".
        - Label at top: current stage name.

      src/components/LoadinPanel.tsx:
        - Receives onSubmit callback.
        - Large textarea: placeholder "Paste Claude's output here..."
        - "Submit" button. Disabled when textarea is empty.
        - On submit: calls onSubmit(text), clears textarea.
        - Optional "Skip (Reader only)" button that only appears on Stage 5 — calls onSubmit with empty string or a skip signal.

      src/components/ManuscriptViewer.tsx:
        - Receives chapters array.
        - Shows assembled text: all chapters where status is 'sharp' or 'complete', joined by a chapter break ("--- Chapter N ---").
        - If no chapters complete: shows placeholder "Your manuscript will appear here as chapters are completed."
        - Shows running word count at top.

      src/components/TopBar.tsx:
        - Shows: project title, genre badge, word count.
        - Fixed height, dark background, minimal.

      Styling notes:
        - Dark theme throughout. Black/near-black backgrounds. White or light-grey text.
        - No rounded corners (brutalist).
        - Monospace font for the loadout and loadin textareas.
        - Accent colour: a single highlight colour (e.g. amber or white) for the active stage indicator and buttons.
    </action>
    <verify>
      /project/{id} renders without errors.
      All three panels are visible.
      Stage list shows current stage highlighted.
      Copy button copies text to clipboard.
      Submit button is disabled when textarea is empty, enabled when text is present.
      Submitting advances the stage and the stage list updates.
    </verify>
    <done>Full three-panel pipeline UI working. Conveyor mechanic advances stages correctly. Manuscript viewer shows completed chapters.</done>
  </task>

  <task type="auto">
    <name>README</name>
    <files>README.md</files>
    <action>
      Write a clear README:
      - What Story6 is (1 paragraph)
      - How it works (the copy/paste conveyor concept)
      - Getting started: npm install, npm run dev, go to localhost:3000
      - The 7 stages listed by name
      - Note that Phase 2 will add real prompts
    </action>
    <verify>README.md exists and is readable.</verify>
    <done>README written.</done>
  </task>

</tasks>
```

---

## Execution Notes for Windsurf

- Work through tasks in order — each depends on the previous
- Reference StoryV4 repo (jball348-svg/StoryV4) for the conveyor hook pattern, but do not copy it wholesale — V6 is simpler
- The `projects/` directory (where JSON state lives) must never be committed — ensure it's in .gitignore
- Commit after each task with a descriptive message
- If anything in a task is ambiguous, refer to `.planning/ARCHITECTURE.md` and `.planning/1-CONTEXT.md` first
