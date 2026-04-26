'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Navbar from '@/app/Navbar';
import Footer from '@/app/Footer';
import Lobby from '@/components/uno/Lobby';
import GameBoard from '@/components/uno/GameBoard';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Users, Crown, Loader2, AlertTriangle } from 'lucide-react';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function UnoGamePage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [myPlayer, setMyPlayer] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnecting(false));
    newSocket.on('connect_error', () => {
      setError('Connection failed. Is the server running?');
      setIsConnecting(false);
    });

    newSocket.on('room_created', ({ roomId, player }) => {
      setRoomId(roomId);
      setMyPlayer(player);
      setPlayers([player]);
    });

    newSocket.on('room_joined', ({ roomId, player, players }) => {
      setRoomId(roomId);
      setMyPlayer(player);
      setPlayers(players);
    });

    newSocket.on('player_joined', (player) => {
      setPlayers((prev) => [...prev, player]);
    });

    newSocket.on('player_left', (playerId) => {
      setPlayers((prev) => prev.filter(p => p.id !== playerId));
    });

    newSocket.on('game_update', ({ gameState }) => {
      console.log('UNO Game Update Received:', gameState);
      setGameState((prev: any) => ({ ...gameState, roomId: prev?.roomId || roomId }));
    });

    newSocket.on('host_transferred', (newHostId) => {
      setPlayers(prev => prev.map(p => ({ ...p, isHost: p.id === newHostId })));
      if (myPlayer?.id === newHostId) {
        setMyPlayer((prev: any) => ({ ...prev, isHost: true }));
      }
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
    socket?.emit('create_room', { playerName });
  };

  const handleJoinRoom = (roomId: string, playerName: string) => {
    socket?.emit('join_room', { roomId: roomId.toUpperCase(), playerName });
  };

  const handleStartGame = () => {
    socket?.emit('start_game', { roomId });
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Connecting to Server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-12 z-10 max-w-7xl min-h-[90vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!roomId ? (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-xl"
            >
              <Lobby onJoin={handleJoinRoom} onCreate={handleCreateRoom} />
            </motion.div>
          ) : !gameState ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl space-y-10"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 shadow-inner">
                  <Users size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter italic">WAITING ROOM</h2>
                  <p className="text-zinc-500 font-medium">Share the code below to invite friends</p>
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
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Players ({players.length}/8)</span>
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < players.length ? 'bg-amber-500' : 'bg-white/5'}`} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {players.map((p) => (
                    <motion.div 
                      key={p.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center font-black text-xl shadow-lg" style={{ color: p.color }}>
                          {p.name[0]}
                        </div>
                        <span className="font-bold tracking-tight">{p.name} {p.id === myPlayer?.id && <span className="text-zinc-600 text-xs ml-1">(You)</span>}</span>
                      </div>
                      {p.isHost && (
                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                          <Crown size={16} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {myPlayer?.isHost ? (
                <button
                  disabled={players.length < 2}
                  onClick={handleStartGame}
                  className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-amber-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-[0.2em] shadow-2xl hover:shadow-amber-500/20 active:scale-[0.98]"
                >
                  Launch Match
                </button>
              ) : (
                <div className="w-full py-6 border border-white/5 rounded-3xl flex items-center justify-center gap-3 text-zinc-500 italic">
                  <Loader2 className="animate-spin" size={20} />
                  Waiting for host to start...
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full"
            >
              <GameBoard gameState={{ ...gameState, roomId }} socket={socket} myId={myPlayer?.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
