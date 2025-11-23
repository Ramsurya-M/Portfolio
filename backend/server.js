const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const rooms = new Map(); // roomId -> { players: [socketId1, socketId2], gameState: {...} }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', () => {
    const roomId = generateRoomId();
    rooms.set(roomId, {
      players: [socket.id],
      gameState: null,
      playerRoles: { [socket.id]: 1 }
    });
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  socket.on('joinRoom', (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    if (room.players.length >= 2) {
      socket.emit('error', 'Room is full');
      return;
    }

    room.players.push(socket.id);
    room.playerRoles[socket.id] = 2;
    socket.join(roomId);

    // Notify both players
    io.to(roomId).emit('roomJoined', {
      roomId,
      players: room.players.map(id => ({ id, role: room.playerRoles[id] }))
    });

    console.log(`Player ${socket.id} joined room ${roomId}`);
  });

  socket.on('startGame', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || room.players.length !== 2) return;

    // Initialize basic game state - full state will be synced by clients
    room.gameState = {
      currentPlayer: 1,
      scores: { 1: 0, 2: 0 },
      message: "Player 1 to play.",
      pocketedCounts: { total: 0, queen: 0 },
      isAnyMoving: false
    };

    io.to(roomId).emit('gameStarted', room.gameState);
  });

  socket.on('gameUpdate', (data) => {
    const { roomId, gameState } = data;
    const room = rooms.get(roomId);
    if (!room) return;

    room.gameState = gameState;
    // Broadcast to other player
    socket.to(roomId).emit('gameUpdate', gameState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from rooms
    for (const [roomId, room] of rooms.entries()) {
      const index = room.players.indexOf(socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        delete room.playerRoles[socket.id];
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          // Notify remaining player
          io.to(roomId).emit('playerDisconnected');
        }
        break;
      }
    }
  });
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});