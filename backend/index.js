import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { UnoEngine } from './unoEngine.js';
import { LudoEngine } from './ludoEngine.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const rooms = new Map(); // Uno rooms
const ludoRooms = new Map(); // Ludo rooms

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

  // --- LUDO GAME HANDLERS ---
  socket.on('create_ludo_room', ({ playerName }) => {
    console.log('Creating Ludo room for:', playerName);
    const roomId = generateRoomCode();
    const engine = new LudoEngine();
    const player = { id: socket.id, name: playerName, socketId: socket.id, isHost: true, color: 'red' };
    
    ludoRooms.set(roomId, { engine, players: [player], hostId: socket.id, messages: [] });
    socket.join(roomId);
    socket.emit('ludo_room_created', { roomId, player });
    console.log('Ludo room created:', roomId);
  });

  socket.on('join_ludo_room', ({ roomId, playerName }) => {
    console.log('Player joining Ludo room:', roomId, playerName);
    const room = ludoRooms.get(roomId);
    if (!room) {
      console.log('Ludo room not found:', roomId);
      return socket.emit('error', 'Room not found');
    }
    if (room.players.length >= 4) return socket.emit('error', 'Room is full');
    if (room.engine.gameStarted) return socket.emit('error', 'Game already started');

    const player = { id: socket.id, name: playerName, socketId: socket.id, isHost: false, color: 'gray' };
    room.players.push(player);
    socket.join(roomId);

    socket.emit('ludo_room_joined', { roomId, player, players: room.players, messages: room.messages });
    socket.to(roomId).emit('ludo_player_joined', player);
  });

  socket.on('start_ludo_game', ({ roomId }) => {
    console.log('Starting Ludo game in room:', roomId);
    const room = ludoRooms.get(roomId);
    if (!room || room.hostId !== socket.id || room.players.length < 2) return;
    const newState = room.engine.startGame(room.players);
    // Sync colors back to the room players for UI consistency
    room.players = newState.players;
    broadcastLudoState(roomId);
  });

  socket.on('roll_ludo_dice', ({ roomId }) => {
    const room = ludoRooms.get(roomId);
    if (!room) return;
    const result = room.engine.rollDice(socket.id);
    if (result) {
      io.in(roomId).emit('ludo_dice_rolled', { 
        playerId: socket.id, 
        value: result.diceValue, 
        validMoves: result.validMoves 
      });
      broadcastLudoState(roomId);
      // If no valid moves, engine might have auto-skipped or we wait for client
      if (result.validMoves.length === 0) {
        setTimeout(() => {
          room.engine.nextTurn();
          broadcastLudoState(roomId);
        }, 2000);
      }
    }
  });

  socket.on('move_ludo_token', ({ roomId, tokenIndex }) => {
    const room = ludoRooms.get(roomId);
    if (!room) return;
    const result = room.engine.moveToken(socket.id, tokenIndex);
    if (result.success) {
      broadcastLudoState(roomId);
    } else {
      socket.emit('error', result.error);
    }
  });

  socket.on('send_ludo_message', ({ roomId, text }) => {
    const room = ludoRooms.get(roomId);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    const message = { id: Date.now(), playerId: socket.id, playerName: player.name, text, color: player.color, timestamp: new Date() };
    room.messages.push(message);
    io.in(roomId).emit('new_ludo_message', message);
  });

  socket.on('disconnect', () => {
    // Handle Uno rooms disconnect
    for (const [roomId, room] of rooms.entries()) {
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        if (room.players.length === 0) rooms.delete(roomId);
        else {
          if (room.hostId === socket.id) {
            room.hostId = room.players[0].id;
            room.players[0].isHost = true;
          }
          io.in(roomId).emit('player_left', socket.id);
          broadcastGameState(roomId);
        }
        break;
      }
    }
    // Handle Ludo rooms disconnect
    for (const [roomId, room] of ludoRooms.entries()) {
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        if (room.players.length === 0) ludoRooms.delete(roomId);
        else {
          if (room.hostId === socket.id) {
            room.hostId = room.players[0].id;
            room.players[0].isHost = true;
          }
          io.in(roomId).emit('ludo_player_left', socket.id);
          broadcastLudoState(roomId);
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

function broadcastLudoState(roomId) {
  const room = ludoRooms.get(roomId);
  if (!room) return;
  const gameState = room.engine.getGameState();
  io.in(roomId).emit('ludo_game_update', { gameState });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
