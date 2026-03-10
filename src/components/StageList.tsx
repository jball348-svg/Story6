import { Chapter } from '@/types/project';

const STAGES = [
    { id: 1, name: 'Architect', repeating: false },
    { id: 2, name: 'Cartographer', repeating: false },
    { id: 3, name: 'Writer', repeating: true },
    { id: 4, name: 'Sharpener', repeating: true },
    { id: 5, name: 'Reader', repeating: true },
    { id: 6, name: 'Assembler', repeating: false },
    { id: 7, name: 'Closer', repeating: false },
];

export default function StageList({
    current_stage,
    current_chapter,
    chapters
}: {
    current_stage: number;
    current_chapter: number | null;
    chapters: Chapter[];
}) {
    return (
        <div className="p-4 flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 px-2">Pipeline</h2>
            {STAGES.map(stage => {
                const isCompleted = current_stage > stage.id;
                const isCurrent = current_stage === stage.id;

                let statusClass = "text-zinc-600 border-transparent";
                let icon = "🔒";

                if (isCompleted) {
                    statusClass = "text-zinc-400 border-transparent";
                    icon = "✓";
                } else if (isCurrent) {
                    statusClass = "text-zinc-50 border-amber-500 bg-zinc-900";
                    icon = "▶";
                }

                const showChapter = stage.repeating && isCurrent && current_chapter !== null;

                return (
                    <div
                        key={stage.id}
                        className={`p-3 border-l-2 flex items-center gap-3 transition-colors ${statusClass}`}
                    >
                        <span className="text-xs w-4 text-center block">{icon}</span>
                        <span className="text-sm uppercase tracking-wider">{stage.name}</span>
                        {showChapter && (
                            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 ml-auto">
                                Ch {current_chapter} of {chapters.length || '?'}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
