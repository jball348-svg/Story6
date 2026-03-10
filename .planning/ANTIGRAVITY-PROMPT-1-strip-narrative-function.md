# Antigravity Prompt 1 — Strip Narrative Function from Writer Chapter Injection

## What and why

The Stage 3 (Writer) prompt injects the current chapter section from the outline. That section currently includes a "Narrative function" line (e.g. "Narrative function: establishes false safety"). This tells the Writer what the chapter is *supposed to mean* before it has been written, which produces illustrative prose rather than discovered prose. We want the Writer to receive the beats but not the meta-analysis.

## File to change

`src/lib/promptGenerator.ts`

## Exact change required

In the `stage3Prompt` function, after `chapterSection` is extracted from the outline, add a step that strips any line beginning with "Narrative function" (case-insensitive) before the section is injected into the prompt.

Add a small pure function above `stage3Prompt`:

```ts
function stripNarrativeFunction(text: string): string {
    return text
        .split('\n')
        .filter(line => !/^\s*narrative function/i.test(line))
        .join('\n')
        .trim();
}
```

Then in `stage3Prompt`, change the line:
```ts
chapterSection = nextIdx !== -1
    ? remaining.slice(0, nextIdx).trim()
    : remaining.trim();
```
to:
```ts
chapterSection = nextIdx !== -1
    ? stripNarrativeFunction(remaining.slice(0, nextIdx))
    : stripNarrativeFunction(remaining);
```

And the fallback:
```ts
chapterSection = `(Could not extract Chapter ${current_chapter} section from outline)`;
```
remains unchanged.

## What NOT to change

- Do not remove "Narrative function" from the Cartographer (Stage 2) prompt. It is still useful for structuring the outline — we just don't want it in what the Writer sees.
- Do not change any other prompt or any other file.
- Do not remove any other fields from the chapter section (Emotional arc, What the reader learns, What the reader does NOT learn — all stay in).

## Test

Run the dev server. Create a project, complete Stages 1 and 2 with real output, then generate the Stage 3 loadout. Inspect the prompt in the LoadoutPanel and confirm there is no "Narrative function" line in the YOUR CHAPTER section.
