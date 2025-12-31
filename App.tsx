
import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Info, Shield, Github } from 'lucide-react';

// Pages
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const Navigation = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-card px-8 py-4 rounded-full border border-zinc-900 shadow-2xl flex items-center gap-8 backdrop-blur-xl">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-red-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <HomeIcon size={20} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
        </NavLink>
        <NavLink to="/profiles" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-red-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <Info size={20} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Info</span>
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-red-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <Shield size={20} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Admin</span>
        </NavLink>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-all">
          <Github size={20} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Git</span>
        </a>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative min-h-screen bg-black overflow-x-hidden selection:bg-red-600 selection:text-white">
        {/* Animated Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 blur-[150px] animate-pulse rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-zinc-900/20 blur-[200px] rounded-full" />
        </div>

        {/* Global Nav Bar Logo (Top) */}
        <div className="fixed top-0 left-0 w-full z-40 p-6 flex justify-between items-center pointer-events-none">
           <div className="flex items-center gap-3 glass-card px-6 py-2 rounded-full border border-zinc-900 pointer-events-auto cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <span className="text-red-600 font-mono font-bold tracking-tighter text-lg">{'</>'} HUB</span>
           </div>
           <div className="flex items-center gap-2 text-zinc-700 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span>SYSTEM: ONLINE</span>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
           </div>
        </div>

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/profiles" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Navigation />

        <footer className="relative z-10 border-t border-zinc-900 bg-black pt-16 pb-32 text-center">
           <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.5em] mb-4">
             Source Code Hub &copy; {new Date().getFullYear()} — Production Ready
           </p>
           <p className="text-zinc-400 text-sm font-medium">
             Built by <span className="text-white hover:text-red-500 cursor-pointer transition-colors">SilverHold</span> & <span className="text-white hover:text-red-500 cursor-pointer transition-colors">BraynOfficial</span>
           </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
