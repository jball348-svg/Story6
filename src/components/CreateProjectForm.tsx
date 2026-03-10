'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProjectForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const config = {
            title: formData.get('title'),
            genre: formData.get('genre'),
            logline: formData.get('logline'),
            tone: formData.get('tone'),
            length_target: formData.get('length_target'),
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

            <div className="flex flex-col gap-2">
                <label htmlFor="genre" className="text-sm uppercase tracking-wider text-zinc-400">Genre</label>
                <select
                    id="genre"
                    name="genre"
                    required
                    className="bg-zinc-950 border border-zinc-700 p-3 focus:outline-none focus:border-zinc-300 transition-colors rounded-none appearance-none"
                >
                    <option value="Literary Fiction">Literary Fiction</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Custom">Custom</option>
                </select>
            </div>

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

            <div className="flex flex-col gap-3">
                <label className="text-sm uppercase tracking-wider text-zinc-400">Length Target</label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="length_target" value="short_story" defaultChecked className="accent-zinc-50" />
                        <span>Short Story (~10k)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="length_target" value="novella" className="accent-zinc-50" />
                        <span>Novella (~30k)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="length_target" value="novel" className="accent-zinc-50" />
                        <span>Novel (~80k)</span>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 px-6 py-4 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
                {loading ? 'Creating...' : 'Create Project'}
            </button>
        </form>
    );
}
