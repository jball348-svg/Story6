'use client';

import { useState } from 'react';
import { Project } from '@/types/project';
import { parseTitles } from '@/lib/parseTitles';

export default function TitlePicker({ project, onTitleSelected }: { project: Project, onTitleSelected: (title: string) => void }) {
    const defaultTitles = parseTitles(project.closer_output || '');
    const titles = defaultTitles.length > 0 ? defaultTitles : [project.config.title];
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [customTitle, setCustomTitle] = useState<string>('');

    const isCustomSelected = selectedTitle === 'custom';
    const canConfirm = isCustomSelected ? customTitle.trim().length > 0 : selectedTitle.length > 0;

    const handleConfirm = () => {
        if (isCustomSelected) {
            onTitleSelected(customTitle.trim());
        } else {
            onTitleSelected(selectedTitle);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full p-8 bg-zinc-950 text-zinc-100 font-mono w-full">
            <h2 className="text-2xl font-bold mb-8 text-zinc-300 tracking-tight">Choose a title for your story</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
                {titles.map((title, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedTitle(title)}
                        className={`p-6 text-left border rounded-sm transition-colors duration-200 ${selectedTitle === title
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'
                            }`}
                    >
                        <div className="text-lg font-semibold">{title}</div>
                    </button>
                ))}
            </div>

            <div className="w-full max-w-4xl mb-12">
                <label className="flex flex-col space-y-2">
                    <span className="text-sm text-zinc-500 flex items-center mb-1">
                        <input
                            type="radio"
                            checked={isCustomSelected}
                            onChange={() => setSelectedTitle('custom')}
                            className="mr-2 accent-amber-500"
                        />
                        Or enter a custom title
                    </span>
                    <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => {
                            setCustomTitle(e.target.value);
                            setSelectedTitle('custom');
                        }}
                        onFocus={() => setSelectedTitle('custom')}
                        placeholder="Type your own title here..."
                        className="w-full p-4 bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                </label>
            </div>

            <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="px-8 py-4 bg-amber-600 text-zinc-50 font-bold text-lg rounded-sm hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Confirm Title
            </button>
        </div>
    );
}
