# Phase 1 — Research

## Reference Codebase: StoryV4

StoryV4 (jball348-svg/StoryV4) is the primary reference. It is a Next.js App Router project with the same conveyor mechanic we're building. Key files to reference:

- `src/hooks/useConveyor.ts` — the loadout/loadin state hook
- `src/app/story/[id]/StoryClient.tsx` — the main pipeline UI component
- `src/app/api/story/[id]/submit/route.ts` — the submit handler (stage advancement logic)
- `prisma/schema.prisma` — V4's data model (we're replacing this with flat JSON)

**What to reuse from V4**: The three-panel layout concept, the conveyor hook pattern, the API route structure.

**What to discard**: Prisma/SQLite, the complex step numbering system (floats like 1.2, 1.5), the `bible`/`beatSheet` client-side state that was never used by the server.

## Next.js Filesystem State Pattern

Since we're using flat JSON instead of a DB:
- `fs.readFileSync` / `fs.writeFileSync` in API routes (server-side only)
- Projects stored at: `projects/{id}/project.json` relative to project root
- This directory should be `.gitignored`
- API routes: `GET /api/project/[id]`, `POST /api/project/[id]/submit`, `POST /api/project/create`

## Tailwind Three-Panel Layout

Standard approach:
```
<div className="flex h-screen">
  <aside className="w-1/5">...</aside>       {/* Stage list */}
  <main className="flex-1 flex flex-col">   {/* Loadout + Loadin */}
    <div className="flex-1">Loadout</div>
    <div className="flex-1">Loadin</div>
  </main>
  <aside className="w-1/3">...</aside>       {/* Manuscript */}
</div>
```

## UUID Generation

Use `crypto.randomUUID()` — available natively in Node 18+ and in the browser. No package needed.
