
import { Project, Admin, ChatMessage } from '../types';
import { INITIAL_PROJECTS, INITIAL_ADMINS } from '../constants';

// Shared Global Storage (npoint allows anonymous JSON storage)
// Note: In a real production app, this would be a secure backend API.
const SHARED_DB_URL = 'https://api.npoint.io/9e67d30777558667c295'; 

const STORAGE_KEYS = {
  PROJECTS: 'sch_projects',
  ADMINS: 'sch_admins',
  CHATS: 'sch_chats'
};

export const storageService = {
  // Fetch data dari Shared DB
  syncFromCloud: async (): Promise<Project[]> => {
    try {
      const res = await fetch(SHARED_DB_URL);
      if (!res.ok) {
        console.warn("Cloud data not initialized or unreachable. Using local data.");
        return storageService.getProjects();
      }
      const data = await res.json();
      
      // If data is empty or malformed, fallback to local
      if (data && Array.isArray(data.projects)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
        return data.projects;
      }
      return storageService.getProjects();
    } catch (e) {
      console.error("Cloud Sync Error:", e);
      return storageService.getProjects();
    }
  },

  // Push data ke Shared DB (Hanya Admin)
  syncToCloud: async (projects: Project[]) => {
    try {
      // We use a PUT request to update the existing bin or create it if supported
      const response = await fetch(SHARED_DB_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projects })
      });
      
      if (!response.ok) {
        console.error("Failed to push to cloud storage:", response.statusText);
      }
    } catch (e) {
      console.error("Cloud Push Error:", e);
    }
  },

  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  },

  saveProject: async (project: Project) => {
    const projects = storageService.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex > -1) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    // Push ke Cloud agar publik
    await storageService.syncToCloud(projects);
  },

  deleteProject: async (id: string) => {
    const projects = storageService.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    await storageService.syncToCloud(filtered);
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
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_ADMINS;
    }
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
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addChat: (msg: ChatMessage) => {
    const chats = storageService.getChats();
    chats.push(msg);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  incrementLike: async (id: string) => {
    const projects = storageService.getProjects();
    const p = projects.find(proj => proj.id === id);
    if (p) {
      p.likes += 1;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      await storageService.syncToCloud(projects);
    }
  },

  incrementDownload: async (id: string) => {
    const projects = storageService.getProjects();
    const p = projects.find(proj => proj.id === id);
    if (p) {
      p.downloads += 1;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      await storageService.syncToCloud(projects);
    }
  }
};
