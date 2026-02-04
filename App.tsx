
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Channel, Message, User } from './types';
import { CHANNELS, USERS, COMMON_EMOJIS } from './constants';
import { getAIResponse } from './services/geminiService';

// --- Sub-components (Internal) ---

// Fixed: Defined SidebarProps and used React.FC to ensure proper React prop handling (including 'key').
interface SidebarProps {
  activeChannel: string;
  setActiveChannel: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeChannel, 
  setActiveChannel 
}) => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-indigo-600 p-1.5 rounded-lg text-white">XI</span>
          KELAS XI DKV
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-2">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Channels</p>
          <div className="space-y-1">
            {CHANNELS.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  activeChannel === channel.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'hover:bg-slate-800'
                }`}
              >
                <span>{channel.icon}</span>
                <span className="font-medium truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Members</p>
          <div className="space-y-1">
            {USERS.map(user => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-2">
                <div className="relative">
                  <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt={user.name} />
                  {user.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fixed: Defined EmojiPickerProps and used React.FC to ensure proper property handling.
interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full mb-2 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 w-64 grid grid-cols-6 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
      {COMMON_EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="text-xl hover:scale-125 transition-transform p-1 hover:bg-slate-100 rounded"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

// Fixed: Defined ChatMessageProps and used React.FC to resolve the 'key' prop TypeScript error.
interface ChatMessageProps {
  message: Message;
  user?: User;
  onReact: (id: string, emoji: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  user, 
  onReact 
}) => {
  const isMe = message.senderId === 'me';
  
  return (
    <div className={`flex gap-3 mb-6 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      <img src={user?.avatar} className="w-10 h-10 rounded-full shadow-sm shrink-0" alt={user?.name} />
      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-bold text-slate-700">{user?.name}</span>
          <span className="text-[10px] text-slate-400">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={`px-4 py-3 rounded-2xl shadow-sm relative group/bubble ${
          isMe 
          ? 'bg-indigo-600 text-white rounded-tr-none' 
          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          
          {/* Reaction Floating UI */}
          <div className={`absolute top-0 flex gap-1 bg-white border border-slate-200 rounded-full px-1 shadow-md opacity-0 group-hover/bubble:opacity-100 transition-opacity z-10 ${
            isMe ? 'right-full mr-2' : 'left-full ml-2'
          }`}>
            {['👍', '❤️', '🔥'].map(emoji => (
              <button 
                key={emoji} 
                onClick={() => onReact(message.id, emoji)}
                className="hover:scale-125 transition-transform p-1 grayscale hover:grayscale-0"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Reactions Display */}
        {Object.entries(message.reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {Object.entries(message.reactions).map(([emoji, userIds]) => (
              <div key={emoji} className="flex items-center gap-1 bg-slate-100 rounded-full px-2 py-0.5 text-[10px] border border-slate-200">
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

// --- Main App Component ---

export default function App() {
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      { id: '1', senderId: 'u1', text: "Welcome to class everyone! Remember the assignment is due Friday.", timestamp: Date.now() - 3600000, reactions: { '👍': ['u2', 'u3'] }, channelId: 'general' },
      { id: '2', senderId: 'u2', text: "Thanks Ms. Alice! I'm starting on it now.", timestamp: Date.now() - 1800000, reactions: {}, channelId: 'general' },
      { id: '3', senderId: 'u4', text: "I can help with any questions regarding the Math curriculum in the #math channel! 📐", timestamp: Date.now() - 600000, reactions: { '🚀': ['me'] }, channelId: 'general' }
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

    // AI Integration Check
    if (activeChannelId === 'math' || currentText.toLowerCase().includes('gemini') || currentText.includes('?')) {
      setIsAiTyping(true);
      // Fixed: Calls getAIResponse with empty history for now as per original implementation.
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
      }, 1000);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const currentReactions = { ...msg.reactions };
      const users = currentReactions[emoji] || [];
      
      if (users.includes('me')) {
        // Remove reaction
        currentReactions[emoji] = users.filter(id => id !== 'me');
        if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
      } else {
        // Add reaction
        currentReactions[emoji] = [...users, 'me'];
      }
      
      return { ...msg, reactions: currentReactions };
    }));
  };

  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];
  const filteredMessages = messages.filter(m => m.channelId === activeChannelId);

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar activeChannel={activeChannelId} setActiveChannel={setActiveChannelId} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-xl relative z-10">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-xl">{activeChannel.icon}</span>
              {activeChannel.name}
            </h2>
            <p className="text-xs text-slate-400">{activeChannel.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {USERS.slice(0, 3).map(u => (
                <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
              ))}
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                +{USERS.length - 3}
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
               </svg>
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50"
        >
          <div className="max-w-4xl mx-auto">
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-sm font-medium">No messages yet in #{activeChannel.id}</p>
                <p className="text-xs">Be the first to say hello!</p>
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
              <div className="flex gap-3 mb-6 animate-pulse">
                <img src={USERS.find(u => u.id === 'u4')?.avatar} className="w-10 h-10 rounded-full grayscale opacity-50" alt="" />
                <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <footer className="p-4 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-slate-100 rounded-2xl p-2 pr-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all border border-transparent focus-within:border-indigo-100">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-xl transition-colors ${showEmojiPicker ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <textarea 
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message #${activeChannel.id}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-1 text-sm max-h-32 min-h-[40px] custom-scrollbar"
              />
              
              <div className="flex items-center gap-1 mb-0.5">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-xl transition-all ${
                    inputText.trim() 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-slate-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {showEmojiPicker && (
                <EmojiPicker onSelect={(emoji) => {
                  setInputText(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }} />
              )}
            </form>
            <p className="text-[10px] text-slate-400 mt-2 px-2">
              <span className="font-bold">Enter</span> to send, <span className="font-bold">Shift + Enter</span> for new line.
              Powered by <span className="text-indigo-500 font-semibold">Gemini AI</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
