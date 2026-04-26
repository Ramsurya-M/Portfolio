'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, MessageSquare, Send, Smile, User, 
  Crown, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getGridCoords } from './ludoUtils';

interface LudoBoardProps {
  gameState: any;
  socket: any;
  myId: string;
  onRollDice: () => void;
  onMoveToken: (tokenIndex: number) => void;
  messages: any[];
  onSendMessage: (text: string) => void;
}

const PLAYER_COLORS = {
  red: { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-500/20', border: 'border-red-500' },
  green: { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-500/20', border: 'border-green-500' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-500/20', border: 'border-yellow-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-500/20', border: 'border-blue-500' },
};

const LudoBoard: React.FC<LudoBoardProps> = ({ 
  gameState, myId, onRollDice, onMoveToken, messages, onSendMessage 
}) => {
  const { players, currentPlayerIndex, diceValue, isDiceRolled, winner } = gameState;
  const myPlayer = players.find((p: any) => p.id === myId);
  const isMyTurn = players[currentPlayerIndex]?.id === myId;
  const [inputText, setInputText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const renderBase = (color: keyof typeof PLAYER_COLORS) => (
    <div className={`w-full h-full ${PLAYER_COLORS[color].bg} p-6 flex items-center justify-center relative`}>
      <div className="w-full h-full bg-white/90 rounded-[2rem] p-6 grid grid-cols-2 gap-4 shadow-inner">
        {[0, 1, 2, 3].map((idx) => {
          const player = players.find((p: any) => p.color === color);
          const hasTokenAtBase = player?.tokens[idx] === -1;
          const isMyToken = player?.id === myId;
          
          return (
            <div key={idx} className="bg-zinc-100 rounded-2xl flex items-center justify-center relative border border-black/5">
              {hasTokenAtBase && (
                <motion.div
                  layoutId={`token-${color}-${idx}`}
                  whileHover={isMyTurn && isMyToken ? { scale: 1.2 } : {}}
                  onClick={() => isMyTurn && isMyToken && onMoveToken(idx)}
                  className={`w-10 h-10 rounded-full ${PLAYER_COLORS[color].bg} shadow-lg cursor-pointer border-4 border-white/50 flex items-center justify-center z-10`}
                >
                  <div className="w-4 h-4 rounded-full bg-white/30" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl h-[85vh] lg:h-[800px]">
      {/* Sidebar: Players & Chat */}
      <motion.div 
        animate={{ width: isChatOpen ? 320 : 80 }}
        className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden flex flex-col relative transition-all duration-500"
      >
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute left-full top-1/2 -translate-y-1/2 -ml-4 w-8 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 z-20"
        >
          {isChatOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className={`flex-1 flex flex-col ${!isChatOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {/* Active Players */}
          <div className="p-6 space-y-4 border-b border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Combatants</h4>
            {players.map((p: any, idx: number) => (
              <div 
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  idx === currentPlayerIndex ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black/20 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${PLAYER_COLORS[p.color as keyof typeof PLAYER_COLORS].bg} text-white`}>
                    {p.name[0]}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[100px]">{p.name}</span>
                </div>
                {p.hasWon && <Trophy size={14} className="text-amber-500" />}
              </div>
            ))}
          </div>

          {/* Chat */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{msg.playerName}</span>
                <span className="text-xs text-white/80 bg-white/5 p-2 rounded-xl mt-1">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk trash..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Board Area */}
      <div className="flex-1 bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-4 md:p-8 flex items-center justify-center relative shadow-2xl">
        <div className="aspect-square w-full max-w-[650px] bg-white rounded-3xl overflow-hidden grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-white/10 relative">
          
          {/* Bases */}
          <div className="col-start-1 col-end-7 row-start-1 row-end-7">{renderBase('red')}</div>
          <div className="col-start-10 col-end-16 row-start-1 row-end-7">{renderBase('green')}</div>
          <div className="col-start-1 col-end-7 row-start-10 row-end-16">{renderBase('blue')}</div>
          <div className="col-start-10 col-end-16 row-start-10 row-end-16">{renderBase('yellow')}</div>

          {/* Tokens on Track */}
          {players.map((player: any) => (
            player.tokens.map((pos: number, tokenIdx: number) => {
              const coords = getGridCoords(player.color, pos);
              if (!coords) return null;
              const isMyToken = player.id === myId;

              return (
                <motion.div
                  key={`${player.id}-${tokenIdx}`}
                  layoutId={`token-${player.color}-${tokenIdx}`}
                  initial={false}
                  animate={{ 
                    gridRowStart: coords[0] + 1, 
                    gridColumnStart: coords[1] + 1,
                    scale: 1
                  }}
                  whileHover={isMyTurn && isMyToken ? { scale: 1.2, zIndex: 50 } : {}}
                  onClick={() => isMyTurn && isMyToken && onMoveToken(tokenIdx)}
                  className={`w-8 h-8 rounded-full ${PLAYER_COLORS[player.color as keyof typeof PLAYER_COLORS].bg} border-2 border-white shadow-lg cursor-pointer flex items-center justify-center z-10 mx-auto`}
                >
                  <div className="w-2 h-2 rounded-full bg-white/40" />
                </motion.div>
              );
            })
          ))}

          {/* Paths (Simplified grid-based rendering) */}
          {[...Array(15)].map((_, r) => (
            [...Array(15)].map((_, c) => {
              // Skip bases and center
              if ((r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8)) return null;
              if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return null;

              // Determine cell color
              let cellColor = "bg-white";
              // Home stretch
              if (r === 7 && c > 0 && c < 6) cellColor = "bg-red-100";
              if (r === 7 && c > 8 && c < 14) cellColor = "bg-yellow-100";
              if (c === 7 && r > 0 && r < 6) cellColor = "bg-green-100";
              if (c === 7 && r > 8 && r < 14) cellColor = "bg-blue-100";
              
              // Start positions
              if (r === 6 && c === 1) cellColor = "bg-red-500/20";
              if (r === 1 && c === 8) cellColor = "bg-green-500/20";
              if (r === 13 && c === 6) cellColor = "bg-blue-500/20";
              if (r === 8 && c === 13) cellColor = "bg-yellow-500/20";

              return (
                <div 
                  key={`${r}-${c}`} 
                  style={{ gridRowStart: r + 1, gridColumnStart: c + 1 }}
                  className={`border border-zinc-100 flex items-center justify-center ${cellColor}`}
                >
                  {/* Token rendering logic on the track would be integrated here based on game state */}
                </div>
              );
            })
          ))}

          {/* Home Center */}
          <div className="col-start-7 col-end-10 row-start-7 row-end-10 bg-zinc-100 flex items-center justify-center p-2">
            <div className="w-full h-full relative overflow-hidden rotate-45 border-4 border-white">
               <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-500" />
               <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500" />
               <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500" />
               <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-500" />
            </div>
          </div>
        </div>

        {/* Dice Controller */}
        <div className="absolute bottom-12 right-12 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {isMyTurn && !isDiceRolled ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRollDice}
                className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 border-4 border-white/20 group"
              >
                <RefreshCw size={32} className="group-hover:rotate-180 transition-transform duration-500" />
              </motion.button>
            ) : (
              <motion.div
                key={diceValue}
                initial={{ rotate: -180, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-zinc-900 text-4xl font-black shadow-2xl shadow-black/40 border-b-8 border-zinc-200"
              >
                {diceValue}
              </motion.div>
            )}
          </AnimatePresence>
          <div className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${
            isMyTurn ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-black/40 text-zinc-600'
          }`}>
            {isMyTurn ? 'Your Turn' : 'Wait...'}
          </div>
        </div>

        {/* Winner Overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl rounded-[4rem] z-[100] flex flex-col items-center justify-center p-12 text-center"
            >
              <motion.div 
                initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-6 border-2 border-amber-500"
              >
                <Trophy size={48} />
              </motion.div>
              <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-4">Supreme Champion</h2>
              <p className="text-blue-500 font-bold text-xl uppercase tracking-widest mb-12">{winner.name} conquered the board!</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-12 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-500 transition-all uppercase tracking-widest"
              >
                Return to Base
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LudoBoard;
