# Antigravity Prompt 2 — Closer Submit → Title Picker → Clean Reading View

## What and why

Currently, submitting the Stage 7 (Closer) loadin clears the text box but does nothing meaningful. This is the final act of the pipeline and should feel like a completion. The change adds:

1. Stage 7 submit saves the Closer output and advances to a new `stage 8` (title selection)
2. At stage 8 the pipeline is replaced by a title picker that parses the four title options from the Closer output and lets the user select one
3. Once a title is selected, the user is navigated to a new clean full-page reading view at `/project/[id]/read` showing the finished story with the chosen title and the assembled manuscript

---

## Part A — Data layer changes

### `src/types/project.ts`

Add two optional fields to the `Project` type:

```ts
closer_output?: string;   // the raw Stage 7 loadin text
chosen_title?: string;    // the title the user selected at stage 8
```

---

## Part B — Submit route

### `src/app/api/project/[id]/submit/route.ts`

Add a new `else if (current_stage === 7)` block:

```ts
} else if (current_stage === 7) {
    project.closer_output = loadin_text;
    project.current_stage = 8;
}
```

Add a new `else if (current_stage === 8)` block that saves the chosen title:

```ts
} else if (current_stage === 8) {
    // loadin_text here is the chosen title string
    if (loadin_text.trim()) {
        project.chosen_title = loadin_text.trim();
    }
    project.current_stage = 9; // complete
}
```

---

## Part C — Title parsing utility

Create `src/lib/parseTitles.ts`:

```ts
/**
 * Parses title options from a Stage 7 (Closer) output.
 * Expects a TITLE OPTIONS section with lines in the format:
 *   - Title Name: one sentence explanation
 * OR
 *   * Title Name: one sentence explanation
 * OR just numbered/bulleted title lines.
 * Returns an array of title strings (without the explanation).
 */
export function parseTitles(closerOutput: string): string[] {
    const section = closerOutput.match(/TITLE OPTIONS(.*?)(?=BLURB|$)/si)?.[1] || '';
    const lines = section.split('\n').filter(l => l.trim());
    const titles: string[] = [];
    for (const line of lines) {
        // Match lines like: "- The Fissure in the Gold: Emphasises..."
        // or "* The Fissure in the Gold — Emphasises..."
        // or "1. The Fissure in the Gold: ..."
        const match = line.match(/^[\-\*\d\.\s]+([^:\-–—]+)[:\-–—]/);
        if (match) {
            const title = match[1].trim();
            if (title.length > 0 && title.length < 100) {
                titles.push(title);
            }
        }
    }
    // Fallback: if parsing found nothing, return a single option from the project title
    return titles.length > 0 ? titles : [];
}
```

---

## Part D — TitlePicker component

Create `src/components/TitlePicker.tsx`:

This component:
- Receives `project: Project` as a prop
- Calls `parseTitles(project.closer_output || '')` to get the list of title options
- If no titles were parsed, shows a free text input instead
- Renders each title as a large selectable button (styled consistently with the rest of the app — dark brutalist, amber accent on selected)
- Has a "Confirm Title" button that is disabled until a title is selected
- On confirm, calls a `onTitleSelected(title: string)` callback prop

Layout:
```
[Heading: "Choose a title for your story"]
[Four large selectable title buttons, one per parsed title]
[Optional: free text input if user wants to type their own]
[Confirm Title button — amber, disabled until selection made]
```

---

## Part E — PipelineClient stage 8 handling

### `src/app/project/[id]/PipelineClient.tsx`

When `project.current_stage === 8`:
- Replace the normal pipeline layout with the `TitlePicker` component full-width (or centred in the main area)
- Hide the StageList, LoadoutPanel, LoadinPanel, ManuscriptViewer
- When `onTitleSelected` fires:
  1. POST to `/api/project/${project.id}/submit` with `{ loadin_text: selectedTitle }`
  2. On success, navigate to `/project/${project.id}/read` using `useRouter`

---

## Part F — Reading view page

Create `src/app/project/[id]/read/page.tsx` (server component):
- Fetches the project using `getProject(id)`
- Passes to a client component `ReadView`

Create `src/components/ReadView.tsx` (client component):

This is a clean, full-page reading experience. No pipeline chrome. Layout:

```
[Top bar: chosen_title (large), genre badge, word count]
[Back link: ← Back to project]
[Main content area: manuscript text, full width, max-width ~680px centred]
  - Each chapter separated by a horizontal rule and "Chapter N" heading
  - Typography: readable serif-style if available, or font-mono as fallback, text-zinc-100
  - Generous line height and padding
```

The manuscript is assembled from `project.chapters` — iterate `project.chapters`, rendering `chapter.sharp || chapter.draft || ''` for each. Use `project.chosen_title` as the display title (fall back to `project.config.title` if not set).

Do NOT use `project.manuscript` (the assembled string) — render chapter by chapter so chapter headings can be added cleanly.

---

## Styling notes

- The TitlePicker and ReadView should feel like the same app — dark background (`bg-zinc-950`), zinc text scale, amber accents
- The ReadView should feel noticeably quieter than the pipeline — no borders on the text body, no panels, just the prose and whitespace
- The "Back to project" link in ReadView should use `router.back()` or link to `/project/${id}`

---

## Files to create or modify

| File | Action |
|---|---|
| `src/types/project.ts` | Add `closer_output` and `chosen_title` fields |
| `src/app/api/project/[id]/submit/route.ts` | Handle stage 7 and stage 8 |
| `src/lib/parseTitles.ts` | New utility |
| `src/components/TitlePicker.tsx` | New component |
| `src/app/project/[id]/PipelineClient.tsx` | Add stage 8 branch |
| `src/app/project/[id]/read/page.tsx` | New page |
| `src/components/ReadView.tsx` | New component |

## Do not change

- `promptGenerator.ts` — not in scope for this prompt
- `StageList.tsx` — the Assembler and Closer stage markers can remain as-is; they will show as completed once stage 8 is reached
- Any existing API routes other than submit
