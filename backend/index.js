import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { UnoEngine } from './unoEngine.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const rooms = new Map(); // roomId -> { engine, players, hostId, messages }

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ playerName }) => {
    const roomId = generateRoomCode();
    const engine = new UnoEngine();
    const player = { id: socket.id, name: playerName, socketId: socket.id, isHost: true, color: `hsl(${Math.random() * 360}, 70%, 60%)` };
    
    rooms.set(roomId, { engine, players: [player], hostId: socket.id, messages: [] });
    socket.join(roomId);
    
    socket.emit('room_created', { roomId, player });
  });

  socket.on('join_room', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    if (!room) return socket.emit('error', 'Room not found');
    if (room.players.length >= 8) return socket.emit('error', 'Room is full');
    if (room.engine.gameStarted) return socket.emit('error', 'Game already started');

    const player = { id: socket.id, name: playerName, socketId: socket.id, isHost: false, color: `hsl(${Math.random() * 360}, 70%, 60%)` };
    room.players.push(player);
    socket.join(roomId);

    socket.emit('room_joined', { roomId, player, players: room.players, messages: room.messages });
    socket.to(roomId).emit('player_joined', player);
  });

  socket.on('start_game', ({ roomId }) => {
    console.log(`Starting game in room: ${roomId}`);
    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id || room.players.length < 2) {
      console.log('Start game failed validation', { roomExists: !!room, isHost: room?.hostId === socket.id, players: room?.players.length });
      return;
    }

    const gameState = room.engine.startGame(room.players);
    broadcastGameState(roomId);
    console.log(`Game started in room: ${roomId}`);
  });

  socket.on('play_card', ({ roomId, cardId, newColor }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const engine = room.engine;
    if (engine.players[engine.currentPlayerIndex].id !== socket.id) return;

    const result = engine.playCard(socket.id, cardId, newColor);
    if (result.error) return socket.emit('error', result.error);

    broadcastGameState(roomId);
  });

  socket.on('draw_card', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const engine = room.engine;
    if (engine.players[engine.currentPlayerIndex].id !== socket.id) return;

    const cards = engine.drawCard(socket.id);
    socket.emit('cards_drawn', cards);
    
    // In many rules, if you draw because of an action card, your turn is skipped.
    // engine.drawCard handles resetting pendingDraw.
    // If it was a normal draw (no pendingDraw), usually you can play the card or pass.
    // For simplicity, drawing ends the turn.
    engine.nextTurn();
    broadcastGameState(roomId);
  });

  socket.on('call_uno', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room?.engine.callUno(socket.id)) {
      io.in(roomId).emit('uno_called', { playerId: socket.id });
    }
  });

  socket.on('catch_uno', ({ roomId, targetPlayerId }) => {
    const room = rooms.get(roomId);
    if (room?.engine.applyPenalty(targetPlayerId)) {
      io.in(roomId).emit('penalty_applied', { playerId: targetPlayerId });
      broadcastGameState(roomId);
    }
  });

  // Communication
  socket.on('send_message', ({ roomId, text }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const message = { id: Date.now(), playerId: socket.id, playerName: player.name, text, color: player.color, timestamp: new Date() };
    room.messages.push(message);
    if (room.messages.length > 50) room.messages.shift();
    io.in(roomId).emit('new_message', message);
  });

  socket.on('send_quick_chat', ({ roomId, text }) => {
    io.in(roomId).emit('quick_chat', { playerId: socket.id, text });
  });

  socket.on('send_sticker', ({ roomId, sticker }) => {
    io.in(roomId).emit('new_sticker', { playerId: socket.id, sticker });
  });

  socket.on('send_meme', ({ roomId, memeUrl }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const message = { 
      id: Date.now(), 
      playerId: socket.id, 
      playerName: player.name, 
      memeUrl, 
      color: player.color, 
      timestamp: new Date() 
    };
    room.messages.push(message);
    if (room.messages.length > 50) room.messages.shift();
    io.in(roomId).emit('new_message', message);
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          if (room.hostId === socket.id) {
            room.hostId = room.players[0].id;
            room.players[0].isHost = true;
            io.in(roomId).emit('host_transferred', room.hostId);
          }
          io.in(roomId).emit('player_left', socket.id);
          if (room.engine.gameStarted) {
            if (room.players.length < 2) {
              room.engine.gameStarted = false;
              io.in(roomId).emit('game_ended', { reason: 'Not enough players' });
            } else {
              broadcastGameState(roomId);
            }
          }
        }
        break;
      }
    }
  });
});

function broadcastGameState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const gameState = room.engine.getGameState();
  room.players.forEach(p => {
    const hand = room.engine.players.find(ep => ep.id === p.id)?.hand || [];
    io.to(p.socketId).emit('game_update', { gameState: { ...gameState, myHand: hand } });
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
