import fs from 'fs/promises';
import path from 'path';
import { Project, ProjectConfig } from '@/types/project';
import { randomUUID } from 'crypto';

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

async function ensureProjectsDir() {
    try {
        await fs.mkdir(PROJECTS_DIR, { recursive: true });
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw err;
        }
    }
}

export async function getProject(id: string): Promise<Project> {
    const filePath = path.join(PROJECTS_DIR, id, 'project.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as Project;
    } catch {
        throw new Error(`Project ${id} not found`);
    }
}

export async function saveProject(project: Project): Promise<void> {
    await ensureProjectsDir();
    const projectDir = path.join(PROJECTS_DIR, project.id);
    try {
        await fs.mkdir(projectDir, { recursive: true });
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw err;
        }
    }
    const filePath = path.join(projectDir, 'project.json');
    await fs.writeFile(filePath, JSON.stringify(project, null, 2), 'utf-8');
}

export async function createProject(config: ProjectConfig): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
        id,
        created_at: new Date().toISOString(),
        config,
        current_stage: 1,
        current_chapter: null,
        foundation: null,
        outline: null,
        chapters: [],
    };
    await saveProject(project);
    return project;
}
