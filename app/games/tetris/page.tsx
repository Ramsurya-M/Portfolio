'use client'

import React from 'react'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const TetrisGame = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} />

      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10 space-y-16">
        <section className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-red'}`}>
            Tetris Clone
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            A Tetris game implementation with modern UI. Arrange falling blocks to clear lines and achieve high scores.
          </p>
        </section>

        <section className="text-center">
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg max-w-4xl mx-auto`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Game Canvas</h2>
            <div className={`w-full h-96 border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} rounded-lg flex items-center justify-center`}>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Game implementation placeholder</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/games"
            className={`inline-block px-6 py-3 rounded-md text-lg font-medium transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
          >
            Back to Games Showcase
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default TetrisGame