'use client'

import React, { useState } from 'react'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const ChessGame = () => {
  const { theme } = useTheme()

  // Chess board is 8x8
  const BOARD_SIZE = 8

  // Piece types
  type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
  type PieceColor = 'white' | 'black'

  interface Piece {
    type: PieceType
    color: PieceColor
  }

  // Initial board setup
  const initialBoard: (Piece | null)[][] = [
    [
      { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }
    ],
    Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'black' as PieceColor })),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'white' as PieceColor })),
    [
      { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }
    ]
  ]

  // Game state
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white')
  const [selectedSquare, setSelectedSquare] = useState<{row: number, col: number} | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<{row: number, col: number}[]>([])
  const [gameStatus, setGameStatus] = useState<string>('White to move')
  const [winner, setWinner] = useState<PieceColor | null>(null)

  // Piece symbols
  const getPieceSymbol = (piece: Piece | null): string => {
    if (!piece) return ''
    const symbols: Record<PieceColor, Record<PieceType, string>> = {
      white: {
        king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙'
      },
      black: {
        king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟'
      }
    }
    return symbols[piece.color][piece.type]
  }

  // Check if move is valid for piece
  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol]
    if (!piece) return false

    const deltaRow = toRow - fromRow
    const deltaCol = toCol - fromCol

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1
        const startRow = piece.color === 'white' ? 6 : 1

        // Normal move
        if (deltaCol === 0 && deltaRow === direction && !board[toRow][toCol]) return true
        // Double move from start
        if (deltaCol === 0 && deltaRow === 2 * direction && fromRow === startRow && !board[toRow][toCol] && !board[fromRow + direction][fromCol]) return true
        // Capture
        if (Math.abs(deltaCol) === 1 && deltaRow === direction && board[toRow][toCol] && board[toRow][toCol]!.color !== piece.color) return true
        return false

      case 'rook':
        // Horizontal or vertical
        if ((deltaRow === 0 || deltaCol === 0) && isPathClear(fromRow, fromCol, toRow, toCol)) return true
        return false

      case 'bishop':
        // Diagonal
        if (Math.abs(deltaRow) === Math.abs(deltaCol) && isPathClear(fromRow, fromCol, toRow, toCol)) return true
        return false

      case 'queen':
        // Rook + Bishop
        if ((deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol)) && isPathClear(fromRow, fromCol, toRow, toCol)) return true
        return false

      case 'knight':
        // L-shape
        if ((Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) || (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2)) return true
        return false

      case 'king':
        // One square any direction
        if (Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1) return true
        return false

      default:
        return false
    }
  }

  // Check if path is clear for sliding pieces
  const isPathClear = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const deltaRow = toRow - fromRow
    const deltaCol = toCol - fromCol
    const stepRow = deltaRow === 0 ? 0 : deltaRow > 0 ? 1 : -1
    const stepCol = deltaCol === 0 ? 0 : deltaCol > 0 ? 1 : -1

    let currentRow = fromRow + stepRow
    let currentCol = fromCol + stepCol

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false
      currentRow += stepRow
      currentCol += stepCol
    }

    return true
  }

  // Get possible moves for selected piece
  const getPossibleMoves = (row: number, col: number): {row: number, col: number}[] => {
    const moves: {row: number, col: number}[] = []
    const piece = board[row][col]

    if (!piece || piece.color !== currentPlayer) return moves

    for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
      for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
        if (isValidMove(row, col, toRow, toCol)) {
          const targetPiece = board[toRow][toCol]
          if (!targetPiece || targetPiece.color !== piece.color) {
            moves.push({ row: toRow, col: toCol })
          }
        }
      }
    }

    return moves
  }

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (winner) return

    if (selectedSquare) {
      // Try to move
      const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col)
      if (isPossibleMove) {
        // Make move
        const newBoard = board.map(r => [...r])
        newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col]
        newBoard[selectedSquare.row][selectedSquare.col] = null
        setBoard(newBoard)

        // Check for checkmate (simplified)
        const opponentColor = currentPlayer === 'white' ? 'black' : 'white'
        const opponentKing = findKing(opponentColor, newBoard)
        if (opponentKing && isInCheck(opponentColor, newBoard)) {
          if (isCheckmate(opponentColor, newBoard)) {
            setWinner(currentPlayer)
            setGameStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins by checkmate!`)
          } else {
            setGameStatus(`${opponentColor.charAt(0).toUpperCase() + opponentColor.slice(1)} is in check!`)
          }
        } else {
          setCurrentPlayer(opponentColor)
          setGameStatus(`${opponentColor.charAt(0).toUpperCase() + opponentColor.slice(1)} to move`)
        }
      }

      setSelectedSquare(null)
      setPossibleMoves([])
    } else {
      // Select piece
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col })
        setPossibleMoves(getPossibleMoves(row, col))
      }
    }
  }

  // Find king position
  const findKing = (color: PieceColor, boardState: (Piece | null)[][]): {row: number, col: number} | null => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = boardState[row][col]
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row, col }
        }
      }
    }
    return null
  }

  // Check if king is in check
  const isInCheck = (color: PieceColor, boardState: (Piece | null)[][]): boolean => {
    const kingPos = findKing(color, boardState)
    if (!kingPos) return false

    const opponentColor = color === 'white' ? 'black' : 'white'
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = boardState[row][col]
        if (piece && piece.color === opponentColor) {
          if (isValidMove(row, col, kingPos.row, kingPos.col)) {
            return true
          }
        }
      }
    }
    return false
  }

  // Check for checkmate (simplified)
  const isCheckmate = (color: PieceColor, boardState: (Piece | null)[][]): boolean => {
    // Simplified: if king is in check and no legal moves
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = boardState[row][col]
        if (piece && piece.color === color) {
          const moves = getPossibleMovesForBoard(row, col, boardState)
          if (moves.length > 0) return false
        }
      }
    }
    return true
  }

  // Get possible moves for board state
  const getPossibleMovesForBoard = (row: number, col: number, boardState: (Piece | null)[][]): {row: number, col: number}[] => {
    const moves: {row: number, col: number}[] = []
    for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
      for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
        if (isValidMove(row, col, toRow, toCol)) {
          const targetPiece = boardState[toRow][toCol]
          if (!targetPiece || targetPiece.color !== boardState[row][col]!.color) {
            moves.push({ row: toRow, col: toCol })
          }
        }
      }
    }
    return moves
  }

  // Reset game
  const resetGame = () => {
    setBoard(initialBoard.map(r => [...r]))
    setCurrentPlayer('white')
    setSelectedSquare(null)
    setPossibleMoves([])
    setGameStatus('White to move')
    setWinner(null)
  }

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

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Chess Board */}
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border-4 border-purple-500/50' : 'bg-white/70 border-4 border-amber-300/70'} backdrop-blur-sm shadow-2xl`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Chess Board</h2>
            <div className="grid grid-cols-8 gap-0 border-2 border-gray-800">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                  const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)
                  const isLight = (rowIndex + colIndex) % 2 === 0

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-16 h-16 flex items-center justify-center text-4xl cursor-pointer border-2 border-gray-600 ${
                        isLight ? (theme === 'dark' ? 'bg-amber-100' : 'bg-amber-50') : (theme === 'dark' ? 'bg-amber-900' : 'bg-amber-300')
                      } ${isSelected ? 'ring-4 ring-blue-500' : ''} ${isPossibleMove ? 'ring-4 ring-green-500 bg-green-200' : ''} hover:scale-105 transition-transform`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      <span className={`drop-shadow-lg ${piece?.color === 'white' ? 'text-white' : 'text-black'} ${piece?.color === 'white' ? 'filter drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]' : 'filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'}`}>
                        {getPieceSymbol(piece)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Game Controls */}
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg min-w-[300px]`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Game Status</h2>

            <div className="space-y-4">
              <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {gameStatus}
                </p>
              </div>

              {selectedSquare && (
                <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <p className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                    Selected: {board[selectedSquare.row][selectedSquare.col]?.type} at {String.fromCharCode(97 + selectedSquare.col)}{8 - selectedSquare.row}
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