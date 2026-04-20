'use client'

import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { useTheme } from 'next-themes'

const Games = () => {
  const { theme } = useTheme()

  // Example games data
  const games = [
    {
      title: "Snake and Ladder Game",
      description: "Classic board game with snakes, ladders, and multiplayer support.",
      tech: ["React", "TypeScript", "Next.js"],
      link: "/games/snake",
    },
    {
      title: "Ludo Game",
      description: "Traditional Ludo board game with 4 players and strategic gameplay.",
      tech: ["React", "TypeScript", "Next.js"],
      link: "/games/ludo",
    },
    {
      title: "Chess Game",
      description: "Classic chess game with full rules and strategic gameplay.",
      tech: ["React", "TypeScript", "Next.js"],
      link: "/games/chess",
    },
    {
      title: "Memory Card Game",
      description: "Flip cards and match pairs in this memory game.",
      tech: ["React", "TailwindCSS"],
      link: "/games/memory",
    },
  ]

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />
      
      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      <main className="container relative mx-auto px-6 py-32 md:py-32 z-10 max-w-7xl">
        <div className="space-y-4 mb-16">
          <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
            Playground
          </h2>
          <h1 className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            Interactive <br />
            <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>Showcase</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {games.map((game, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-[2rem] border transition-all duration-500 group ${
                theme === 'dark' 
                  ? 'bg-neutral-900/40 border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
                  : 'bg-white/60 border-neutral-200 hover:border-amber-500/30 hover:shadow-xl shadow-sm'
              } backdrop-blur-xl flex flex-col`}
            >
              <h3 className={`text-2xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                {game.title}
              </h3>
              <p className={`text-base leading-relaxed mb-8 flex-grow ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {game.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {game.tech.map((tech) => (
                  <span key={tech} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'bg-neutral-800 text-purple-400' : 'bg-amber-50 text-amber-900'}`}>
                    {tech}
                  </span>
                ))}
              </div>
              
              <a
                href={game.link}
                className={`inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-neutral-900 hover:bg-black text-white shadow-lg'
                }`}
              >
                Launch Game
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Games