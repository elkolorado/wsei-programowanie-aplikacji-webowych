import type { Project } from '../models/Project';

const LOCAL_STORAGE_NAME = 'manage-me-data';

export const ProjectService = class {
    static getAllProjects(): Project[] {
        if (typeof window === 'undefined') return []; // Ensure this runs only in the browser
        const projects = localStorage.getItem(LOCAL_STORAGE_NAME);
        return projects ? JSON.parse(projects) : [];
    }

    static getProjectById(id: string): Project | undefined {
        if (typeof window === 'undefined') return undefined;
        const projects = this.getAllProjects();
        return projects.find(project => project.id === id);
    }

    static addProject(project: Project): void {
        console.log('here')
        if (typeof window === 'undefined') return;
        const projects = this.getAllProjects();
        projects.push(project);
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(projects));
    }

    static updateProject(updatedProject: Project): void {
        if (typeof window === 'undefined') return;
        let projects = this.getAllProjects();
        projects = projects.map(project =>
            project.id === updatedProject.id ? updatedProject : project
        );
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(projects));
    }

    static deleteProject(id: string): void {
        if (typeof window === 'undefined') return;
        let projects = this.getAllProjects();
        projects = projects.filter(project => project.id !== id);
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(projects));
    }
};