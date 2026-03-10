import { NextResponse } from 'next/server';
import { getProject } from '@/lib/projectStore';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const project = await getProject(params.id);
        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
}
