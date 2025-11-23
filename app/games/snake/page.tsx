'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const SnakeAndLadderGame = () => {
  const { theme } = useTheme()

  // Game constants
  const BOARD_SIZE = 10
  const TOTAL_SQUARES = 100

  // Snakes and Ladders positions
  const snakes: Record<number, number> = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
  }
  const ladders: Record<number, number> = {
    1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
  }

  // Player colors
  const playerColors = ['red', 'blue', 'green', 'yellow']

  // Game state
  const [numPlayers, setNumPlayers] = useState<number>(2)
  const [players, setPlayers] = useState(Array(2).fill(0).map((_, i) => ({ position: 0, score: 0, color: playerColors[i] })))
  const [currentPlayer, setCurrentPlayer] = useState<number>(0)
  const [diceValue, setDiceValue] = useState<number>(1)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [winner, setWinner] = useState<number | null>(null)
  const [animatingPlayer, setAnimatingPlayer] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')

  // Initialize players when numPlayers changes
  useEffect(() => {
    setPlayers(Array(numPlayers).fill(0).map((_, i) => ({ position: 0, score: 0, color: playerColors[i] })))
    setCurrentPlayer(0)
    setWinner(null)
    setMessage('')
  }, [numPlayers])

  // Roll dice
  const rollDice = () => {
    if (isRolling || winner) return

    setIsRolling(true)
    setMessage('')

    // Animate dice rolling
    let rolls = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 10) {
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        setIsRolling(false)
        movePlayer(finalValue)
      }
    }, 100)
  }

  // Move player
  const movePlayer = (steps: number) => {
    const newPlayers = [...players]
    const player = newPlayers[currentPlayer]
    let newPosition = player.position + steps

    // Check if overshooting 100
    if (newPosition > 100) {
      newPosition = player.position
      setMessage(`Player ${currentPlayer + 1} needs exact roll to win!`)
    } else {
      player.position = newPosition
      player.score += 1 // Increment moves

      // Check for snakes and ladders
      if (snakes[newPosition]) {
        setTimeout(() => {
          player.position = snakes[newPosition]
          setMessage(`Player ${currentPlayer + 1} got bitten by a snake! Moved to ${snakes[newPosition]}`)
        }, 1000)
      } else if (ladders[newPosition]) {
        setTimeout(() => {
          player.position = ladders[newPosition]
          setMessage(`Player ${currentPlayer + 1} climbed a ladder! Moved to ${ladders[newPosition]}`)
        }, 1000)
      }

      // Check win condition
      if (newPosition === 100) {
        setWinner(currentPlayer)
        setMessage(`Player ${currentPlayer + 1} wins!`)
        return
      }
    }

    setPlayers(newPlayers)

    // Next player
    setTimeout(() => {
      setCurrentPlayer((currentPlayer + 1) % numPlayers)
    }, 1500)
  }

  // Start new game
  const startGame = () => {
    setGameStarted(true)
    setPlayers(Array(numPlayers).fill(0).map((_, i) => ({ position: 0, score: 0, color: playerColors[i] })))
    setCurrentPlayer(0)
    setWinner(null)
    setMessage('Game started! Player 1\'s turn')
  }

  // Reset game
  const resetGame = () => {
    setGameStarted(false)
    setPlayers(Array(numPlayers).fill(0).map((_, i) => ({ position: 0, score: 0, color: playerColors[i] })))
    setCurrentPlayer(0)
    setWinner(null)
    setMessage('')
  }

  // Render board square
  const renderSquare = (num: number) => {
    const hasSnake = snakes[num]
    const hasLadder = ladders[num]
    const playersHere = players.filter(p => p.position === num)

    return (
      <div
        key={num}
        className={`w-14 h-14 border-2 ${theme === 'dark' ? 'border-gray-500' : 'border-gray-400'} flex items-center justify-center text-xs font-bold relative rounded-lg shadow-md ${
          hasSnake ? 'bg-gradient-to-br from-red-300 to-red-500 dark:from-red-700 dark:to-red-900' :
          hasLadder ? 'bg-gradient-to-br from-green-300 to-green-500 dark:from-green-700 dark:to-green-900' :
          num % 2 === 0 ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200') : (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')
        } transition-all duration-300 hover:scale-105`}
      >
        <span className={`z-10 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{num}</span>
        {hasSnake && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-80">
            🐍
          </div>
        )}
        {hasLadder && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-80">
            🪜
          </div>
        )}
        {playersHere.map((player, idx) => (
          <div
            key={idx}
            className={`absolute w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold`}
            style={{
              backgroundColor: player.color,
              bottom: idx * 6 + 2,
              right: idx * 6 + 2,
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {idx + 1}
          </div>
        ))}
      </div>
    )
  }

  // Generate board
  const renderBoard = () => {
    const board = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      const squares = []
      if (row % 2 === 0) {
        // Even rows: left to right (1-10, 21-30, etc.)
        for (let col = 0; col < BOARD_SIZE; col++) {
          const num = row * BOARD_SIZE + col + 1
          squares.push(renderSquare(num))
        }
      } else {
        // Odd rows: right to left (20-11, 40-31, etc.)
        for (let col = BOARD_SIZE - 1; col >= 0; col--) {
          const num = row * BOARD_SIZE + (BOARD_SIZE - col)
          squares.push(renderSquare(num))
        }
      }
      board.push(
        <div key={row} className="flex">
          {squares}
        </div>
      )
    }
    return board
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} />

      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10 space-y-8">
        <section className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-red'}`}>
            Snake and Ladder Game
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            A classic board game where players roll dice to move forward, climb ladders, and avoid snakes. First to reach 100 wins!
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border-4 border-purple-500/50' : 'bg-white/70 border-4 border-amber-300/70'} backdrop-blur-sm shadow-2xl`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Game Board</h2>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'} border-2 ${theme === 'dark' ? 'border-purple-400' : 'border-purple-300'}`}>
              <div className="flex flex-col items-center gap-1">
                {renderBoard()}
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg min-w-[300px]`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Game Controls</h2>

            {!gameStarted ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Number of Players:
                  </label>
                  <select
                    value={numPlayers}
                    onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                    className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} border`}
                  >
                    <option value={2}>2 Players</option>
                    <option value={3}>3 Players</option>
                    <option value={4}>4 Players</option>
                  </select>
                </div>
                <button
                  onClick={startGame}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Current Player: <span style={{ color: players[currentPlayer]?.color }}>Player {currentPlayer + 1}</span>
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Position: {players[currentPlayer]?.position}
                  </p>
                </div>

                <div className="text-center">
                  <div className={`inline-block p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                    <div className={`text-4xl font-bold ${isRolling ? 'animate-spin' : ''}`}>
                      🎲
                    </div>
                    <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {diceValue}
                    </p>
                  </div>
                  <button
                    onClick={rollDice}
                    disabled={isRolling || winner !== null}
                    className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors disabled:opacity-50 ${
                      theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {isRolling ? 'Rolling...' : 'Roll Dice'}
                  </button>
                </div>

                {message && (
                  <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                    <p className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>{message}</p>
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Reset Game
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scores */}
        {gameStarted && (
          <section className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Scores</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {players.map((player, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                  <div
                    className="w-6 h-6 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: player.color }}
                  />
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Player {idx + 1}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Position: {player.position}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Moves: {player.score}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

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

export default SnakeAndLadderGame