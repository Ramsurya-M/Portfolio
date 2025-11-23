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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} />

      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10 space-y-16">
        <section className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-red'}`}>
            Games Showcase
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore my collection of interactive games and web-based projects. Each game demonstrates different programming concepts and technologies.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {games.map((game, index) => (
              <div key={index} className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-300`}>
                <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                  {game.title}
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {game.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tech.map((tech) => (
                    <span key={tech} className={`px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-amber-100 text-amber-800'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={game.link}
                  className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                >
                  Let's Play
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Games