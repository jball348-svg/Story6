import { Chapter } from '@/types/project';

function wordCount(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ManuscriptViewer({ chapters }: { chapters: Chapter[] }) {
    const completedChapters = chapters.filter(c => c.status === 'sharp' || c.status === 'complete');

    if (completedChapters.length === 0) {
        return (
            <div className="p-6 h-full flex items-center justify-center text-zinc-600 text-center text-sm uppercase tracking-widest">
                Your manuscript will appear here<br />as chapters are completed.
            </div>
        );
    }

    const totalWords = completedChapters.reduce((acc, c) => acc + (c.sharp ? wordCount(c.sharp) : 0), 0);

    return (
        <div className="h-full flex flex-col bg-zinc-900 border-l border-zinc-800">
            <div className="p-4 border-b border-zinc-800 shrink-0">
                <h2 className="text-xs uppercase tracking-widest text-zinc-400">Manuscript</h2>
                <div className="text-sm font-bold mt-1 text-zinc-50">{totalWords.toLocaleString()} words assembled</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {completedChapters.map(c => (
                    <div key={c.number} className="prose prose-invert prose-zinc max-w-none">
                        <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">
                            --- Chapter {c.number} ---
                        </h3>
                        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-300 font-sans">
                            {c.sharp}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
