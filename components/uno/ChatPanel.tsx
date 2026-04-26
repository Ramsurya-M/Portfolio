import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, ChevronRight, ChevronLeft, Image as ImageIcon, Smile } from 'lucide-react';
import { MemePicker } from './Communication';

interface Message {
  id: number;
  playerId: string;
  playerName: string;
  text?: string;
  memeUrl?: string;
  color: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onSendMeme: (memeUrl: string) => void;
  myId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onSendMeme, myId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [showMemePicker, setShowMemePicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleMemeSend = (url: string) => {
    onSendMeme(url);
    setShowMemePicker(false);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 300 : 60 }}
      className="fixed right-4 top-20 bottom-32 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-[100] transition-all duration-500"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors z-20"
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`flex-1 flex flex-col ${!isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Game Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live</span>
          </div>
        </div>

        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg.id}
              className={`flex flex-col ${msg.playerId === myId ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold" style={{ color: msg.color }}>{msg.playerName}</span>
                <span className="text-[8px] text-zinc-600 font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {msg.text && (
                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                  msg.playerId === myId 
                    ? 'bg-amber-500 text-black font-medium rounded-tr-none shadow-lg shadow-amber-500/10' 
                    : 'bg-white/5 text-zinc-300 rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
              )}

              {msg.memeUrl && (
                <div className={`relative group max-w-[85%] rounded-2xl overflow-hidden border-2 ${
                  msg.playerId === myId ? 'border-amber-500/50' : 'border-white/10'
                }`}>
                  <img 
                    src={msg.memeUrl} 
                    alt="Meme" 
                    className="w-full h-auto max-h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => window.open(msg.memeUrl, '_blank')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">Meme Battle</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-black/20 relative">
          <AnimatePresence>
            {showMemePicker && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full right-4 mb-4 z-[200]"
              >
                <MemePicker onSendMeme={handleMemeSend} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMemePicker(!showMemePicker)}
              className={`p-3 rounded-xl transition-all ${showMemePicker ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
            >
              <ImageIcon size={20} />
            </button>
            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/30 transition-all pr-12 group-hover:border-white/10"
              />
              <button
                onClick={handleSend}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                <Send size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isOpen && (
        <div className="flex-1 flex flex-col items-center py-8 gap-4">
          <MessageSquare size={24} className="text-zinc-600" />
          <div className="w-1 h-1 rounded-full bg-amber-500 animate-ping" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatPanel;
