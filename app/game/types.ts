export type Vec = { x: number; y: number };

export type CoinKind = "coin" | "queen" | "striker";

export type Coin = {
  id: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  kind: CoinKind;
  pocketed: boolean;
  _justShot?: boolean;
};

export type Player = 1 | 2;

export type GameState = {
  currentPlayer: Player;
  scores: { 1: number; 2: number };
  message: string;
  pocketedCounts: { total: number; queen: number };
  isAnyMoving: boolean;
};

export type MultiplayerState = {
  isConnected: boolean;
  roomId: string | null;
  playerRole: Player | null;
  opponentConnected: boolean;
  gameStarted: boolean;
};