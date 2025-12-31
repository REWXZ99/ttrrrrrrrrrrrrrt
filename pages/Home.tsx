
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import ChatSection from '../components/ChatSection';
import { Search, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(storageService.getProjects());
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Hero Branding */}
      <header className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white">
          <span className="text-red-600 font-mono">{'</>'}</span> SOURCE CODE
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.4em] text-xs font-bold mb-8">
          The Premium Public Repository
        </p>
        <button 
          onClick={() => navigate('/profiles')}
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full font-bold overflow-hidden transition-all hover:bg-red-700 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
        >
          <span>INFO 👑</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-16">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Cari proyek atau bahasa..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] py-5 px-16 text-lg focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700 shadow-xl backdrop-blur-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
           <span className="bg-zinc-800 px-3 py-1 rounded-lg text-[10px] text-zinc-500 font-bold border border-zinc-700">CTRL K</span>
        </div>
      </div>

      {/* Project List */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-red-600" size={24} /> TERBARU
          </h2>
          <span className="text-zinc-500 text-xs font-mono uppercase">Count: {filteredProjects.length}</span>
        </div>
        
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20 glass-card rounded-[2.5rem] border border-zinc-900">
              <p className="text-zinc-500 font-medium">Tidak ada proyek ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Admin Section */}
      <ChatSection />
    </div>
  );
};

export default Home;
