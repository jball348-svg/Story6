import { NextResponse } from 'next/server';
import { createProject } from '@/lib/projectStore';
import { ProjectConfig } from '@/types/project';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const config: ProjectConfig = body.config;

        if (!config || !config.title || !config.genre || !config.logline) {
            return NextResponse.json({ error: 'Missing required configuration' }, { status: 400 });
        }

        const project = await createProject(config);
        return NextResponse.json({ id: project.id });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
