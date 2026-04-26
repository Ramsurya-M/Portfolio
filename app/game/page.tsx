'use client';

import React from 'react';
import Navbar from '@/app/Navbar';
import Footer from '@/app/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Users, Zap, Shield } from 'lucide-react';

export default function GamePage() {
  const games = [
    {
      id: 'uno',
      title: 'UNO Multiplayer',
      description: 'Real-time multiplayer UNO with room codes, action cards, and premium animations.',
      image: '/uno-thumb.png',
      href: '/games/uno',
      players: '2-8 Players',
      difficulty: 'Easy',
      features: ['Real-time', 'No Login', 'Mobile Ready']
    },
    {
      id: 'ludo',
      title: 'Ludo Royale',
      description: 'The classic Ludo experience reimagined with premium 3D-style UI and real-time multiplayer.',
      image: '/ludo-thumb.png',
      href: '/games/ludo',
      players: '2-4 Players',
      difficulty: 'Medium',
      features: ['Fast-Paced', 'Room Codes', 'Smooth Motion']
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-32 z-10 max-w-7xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black leading-none tracking-tighter"
            >
              Play <span className="text-amber-500">Games</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl leading-relaxed max-w-2xl mx-auto text-gray-400"
            >
              Experience high-quality, real-time multiplayer games built directly into the portfolio. No downloads, no installs — just play.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-amber-500/50 transition-all duration-500 shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <Image 
                    src={game.image} 
                    alt={game.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                      New Game
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold tracking-tight">{game.title}</h3>
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Users size={16} />
                        <span className="text-xs font-bold">{game.players}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                      {game.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {game.features.map(feature => (
                      <span key={feature} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Link href={game.href}>
                    <button className="w-full mt-4 group/btn relative p-4 bg-white text-black font-black rounded-2xl overflow-hidden transition-all active:scale-95 flex items-center justify-center gap-2">
                      <span className="relative z-10 uppercase tracking-widest">Play Now</span>
                      <Play size={18} fill="currentColor" className="relative z-10" />
                      <div className="absolute inset-0 bg-amber-500 translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* Coming Soon Card */}
            <div className="relative bg-zinc-900/20 border border-white/5 border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-4 opacity-50 grayscale">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                <Zap size={32} className="text-zinc-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-500">More Coming Soon</h3>
                <p className="text-xs text-zinc-600">New multiplayer experiences are in development</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}