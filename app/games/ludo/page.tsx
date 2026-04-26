'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Navbar from '@/app/Navbar';
import Footer from '@/app/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Crown, Loader2, Trophy, Copy, Check, MessageSquare, 
  Settings, LogOut, ChevronRight, ChevronLeft, Send
} from 'lucide-react';
import LudoBoard from '@/components/ludo/LudoBoard';
import LudoLobby from '@/components/ludo/LudoLobby';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function LudoGamePage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [myPlayer, setMyPlayer] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Ludo Socket Connected:', newSocket.id);
      setIsConnecting(false);
    });
    newSocket.on('connect_error', (err) => {
      console.error('Ludo Connection Error:', err);
      setError('Connection failed. Is the server running?');
      setIsConnecting(false);
    });

    newSocket.on('ludo_room_created', ({ roomId, player }) => {
      console.log('Ludo Room Created Event Received:', roomId, player);
      setRoomId(roomId);
      setMyPlayer(player);
      setPlayers([player]);
    });

    newSocket.on('ludo_room_joined', ({ roomId, player, players, messages }) => {
      console.log('Ludo Room Joined Event Received:', roomId, player);
      setRoomId(roomId);
      setMyPlayer(player);
      setPlayers(players);
      setMessages(messages || []);
    });

    newSocket.on('ludo_player_joined', (player) => {
      console.log('Other Player Joined Ludo:', player);
      setPlayers((prev) => [...prev, player]);
    });

    newSocket.on('ludo_player_left', (playerId) => {
      console.log('Player Left Ludo:', playerId);
      setPlayers((prev) => prev.filter(p => p.id !== playerId));
    });

    newSocket.on('ludo_game_update', ({ gameState }) => {
      console.log('Ludo Game Update Received:', gameState);
      setGameState(gameState);
    });

    newSocket.on('new_ludo_message', (msg) => {
      setMessages(prev => [...prev, msg].slice(-50));
    });

    newSocket.on('error', (msg) => {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCreateRoom = (playerName: string) => {
    if (!playerName.trim()) {
      setError('Please enter a name first');
      return;
    }
    console.log('Emitting create_ludo_room for:', playerName);
    socket?.emit('create_ludo_room', { playerName });
  };

  const handleJoinRoom = (roomId: string, playerName: string) => {
    if (!playerName.trim() || !roomId.trim()) {
      setError('Name and Room Code are required');
      return;
    }
    console.log('Emitting join_ludo_room for:', roomId, playerName);
    socket?.emit('join_ludo_room', { roomId: roomId.toUpperCase(), playerName });
  };

  const handleStartGame = () => {
    socket?.emit('start_ludo_game', { roomId });
  };

  const handleRollDice = () => {
    socket?.emit('roll_ludo_dice', { roomId });
  };

  const handleMoveToken = (tokenIndex: number) => {
    socket?.emit('move_ludo_token', { roomId, tokenIndex });
  };

  const sendMessage = (text: string) => {
    socket?.emit('send_ludo_message', { roomId, text });
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!roomId ? (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              className="w-full max-w-xl"
            >
              <LudoLobby onJoin={handleJoinRoom} onCreate={handleCreateRoom} />
            </motion.div>
          ) : !gameState ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-10"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Users size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">Ludo Arena</h2>
                  <p className="text-zinc-500 font-medium">Invite players to join the match</p>
                </div>
                <div 
                  onClick={copyRoomId}
                  className="flex items-center gap-4 bg-black/40 border border-white/10 px-8 py-4 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group active:scale-95"
                >
                  <span className="text-2xl font-mono font-bold text-white tracking-[0.2em]">{roomId}</span>
                  {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} className="text-zinc-500 group-hover:text-white" />}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Players ({players.length}/4)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {players.map((p) => (
                    <motion.div 
                      key={p.id} 
                      className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center font-black text-xl text-blue-400">
                          {p.name[0]}
                        </div>
                        <span className="font-bold tracking-tight">{p.name}</span>
                      </div>
                      {p.isHost && <Crown size={18} className="text-amber-500" />}
                    </motion.div>
                  ))}
                </div>
              </div>

              {myPlayer?.isHost ? (
                <button
                  disabled={players.length < 2}
                  onClick={handleStartGame}
                  className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-500 transition-all disabled:opacity-30 uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20"
                >
                  Start Battle
                </button>
              ) : (
                <div className="w-full py-6 border border-white/5 rounded-3xl flex items-center justify-center gap-3 text-zinc-500 italic">
                  <Loader2 className="animate-spin" size={20} />
                  Waiting for host...
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center"
            >
              <LudoBoard 
                gameState={gameState} 
                socket={socket} 
                myId={myPlayer?.id}
                onRollDice={handleRollDice}
                onMoveToken={handleMoveToken}
                messages={messages}
                onSendMessage={sendMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {error && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-red-500 text-white font-black rounded-2xl shadow-2xl z-[1000]"
        >
          {error}
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
