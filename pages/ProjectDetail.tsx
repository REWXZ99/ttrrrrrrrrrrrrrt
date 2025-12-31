
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Project, ProjectType } from '../types';
import { ChevronLeft, Heart, Download, Code, Calendar, User, ExternalLink } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      const data = storageService.getProjectById(id);
      if (data) setProject(data);
      else navigate('/');
    }
  }, [id, navigate]);

  if (!project) return null;

  const handleLike = () => {
    if (!project) return;
    storageService.incrementLike(project.id);
    setProject({ ...project, likes: project.likes + 1 });
  };

  const handleDownload = () => {
    if (!project) return;
    storageService.incrementDownload(project.id);
    setProject({ ...project, downloads: project.downloads + 1 });

    if (project.type === ProjectType.CODE) {
      const blob = new Blob([project.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}.txt`;
      a.click();
    } else {
      window.open(project.content, '_blank');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors font-bold uppercase text-xs"
      >
        <ChevronLeft size={16} /> Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border border-zinc-900">
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <span className="px-4 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                 {project.language}
               </span>
               <span className="px-4 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold border border-zinc-700 flex items-center gap-2">
                 {project.type === ProjectType.CODE ? <Code size={14} /> : <ExternalLink size={14} />}
                 {project.type}
               </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>
            
            {project.notes && (
              <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800/50 mb-8">
                <p className="text-zinc-400 italic">"{project.notes}"</p>
              </div>
            )}

            <div className="aspect-video w-full rounded-3xl overflow-hidden mb-8 border border-zinc-800 bg-zinc-900">
              <img src={project.previewUrl} alt={project.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-500">KONTEN PROYEK</h3>
              {project.type === ProjectType.CODE ? (
                <div className="glass-card p-6 rounded-3xl border border-zinc-900 font-mono text-sm overflow-x-auto bg-black shadow-inner max-h-[500px]">
                  <pre className="text-zinc-300"><code>{project.content}</code></pre>
                </div>
              ) : (
                <div className="p-12 glass-card rounded-3xl border border-zinc-900 flex flex-col items-center justify-center text-center">
                  <ExternalLink size={48} className="text-zinc-700 mb-4" />
                  <p className="text-zinc-500 mb-6">Proyek ini adalah file eksternal.</p>
                  <button onClick={handleDownload} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all">
                    Buka Link Proyek
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-zinc-900 sticky top-24">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-zinc-400 text-sm">
                <Calendar size={18} className="text-red-600" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400 text-sm">
                <User size={18} className="text-red-600" />
                <span>By {storageService.getAdmins().find(a => a.id === project.authorId)?.name || 'Team'}</span>
              </div>

              <hr className="border-zinc-800" />

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleLike}
                  className="flex flex-col items-center justify-center p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 hover:border-red-600/50 transition-all group"
                >
                  <Heart size={24} className="text-zinc-500 group-hover:text-red-600 mb-2 transition-colors" />
                  <span className="font-mono text-xl font-bold">{project.likes}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Likes</span>
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex flex-col items-center justify-center p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 hover:border-red-600/50 transition-all group"
                >
                  <Download size={24} className="text-zinc-500 group-hover:text-red-600 mb-2 transition-colors" />
                  <span className="font-mono text-xl font-bold">{project.downloads}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Downloads</span>
                </button>
              </div>

              <button 
                onClick={handleDownload}
                className="w-full py-5 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.2)]"
              >
                UNDUH SEKARANG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
