
import { Project, Admin, ChatMessage } from '../types';
import { INITIAL_PROJECTS, INITIAL_ADMINS } from '../constants';

const STORAGE_KEYS = {
  PROJECTS: 'sch_projects',
  ADMINS: 'sch_admins',
  CHATS: 'sch_chats'
};

export const storageService = {
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(data);
  },

  saveProject: (project: Project) => {
    const projects = storageService.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex > -1) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  deleteProject: (id: string) => {
    const projects = storageService.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
  },

  getProjectById: (id: string): Project | undefined => {
    return storageService.getProjects().find(p => p.id === id);
  },

  getAdmins: (): Admin[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    return JSON.parse(data);
  },

  updateAdmin: (admin: Admin) => {
    const admins = storageService.getAdmins();
    const idx = admins.findIndex(a => a.id === admin.id);
    if (idx > -1) {
      admins[idx] = admin;
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    }
  },

  getChats: (): ChatMessage[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  },

  addChat: (msg: ChatMessage) => {
    const chats = storageService.getChats();
    chats.push(msg);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  incrementLike: (id: string) => {
    const projects = storageService.getProjects();
    const p = projects.find(proj => proj.id === id);
    if (p) {
      p.likes += 1;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
  },

  incrementDownload: (id: string) => {
    const projects = storageService.getProjects();
    const p = projects.find(proj => proj.id === id);
    if (p) {
      p.downloads += 1;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
  }
};
