import { NextResponse } from 'next/server';
import { getProject, saveProject } from '@/lib/projectStore';

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
            let chapterCount = 10;

            // Attempt to parse "Chapter X" or similar, just do a very basic count check
            // E.g., if there's "Chapter 1", "Chapter 2", maybe count occurrences, or just a match
            // For Phase 1, the prompt says "Parse chapter count from outline length or default to 10."
            // Let's just default to 10 for simplicity or count "Chapter" occurrences.
            const chapterMatches = loadin_text.match(/chapter \d+/gi);
            if (chapterMatches && chapterMatches.length > 0) {
                chapterCount = chapterMatches.length;
            }

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
                project.chapters[idx].sharp = loadin_text;
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

        if (project.current_stage === 6) {
            // Auto-advance
            project.current_stage = 7;
        }

        await saveProject(project);

        return NextResponse.json(project);
    } catch (error) {
        console.error('Submit error:', error);
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }
}
