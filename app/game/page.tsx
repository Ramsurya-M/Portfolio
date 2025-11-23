"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import { useGameState } from './useGameState';
import { integrateCoins, handleWalls, handleCollisions, checkPockets, isAnyMoving } from './physics';
import { LOGICAL_SIZE, STRIKER_AREA_HEIGHT, COIN_RADIUS, STRIKER_RADIUS, POWER_MULTIPLIER, MAX_POWER } from './constants';
import { clamp, len } from './utils';
import GameBoard from './GameBoard';
import GameUI from './GameUI';
import Lobby from './Lobby';
import { Vec, MultiplayerState } from './types';

export default function GamePage() {
  const rafRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // multiplayer state
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>({
    isConnected: false,
    roomId: null,
    playerRole: null,
    opponentConnected: false,
    gameStarted: false,
  });

  // input/drag refs
  const pointerDownRef = useRef(false);
  const dragStartRef = useRef<Vec | null>(null);
  const dragCurRef = useRef<Vec | null>(null);
  const aimingRef = useRef(false);

  const {
    coinsRef,
    strikerRef,
    gameState,
    setCurrentPlayer,
    setScores,
    setMessage,
    setPocketedCounts,
    setIsAnyMoving,
    resetTable,
    updatePocketCounts,
    switchPlayer,
    getStrikerYForPlayer,
    checkWinCondition,
  } = useGameState();

  /* ---------- init ---------- */
  useEffect(() => {
    if (multiplayerState.gameStarted) {
      resetTable();
      startLoop();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [multiplayerState.gameStarted]);

  /* ---------- socket listeners ---------- */
  useEffect(() => {
    if (socketRef.current) {
      const socket = socketRef.current;

      socket.on('gameUpdate', (gameStateUpdate) => {
        // Update local state from server
        setCurrentPlayer(gameStateUpdate.currentPlayer);
        setScores(gameStateUpdate.scores);
        setMessage(gameStateUpdate.message);
        setPocketedCounts(gameStateUpdate.pocketedCounts);
        setIsAnyMoving(gameStateUpdate.isAnyMoving);

        // Update coins and striker
        coinsRef.current = gameStateUpdate.coins.map((c: any) => ({ ...c }));
        if (gameStateUpdate.striker) {
          strikerRef.current = { ...gameStateUpdate.striker };
        }
      });

      return () => {
        socket.off('gameUpdate');
      };
    }
  }, [multiplayerState.gameStarted]);

  const handleGameStart = (socket: Socket, newMultiplayerState: MultiplayerState) => {
    socketRef.current = socket;
    setMultiplayerState(newMultiplayerState);
  };

  /* ---------- main loop ---------- */
  function startLoop() {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(34, now - last);
      last = now;
      physicsTick(dt / 16.67);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  /* ---------- physics ---------- */
  function physicsTick(factor = 1) {
    const coins = coinsRef.current;
    const s = strikerRef.current;
    if (!s) return;

    // Substepping for better accuracy
    const substeps = 2;
    const subFactor = factor / substeps;
    for (let i = 0; i < substeps; i++) {
      integrateCoins(coins, s, subFactor);
      handleWalls(coins, s, 28);
      handleCollisions(coins, s);
    }

    const pocketedThisTick = checkPockets(coins, s);

    let gameOver = false;
    if (pocketedThisTick.length > 0) {
      for (const c of pocketedThisTick) {
        if (c.kind === "striker") {
          const opp = gameState.currentPlayer === 1 ? 2 : 1;
          setScores((prev) => ({ ...prev, [opp]: prev[opp] + 5 }));
          setMessage(`Striker pocketed: Player ${opp} +5. Striker will reset to other side.`);
        } else if (c.kind === "queen") {
          setScores((prev) => ({ ...prev, [gameState.currentPlayer]: prev[gameState.currentPlayer] + 3 }));
          setMessage(`Player ${gameState.currentPlayer} pocketed the Queen (+3).`);
        } else {
          setScores((prev) => ({ ...prev, [gameState.currentPlayer]: prev[gameState.currentPlayer] + 1 }));
          setMessage(`Player ${gameState.currentPlayer} pocketed a coin (+1).`);
        }
      }
      updatePocketCounts();
      gameOver = checkWinCondition();
    }

    const anyMoving = isAnyMoving(coins, s);
    setIsAnyMoving(anyMoving);

    // Send game state update to server if multiplayer
    if (multiplayerState.gameStarted && socketRef.current && multiplayerState.roomId) {
      const gameStateUpdate = {
        currentPlayer: gameState.currentPlayer,
        scores: gameState.scores,
        message: gameState.message,
        pocketedCounts: gameState.pocketedCounts,
        isAnyMoving: anyMoving,
        coins: coins.map(c => ({ ...c })),
        striker: s ? { ...s } : null
      };
      socketRef.current.emit('gameUpdate', {
        roomId: multiplayerState.roomId,
        gameState: gameStateUpdate
      });
    }

    // When everything stops and last shot flag was set -> switch player and reset striker to opposite side
    if (!anyMoving && s._justShot && !gameOver) {
      s._justShot = false;
      switchPlayer();
    }
  }

  /* ---------- input handling ---------- */
  const toLogical = (clientX: number, clientY: number) => {
    const scale = Math.min(window.innerWidth / LOGICAL_SIZE, window.innerHeight / LOGICAL_SIZE);
    const boardLeft = (window.innerWidth - LOGICAL_SIZE * scale) / 2;
    const boardTop = (window.innerHeight - LOGICAL_SIZE * scale) / 2;
    const x = (clientX - boardLeft) / scale;
    const y = (clientY - boardTop) / scale;
    return { x, y };
  };

  const positioningThreshold = 10;

  const onPointerDown = (ev: MouseEvent | TouchEvent) => {
    const touch = (ev as TouchEvent).touches ? (ev as TouchEvent).touches[0] : undefined;
    const cx = touch ? touch.clientX : (ev as MouseEvent).clientX;
    const cy = touch ? touch.clientY : (ev as MouseEvent).clientY;
    const p = toLogical(cx, cy);

    const s = strikerRef.current!;
    const areaTop = gameState.currentPlayer === 1 ? LOGICAL_SIZE - STRIKER_AREA_HEIGHT : 0;
    const areaBottom = gameState.currentPlayer === 1 ? LOGICAL_SIZE : STRIKER_AREA_HEIGHT;
    const inArea = p.y >= areaTop && p.y <= areaBottom;
    const nearStriker = Math.sqrt((p.x - s.x) ** 2 + (p.y - s.y) ** 2) <= s.r + 20;

    if (!inArea || !nearStriker || gameState.isAnyMoving) return;

    // In multiplayer, only allow moves when it's your turn
    if (multiplayerState.gameStarted && multiplayerState.playerRole !== gameState.currentPlayer) {
      setMessage("It's not your turn!");
      return;
    }

    ev.preventDefault();
    pointerDownRef.current = true;
    dragStartRef.current = p;
    dragCurRef.current = p;
    aimingRef.current = false;
  };

  const onPointerMove = (ev: MouseEvent | TouchEvent) => {
    if (!pointerDownRef.current) return;
    const touch = (ev as TouchEvent).touches ? (ev as TouchEvent).touches[0] : undefined;
    const cx = touch ? touch.clientX : (ev as MouseEvent).clientX;
    const cy = touch ? touch.clientY : (ev as MouseEvent).clientY;
    const p = toLogical(cx, cy);
    dragCurRef.current = p;

    const start = dragStartRef.current;
    if (!start) return;
    const dy = start.y - p.y;
    if (Math.abs(dy) > positioningThreshold) aimingRef.current = true;

    const s = strikerRef.current!;
    if (!aimingRef.current) {
      // allow horizontal repositioning within board limits
      const left = 59 + s.r;
      const right = LOGICAL_SIZE - 59 - s.r;
      s.x = clamp(p.x, left, right);
      s.y = getStrikerYForPlayer(gameState.currentPlayer);
    }
  };

  const onPointerUp = () => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;
    const start = dragStartRef.current;
    const end = dragCurRef.current;
    dragStartRef.current = null;
    dragCurRef.current = null;

    if (!start || !end) return;

    const s = strikerRef.current!;
    if (aimingRef.current) {
      // compute pull vector
      const dx = start.x - end.x;
      const dy = start.y - end.y;
      const power = clamp(len(dx, dy), 0, MAX_POWER);
      if (power < 8) {
        setMessage("Shot too weak — pull more.");
        aimingRef.current = false;
        return;
      }
      const nx = dx / (power || 1);
      const ny = dy / (power || 1);
      s.vx = nx * power * POWER_MULTIPLIER;
      s.vy = ny * power * POWER_MULTIPLIER;
      s._justShot = true;
      setMessage(`Player ${gameState.currentPlayer} shot (power ${Math.round(power)})`);
    } else {
      setMessage(`Striker positioned X=${Math.round(s.x)}. Pull vertically to shoot.`);
    }
    aimingRef.current = false;
  };

  /* ---------- control helpers ---------- */
  const handleReset = () => {
    resetTable();
    setMessage("Table reset. Player 1 to play.");
  };

  const handlePass = () => {
    setCurrentPlayer((p) => {
      const next = p === 1 ? 2 : 1;
      const s = strikerRef.current;
      if (s) {
        s.x = LOGICAL_SIZE / 2;
        s.y = getStrikerYForPlayer(next);
        s.vx = 0;
        s.vy = 0;
      }
      setMessage(`Forced pass. Player ${next} turn.`);
      return next;
    });
  };

  /* ---------- periodic update for counts ---------- */
  useEffect(() => {
    const t = setInterval(() => updatePocketCounts(), 500);
    return () => clearInterval(t);
  }, []);

  /* ---------- JSX ---------- */
  if (!multiplayerState.gameStarted) {
    return <Lobby onGameStart={handleGameStart} />;
  }

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#071427", color: "#e6edf3", boxSizing: "border-box", position: "relative" }}>
      <GameUI
        currentPlayer={gameState.currentPlayer}
        scores={gameState.scores}
        message={gameState.message}
        pocketedCounts={gameState.pocketedCounts}
        onReset={handleReset}
        onPass={handlePass}
      />
      <GameBoard
        coins={coinsRef.current}
        striker={strikerRef.current}
        currentPlayer={gameState.currentPlayer}
        pointerDown={pointerDownRef.current}
        dragStart={dragStartRef.current}
        dragCur={dragCurRef.current}
        aiming={aimingRef.current}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}
