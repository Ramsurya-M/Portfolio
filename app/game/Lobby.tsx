"use client";

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { MultiplayerState, Player } from './types';

interface LobbyProps {
  onGameStart: (socket: Socket, multiplayerState: MultiplayerState) => void;
}

export default function Lobby({ onGameStart }: LobbyProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>({
    isConnected: false,
    roomId: null,
    playerRole: null,
    opponentConnected: false,
    gameStarted: false,
  });
  const [roomInput, setRoomInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setMultiplayerState(prev => ({ ...prev, isConnected: true }));
    });

    newSocket.on('disconnect', () => {
      setMultiplayerState(prev => ({ ...prev, isConnected: false }));
    });

    newSocket.on('roomCreated', (roomId: string) => {
      setMultiplayerState(prev => ({
        ...prev,
        roomId,
        playerRole: 1,
        opponentConnected: false,
      }));
      setIsCreating(false);
    });

    newSocket.on('roomJoined', (data: { roomId: string; players: { id: string; role: Player }[] }) => {
      const myRole = data.players.find(p => p.id === newSocket.id)?.role || null;
      setMultiplayerState(prev => ({
        ...prev,
        roomId: data.roomId,
        playerRole: myRole,
        opponentConnected: data.players.length === 2,
      }));
    });

    newSocket.on('gameStarted', (gameState) => {
      setMultiplayerState(prev => ({ ...prev, gameStarted: true }));
      onGameStart(newSocket, { ...multiplayerState, gameStarted: true });
    });

    newSocket.on('error', (message: string) => {
      alert(message);
    });

    newSocket.on('playerDisconnected', () => {
      setMultiplayerState(prev => ({ ...prev, opponentConnected: false }));
      alert('Opponent disconnected');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = () => {
    if (!socket) return;
    setIsCreating(true);
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (!socket || !roomInput.trim()) return;
    socket.emit('joinRoom', roomInput.trim().toUpperCase());
  };

  const startGame = () => {
    if (!socket || !multiplayerState.roomId) return;
    socket.emit('startGame', multiplayerState.roomId);
  };

  if (!multiplayerState.isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Connecting to server...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  if (multiplayerState.gameStarted) {
    return null; // Game component will render
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Online Carrom</h1>

        {!multiplayerState.roomId ? (
          <div className="space-y-4">
            <button
              onClick={createRoom}
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {isCreating ? 'Creating Room...' : 'Create Room'}
            </button>

            <div className="text-center text-gray-400">or</div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                maxLength={6}
              />
              <button
                onClick={joinRoom}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Join Room
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-xl">Room: {multiplayerState.roomId}</h2>
            <p className="text-gray-400">
              You are Player {multiplayerState.playerRole}
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p>Status: {multiplayerState.opponentConnected ? 'Opponent Connected' : 'Waiting for opponent...'}</p>
            </div>
            {multiplayerState.opponentConnected && (
              <button
                onClick={startGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Start Game
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}