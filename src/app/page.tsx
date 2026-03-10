import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 font-mono">
      <h1 className="text-6xl font-bold mb-8">Story6</h1>
      <Link
        href="/new"
        className="px-6 py-3 border border-zinc-50 hover:bg-zinc-50 hover:text-zinc-950 transition-colors uppercase tracking-widest text-sm"
      >
        New Project
      </Link>
    </main>
  );
}
