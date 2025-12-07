import { useRef, useState } from 'react';
import { Coin, Player, GameState } from './types';
import { LOGICAL_SIZE, COIN_RADIUS, STRIKER_RADIUS } from './constants';

export function useGameState() {
  const coinsRef = useRef<Coin[]>([]);
  const strikerRef = useRef<Coin | null>(null);

  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [message, setMessage] = useState("Position striker horizontally then pull vertically to shoot.");
  const [pocketedCounts, setPocketedCounts] = useState({ total: 0, queen: 0 });
  const [isAnyMoving, setIsAnyMoving] = useState(false);

  const getStrikerYForPlayer = (player: Player) => {
    return player === 1 ? LOGICAL_SIZE - 175 : 175;
  };

  const resetTable = () => {
    const center = LOGICAL_SIZE / 2;
    const coins: Coin[] = [];
    let id = 1;

    // queen
    coins.push({
      id: id++,
      x: center,
      y: center,
      r: COIN_RADIUS,
      vx: 0,
      vy: 0,
      color: "#ff3b30",
      kind: "queen",
      pocketed: false,
    });

    // cluster
    const ringR = COIN_RADIUS * 3.2;
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      coins.push({
        id: id++,
        x: center + ringR * Math.cos(ang),
        y: center + ringR * Math.sin(ang),
        r: COIN_RADIUS,
        vx: 0,
        vy: 0,
        color: i % 2 === 0 ? "#0b0b0b" : "#ffffff",
        kind: "coin",
        pocketed: false,
      });
    }

    // outer
    const outerR = COIN_RADIUS * 5.6;
    for (let i = 0; i < 6; i++) {
      const ang = ((i + 0.5) / 6) * Math.PI * 2;
      coins.push({
        id: id++,
        x: center + outerR * Math.cos(ang),
        y: center + outerR * Math.sin(ang),
        r: COIN_RADIUS,
        vx: 0,
        vy: 0,
        color: i % 2 ? "#0b0b0b" : "#ffffff",
        kind: "coin",
        pocketed: false,
      });
    }

    // extra
    let whiteCount = coins.filter((c) => c.kind === "coin" && c.color === "#ffffff").length;
    let blackCount = coins.filter((c) => c.kind === "coin" && c.color === "#0b0b0b").length;

    while (whiteCount < 9 || blackCount < 9) {
      const angle = Math.random() * Math.PI * 2;
      const radius = outerR + COIN_RADIUS * (0.8 + Math.random() * 1.6);
      const color = whiteCount < 9 ? "#ffffff" : "#0b0b0b";
      coins.push({
        id: id++,
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        r: COIN_RADIUS,
        vx: 0,
        vy: 0,
        color,
        kind: "coin",
        pocketed: false,
      });
      if (color === "#ffffff") whiteCount++;
      else blackCount++;
    }

    coinsRef.current = coins;

    strikerRef.current = {
      id: 9999,
      x: LOGICAL_SIZE / 2,
      y: getStrikerYForPlayer(1),
      r: STRIKER_RADIUS,
      vx: 0,
      vy: 0,
      color: "#ffffff",
      kind: "striker",
      pocketed: false,
    };

    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
    setMessage("Player 1 (bottom) to play. Position striker horizontally then pull vertically to shoot.");
    setPocketedCounts({ total: 0, queen: 0 });
  };

  const updatePocketCounts = () => {
    const coins = coinsRef.current;
    const total = coins.filter((c) => c.pocketed && c.kind !== "striker").length;
    const queen = coins.filter((c) => c.pocketed && c.kind === "queen").length;
    setPocketedCounts({ total, queen });
  };

  const switchPlayer = () => {
    setCurrentPlayer((p) => {
      const next = p === 1 ? 2 : 1;
      const s = strikerRef.current;
      if (s) {
        s.vx = 0;
        s.vy = 0;
        s.pocketed = false;
        s.x = LOGICAL_SIZE / 2;
        s.y = getStrikerYForPlayer(next);
      }
      setMessage(`Motion stopped. Player ${next} turn — striker moved to opposite side.`);
      return next;
    });
  };

  const checkWinCondition = () => {
    const coins = coinsRef.current;
    const whitePocketed = coins.filter(c => c.kind === "coin" && c.color === "#ffffff" && c.pocketed).length;
    const blackPocketed = coins.filter(c => c.kind === "coin" && c.color === "#0b0b0b" && c.pocketed).length;
    const queenPocketed = coins.some(c => c.kind === "queen" && c.pocketed);

    if (whitePocketed >= 9 && blackPocketed >= 9 && queenPocketed) {
      // Game over, determine winner
      const p1Score = scores[1];
      const p2Score = scores[2];
      if (p1Score > p2Score) {
        setMessage("Game Over! Player 1 wins!");
      } else if (p2Score > p1Score) {
        setMessage("Game Over! Player 2 wins!");
      } else {
        setMessage("Game Over! It's a tie!");
      }
      return true;
    }
    return false;
  };

  const gameState: GameState = {
    currentPlayer,
    scores,
    message,
    pocketedCounts,
    isAnyMoving,
  };

  return {
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
  };
}