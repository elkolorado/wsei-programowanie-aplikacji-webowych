// import type { Project } from '../models/Project';

import type { Project } from '../models/Project';

const LOCAL_STORAGE_NAME = 'manage-me-data';

export const ProjectService = class {
    static getAllProjects(): Project[] {
        const projects = localStorage.getItem(LOCAL_STORAGE_NAME);
        return projects ? JSON.parse(projects) : [];
    }

    static getProjectById(id: string): Project | undefined {
        const projects = this.getAllProjects();
        return projects.find(project => project.id === id);
    }

    static addProject(project: Project): void {
        const projects = this.getAllProjects();
        projects.push(project);
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(projects));
    }

    static updateProject(updatedProject: Project): void {
        let projects = this.getAllProjects();
        projects = projects.map(project =>
            project.id === updatedProject.id ? updatedProject : project
        );
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(projects));
    }

    static deleteProject(id: string): void {
        let projects = this.getAllProjects();
        projects = projects.filter(project => project.id !== id);
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(projects));
    }
}