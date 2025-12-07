import React from 'react'

interface PieceProps {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
  color: 'white' | 'black'
  size?: number
}

const Piece: React.FC<PieceProps> = ({ type, color, size = 64 }) => {
  const fill = color === 'white' ? '#ffffff' : '#000000'
  const stroke = color === 'white' ? '#000000' : '#ffffff'

  const getPath = () => {
    switch (type) {
      case 'pawn': return 'M32 48 L24 40 L24 32 L40 32 L40 40 Z'
      case 'rook': return 'M24 48 L24 40 L28 40 L28 32 L36 32 L36 40 L40 40 L40 48 Z M26 32 L26 24 L30 24 L30 32 Z M34 32 L34 24 L38 24 L38 32 Z'
      case 'knight': return 'M32 48 L24 40 L28 32 L32 32 L36 40 Z'
      case 'bishop': return 'M32 48 L28 40 L24 32 L32 24 L40 32 L36 40 Z'
      case 'queen': return 'M32 48 L24 40 L28 32 L32 24 L36 32 L40 40 Z M26 32 L26 28 L30 28 L30 32 Z M34 32 L34 28 L38 28 L38 32 Z'
      case 'king': return 'M32 48 L28 40 L24 32 L32 24 L40 32 L36 40 Z M26 32 L26 28 L30 28 L30 32 Z M34 32 L34 28 L38 28 L38 32 Z M30 24 L30 20 L34 20 L34 24 Z'
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d={getPath()} fill={fill} stroke={stroke} strokeWidth="2" />
    </svg>
  )
}

export default Piece
