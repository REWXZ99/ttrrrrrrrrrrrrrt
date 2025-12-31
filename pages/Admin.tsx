
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Project, ProjectType, Admin as AdminType } from '../types';
import { ADMIN_CREDENTIALS } from '../constants';
import { Lock, Plus, Trash2, Edit, LogOut, Code, File as FileIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminType | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  
  // Dashboard states
  const [view, setView] = useState<'LIST' | 'CREATE' | 'PROFILE'>('LIST');
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    language: '',
    type: ProjectType.CODE,
    content: '',
    notes: '',
    previewUrl: 'https://picsum.photos/seed/new/800/450'
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setProjects(storageService.getProjects().filter(p => p.authorId === currentUser.id));
    }
  }, [isLoggedIn, currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = ADMIN_CREDENTIALS.find(c => c.username === loginForm.username && c.password === loginForm.password);
    if (creds) {
      const admin = storageService.getAdmins().find(a => a.username === creds.username);
      if (admin) {
        setIsLoggedIn(true);
        setCurrentUser(admin);
        setError('');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Hapus proyek ini?')) {
      storageService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const project: Project = {
      ...newProject as Project,
      id: Date.now().toString(),
      authorId: currentUser.id,
      likes: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    storageService.saveProject(project);
    setProjects(prev => [project, ...prev]);
    setView('LIST');
    setNewProject({
      name: '',
      language: '',
      type: ProjectType.CODE,
      content: '',
      notes: '',
      previewUrl: 'https://picsum.photos/seed/new/800/450'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div className="w-full max-w-md glass-card rounded-[2.5rem] p-10 border border-zinc-900 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 blur-[100px]" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-[2rem] bg-red-600 flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(255,0,0,0.4)]">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">ADMIN <span className="text-red-600">ACCESS</span></h1>
            <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Username</label>
              <input 
                type="text" 
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 focus:outline-none focus:border-red-600 transition-all"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 focus:outline-none focus:border-red-600 transition-all"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            {error && <p className="text-red-500 text-center text-xs font-bold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-xl active:scale-95">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold">DASHBOARD</h1>
          <p className="text-zinc-500">Welcome back, <span className="text-red-500 font-bold">{currentUser?.name}</span></p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('LIST')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${view === 'LIST' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
          >
            My Projects
          </button>
          <button 
            onClick={() => setView('PROFILE')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${view === 'PROFILE' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
          >
            Edit Profile
          </button>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-red-500 border border-zinc-800 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {view === 'LIST' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Code className="text-red-600" size={20} /> YOUR PROJECTS
            </h2>
            <button 
              onClick={() => setView('CREATE')}
              className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-zinc-200 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> NEW PROJECT
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.map(p => (
              <div key={p.id} className="glass-card p-6 rounded-[2.5rem] border border-zinc-900 flex justify-between items-center group">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-red-500 transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    <span>{p.language}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">{p.type === ProjectType.CODE ? <Code size={12}/> : <FileIcon size={12}/>} {p.type}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-3 bg-zinc-900 rounded-full text-zinc-500 hover:text-red-600 border border-zinc-800 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-20 glass-card rounded-[2.5rem] border border-zinc-900">
                <p className="text-zinc-500">Belum ada proyek. Ayo buat satu!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'CREATE' && (
        <div className="max-w-3xl mx-auto">
           <div className="glass-card rounded-[2.5rem] p-10 border border-zinc-900 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Upload className="text-red-600" /> UNGGAH PROYEK BARU
              </h2>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Nama Proyek</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 focus:outline-none focus:border-red-600 transition-all"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Bahasa Pemrograman</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. React, Python"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 focus:outline-none focus:border-red-600 transition-all"
                      value={newProject.language}
                      onChange={(e) => setNewProject({...newProject, language: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Tipe Proyek</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewProject({...newProject, type: ProjectType.CODE})}
                      className={`flex-1 py-3 rounded-full font-bold text-sm border transition-all ${newProject.type === ProjectType.CODE ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                    >
                      Paste Source Code
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewProject({...newProject, type: ProjectType.FILE})}
                      className={`flex-1 py-3 rounded-full font-bold text-sm border transition-all ${newProject.type === ProjectType.FILE ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                    >
                      Upload File / Link
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">
                    {newProject.type === ProjectType.CODE ? 'Source Code' : 'URL File (ZIP/RAR)'}
                  </label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] px-6 py-4 focus:outline-none focus:border-red-600 transition-all font-mono text-sm"
                    value={newProject.content}
                    onChange={(e) => setNewProject({...newProject, content: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Preview Image URL</label>
                  <input 
                    type="url" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 focus:outline-none focus:border-red-600 transition-all"
                    value={newProject.previewUrl}
                    onChange={(e) => setNewProject({...newProject, previewUrl: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Catatan (Opsional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 focus:outline-none focus:border-red-600 transition-all"
                    value={newProject.notes}
                    onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setView('LIST')}
                    className="flex-1 py-4 bg-zinc-900 text-zinc-400 rounded-full font-bold border border-zinc-800 hover:bg-zinc-800 transition-all"
                  >
                    BATAL
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-full font-bold shadow-xl hover:bg-red-700 transition-all">
                    UNGGAH SEKARANG
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}

      {view === 'PROFILE' && currentUser && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-[2.5rem] p-10 border border-zinc-900">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Edit className="text-red-600" /> EDIT PROFIL
            </h2>
            <div className="space-y-6">
               <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer">
                    <img src={currentUser.photoUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-red-600" />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="text-white" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Update Photo URL</p>
                  <input 
                    type="text" 
                    value={currentUser.photoUrl}
                    onChange={(e) => {
                      const updated = { ...currentUser, photoUrl: e.target.value };
                      setCurrentUser(updated);
                      storageService.updateAdmin(updated);
                    }}
                    className="mt-2 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-full px-6 py-2 text-xs text-center focus:outline-none focus:border-red-600"
                  />
               </div>

               <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Nama Tampilan</label>
                <input 
                  type="text" 
                  value={currentUser.name}
                  onChange={(e) => {
                    const updated = { ...currentUser, name: e.target.value };
                    setCurrentUser(updated);
                    storageService.updateAdmin(updated);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 focus:outline-none focus:border-red-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2 ml-4">Quote / Motto</label>
                <textarea 
                  rows={3}
                  value={currentUser.quote}
                  onChange={(e) => {
                    const updated = { ...currentUser, quote: e.target.value };
                    setCurrentUser(updated);
                    storageService.updateAdmin(updated);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] px-6 py-4 focus:outline-none focus:border-red-600 transition-all text-sm italic"
                />
              </div>

              <p className="text-center text-zinc-600 text-[10px] uppercase tracking-widest font-bold mt-8">Changes are saved automatically</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
