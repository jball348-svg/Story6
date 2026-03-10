'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LengthTarget } from '@/types/project';

const LENGTH_OPTIONS: { value: LengthTarget; label: string; sub: string }[] = [
    { value: 'short_story', label: 'Short Story', sub: '~5k words' },
    { value: 'story',       label: 'Story',       sub: '~7k words' },
    { value: 'novella',     label: 'Novella',     sub: '~10k words' },
    { value: 'novella_plus',label: 'Novella+',    sub: '~20k words' },
    { value: 'custom',      label: 'Custom',      sub: 'you decide' },
];

const GENRE_PRESETS = [
    'Literary Fiction',
    'Thriller',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Fantasy',
    'Mystery',
    'Historical Fiction',
    'Custom',
];

export default function CreateProjectForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState('Literary Fiction');
    const [customGenre, setCustomGenre] = useState('');
    const [lengthTarget, setLengthTarget] = useState<LengthTarget>('short_story');
    const [customLength, setCustomLength] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const resolvedGenre = genre === 'Custom' ? customGenre.trim() : genre;

        const config = {
            title: formData.get('title') as string,
            genre: resolvedGenre || 'Custom',
            logline: formData.get('logline') as string,
            tone: formData.get('tone') as string,
            length_target: lengthTarget,
            ...(lengthTarget === 'custom' && { length_target_custom: customLength.trim() }),
        };

        try {
            const res = await fetch('/api/project/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config }),
            });
            const data = await res.json();
            if (data.id) {
                router.push(`/project/${data.id}`);
            } else {
                console.error('Failed to create project:', data);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Title */}
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm uppercase tracking-wider text-zinc-400">Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="bg-transparent border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none"
                />
            </div>

            {/* Genre */}
            <div className="flex flex-col gap-2">
                <label htmlFor="genre" className="text-sm uppercase tracking-wider text-zinc-400">Genre</label>
                <select
                    id="genre"
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none appearance-none"
                >
                    {GENRE_PRESETS.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
                {genre === 'Custom' && (
                    <input
                        type="text"
                        required
                        placeholder="Enter your genre..."
                        value={customGenre}
                        onChange={e => setCustomGenre(e.target.value)}
                        className="bg-transparent border border-zinc-700 border-t-0 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none"
                    />
                )}
            </div>

            {/* Logline */}
            <div className="flex flex-col gap-2">
                <label htmlFor="logline" className="text-sm uppercase tracking-wider text-zinc-400">Logline</label>
                <textarea
                    id="logline"
                    name="logline"
                    required
                    rows={4}
                    placeholder="Who is the protagonist, what do they want, what's in the way?"
                    className="bg-transparent border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none resize-none"
                />
            </div>

            {/* Tone */}
            <div className="flex flex-col gap-2">
                <label htmlFor="tone" className="text-sm uppercase tracking-wider text-zinc-400">Tone</label>
                <input
                    id="tone"
                    name="tone"
                    type="text"
                    placeholder="e.g. bleak, darkly comic, warm, tense"
                    className="bg-transparent border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none"
                />
            </div>

            {/* Length Target */}
            <div className="flex flex-col gap-3">
                <label className="text-sm uppercase tracking-wider text-zinc-400">Length Target</label>
                <div className="flex flex-col gap-2">
                    {LENGTH_OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="length_target"
                                value={opt.value}
                                checked={lengthTarget === opt.value}
                                onChange={() => setLengthTarget(opt.value)}
                                className="accent-amber-500"
                            />
                            <span className="text-zinc-200">{opt.label}</span>
                            <span className="text-zinc-500 text-sm">{opt.sub}</span>
                        </label>
                    ))}
                </div>
                {lengthTarget === 'custom' && (
                    <input
                        type="text"
                        required
                        placeholder="e.g. 12000 words, or 8 chapters"
                        value={customLength}
                        onChange={e => setCustomLength(e.target.value)}
                        className="bg-transparent border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none mt-1"
                    />
                )}
            </div>

            <button
                type="submit"
                disabled={loading || (genre === 'Custom' && !customGenre.trim()) || (lengthTarget === 'custom' && !customLength.trim())}
                className="mt-4 px-6 py-4 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
                {loading ? 'Creating...' : 'Create Project'}
            </button>
        </form>
    );
}
