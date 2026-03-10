import CreateProjectForm from '@/components/CreateProjectForm';

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 font-mono p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl mb-8 border-b border-zinc-800 pb-4">Start New Project</h1>
                <CreateProjectForm />
            </div>
        </main>
    );
}
