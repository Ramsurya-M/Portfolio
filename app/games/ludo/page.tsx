'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const LudoGame = () => {
  const { theme } = useTheme()

  // Ludo board is 15x15, but we'll represent it as positions
  const BOARD_SIZE = 15
  const HOME_SIZE = 6 // Each home is 6x6

  // Player colors
  const playerColors = ['red', 'blue', 'yellow', 'green']

  // Game state
  const [numPlayers, setNumPlayers] = useState<number>(4)

  // Get active player indices based on number of players
  const getActivePlayers = (num: number) => {
    if (num === 2) return [0, 3] // red and green (diagonally opposite)
    return [0, 1, 2, 3] // all players for 4
  }

  const [activePlayerIndices, setActivePlayerIndices] = useState<number[]>(getActivePlayers(4))
  const [players, setPlayers] = useState(() =>
    Array(4).fill(0).map((_, i) => ({
      pieces: Array(4).fill(0).map((_, j) => ({ position: -1, id: j })), // -1 = home, 0-51 = board
      color: playerColors[i],
      finished: false
    }))
  )
  const [currentPlayer, setCurrentPlayer] = useState<number>(0)
  const [diceValue, setDiceValue] = useState<number>(1)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [winner, setWinner] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)

  // Initialize players when numPlayers changes
  useEffect(() => {
    const activeIndices = getActivePlayers(numPlayers)
    setActivePlayerIndices(activeIndices)
    setPlayers(Array(4).fill(0).map((_, i) => ({
      pieces: Array(4).fill(0).map((_, j) => ({ position: -1, id: j })),
      color: playerColors[i],
      finished: false
    })))
    setCurrentPlayer(activeIndices[0])
    setWinner(null)
    setMessage('')
  }, [numPlayers])

  // Ludo board positions (simplified)
  // 0-51: main path, 52-57: red home, etc.
  const getPlayerHomeStart = (player: number) => 52 + player * 6

  // Move piece
  const movePiece = (pieceIndex: number) => {
    if (winner || !gameStarted) return

    const player = players[currentPlayer]
    const piece = player.pieces[pieceIndex]

    if (piece.position === -1) {
      // Need 6 to exit home
      if (diceValue !== 6) {
        setMessage('Need 6 to exit home!')
        nextTurn()
        return
      }
      piece.position = currentPlayer * 13 // Starting position for each player
    } else {
      piece.position = (piece.position + diceValue) % 52
      // Check if entered home path
      if (piece.position >= currentPlayer * 13 && piece.position < currentPlayer * 13 + 6) {
        // Enter home
        piece.position = getPlayerHomeStart(currentPlayer) + (piece.position - currentPlayer * 13)
      }
    }

    // Check win condition
    const finishedPieces = player.pieces.filter(p => p.position >= getPlayerHomeStart(currentPlayer) + 5).length
    if (finishedPieces === 4) {
      player.finished = true
      const activeFinished = activePlayerIndices.filter(idx => players[idx].finished).length
      if (activeFinished === activePlayerIndices.length - 1) {
        setWinner(currentPlayer)
        setMessage(`Player ${currentPlayer + 1} wins!`)
      }
    }

    setPlayers([...players])
    setSelectedPiece(null)
    nextTurn()
  }

  const nextTurn = () => {
    setTimeout(() => {
      const currentIndex = activePlayerIndices.indexOf(currentPlayer)
      let nextIndex = (currentIndex + 1) % activePlayerIndices.length
      let nextPlayer = activePlayerIndices[nextIndex]
      while (players[nextPlayer].finished && nextIndex !== currentIndex) {
        nextIndex = (nextIndex + 1) % activePlayerIndices.length
        nextPlayer = activePlayerIndices[nextIndex]
      }
      setCurrentPlayer(nextPlayer)
      setMessage(`Player ${nextPlayer + 1}'s turn`)
    }, 1000)
  }

  // Roll dice
  const rollDice = () => {
    if (isRolling || winner) return

    setIsRolling(true)
    setMessage('')

    let rolls = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 10) {
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        setIsRolling(false)

        // Check movable pieces
        const movablePieces = getMovablePieces(finalValue)
        if (movablePieces.length === 0) {
          setMessage(`Rolled ${finalValue}. No moves available.`)
          nextTurn()
        } else if (movablePieces.length === 1) {
          // Auto move the only piece
          setMessage(`Rolled ${finalValue}. Auto-moving piece.`)
          setTimeout(() => movePiece(movablePieces[0]), 1000)
        } else {
          // Multiple options, let user choose
          setMessage(`Rolled ${finalValue}. Choose a piece to move.`)
        }
      }
    }, 100)
  }

  // Get movable pieces for current player
  const getMovablePieces = (diceValue: number) => {
    const player = players[currentPlayer]
    const movable: number[] = []

    player.pieces.forEach((piece, idx) => {
      if (piece.position === -1) {
        if (diceValue === 6) movable.push(idx)
      } else {
        // Check if can move
        const newPos = (piece.position + diceValue) % 52
        // Simplified: can always move if not in home column or not overshooting
        movable.push(idx)
      }
    })

    return movable
  }

  // Start game
  const startGame = () => {
    setGameStarted(true)
    setPlayers(Array(4).fill(0).map((_, i) => ({
      pieces: Array(4).fill(0).map((_, j) => ({ position: -1, id: j })),
      color: playerColors[i],
      finished: false
    })))
    setCurrentPlayer(0)
    setWinner(null)
    setMessage('Game started! Player 1\'s turn')
  }

  // Reset game
  const resetGame = () => {
    setGameStarted(false)
    setPlayers(Array(4).fill(0).map((_, i) => ({
      pieces: Array(4).fill(0).map((_, j) => ({ position: -1, id: j })),
      color: playerColors[i],
      finished: false
    })))
    setCurrentPlayer(0)
    setWinner(null)
    setMessage('')
  }

  // Render board square
  const renderSquare = (row: number, col: number) => {
    let bgColor = theme === 'dark' ? 'bg-gray-100' : 'bg-gray-50'
    let playerHere = -1
    let pieceIndex = -1

    // Determine square color
    if (row >= 0 && row <= 5 && col >= 0 && col <= 5) {
      // Red home quadrant
      bgColor = 'bg-red-300 dark:bg-red-700'
    } else if (row >= 0 && row <= 5 && col >= 9 && col <= 14) {
      // Blue home quadrant
      bgColor = 'bg-blue-300 dark:bg-blue-700'
    } else if (row >= 9 && row <= 14 && col >= 0 && col <= 5) {
      // Yellow home quadrant
      bgColor = 'bg-yellow-300 dark:bg-yellow-700'
    } else if (row >= 9 && row <= 14 && col >= 9 && col <= 14) {
      // Green home quadrant
      bgColor = 'bg-green-300 dark:bg-green-700'
    } else if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
      // Center
      bgColor = 'bg-gray-400 dark:bg-gray-600'
    } else if (
      // Main path (perimeter and cross)
      (row === 6 && (col >= 0 && col <= 14)) || // top horizontal
      (row === 8 && (col >= 0 && col <= 14)) || // bottom horizontal
      (col === 6 && (row >= 0 && row <= 14)) || // left vertical
      (col === 8 && (row >= 0 && row <= 14))    // right vertical
    ) {
      bgColor = theme === 'dark' ? 'bg-amber-100' : 'bg-amber-50'
    } else if (
      // Home columns
      (row === 7 && col >= 1 && col <= 5) || // red home column
      (row === 7 && col >= 9 && col <= 13) || // blue home column
      (col === 7 && row >= 9 && row <= 13) || // yellow home column
      (col === 7 && row >= 1 && row <= 5)    // green home column
    ) {
      bgColor = theme === 'dark' ? 'bg-gray-200' : 'bg-gray-100'
    }

    // Safe squares (some positions on path)
    const isSafe = (
      (row === 6 && col === 1) || (row === 8 && col === 13) || // red safe
      (row === 1 && col === 8) || (row === 13 && col === 6) || // blue safe
      (row === 8 && col === 1) || (row === 6 && col === 13) || // yellow safe
      (row === 13 && col === 8) || (row === 1 && col === 6)    // green safe
    )

    if (isSafe) {
      bgColor = 'bg-white dark:bg-gray-300'
    }

    // Check for pieces (simplified)
    players.forEach((player, pIdx) => {
      player.pieces.forEach((piece, idx) => {
        let pieceRow = -1, pieceCol = -1

        if (piece.position === -1) {
          // In home
          const homePositions = [
            [[1,1],[1,3],[3,1],[3,3]], // red
            [[1,11],[1,13],[3,11],[3,13]], // blue
            [[11,1],[11,3],[13,1],[13,3]], // yellow
            [[11,11],[11,13],[13,11],[13,13]] // green
          ]
          if (homePositions[pIdx] && homePositions[pIdx][idx]) {
            [pieceRow, pieceCol] = homePositions[pIdx][idx]
          }
        } else {
          // On path - simplified mapping
          const pathPositions = [
            // Red start path
            [7,1],[7,2],[7,3],[7,4],[7,5],
            // Main path clockwise from red start
            [6,6],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
            [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,9],[7,10],[7,11],[7,12],[7,13],
            [8,13],[9,13],[10,13],[11,13],[12,13],[13,13],[13,12],[13,11],[13,10],[13,9],[13,8],
            [12,8],[11,8],[10,8],[9,8],[8,8],[8,7],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[14,7],[14,8],
            [13,8],[12,8],[11,8],[10,8],[9,8],[8,8],[7,7],[7,6],[6,6]
          ]
          if (pathPositions[piece.position]) {
            [pieceRow, pieceCol] = pathPositions[piece.position]
          }
        }

        if (pieceRow === row && pieceCol === col) {
          playerHere = pIdx
          pieceIndex = idx
        }
      })
    })

    return (
      <div
        key={`${row}-${col}`}
        className={`w-6 h-6 border border-gray-400 ${bgColor} flex items-center justify-center text-xs relative`}
      >
        {isSafe && <div className="absolute inset-0 border-2 border-yellow-500 rounded"></div>}
        {playerHere >= 0 && (
          <div
            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer`}
            style={{ backgroundColor: playerColors[playerHere] }}
            onClick={() => selectedPiece === null ? setSelectedPiece(pieceIndex) : movePiece(pieceIndex)}
          />
        )}
      </div>
    )
  }

  // Render board
  const renderBoard = () => {
    const board = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      const squares = []
      for (let col = 0; col < BOARD_SIZE; col++) {
        squares.push(renderSquare(row, col))
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
            Ludo Game
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Traditional Ludo board game. Roll dice to move your pieces around the board and get them home first!
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border-4 border-purple-500/50' : 'bg-white/70 border-4 border-amber-300/70'} backdrop-blur-sm shadow-2xl`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Game Board</h2>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'} border-2 ${theme === 'dark' ? 'border-purple-400' : 'border-purple-300'}`}>
              <div className="flex flex-col items-center">
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

                {selectedPiece !== null && (
                  <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                    <p className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                      Selected piece {selectedPiece + 1}. Click on it again to move.
                    </p>
                  </div>
                )}

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
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Players</h2>
            <div className={`grid gap-4 ${numPlayers === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              {activePlayerIndices.map((idx) => {
                const player = players[idx]
                return (
                  <div key={idx} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: player.color }}
                    />
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      Player {idx + 1}
                    </p>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Pieces home: {player.pieces.filter(p => p.position >= getPlayerHomeStart(idx) + 5).length}/4
                    </p>
                    {player.finished && (
                      <p className={`text-green-500 font-bold`}>Finished!</p>
                    )}
                  </div>
                )
              })}
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

export default LudoGame