'use client';

import { Project } from '@/types/project';
import Link from 'next/link';
import { useMemo } from 'react';

export default function ReadView({ project }: { project: Project }) {
    const title = project.chosen_title || project.config.title;

    // Calculate word count
    const wordCount = useMemo(() => {
        let text = '';
        project.chapters.forEach(c => {
            text += (c.sharp || c.draft || '') + ' ';
        });
        return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }, [project.chapters]);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/project/${project.id}`}
                            className="text-zinc-500 hover:text-amber-500 transition-colors flex items-center text-sm"
                        >
                            <span className="mr-1">←</span> Back to project
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <span className="px-2 py-1 bg-zinc-900 text-zinc-400 rounded-sm uppercase tracking-wider text-xs border border-zinc-800">
                            {project.config.genre}
                        </span>
                        <span className="text-zinc-500">
                            {wordCount.toLocaleString()} words
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-[680px] mx-auto px-6 py-16 pb-32">
                <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center text-zinc-100 leading-tight tracking-tight px-4 font-serif" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                    {title}
                </h1>

                <div className="space-y-16">
                    {project.chapters.map((chapter) => {
                        const content = chapter.sharp || chapter.draft || '';
                        if (!content.trim()) return null;

                        return (
                            <article key={chapter.number} className="prose prose-invert prose-zinc max-w-none">
                                <h2 className="text-xl font-bold text-zinc-500 mb-8 tracking-widest uppercase text-center font-mono transition-opacity opacity-50 hover:opacity-100">
                                    Chapter {chapter.number}
                                </h2>
                                <div
                                    className="text-lg leading-relaxed text-zinc-300 font-serif space-y-6"
                                    style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    {content.split('\n\n').map((para, i) => {
                                        if (!para.trim()) return null;
                                        return <p key={i} className="mb-6">{para}</p>;
                                    })}
                                </div>
                                {chapter.number < project.chapters.length && (
                                    <hr className="my-16 border-zinc-800 w-1/4 mx-auto" />
                                )}
                            </article>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
