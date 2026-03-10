import { Project } from '@/types/project';

export default function TopBar({ project }: { project: Project }) {
    const wordCount = project.chapters
        .filter(c => c.status === 'sharp' || c.status === 'complete')
        .reduce((acc, c) => acc + (c.sharp ? c.sharp.trim().split(/\s+/).length : 0), 0);

    return (
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 bg-zinc-950">
            <div className="flex items-center gap-4">
                <h1 className="font-bold text-lg">{project.config.title}</h1>
                <span className="px-2 py-1 bg-zinc-800 text-xs uppercase tracking-wider text-zinc-300">
                    {project.config.genre}
                </span>
            </div>
            <div className="text-sm text-zinc-400">
                {wordCount.toLocaleString()} words
            </div>
        </div>
    );
}
