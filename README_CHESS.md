# Chess Game

A modern, responsive web chess application built with React, TypeScript, and Next.js.

## Features

- **Complete Chess Rules**: Full implementation of chess rules including castling, en passant, pawn promotion, check/checkmate, stalemate, threefold repetition, and 50-move rule
- **Smooth Animations**: Piece movements with 150-300ms transitions using Framer Motion
- **Game States**: Tracks check, checkmate, stalemate, and draw conditions
- **Drag & Drop**: Intuitive drag-and-drop piece movement alongside click-to-move
- **Visual Feedback**: Highlighting for selected squares, legal moves, and last move
- **Accessibility**: Keyboard navigation with arrow keys and Enter/Space selection, ARIA labels
- **Move History**: SAN notation move history with PGN export
- **Responsive Design**: Works on desktop and mobile devices
- **SVG Pieces**: High-quality vector pieces with drop shadows
- **Theme Support**: Light and dark mode integration

## How to Play

1. **Click to Move**: Click on a piece to select it, then click on a highlighted square to move
2. **Drag to Move**: Drag pieces directly to their destination squares
3. **Keyboard Navigation**: Use arrow keys to navigate squares, Enter/Space to select/move
4. **Promotion**: When a pawn reaches the last rank, choose your promotion piece

## Controls

- **New Game**: Reset the board to start a new game
- **Copy PGN**: Copy the game in Portable Game Notation format
- **Move History**: View all moves in Standard Algebraic Notation

## Technical Details

- Built with React 19 and TypeScript
- Chess logic powered by chess.js library
- Animations with Framer Motion
- Styled with Tailwind CSS
- Responsive design with CSS Grid

## Installation & Setup

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open http://localhost:3000/games/chess

## Game Rules Implemented

- All standard chess piece movements
- Castling (kingside and queenside)
- En passant captures
- Pawn promotion with piece selection
- Check and checkmate detection
- Stalemate detection
- Draw by insufficient material
- Threefold repetition
- 50-move rule

## Accessibility

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- High contrast piece designs
- Focus indicators for keyboard users

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)