const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the frontend directory (we'll adjust later)
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory storage for game rooms
const rooms = {};

// Helper function to generate a unique room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle creating a new game room
  socket.on('createRoom', (playerName) => {
    const roomCode = generateRoomCode();
    // Ensure the room code is unique
    while (rooms[roomCode]) {
      roomCode = generateRoomCode();
    }
    rooms[roomCode] = {
      id: roomCode,
      players: [{ id: socket.id, name: playerName, ready: false }],
      host: socket.id,
      gameState: null, // Will be initialized when game starts
      status: 'waiting' // waiting, playing, finished
    };
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, playerId: socket.id });
    console.log(`Room created: ${roomCode} by ${playerName}`);
  });

  // Handle joining an existing room
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    if (room.status !== 'waiting') {
      socket.emit('error', { message: 'Game already started' });
      return;
    }
    // Check if player already in room (reconnection)
    const existingPlayerIndex = room.players.findIndex(p => p.id === socket.id);
    if (existingPlayerIndex === -1) {
      // Check if room is full (max 8 players)
      if (room.players.length >= 8) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }
      room.players.push({ id: socket.id, name: playerName, ready: false });
    }
    socket.join(roomCode);
    // Update all clients in the room about the current state
    io.to(roomCode).emit('roomUpdated', {
      players: room.players,
      host: room.host,
      status: room.status
    });
    console.log(`Player ${playerName} joined room ${roomCode}`);
  });

  // Handle player ready status
  socket.on('playerReady', ({ roomCode, ready }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = ready;
      // Check if all players are ready and at least 2 players
      if (room.players.length >= 2 && room.players.every(p => p.ready)) {
        // Start the game
        startGame(roomCode);
      }
      // Notify room of updated ready status
      io.to(roomCode).emit('roomUpdated', {
        players: room.players,
        host: room.host,
        status: room.status
      });
    }
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove player from any room they were in
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        // If the host leaves, transfer host to another player or end game
        if (room.host === socket.id) {
          if (room.players.length > 1) {
            // Transfer host to the next player
            const nextPlayerIndex = (playerIndex + 1) % room.players.length;
            room.host = room.players[nextPlayerIndex].id;
          } else {
            // No players left, delete room
            delete rooms[roomCode];
            continue;
          }
        }
        // Remove player
        room.players.splice(playerIndex, 1);
        // If room becomes empty, delete it
        if (room.players.length === 0) {
          delete rooms[roomCode];
        } else {
          // Update remaining players
          io.to(roomCode).emit('roomUpdated', {
            players: room.players,
            host: room.host,
            status: room.status
          });
        }
        break;
      }
    }
  });
});

// Function to start a game in a room
function startGame(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  room.status = 'playing';
  // Initialize game state (simplified for now)
  room.gameState = {
    deck: createDeck(),
    discardPile: [],
    players: room.players.map((player, index) => ({
      id: player.id,
      name: player.name,
      hand: [], // Will be dealt
      score: 0
    })),
    currentPlayerIndex: 0,
    direction: 1, // 1 for clockwise, -1 for counter-clockwise
    drawCount: 0, // For handling draw card stacking
    unoCalled: false // Track if UNO has been called
  };
  // Shuffle deck
  room.gameState.deck = shuffleDeck(room.gameState.deck);
  // Deal 7 cards to each player
  for (let i = 0; i < 7; i++) {
    room.gameState.players.forEach(p => {
      p.hand.push(room.gameState.deck.pop());
    });
  }
  // Flip first card for discard pile
  let firstCard = room.gameState.deck.pop();
  // Ensure first card is not a wild draw four (simplified)
  while (firstCard && firstCard.value === 'Wild Draw Four') {
    room.gameState.deck.push(firstCard);
    room.gameState.deck = shuffleDeck(room.gameState.deck);
    firstCard = room.gameState.deck.pop();
  }
  room.gameState.discardPile.push(firstCard);
  // Notify all players of game start and their hand
  room.gameState.players.forEach(player => {
    io.to(player.id).emit('gameState', {
      ...room.gameState,
      hand: player.hand // Only send the player's own hand
    });
  });
  // Start the first turn
  io.to(roomCode).emit('turnStart', {
    playerId: room.gameState.players[room.gameState.currentPlayerIndex].id,
    roomState: {
      topCard: room.gameState.discardPile[room.gameState.discardPile.length - 1],
      direction: room.gameState.direction,
      drawCount: room.gameState.drawCount
    }
  });
}

// Helper functions for UNO game logic
function createDeck() {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'];
  const colors = ['Red', 'Green', 'Blue', 'Yellow'];
  const specials = ['Wild', 'Wild Draw Four'];
  let deck = [];

  // Number cards
  for (const color of colors) {
    // One zero
    deck.push({ color, value: '0' });
    // Two of each other number
    for (let i = 1; i <= 9; i++) {
      deck.push({ color, value: i.toString() });
      deck.push({ color, value: i.toString() });
    }
    // Two of each action card
    for (const action of ['Skip', 'Reverse', 'Draw Two']) {
      deck.push({ color, value: action });
      deck.push({ color, value: action });
    }
  }

  // Wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ color: null, value: 'Wild' });
    deck.push({ color: null, value: 'Wild Draw Four' });
  }

  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});