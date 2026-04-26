'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, Plus, LogIn, Sparkles } from 'lucide-react';

interface LudoLobbyProps {
  onJoin: (roomId: string, playerName: string) => void;
  onCreate: (playerName: string) => void;
  isCreating?: boolean;
}

const LudoLobby: React.FC<LudoLobbyProps> = ({ onJoin, onCreate, isCreating }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  return (
    <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-colors" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-colors" />

      <div className="relative z-10 flex flex-col items-center space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20">
            <Gamepad2 size={48} />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">Ludo Royale</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-blue-500" />
              Premium Multiplayer Experience
            </p>
          </div>
        </div>

        {mode === 'menu' && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('create')}
              className="flex flex-col items-center justify-center gap-6 p-10 bg-white/5 border-2 border-white/5 rounded-[2.5rem] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group"
            >
              <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Plus size={32} />
              </div>
              <div className="text-center">
                <span className="block text-xl font-black uppercase italic tracking-tighter text-white">Host Match</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Start Private Room</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('join')}
              className="flex flex-col items-center justify-center gap-6 p-10 bg-white/5 border-2 border-white/5 rounded-[2.5rem] hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group"
            >
              <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <LogIn size={32} />
              </div>
              <div className="text-center">
                <span className="block text-xl font-black uppercase italic tracking-tighter text-white">Join Match</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Enter Room Code</span>
              </div>
            </motion.button>
          </div>
        )}

        {(mode === 'create' || mode === 'join') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col space-y-6"
          >
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Player Handle</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ex: Maverick"
                className="w-full bg-black/40 border-2 border-white/10 rounded-3xl px-8 py-5 text-lg font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {mode === 'join' && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Room Access Code</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="X7Y2Z9"
                  className="w-full bg-black/40 border-2 border-white/10 rounded-3xl px-8 py-5 text-2xl font-mono font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-all uppercase tracking-[0.3em]"
                />
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isCreating}
                onClick={() => mode === 'create' ? onCreate(playerName) : onJoin(roomId, playerName)}
                className="w-full py-6 bg-white text-black font-black rounded-3xl text-lg uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isCreating && <Loader2 className="animate-spin" size={20} />}
                {mode === 'create' ? 'Initialize' : 'Enter Arena'}
              </motion.button>
              <button onClick={() => setMode('menu')} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                Go Back
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LudoLobby;
