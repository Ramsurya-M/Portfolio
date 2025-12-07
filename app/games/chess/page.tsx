'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Chess, Square, PieceSymbol } from 'chess.js'
import { motion } from 'framer-motion'
import Piece from './Piece'
import ChessBoard3D from './ChessBoard3D'

const ChessGame = () => {
  const { theme } = useTheme()
  const audioContextRef = useRef<AudioContext | null>(null)


  // Sound effects using Web Audio API
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      audioContextRef.current = new AudioContextClass()
    }
    const context = audioContextRef.current
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + duration)
  }, [])

  const playMoveSound = useCallback(() => playSound(800, 0.1, 'square'), [playSound])
  const playCaptureSound = useCallback(() => playSound(400, 0.2, 'sawtooth'), [playSound])
  const playCheckSound = useCallback(() => playSound(600, 0.3, 'triangle'), [playSound])
  const playGameOverSound = useCallback(() => {
    playSound(300, 0.5, 'sawtooth')
    setTimeout(() => playSound(250, 0.5, 'sawtooth'), 200)
  }, [playSound])

  // Game state
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<string>('White to move')
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null)
  const [focusedSquare, setFocusedSquare] = useState<string>('e4')
  const [promotionSquare, setPromotionSquare] = useState<string | null>(null)
  const [animatingMove, setAnimatingMove] = useState<{from: string, to: string} | null>(null)
  const [timersEnabled, setTimersEnabled] = useState(false)
  const [whiteTime, setWhiteTime] = useState(5400) // 90 minutes in seconds
  const [blackTime, setBlackTime] = useState(5400)
  const [currentTimer, setCurrentTimer] = useState<'white' | 'black'>('white')
  const [moveFeedback, setMoveFeedback] = useState<string>('')

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timersEnabled && !game.isGameOver() && (whiteTime > 0 || blackTime > 0)) {
      interval = setInterval(() => {
        if (currentTimer === 'white' && whiteTime > 0) {
          setWhiteTime(prev => {
            const newTime = prev - 1
            if (newTime <= 0) {
              setGameStatus('Black wins by timeout!')
              playGameOverSound()
            }
            return newTime
          })
        } else if (currentTimer === 'black' && blackTime > 0) {
          setBlackTime(prev => {
            const newTime = prev - 1
            if (newTime <= 0) {
              setGameStatus('White wins by timeout!')
              playGameOverSound()
            }
            return newTime
          })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timersEnabled, game, whiteTime, blackTime, currentTimer, playGameOverSound])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const col = focusedSquare.charCodeAt(0) - 97
        const row = parseInt(focusedSquare[1]) - 1

        let newCol = col
        let newRow = row

        switch (event.key) {
          case 'ArrowUp': newRow = Math.min(7, row + 1); break
          case 'ArrowDown': newRow = Math.max(0, row - 1); break
          case 'ArrowLeft': newCol = Math.max(0, col - 1); break
          case 'ArrowRight': newCol = Math.min(7, col + 1); break
        }

        const newSquare = String.fromCharCode(97 + newCol) + (newRow + 1)
        setFocusedSquare(newSquare)
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleSquareClick(focusedSquare)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedSquare]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get piece at square
  const getPieceAt = useCallback((square: string) => {
    return game.get(square as Square)
  }, [game])

  // Get possible moves for selected square
  const getPossibleMoves = useCallback((square: string): string[] => {
    return game.moves({ square: square as Square, verbose: true }).map((move: { to: string }) => move.to)
  }, [game])

  // Update game status
  const updateGameStatus = useCallback(() => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White'
      setGameStatus(`${winner} wins by checkmate!`)
      playGameOverSound()
    } else if (game.isCheck()) {
      const player = game.turn() === 'w' ? 'White' : 'Black'
      setGameStatus(`${player} is in check!`)
      playCheckSound()
    } else if (game.isDraw()) {
      setGameStatus('Game is a draw!')
      playGameOverSound()
    } else {
      const player = game.turn() === 'w' ? 'White' : 'Black'
      setGameStatus(`${player} to move`)
    }
  }, [game, playGameOverSound, playCheckSound])

  // Make a move
  const makeMove = useCallback((from: string, to: string, promotion?: string) => {

    const move = game.move({ from, to, promotion: promotion as PieceSymbol })
    if (move) {
      // Play sound based on move type
      if (move.captured) {
        playCaptureSound()
      } else {
        playMoveSound()
      }

      // Switch timer
      if (timersEnabled) {
        setCurrentTimer(game.turn() === 'w' ? 'black' : 'white')
      }

      // Check for promotion
      const piece = game.get(to as Square)
      if (piece && piece.type === 'p' && (to[1] === '8' || to[1] === '1')) {
        setPromotionSquare(to)
        return // Don't update state yet, wait for promotion choice
      }

      setAnimatingMove({ from, to })
      setTimeout(() => {
        setGame(new Chess(game.fen()))
        setLastMove({ from, to })
        setAnimatingMove(null)
        setTimeout(() => setLastMove(null), 600)
        updateGameStatus()
      }, 1000) // Animation duration
    }
  }, [game, updateGameStatus, playMoveSound, playCaptureSound, timersEnabled])

  // Handle square click
  const handleSquareClick = useCallback((square: string) => {
    if (game.isGameOver()) return

    if (selectedSquare) {
      // Try to move
      if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square)
        setMoveFeedback('')
      } else {
        // Invalid move
        const piece = game.get(selectedSquare as Square)
        setMoveFeedback(`Invalid move for ${piece?.type?.toUpperCase()} at ${selectedSquare}`)
        setTimeout(() => setMoveFeedback(''), 2000)
      }

      setSelectedSquare(null)
      setPossibleMoves([])
    } else {
      // Select piece
      const piece = game.get(square as Square)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
        setPossibleMoves(getPossibleMoves(square))
        setMoveFeedback(`${piece.type.toUpperCase()} selected at ${square}`)
        setTimeout(() => setMoveFeedback(''), 1500)
      } else if (piece) {
        setMoveFeedback('Not your turn')
        setTimeout(() => setMoveFeedback(''), 1500)
      } else {
        setMoveFeedback('Empty square')
        setTimeout(() => setMoveFeedback(''), 1000)
      }
    }
  }, [game, selectedSquare, possibleMoves, makeMove, getPossibleMoves])

  // Handle promotion choice
  const handlePromotion = useCallback((piece: string) => {
    if (promotionSquare) {
      const from = selectedSquare!
      const move = game.move({ from: from as Square, to: promotionSquare as Square, promotion: piece as PieceSymbol })
      if (move) {
        playMoveSound() // Promotion is a special move
        setGame(new Chess(game.fen()))
        setLastMove({ from, to: promotionSquare })
        setTimeout(() => setLastMove(null), 600)
        updateGameStatus()
      }
      setPromotionSquare(null)
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }, [game, promotionSquare, selectedSquare, updateGameStatus, playMoveSound])




  // Toggle timers
  const toggleTimers = useCallback(() => {
    setTimersEnabled(prev => !prev)
    if (!timersEnabled) {
      setWhiteTime(5400)
      setBlackTime(5400)
      setCurrentTimer('white')
    }
  }, [timersEnabled])

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    setGame(new Chess())
    setSelectedSquare(null)
    setPossibleMoves([])
    setGameStatus('White to move')
    setLastMove(null)
    setPromotionSquare(null)
    setAnimatingMove(null)
    setFocusedSquare('e4')
    setWhiteTime(5400)
    setBlackTime(5400)
    setCurrentTimer('white')
    setMoveFeedback('')
  }, [])



  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} />

      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10 space-y-8">
        <section className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-red'}`}>
            Chess Game
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Classic chess game with strategic gameplay. Click on a piece to select it, then click on a highlighted square to move.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Chess Board */}
          <div className={`p-4 rounded-3xl w-full lg:w-auto relative ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/70'} backdrop-blur-sm shadow-2xl overflow-hidden`}>
            {/* Gradient Border */}
            <div className={`absolute inset-0 rounded-3xl p-[3px] pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600' : 'bg-gradient-to-br from-amber-400 via-orange-400 to-red-400'}`}>
              <div className={`absolute inset-[3px] rounded-3xl ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/70'}`} />
            </div>

            <div className="relative z-10">
              <h2 className={`text-2xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-purple-300' : 'text-amber-700'}`}>♟ Chess Board</h2>
              <div className="w-full h-screen md:h-[90vh] lg:h-[900px] lg:w-[900px]">
          <ChessBoard3D
            game={game}
            selectedSquare={selectedSquare}
            possibleMoves={possibleMoves}
            lastMove={lastMove}
            focusedSquare={focusedSquare}
            animatingMove={animatingMove}
            onSquareClick={handleSquareClick}
            onSquareFocus={setFocusedSquare}
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
              </div>
            </div>

            {/* Promotion Modal */}
            {promotionSquare && (
              <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
              >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl border-2 ${theme === 'dark' ? 'border-purple-500' : 'border-amber-400'}`}
          >
            <h3 className={`text-xl font-semibold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              ♛ Choose Promotion Piece
            </h3>
            <div className="flex gap-4">
              {['q', 'r', 'b', 'n'].map((piece) => (
                <button
            key={piece}
            onClick={() => handlePromotion(piece)}
            className={`p-3 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-purple-900/50 border border-purple-500/30' : 'hover:bg-amber-100 border border-amber-300'}`}
                >
            <Piece
              type={piece === 'q' ? 'queen' : piece === 'r' ? 'rook' : piece === 'b' ? 'bishop' : 'knight'}
              color={game.turn() === 'w' ? 'white' : 'black'}
              size={48}
            />
                </button>
              ))}
            </div>
          </motion.div>
              </motion.div>
            )}
          </div>

          {/* Game Controls */}
          <div className="flex flex-col gap-4 min-w-[300px]">
            <div className={`p-6 rounded-3xl relative ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/70'} backdrop-blur-sm shadow-lg overflow-hidden`}>
              {/* Subtle Gradient Border */}
              <div className={`absolute inset-0 rounded-3xl p-[2px] pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50' : 'bg-gradient-to-r from-amber-300/60 to-orange-300/60'}`}>
          <div className={`absolute inset-[2px] rounded-3xl ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/70'}`} />
              </div>

              <div className="relative z-10">
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-amber-700'}`}>⚙️ Game Status</h2>

          <div className="space-y-4">
            {/* Timer Display */}
            {timersEnabled && (
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50' : 'bg-gradient-to-r from-indigo-100 to-purple-100'} border ${theme === 'dark' ? 'border-indigo-600/50' : 'border-indigo-300'}`}>
                <div className="flex justify-between items-center">
                  <div className={`text-center ${currentTimer === 'white' ? 'font-bold' : ''}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>White</p>
                    <p className={`text-lg font-mono ${theme === 'dark' ? 'text-white' : 'text-black'} ${whiteTime <= 30 ? 'text-red-500 animate-pulse' : ''}`}>
                      {formatTime(whiteTime)}
                    </p>
                  </div>
                  <div className={`text-center ${currentTimer === 'black' ? 'font-bold' : ''}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Black</p>
                    <p className={`text-lg font-mono ${theme === 'dark' ? 'text-white' : 'text-black'} ${blackTime <= 30 ? 'text-red-500 animate-pulse' : ''}`}>
                      {formatTime(blackTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-600/50' : 'bg-gradient-to-r from-gray-100 to-gray-50'} border ${theme === 'dark' ? 'border-gray-600/50' : 'border-gray-200'}`}>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {gameStatus}
              </p>
            </div>

            {moveFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/40 border border-yellow-600/50' : 'bg-yellow-50 border border-yellow-300'}`}
              >
                <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  💡 {moveFeedback}
                </p>
              </motion.div>
            )}

            {selectedSquare && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/40 border border-blue-600/50' : 'bg-blue-50 border border-blue-300'}`}
              >
                <p className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
            Selected: <span className="font-semibold">{getPieceAt(selectedSquare)?.type?.toUpperCase()}</span> at <span className="font-mono font-semibold">{selectedSquare}</span>
                </p>
              </motion.div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={resetGame}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/30' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'}`}
                  aria-label="Start a new chess game"
                >
                  🔄 New Game
                </button>
                <button
                  onClick={toggleTimers}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 active:scale-95 ${timersEnabled ? (theme === 'dark' ? 'bg-orange-600' : 'bg-orange-500') : (theme === 'dark' ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 'bg-gradient-to-r from-slate-500 to-slate-600')}`}
                  aria-label={timersEnabled ? "Disable game timers" : "Enable game timers"}
                >
                  {timersEnabled ? '⏱️' : '⏰'} {timersEnabled ? 'Disable' : 'Enable'} Timer
                </button>
              </div>
            </div>

          </div>
        </div>
            </div>
          </div>
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

export default ChessGame