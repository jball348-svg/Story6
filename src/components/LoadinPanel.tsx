import { useState } from 'react';

export default function LoadinPanel({
    current_stage,
    onSubmit,
}: {
    current_stage: number;
    onSubmit: (text: string) => void;
}) {
    const [text, setText] = useState('');

    function handleSubmit() {
        if (!text.trim() && current_stage !== 5) return;
        onSubmit(text);
        setText('');
    }

    function handleSkip() {
        onSubmit('');
        setText('');
    }

    return (
        <div className="flex flex-col h-full p-6">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-4">Loadin</h2>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste Claude's output here..."
                className="flex-1 bg-transparent border border-zinc-800 p-4 focus:outline-none focus:border-zinc-500 transition-colors resize-none font-mono text-zinc-300 mb-4"
            />
            <div className="flex gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={!text.trim() && current_stage !== 5}
                    className="flex-1 px-4 py-3 bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors text-sm uppercase tracking-widest font-bold"
                >
                    Submit
                </button>
                {current_stage === 5 && (
                    <button
                        onClick={handleSkip}
                        className="px-6 py-3 border border-zinc-700 hover:bg-zinc-800 transition-colors text-sm uppercase tracking-widest"
                    >
                        Skip (Reader only)
                    </button>
                )}
            </div>
        </div>
    );
}
