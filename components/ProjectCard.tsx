
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectType } from '../types';
import { Heart, Download, Code, File as FileIcon } from 'lucide-react';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="glass-card group relative w-full rounded-[2.5rem] p-6 mb-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-zinc-900 hover:border-red-600/30 overflow-hidden"
    >
      {/* Red Highlight Bar Slide-in */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 transition-transform duration-300 -translate-x-full group-hover:translate-x-0" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-red-600/10 text-red-500 text-xs font-bold border border-red-600/20">
              {project.language}
            </span>
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              {project.type === ProjectType.CODE ? <Code size={12}/> : <FileIcon size={12}/>}
              {project.type}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
            {project.name}
          </h3>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <div className="flex items-center gap-2 group-hover:text-red-500 transition-colors">
            <Heart size={18} />
            <span className="font-mono">{project.likes}</span>
          </div>
          <div className="flex items-center gap-2 group-hover:text-red-500 transition-colors">
            <Download size={18} />
            <span className="font-mono">{project.downloads}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
