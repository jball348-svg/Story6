import { useState } from 'react';
import { Project } from '@/types/project';
import { generateLoadout } from '@/lib/promptGenerator';

const STAGES: Record<number, string> = {
    1: 'Architect',
    2: 'Cartographer',
    3: 'Writer',
    4: 'Sharpener',
    5: 'Reader',
    6: 'Assembler',
    7: 'Closer',
};

export default function LoadoutPanel({ project }: { project: Project }) {
    const [copied, setCopied] = useState(false);
    const stageName = STAGES[project.current_stage] || 'Unknown';
    const loadoutText = generateLoadout(project.current_stage, project);

    function handleCopy() {
        navigator.clipboard.writeText(loadoutText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-sm uppercase tracking-widest text-zinc-400">Loadout: <span className="text-zinc-50">{stageName}</span></h2>
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 transition-colors text-xs uppercase tracking-wider"
                >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
            </div>
            <textarea
                readOnly
                value={loadoutText}
                className="flex-1 bg-transparent border border-zinc-800 p-4 focus:outline-none focus:border-zinc-500 transition-colors resize-none font-mono text-zinc-300"
            />
        </div>
    );
}
