
import { Admin, Project, ProjectType } from './types';

export const ADMIN_CREDENTIALS = [
  { username: 'Silverhold', password: 'Rian' },
  { username: 'BraynOfficial', password: 'Plerr321' }
];

export const INITIAL_ADMINS: Admin[] = [
  {
    id: 'admin-1',
    username: 'Silverhold',
    name: 'SilverHold Official',
    role: 'Admin',
    quote: "Jangan lupa sholat walaupun kamu seorang pendosa, Allah lebih suka orang pendosa yang sering bertaubat daripada orang yang merasa suci",
    hashtags: ['#bismillahcalonustad'],
    photoUrl: 'https://picsum.photos/seed/silver/400/400',
    isOnline: true
  },
  {
    id: 'owner-1',
    username: 'BraynOfficial',
    name: 'Brayn Official',
    role: 'Owner',
    quote: "Tidak Semua Orang Suka Kita Berkembang Pesat!",
    hashtags: ['#backenddev', '#frontenddev', '#BraynOfficial'],
    photoUrl: 'https://picsum.photos/seed/brayn/400/400',
    isOnline: true
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Cyberpunk Portfolio Template',
    language: 'React / Tailwind',
    type: ProjectType.CODE,
    content: "export const CyberApp = () => { return <div className='bg-black text-red-600'>Hello CyberWorld</div> }",
    notes: 'Premium minimalist portfolio for creative developers.',
    previewUrl: 'https://picsum.photos/seed/tech1/800/450',
    likes: 124,
    downloads: 56,
    authorId: 'owner-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'System Monitor Dashboard',
    language: 'Python',
    type: ProjectType.FILE,
    content: 'https://example.com/files/system_monitor.zip',
    notes: 'A robust system monitoring tool with real-time analytics.',
    previewUrl: 'https://picsum.photos/seed/tech2/800/450',
    likes: 89,
    downloads: 210,
    authorId: 'admin-1',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Connection Configs (Provided by User)
export const DB_CONFIG = {
  mongodb: 'mongodb+srv://braynofficial66_db_user:Oh2ivMc2GGP0SbJF@cluster0.zi2ra3a.mongodb.net/website_db'
};

export const CLOUDINARY_CONFIG = {
  cloud_name: 'dnb0q2s2h',
  api_key: '838368993294916',
  api_secret: 'N9U1eFJGKjJ-A8Eo4BTtSCl720c'
};
