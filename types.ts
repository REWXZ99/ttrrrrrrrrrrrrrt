
export enum ProjectType {
  CODE = 'CODE',
  FILE = 'FILE'
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Owner';
  quote: string;
  hashtags: string[];
  photoUrl: string;
  password?: string;
  isOnline: boolean;
}

export interface Project {
  id: string;
  name: string;
  language: string;
  type: ProjectType;
  content: string;
  notes?: string;
  previewUrl: string;
  likes: number;
  downloads: number;
  authorId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}
