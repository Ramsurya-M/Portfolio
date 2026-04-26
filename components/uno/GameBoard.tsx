'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnoCard from './UnoCard';
import ChatPanel from './ChatPanel';
import { QuickChat, StickerPicker } from './Communication';
import { 
  MessageSquare, Smile, Crown, Trophy, Volume2, VolumeX, 
  Settings, LogOut, Eye, Copy, Check, Users, Clock, RotateCw, Hand
} from 'lucide-react';

interface GameBoardProps {
  gameState: any;
  socket: any;
  myId: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, socket, myId }) => {
  const { 
    players, discardPile, topCard, currentColor, currentPlayerIndex, 
    myHand, winner, direction, pendingDraw, roomId 
  } = gameState;

  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reactions, setReactions] = useState<any>({});
  const [memePopups, setMemePopups] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const isMyTurn = players[currentPlayerIndex]?.id === myId;

  useEffect(() => {
    if (!socket) return;
    socket.on('new_message', (msg: any) => {
      setMessages(prev => [...prev, msg].slice(-50));
      if (msg.memeUrl) {
        const popupId = Date.now();
        setMemePopups(prev => [...prev, { ...msg, popupId }]);
        setTimeout(() => {
          setMemePopups(prev => prev.filter(p => p.popupId !== popupId));
        }, 4000);
      }
    });
    socket.on('new_sticker', ({ playerId, sticker }: any) => {
      setReactions((prev: any) => ({ ...prev, [playerId]: { type: 'sticker', value: sticker, id: Date.now() } }));
    });
    socket.on('quick_chat', ({ playerId, text }: any) => {
      setReactions((prev: any) => ({ ...prev, [playerId]: { type: 'text', value: text, id: Date.now() } }));
    });
    socket.on('uno_called', ({ playerId }: any) => {
      setReactions((prev: any) => ({ ...prev, [playerId]: { type: 'uno', value: 'UNO!', id: Date.now() } }));
    });
    return () => {
      socket.off('new_message');
      socket.off('new_sticker');
      socket.off('quick_chat');
      socket.off('uno_called');
    };
  }, [socket]);

  const handlePlayCard = (card: any) => {
    if (!isMyTurn) return;
    if (card.color === 'wild') {
      setSelectedCard(card);
      setShowColorPicker(true);
    } else {
      socket.emit('play_card', { roomId, cardId: card.id });
    }
  };

  const handleColorSelect = (color: string) => {
    socket.emit('play_card', { roomId, cardId: selectedCard.id, newColor: color });
    setShowColorPicker(false);
    setSelectedCard(null);
  };

  const handleDrawCard = () => {
    if (!isMyTurn) return;
    socket.emit('draw_card', { roomId });
  };

  const handleCallUno = () => socket.emit('call_uno', { roomId });
  const handleCatchUno = (playerId: string) => socket.emit('catch_uno', { roomId, targetPlayerId: playerId });
  const sendQuickChat = (text: string) => socket.emit('send_quick_chat', { roomId, text });
  const sendSticker = (sticker: string) => {
    socket.emit('send_sticker', { roomId, sticker });
    setShowStickerPicker(false);
  };
  const sendMessage = (text: string) => socket.emit('send_message', { roomId, text });
  const sendMeme = (memeUrl: string) => socket.emit('send_meme', { roomId, memeUrl });

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 overflow-hidden font-sans">
      {/* Sidebar: Chat & Status */}
      <ChatPanel messages={messages} onSendMessage={sendMessage} onSendMeme={sendMeme} myId={myId} />

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative">
        
        {/* Opponents Section */}
        <div className="flex justify-center gap-6 mb-12 h-32">
          {players.filter((p: any) => p.id !== myId).map((p: any) => (
            <motion.div 
              key={p.id}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                players[currentPlayerIndex]?.id === p.id ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/5 bg-black/20'
              }`}
            >
              {/* Reaction Popup */}
              <AnimatePresence>
                {reactions[p.id] && (
                  <motion.div
                    key={reactions[p.id].id}
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute top-0 bg-white px-3 py-1 rounded-xl text-black font-bold text-xs shadow-2xl z-50 whitespace-nowrap"
                  >
                    {reactions[p.id].value}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-black text-xs" style={{ color: p.color }}>
                  {p.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-white/90">{p.name}</span>
                  <div className="flex items-center gap-1.5">
                    <Hand size={10} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500">{p.handSize} Cards</span>
                  </div>
                </div>
              </div>
              {p.handSize === 1 && !p.unoCalled && (
                <button 
                  onClick={() => handleCatchUno(p.id)}
                  className="absolute -bottom-4 px-3 py-1 bg-red-600 text-[8px] font-black rounded-lg hover:bg-red-500 transition-all shadow-lg animate-pulse"
                >
                  CATCH UNO!
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Board Center */}
        <div className="flex-1 flex items-center justify-center gap-16 relative">
          {/* Direction Indicator */}
          <motion.div 
            animate={{ rotate: direction === 1 ? 360 : -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 border-2 border-dashed border-white/5 rounded-full flex items-center justify-center"
          >
            <RotateCw size={40} className={`text-white/5 ${direction === -1 ? 'scale-x-[-1]' : ''}`} />
          </motion.div>

          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Draw Deck</span>
            <div className="relative group cursor-pointer" onClick={handleDrawCard}>
              <UnoCard card={{ color: '', value: '', id: 'draw' }} isBack />
              {pendingDraw > 0 && (
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-black text-xl shadow-2xl animate-bounce">
                  +{pendingDraw}
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Discard</span>
            <div className="relative">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={topCard.id}
                  initial={{ scale: 0.5, opacity: 0, rotate: -45, y: -100 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
                  className="relative z-10"
                >
                  <UnoCard card={topCard} disabled />
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-1 left-1 w-24 h-36 bg-black/40 rounded-xl -z-10" />
            </div>
          </div>
        </div>

        {/* Controls & Communication */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCallUno}
              className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all shadow-lg active:scale-95 italic tracking-tighter"
            >
              UNO!
            </button>
            <div className={`px-6 py-3 rounded-2xl border-2 transition-all ${
              isMyTurn ? 'bg-amber-500 border-amber-400 text-black shadow-lg scale-105' : 'bg-black/20 border-white/5 text-zinc-600'
            }`}>
              <span className="text-xs font-black uppercase tracking-widest italic">
                {isMyTurn ? "YOUR TURN!" : `WAITING FOR ${players[currentPlayerIndex]?.name.toUpperCase()}...`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5 relative">
            <QuickChat onSendQuickChat={sendQuickChat} onSendSticker={sendSticker} />
            <div className="w-px h-8 bg-white/10 mx-1" />
            <button 
              onClick={() => setShowStickerPicker(!showStickerPicker)}
              className={`p-2 rounded-xl transition-all ${showStickerPicker ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              <Smile size={24} />
            </button>
            
            <AnimatePresence>
              {showStickerPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full right-0 mb-4 z-50"
                >
                  <StickerPicker onSendQuickChat={sendQuickChat} onSendSticker={sendSticker} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* My Hand: Fanned out */}
        <div className="mt-12 relative w-full flex justify-center h-48 group">
          <AnimatePresence>
            {myHand.map((card: any, idx: number) => {
              const totalCards = myHand.length;
              const midPoint = (totalCards - 1) / 2;
              const rotation = (idx - midPoint) * (totalCards > 10 ? 5 : 8);
              const xOffset = (idx - midPoint) * (totalCards > 10 ? 40 : 60);
              const yOffset = Math.abs(idx - midPoint) * 8;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 100, rotate: rotation }}
                  animate={{ 
                    opacity: 1, 
                    y: yOffset, 
                    x: xOffset,
                    rotate: rotation 
                  }}
                  whileHover={{ 
                    y: -40, 
                    zIndex: 100,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  className="absolute cursor-pointer"
                  style={{ zIndex: idx }}
                >
                  <UnoCard 
                    card={card} 
                    onClick={() => handlePlayCard(card)}
                    disabled={!isMyTurn}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      {/* Meme Pop-ups Layer */}
      <div className="fixed bottom-36 right-8 z-[200] pointer-events-none flex flex-col-reverse gap-4">
        <AnimatePresence>
          {memePopups.map((meme, idx) => (
            <motion.div
              key={meme.popupId}
              initial={{ opacity: 0, x: 100, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: 50, scale: 0.5, filter: 'blur(10px)' }}
              className="pointer-events-auto relative group"
            >
              <div className="relative w-64 rounded-3xl overflow-hidden border-4 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)] bg-zinc-900">
                {/* Sender Tag */}
                <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-[10px] font-black text-black">
                      {meme.playerName[0]}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{meme.playerName}</span>
                  </div>
                  <span className="text-[8px] font-bold text-amber-500 uppercase tracking-tighter bg-amber-500/10 px-2 py-0.5 rounded-full">MEME!</span>
                </div>

                {/* Reaction Emojis Floating */}
                <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
                  {['🔥', '😂', '✨'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: -40, opacity: [0, 1, 0] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                      className="text-lg"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>

                <img 
                  src={meme.memeUrl} 
                  alt="Meme Popup"
                  className="w-full h-auto max-h-64 object-cover"
                />
                
                {/* Footer Deco */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]" />
              </div>
              
              {/* Manual Close Button */}
              <button 
                onClick={() => setMemePopups(prev => prev.filter(p => p.popupId !== meme.popupId))}
                className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 border-2 border-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-2xl"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl rounded-[3rem] z-[100] flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-6 border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Trophy size={48} />
            </div>
            <h2 className="text-6xl font-black text-white italic tracking-tighter mb-2 uppercase">VICTORY</h2>
            <p className="text-amber-500 font-bold text-xl uppercase tracking-widest mb-12">{winner.name} Wins the Game!</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-4 bg-white text-black font-black rounded-2xl hover:bg-amber-500 transition-all uppercase tracking-widest shadow-2xl active:scale-95"
            >
              Back to Lobby
            </button>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Wild Color Picker */}
        <AnimatePresence>
          {showColorPicker && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-[3rem] z-[100] flex flex-col items-center justify-center p-12 text-center"
            >
              <h3 className="text-3xl font-black text-white italic tracking-tighter mb-8 uppercase">SELECT COLOR</h3>
              <div className="grid grid-cols-2 gap-6">
                {['red', 'blue', 'green', 'yellow'].map(color => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleColorSelect(color)}
                    className={`w-24 h-24 rounded-2xl shadow-2xl ${
                      color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameBoard;
