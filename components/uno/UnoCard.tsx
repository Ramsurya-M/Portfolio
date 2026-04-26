'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UnoCardProps {
  card: {
    color: string;
    value: string;
    id: string;
  };
  onClick?: () => void;
  disabled?: boolean;
  isSmall?: boolean;
  isBack?: boolean;
  className?: string;
  isDraggable?: boolean;
}

const UnoCard: React.FC<UnoCardProps> = ({ card, onClick, disabled, isSmall, isBack, className, isDraggable }) => {
  const getColorGradients = (color: string) => {
    switch (color) {
      case 'red': return 'from-red-500 to-red-700 shadow-red-500/30';
      case 'blue': return 'from-blue-500 to-blue-700 shadow-blue-500/30';
      case 'green': return 'from-green-500 to-green-700 shadow-green-500/30';
      case 'yellow': return 'from-yellow-400 to-yellow-600 shadow-yellow-500/30';
      case 'wild': return 'from-zinc-800 to-zinc-950 shadow-white/10';
      default: return 'from-zinc-800 to-zinc-900';
    }
  };

  const getDisplayText = (value: string) => {
    if (value === 'skip') return '⊘';
    if (value === 'reverse') return '⇄';
    if (value === 'draw2') return '+2';
    if (value === 'wild') return 'W';
    if (value === 'wild4') return '+4';
    return value;
  };

  if (isBack) {
    return (
      <motion.div
        whileHover={!disabled ? { y: -10, scale: 1.05 } : {}}
        className={`relative ${isSmall ? 'w-10 h-16' : 'w-24 h-36'} rounded-xl bg-zinc-900 border-2 border-white/20 shadow-2xl overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900" />
        <div className="absolute inset-2 border-2 border-white/10 rounded-lg flex items-center justify-center">
          <span className="text-xl font-black text-white italic tracking-tighter drop-shadow-lg transform -rotate-15">UNO</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={card.id}
      whileHover={!disabled ? { y: -15, scale: 1.05, zIndex: 50 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      drag={isDraggable && !disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onClick={!disabled ? onClick : undefined}
      className={`relative ${isSmall ? 'w-10 h-16' : 'w-24 h-36'} rounded-xl bg-gradient-to-br ${getColorGradients(card.color)} border-2 border-white/20 cursor-pointer overflow-hidden transition-all
        ${disabled ? 'opacity-40 grayscale-[0.5] cursor-not-allowed' : 'hover:brightness-110'}
        ${className}
      `}
    >
      {/* Glossy Overlay */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-white/10 to-transparent skew-y-[-10deg] translate-y-[-20%]" />
      
      {/* Inner White Border Ellipse */}
      <div className="absolute inset-1.5 border-2 border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute w-[140%] h-[70%] bg-white/5 rounded-[100%] rotate-[-45deg] blur-sm" />
      </div>

      {/* Center Value */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <span className={`font-black text-white italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] ${isSmall ? 'text-xl' : 'text-4xl'}`}>
          {getDisplayText(card.value)}
        </span>
      </div>

      {/* Corner Values */}
      <div className="absolute top-1 left-1.5 text-[10px] font-black text-white drop-shadow-md">
        {getDisplayText(card.value)}
      </div>
      <div className="absolute bottom-1 right-1.5 text-[10px] font-black text-white drop-shadow-md rotate-180">
        {getDisplayText(card.value)}
      </div>

      {/* Wild Color Wheel */}
      {card.color === 'wild' && (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none">
          <div className="bg-red-500" />
          <div className="bg-blue-500" />
          <div className="bg-green-500" />
          <div className="bg-yellow-500" />
        </div>
      )}
    </motion.div>
  );
};

export default UnoCard;
