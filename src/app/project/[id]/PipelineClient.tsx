'use client';

import { useState } from 'react';
import { Project } from '@/types/project';
import TopBar from '@/components/TopBar';
import StageList from '@/components/StageList';
import LoadoutPanel from '@/components/LoadoutPanel';
import LoadinPanel from '@/components/LoadinPanel';
import ManuscriptViewer from '@/components/ManuscriptViewer';

export default function PipelineClient({ initialProject }: { initialProject: Project }) {
    const [project, setProject] = useState<Project>(initialProject);

    async function handleLoadinSubmit(text: string): Promise<boolean> {
        try {
            const res = await fetch(`/api/project/${project.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loadin_text: text }),
            });
            if (res.ok) {
                const updatedProject = await res.json();
                setProject(updatedProject);
                return true;
            } else {
                console.error('Submit failed', await res.text());
                alert('Submit failed. Please try again or check the console for details.');
                return false;
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('A network error occurred. Please try again.');
            return false;
        }
    }

    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-zinc-50 font-mono">
            <TopBar project={project} />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/5 border-r border-zinc-800 overflow-y-auto">
                    <StageList current_stage={project.current_stage} current_chapter={project.current_chapter} chapters={project.chapters} />
                </div>
                <div className="flex-1 flex flex-col border-r border-zinc-800">
                    <div className="flex-1 border-b border-zinc-800 overflow-y-auto">
                        <LoadoutPanel project={project} />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <LoadinPanel current_stage={project.current_stage} onSubmit={handleLoadinSubmit} />
                    </div>
                </div>
                <div className="w-[30%] overflow-y-auto">
                    <ManuscriptViewer chapters={project.chapters} />
                </div>
            </div>
        </div>
    );
}
