import { notFound } from 'next/navigation';
import { getProject } from '@/lib/projectStore';
import ReadView from '@/components/ReadView';

export default async function ReadPage({ params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const project = await getProject(id);
        return <ReadView project={project} />;
    } catch (e) {
        notFound();
    }
}
