import { NextResponse } from 'next/server';
import { getProject, saveProject } from '@/lib/projectStore';
import { LengthTarget } from '@/types/project';

/**
 * Extracts the REVISED CHAPTER section from a Stage 4 (Sharpener) response.
 */
function extractRevisedChapter(loadin_text: string): string {
    const marker = /REVISED CHAPTER/i;
    const idx = loadin_text.search(marker);
    if (idx === -1) return loadin_text.trim();
    const afterMarker = loadin_text.slice(idx);
    const newlineIdx = afterMarker.indexOf('\n');
    return afterMarker.slice(newlineIdx).trim();
}

/**
 * Count chapters from outline text.
 * Handles common Claude formatting variants:
 *   "Chapter 1", "Chapter 1:", "**Chapter 1**", "## Chapter 1", "### Chapter 2 — Title"
 * Deduplicates by number so repeated mentions don't inflate the count.
 */
function countChaptersInOutline(outline: string): number {
    // Match "Chapter" followed by a number, ignoring markdown formatting around it
    const matches = outline.match(/(?:^|\s|#|\*+)chapter\s+(\d+)/gi);
    if (!matches || matches.length === 0) return 0;

    // Extract the numbers and deduplicate — Claude sometimes mentions Chapter N twice
    const numbers = new Set(
        matches.map(m => {
            const num = m.match(/\d+/);
            return num ? parseInt(num[0], 10) : 0;
        }).filter(n => n > 0)
    );
    return numbers.size;
}

/**
 * Fallback chapter count by length_target when outline parsing fails.
 */
function defaultChapterCount(length_target: LengthTarget): number {
    switch (length_target) {
        case 'short_story':  return 4;
        case 'story':        return 6;
        case 'novella':      return 8;
        case 'novella_plus': return 14;
        case 'custom':       return 8;
        default:             return 8;
    }
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

            const parsed = countChaptersInOutline(loadin_text);
            const chapterCount = parsed > 0
                ? parsed
                : defaultChapterCount(project.config.length_target);

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
                project.chapters[idx].sharp = extractRevisedChapter(loadin_text);
                project.chapters[idx].status = 'sharp';
                project.current_stage = 5;
            }

        } else if (current_stage === 5) {
            if (current_chapter !== null && current_chapter > 0 && current_chapter <= project.chapters.length) {
                const idx = current_chapter - 1;
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
