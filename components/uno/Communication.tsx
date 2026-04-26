'use client';

import React from 'react';
import { motion } from 'framer-motion';

const PRESET_MESSAGES = [
  'Hi 👋', 'Hello 🙂', 'Good Game 🔥', 'Nice Move 😎', 
  'Hurry Up ⏳', 'My Turn? 🤔', 'Sorry 😅', 'Well Played 👏', 
  'LOL 😂', 'Bye 👋'
];

const STICKERS = [
  { emoji: '😀', label: 'Happy' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😭', label: 'Cry' },
  { emoji: '👏', label: 'Well Done' },
  { emoji: '🏆', label: 'Victory' },
  { emoji: '😜', label: 'Troll' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😲', label: 'Shock' }
];

interface CommunicationProps {
  onSendQuickChat?: (text: string) => void;
  onSendSticker?: (sticker: string) => void;
  onSendMeme?: (memeUrl: string) => void;
}

const MEME_IMAGES = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  url: `/Meme%20Template/Meme%20(${i + 1}).jpg`,
  name: `Meme ${i + 1}`
}));

export const QuickChat: React.FC<CommunicationProps> = ({ onSendQuickChat }) => {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 max-w-lg">
      {PRESET_MESSAGES.map((msg) => (
        <motion.button
          key={msg}
          whileHover={{ scale: 1.1, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSendQuickChat?.(msg)}
          className="whitespace-nowrap px-5 py-2.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-lg active:border-amber-500/50"
        >
          {msg}
        </motion.button>
      ))}
    </div>
  );
};

export const StickerPicker: React.FC<CommunicationProps> = ({ onSendSticker }) => {
  return (
    <div className="bg-zinc-900/90 backdrop-blur-2xl border-2 border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 w-80">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Sticker</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {STICKERS.map((s) => (
          <motion.button
            key={s.label}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSendSticker?.(s.emoji)}
            className="group relative flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-white/10 transition-all"
          >
            <span className="text-4xl drop-shadow-xl">{s.emoji}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const MemePicker: React.FC<CommunicationProps> = ({ onSendMeme }) => {
  return (
    <div className="bg-zinc-900/90 backdrop-blur-2xl border-2 border-white/10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.6)] p-6 w-96 h-[32rem] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6 px-2 shrink-0">
        <div>
          <h4 className="text-sm font-black text-white italic uppercase tracking-tighter">Meme Gallery</h4>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tap to send instantly</p>
        </div>
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            🔥
          </motion.div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-4 pb-4">
        {MEME_IMAGES.map((meme) => (
          <motion.button
            key={meme.id}
            whileHover={{ scale: 1.05, y: -4, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSendMeme?.(meme.url)}
            className="relative aspect-square bg-black/40 border-2 border-white/5 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl"
          >
            <img 
              src={meme.url} 
              alt={meme.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Use Meme</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
