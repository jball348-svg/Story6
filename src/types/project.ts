export type LengthTarget = 'short_story' | 'story' | 'novella' | 'novella_plus' | 'custom';

export type ProjectConfig = {
    title: string;
    genre: string;                    // free string — custom genre supported
    logline: string;
    tone: string;
    length_target: LengthTarget;
    length_target_custom?: string;    // only set when length_target === 'custom', e.g. "15000 words"
};

export type ChapterStatus = 'not_started' | 'draft' | 'sharp' | 'complete';

export type Chapter = {
    number: number;
    draft: string | null;
    sharp: string | null;
    reader: string | null;
    status: ChapterStatus;
};

export type Project = {
    id: string;
    created_at: string;
    config: ProjectConfig;
    current_stage: number;
    current_chapter: number | null;
    foundation: string | null;
    outline: string | null;
    chapters: Chapter[];
    manuscript?: string;
    closer_output?: string;
    chosen_title?: string;
};
