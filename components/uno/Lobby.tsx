'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, LogIn, ArrowRight } from 'lucide-react';

interface LobbyProps {
  onJoin: (roomId: string, playerName: string) => void;
  onCreate: (playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoin, onCreate }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'initial' | 'create' | 'join'>('initial');

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-10"
      >
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black italic tracking-tighter text-white">
            UNO<span className="text-amber-500">ONLINE</span>
          </h2>
          <p className="text-zinc-500 font-medium tracking-wide uppercase text-xs">Modern Multiplayer Experience</p>
        </div>

        {mode === 'initial' && (
          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={() => setMode('create')}
              className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all text-left flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-black text-white italic">CREATE ROOM</h3>
                <p className="text-sm text-zinc-500">Host a new game and invite friends</p>
              </div>
              <div className="p-4 bg-amber-500 rounded-2xl text-black">
                <Plus size={28} strokeWidth={3} />
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all text-left flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-black text-white italic">JOIN ROOM</h3>
                <p className="text-sm text-zinc-500">Enter a room code to join the battle</p>
              </div>
              <div className="p-4 bg-zinc-800 rounded-2xl text-white">
                <LogIn size={28} strokeWidth={3} />
              </div>
            </button>
          </div>
        )}

        {(mode === 'create' || mode === 'join') && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Player Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-bold"
              />
            </div>

            {mode === 'join' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Room Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="w-full bg-black/20 border-2 border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono font-bold tracking-widest text-center uppercase"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setMode('initial')}
                className="flex-1 px-8 py-4 rounded-2xl border-2 border-white/5 text-zinc-500 font-black uppercase tracking-widest hover:bg-white/5 transition-all text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!playerName || (mode === 'join' && !roomId)}
                onClick={() => mode === 'create' ? onCreate(playerName) : onJoin(roomId, playerName)}
                className="flex-[2] px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-amber-500 transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center gap-2"
              >
                {mode === 'create' ? 'Host Game' : 'Join Game'}
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Lobby;
