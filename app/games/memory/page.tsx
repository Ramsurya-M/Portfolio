'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const MemoryGame = () => {
  const { theme } = useTheme()

  // Card symbols
  const cardSymbols = [
    '🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎺', '🎸', '🎹', '🎤', '🎧', '📱', '💻', '🖥️', '⌚', '📷', '🎥',
    '🚗', '✈️', '🚀', '⛵', '🏠', '🌳', '🌸', '🍎', '🍕', '🍔', '🍦', '🎂', '🍺', '⚽', '🏀', '🎾', '🏈'
  ]

  // Game state
  const [cards, setCards] = useState<string[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [moves, setMoves] = useState<number>(0)
  const [gameWon, setGameWon] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert' | 'master'>('medium')
  const [gameStarted, setGameStarted] = useState<boolean>(false)

  // Initialize game
  const initializeGame = (diff: 'easy' | 'medium' | 'hard' | 'expert' | 'master' = difficulty) => {
    const pairs = diff === 'easy' ? 6 : diff === 'medium' ? 8 : diff === 'hard' ? 12 : diff === 'expert' ? 18 : 30
    const selectedSymbols = cardSymbols.slice(0, pairs)
    const gameCards = [...selectedSymbols, ...selectedSymbols]
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setGameWon(false)
    setGameStarted(true)
    setDifficulty(diff)
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)

      const [firstIndex, secondIndex] = newFlippedCards
      if (cards[firstIndex] === cards[secondIndex]) {
        // Match found
        setTimeout(() => {
          setMatchedCards(prev => [...prev, firstIndex, secondIndex])
          setFlippedCards([])

          // Check win condition
          if (matchedCards.length + 2 === cards.length) {
            setGameWon(true)
          }
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  // Reset game
  const resetGame = () => {
    setGameStarted(false)
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setGameWon(false)
  }

  // Get grid columns based on difficulty
  const getGridCols = () => {
    switch (difficulty) {
      case 'easy': return 'grid-cols-4' // 12 cards - 3 rows
      case 'medium': return 'grid-cols-4' // 16 cards - 4 rows
      case 'hard': return 'grid-cols-6' // 24 cards - 4 rows
      case 'expert': return 'grid-cols-6' // 36 cards - 6 rows
      case 'master': return 'grid-cols-6' // 60 cards - 10 rows
      default: return 'grid-cols-4'
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} />

      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10 space-y-8">
        <section className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-red'}`}>
            Memory Card Game
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Test your memory by flipping cards to find matching pairs. Choose your difficulty and see how few moves you can complete the game in!
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Game Board */}
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border-4 border-purple-500/50' : 'bg-white/70 border-4 border-amber-300/70'} backdrop-blur-sm shadow-2xl`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Memory Cards</h2>

            {!gameStarted ? (
              <div className="space-y-4 min-w-[300px]">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Difficulty:
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'expert' | 'master')}
                    className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border`}
                  >
                    <option value="easy">Easy (6 pairs - 12 cards)</option>
                    <option value="medium">Medium (8 pairs - 16 cards)</option>
                    <option value="hard">Hard (12 pairs - 24 cards)</option>
                    <option value="expert">Expert (18 pairs - 36 cards)</option>
                    <option value="master">Master (30 pairs - 60 cards)</option>
                  </select>
                </div>
                <button
                  onClick={() => initializeGame()}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div className={`grid ${getGridCols()} gap-4 p-4`}>
                {cards.map((symbol, index) => {
                  const isFlipped = flippedCards.includes(index) || matchedCards.includes(index)
                  const isMatched = matchedCards.includes(index)

                  return (
                    <div
                      key={index}
                      className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 transform ${
                        isFlipped ? 'rotate-y-180' : ''
                      } ${isMatched ? 'scale-95 opacity-75' : 'hover:scale-105'}`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className={`w-full h-full rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                        theme === 'dark' ? 'border-purple-400 bg-purple-800' : 'border-amber-400 bg-amber-200'
                      } ${isFlipped ? 'bg-white' : ''} transition-all duration-300`}>
                        {isFlipped ? (
                          <span className="text-3xl">{symbol}</span>
                        ) : (
                          <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-amber-700'}`}>?</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Game Stats */}
          {gameStarted && (
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg min-w-[300px]`}>
              <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Game Stats</h2>

              <div className="space-y-4">
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Moves: {moves}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Matched Pairs: {matchedCards.length / 2} / {cards.length / 2}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </p>
                </div>

                {gameWon && (
                  <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'}`}>
                    <p className={`text-green-600 font-bold text-center`}>
                      🎉 Congratulations! You won in {moves} moves!
                    </p>
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  New Game
                </button>
              </div>
            </div>
          )}
        </div>

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

export default MemoryGame