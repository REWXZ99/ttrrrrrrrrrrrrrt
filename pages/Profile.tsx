
import React from 'react';
import { storageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Github, Twitter, Instagram, Quote } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const admins = storageService.getAdmins();

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="mb-12 flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors font-bold uppercase text-xs"
      >
        <ChevronLeft size={16} /> Beranda
      </button>

      <h1 className="text-5xl font-bold mb-16 text-center">CORE <span className="text-red-600">TEAM</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {admins.map(admin => (
          <div key={admin.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-zinc-900 p-8 flex flex-col items-center text-center">
             <div className="relative mb-6">
                <img src={admin.photoUrl} alt={admin.name} className="w-40 h-40 rounded-full object-cover border-4 border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.3)]" />
                <span className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold border-4 border-black">
                  {admin.role.toUpperCase()}
                </span>
             </div>

             <h2 className="text-3xl font-bold mb-2">{admin.name}</h2>
             <p className="text-zinc-500 font-mono text-sm mb-6">@{admin.username.toLowerCase()}</p>

             <div className="relative p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 mb-8 w-full italic">
                <Quote size={20} className="absolute -top-3 -left-3 text-red-600" />
                <p className="text-zinc-400 leading-relaxed text-sm">"{admin.quote}"</p>
             </div>

             <div className="flex flex-wrap justify-center gap-2 mb-8">
                {admin.hashtags.map(tag => (
                  <span key={tag} className="text-red-500 text-xs font-bold px-3 py-1 bg-red-600/10 rounded-lg border border-red-600/20">
                    {tag}
                  </span>
                ))}
             </div>

             <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors border border-zinc-800">
                  <Github size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors border border-zinc-800">
                  <Instagram size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors border border-zinc-800">
                  <Twitter size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
