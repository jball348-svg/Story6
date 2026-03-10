import { getProject } from '@/lib/projectStore';
import PipelineClient from './PipelineClient';

export default async function ProjectPage({
    params,
}: {
    params: { id: string };
}) {
    const project = await getProject(params.id);

    if (!project) {
        return <div>Project not found</div>;
    }

    return <PipelineClient initialProject={project} />;
}
