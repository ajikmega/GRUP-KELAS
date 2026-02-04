
import React, { useState, useEffect, useRef } from 'react';
import { Channel, Message, User } from './types.ts';
import { CHANNELS, USERS, COMMON_EMOJIS } from './constants.tsx';
import { getAIResponse } from './services/geminiService.ts';

// --- Sub-components ---

interface SidebarProps {
  activeChannel: string;
  setActiveChannel: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeChannel, setActiveChannel }) => {
  return (
    <div className="w-72 bg-slate-950 text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800">
      <div className="p-8">
        <h1 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            DKV
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-none text-indigo-400">KELAS</span>
            <span className="text-lg">XI DKV</span>
          </div>
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        <div className="mb-8">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Channels</p>
          <div className="space-y-1">
            {CHANNELS.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeChannel === channel.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{channel.icon}</span>
                <span className="font-semibold text-sm truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Online Members</p>
          <div className="space-y-2">
            {USERS.map(user => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-1 group cursor-default">
                <div className="relative">
                  <img src={user.avatar} className="w-9 h-9 rounded-full border border-slate-700 p-0.5" alt="" />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950"></div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
          <img src={USERS.find(u => u.id === 'me')?.avatar} className="w-8 h-8 rounded-full" alt="" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">You (Designer)</p>
            <p className="text-[10px] text-slate-500">Active Now</p>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
  user?: User;
  onReact: (id: string, emoji: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user, onReact }) => {
  const isMe = message.senderId === 'me';
  
  return (
    <div className={`flex gap-4 mb-8 group animate-in fade-in slide-in-from-bottom-4 duration-500 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="shrink-0">
        <img src={user?.avatar} className="w-11 h-11 rounded-2xl shadow-md border-2 border-white" alt="" />
      </div>
      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-xs font-black text-slate-800">{user?.name}</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={`px-5 py-3.5 rounded-3xl shadow-sm relative group/bubble transition-all duration-300 ${
          isMe 
          ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-none' 
          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
        }`}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
          
          <div className={`absolute top-0 flex gap-1 bg-white border border-slate-200 rounded-full p-1 shadow-xl opacity-0 group-hover/bubble:opacity-100 transition-all duration-300 z-10 ${
            isMe ? 'right-full mr-2' : 'left-full ml-2'
          }`}>
            {['👍', '❤️', '🔥', '✨'].map(emoji => (
              <button 
                key={emoji} 
                onClick={() => onReact(message.id, emoji)}
                className="hover:scale-125 transition-transform p-1.5 hover:bg-slate-50 rounded-full"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {Object.entries(message.reactions).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {Object.entries(message.reactions).map(([emoji, userIds]) => (
              <div key={emoji} className="flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 text-xs border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-default">
                <span>{emoji}</span>
                <span className="font-bold text-slate-600">{userIds.length}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessages: Message[] = [
      { id: '1', senderId: 'u1', text: "Halo desainer masa depan! Jangan lupa kirim progres desain poster pameran minggu depan ya.", timestamp: Date.now() - 3600000, reactions: { '🎨': ['u2', 'u3'] }, channelId: 'general' },
      { id: '2', senderId: 'u2', text: "Siap Pak! Baru beres sketsa kasar, tinggal trace di Illustrator.", timestamp: Date.now() - 1800000, reactions: { '🔥': ['me'] }, channelId: 'general' },
      { id: '3', senderId: 'u4', text: "Butuh ide palet warna atau referensi layout? Tanyakan saja di sini! 🎨🖌️", timestamp: Date.now() - 600000, reactions: { '✨': ['me'] }, channelId: 'general' }
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now(),
      reactions: {},
      channelId: activeChannelId
    };

    setMessages(prev => [...prev, newMessage]);
    const currentText = inputText;
    setInputText('');
    setShowEmojiPicker(false);

    if (activeChannelId === 'design-feedback' || currentText.toLowerCase().includes('ai') || currentText.includes('?')) {
      setIsAiTyping(true);
      const aiResponseText = await getAIResponse(currentText, []);
      
      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: 'u4',
        text: aiResponseText,
        timestamp: Date.now(),
        reactions: {},
        channelId: activeChannelId
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsAiTyping(false);
      }, 1500);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      const currentReactions = { ...msg.reactions };
      const users = currentReactions[emoji] || [];
      if (users.includes('me')) {
        currentReactions[emoji] = users.filter(id => id !== 'me');
        if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
      } else {
        currentReactions[emoji] = [...users, 'me'];
      }
      return { ...msg, reactions: currentReactions };
    }));
  };

  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];
  const filteredMessages = messages.filter(m => m.channelId === activeChannelId);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar activeChannel={activeChannelId} setActiveChannel={setActiveChannelId} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <header className="h-20 glass-morphism flex items-center justify-between px-8 z-20">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center border border-slate-200">{activeChannel.icon}</span>
              {activeChannel.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium ml-13 px-13">{activeChannel.description}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {USERS.slice(0, 4).map(u => (
                <img key={u.id} src={u.avatar} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="" />
              ))}
              <div className="w-10 h-10 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-indigo-600">
                +{USERS.length - 4}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-2">
          <div className="max-w-4xl mx-auto py-10">
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 text-center animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-5xl mb-6 border border-indigo-100 shadow-inner">🎨</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada karya di #{activeChannel.id}</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Mulai percakapan atau bagikan referensi desainmu di sini!</p>
              </div>
            )}
            {filteredMessages.map(msg => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                user={USERS.find(u => u.id === msg.senderId)} 
                onReact={handleAddReaction}
              />
            ))}
            {isAiTyping && (
              <div className="flex gap-4 mb-8">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 animate-pulse text-xl">🪄</div>
                <div className="bg-white border border-slate-200 px-6 py-4 rounded-3xl rounded-tl-none flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="p-8 pt-4">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white rounded-3xl p-3 pl-5 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all focus-within:ring-4 focus-within:ring-indigo-500/10">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-3 rounded-2xl transition-all ${showEmojiPicker ? 'bg-indigo-50 text-indigo-600 scale-110' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Diskusi kreatif di #${activeChannel.id}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-medium placeholder:text-slate-300 py-3"
              />
              
              <div className="flex items-center gap-2">
                <button type="button" className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-slate-50 rounded-2xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-4 rounded-2xl shadow-xl transition-all flex items-center justify-center ${
                    inputText.trim() 
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white scale-105 hover:scale-110 active:scale-95 shadow-indigo-500/40' 
                    : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute bottom-full mb-6 right-0 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 w-72 grid grid-cols-6 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
                  {COMMON_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setInputText(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl hover:scale-125 transition-all p-2 hover:bg-slate-50 rounded-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </form>
            <div className="flex justify-between items-center mt-4 px-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Creative Group Chat • <span className="text-indigo-400">Online</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Press <span className="bg-slate-200 px-1 rounded font-bold text-slate-600">Enter</span> to send
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
