
import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { ChatMessage, Admin } from '../types';
import { Send, User as UserIcon, ShieldCheck } from 'lucide-react';

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [userId] = useState(() => `USER${Math.floor(Math.random() * 9999)}`);
  const [admins] = useState<Admin[]>(storageService.getAdmins());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(storageService.getChats());
    const interval = setInterval(() => {
      setMessages(storageService.getChats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Internal scroll management to prevent global page jumping
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userId,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: false
    };

    storageService.addChat(newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulated Auto-Reply
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: admins[0].name,
        text: `Hello ${userId}! One of us will check your message soon.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdmin: true
      };
      storageService.addChat(autoReply);
      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  return (
    <section className="mt-12 mb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <span className="text-red-600">#</span> CHAT ADMIN
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {admins.map(admin => (
            <div key={admin.id} className="glass-card p-6 rounded-[2.5rem] flex items-center gap-4 border border-zinc-900">
              <div className="relative">
                <img src={admin.photoUrl} alt={admin.name} className="w-16 h-16 rounded-full object-cover border-2 border-red-600/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
              </div>
              <div>
                <h4 className="font-bold text-white">{admin.name}</h4>
                <p className="text-zinc-500 text-sm">Online</p>
                <button 
                  onClick={() => document.getElementById('chat-input')?.focus()}
                  className="mt-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all uppercase tracking-tighter"
                >
                  CHAT {admin.role.toUpperCase()}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2.5rem] border border-zinc-900 overflow-hidden flex flex-col h-[500px]">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <ShieldCheck size={48} className="mb-4 opacity-20" />
                <p>Start a secure conversation with the team</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl ${msg.isAdmin ? 'bg-zinc-800 text-white rounded-tl-none border border-red-600/20' : 'bg-red-600 text-white rounded-tr-none'}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70 flex items-center gap-1">
                    {msg.isAdmin ? <ShieldCheck size={10} /> : <UserIcon size={10} />}
                    {msg.sender}
                  </p>
                  <p className="text-sm font-medium">{msg.text}</p>
                  <p className="text-[9px] mt-1 text-right opacity-50">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-black/50 border-t border-zinc-900 flex gap-4">
            <input 
              id="chat-input"
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-red-600 transition-all"
            />
            <button type="submit" className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-all">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
