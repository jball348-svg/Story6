import { NextResponse } from 'next/server';
import { getProject, saveProject } from '@/lib/projectStore';

/**
 * Extracts the REVISED CHAPTER section from a Stage 4 (Sharpener) response.
 * The Sharpener prompt asks Claude to respond in the format:
 *   DIAGNOSIS
 *   [weak moments]
 *
 *   REVISED CHAPTER
 *   [full chapter prose]
 *
 * We only want the prose after "REVISED CHAPTER" stored in chapter.sharp.
 */
function extractRevisedChapter(loadin_text: string): string {
    const marker = /REVISED CHAPTER/i;
    const idx = loadin_text.search(marker);
    if (idx === -1) {
        // Claude didn't use the expected format — store the whole thing as fallback
        return loadin_text.trim();
    }
    // Skip past the marker line itself
    const afterMarker = loadin_text.slice(idx);
    const newlineIdx = afterMarker.indexOf('\n');
    return afterMarker.slice(newlineIdx).trim();
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const loadin_text = body.loadin_text || '';

        const project = await getProject(id);
        const { current_stage, current_chapter } = project;

        if (current_stage === 1) {
            project.foundation = loadin_text;
            project.current_stage = 2;

        } else if (current_stage === 2) {
            project.outline = loadin_text;

            // Count chapters from outline — look for "Chapter N" occurrences
            const chapterMatches = loadin_text.match(/chapter \d+/gi);
            const chapterCount = (chapterMatches && chapterMatches.length > 0)
                ? chapterMatches.length
                : 10;

            project.chapters = Array.from({ length: chapterCount }).map((_, i) => ({
                number: i + 1,
                draft: null,
                sharp: null,
                reader: null,
                status: 'not_started',
            }));
            project.current_stage = 3;
            project.current_chapter = 1;

        } else if (current_stage === 3) {
            if (current_chapter !== null && current_chapter > 0 && current_chapter <= project.chapters.length) {
                const idx = current_chapter - 1;
                project.chapters[idx].draft = loadin_text;
                project.chapters[idx].status = 'draft';
                project.current_stage = 4;
            }

        } else if (current_stage === 4) {
            if (current_chapter !== null && current_chapter > 0 && current_chapter <= project.chapters.length) {
                const idx = current_chapter - 1;
                // BUG FIX: extract only the REVISED CHAPTER section, not the full DIAGNOSIS + REVISED CHAPTER response
                project.chapters[idx].sharp = extractRevisedChapter(loadin_text);
                project.chapters[idx].status = 'sharp';
                project.current_stage = 5;
            }

        } else if (current_stage === 5) {
            if (current_chapter !== null && current_chapter > 0 && current_chapter <= project.chapters.length) {
                const idx = current_chapter - 1;
                // Save reader response — it will be injected into the next chapter's Writer prompt
                if (loadin_text.trim()) {
                    project.chapters[idx].reader = loadin_text;
                }
                project.chapters[idx].status = 'complete';

                if (current_chapter < project.chapters.length) {
                    project.current_stage = 3;
                    project.current_chapter = current_chapter + 1;
                } else {
                    project.current_stage = 6;
                    project.current_chapter = null;
                }
            }
        }

        // Stage 6: Assembler — auto-advance, build manuscript string
        if (project.current_stage === 6) {
            project.manuscript = project.chapters
                .map(c => `Chapter ${c.number}\n\n${c.sharp || c.draft || ''}`)
                .join('\n\n---\n\n');
            project.current_stage = 7;
        }

        await saveProject(project);
        return NextResponse.json(project);

    } catch (error) {
        console.error('Submit error:', error);
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }
}
