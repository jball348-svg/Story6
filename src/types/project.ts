export type ProjectConfig = {
    title: string;
    genre: string;
    logline: string;
    tone: string;
    length_target: 'short_story' | 'novella' | 'novel';
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
};
