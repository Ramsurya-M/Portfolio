export const COLORS = ['red', 'green', 'yellow', 'blue'];

export class LudoEngine {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gameStarted = false;
    this.winner = null;
    this.diceValue = 1;
    this.isDiceRolled = false;
    this.turnHistory = [];
    this.boardState = this.initializeBoard();
    this.consecutiveSixes = 0;
  }

  initializeBoard() {
    // 0-3: Red base, 4-7: Green base, 8-11: Yellow base, 12-15: Blue base
    // Each token position: -1 (base), 0-51 (main track), 52-57 (home stretch), 58 (home)
    const state = {};
    COLORS.forEach(color => {
      state[color] = [-1, -1, -1, -1];
    });
    return state;
  }

  // Map local token position (0-57) to global track index (0-51)
  // Red starts at 0, Green at 13, Yellow at 26, Blue at 39
  static getGlobalPosition(color, localPos) {
    if (localPos === -1) return -1;
    if (localPos >= 52) return 100 + localPos; // Home stretch / Home
    
    const startOffset = { red: 0, green: 13, yellow: 26, blue: 39 };
    return (localPos + startOffset[color]) % 52;
  }

  startGame(players) {
    this.players = players.map((p, i) => ({
      ...p,
      color: COLORS[i],
      tokens: [-1, -1, -1, -1],
      hasWon: false
    }));
    this.currentPlayerIndex = 0;
    this.gameStarted = true;
    this.winner = null;
    this.isDiceRolled = false;
    this.consecutiveSixes = 0;
    return this.getGameState();
  }

  rollDice(playerId) {
    if (!this.gameStarted || this.isDiceRolled) return null;
    if (this.players[this.currentPlayerIndex].id !== playerId) return null;

    this.diceValue = Math.floor(Math.random() * 6) + 1;
    this.isDiceRolled = true;

    if (this.diceValue === 6) {
      this.consecutiveSixes++;
      if (this.consecutiveSixes === 3) {
        // Turn ends immediately on triple 6
        this.nextTurn();
        return { diceValue: 6, message: 'Triple 6! Turn skipped.' };
      }
    } else {
      this.consecutiveSixes = 0;
    }

    // Check if player has any valid moves
    const validMoves = this.getValidMoves();
    if (validMoves.length === 0) {
      // Auto-skip turn if no moves possible (wait for client to show dice then auto-skip)
      // For now, let the client trigger the skip after animation
    }

    return { diceValue: this.diceValue, validMoves };
  }

  getValidMoves() {
    const player = this.players[this.currentPlayerIndex];
    const moves = [];
    player.tokens.forEach((pos, idx) => {
      if (pos === -1) {
        if (this.diceValue === 6) moves.push(idx);
      } else if (pos < 58) {
        if (pos + this.diceValue <= 58) moves.push(idx);
      }
    });
    return moves;
  }

  moveToken(playerId, tokenIndex) {
    if (!this.isDiceRolled) return { error: 'Roll dice first' };
    const player = this.players[this.currentPlayerIndex];
    if (player.id !== playerId) return { error: 'Not your turn' };

    const validMoves = this.getValidMoves();
    if (!validMoves.includes(tokenIndex)) return { error: 'Invalid move' };

    let currentPos = player.tokens[tokenIndex];
    if (currentPos === -1) {
      player.tokens[tokenIndex] = 0; // Move out of base
    } else {
      player.tokens[tokenIndex] += this.diceValue;
    }

    const newPos = player.tokens[tokenIndex];
    
    // Handle Capture
    if (newPos >= 0 && newPos < 52) {
      this.checkCapture(player.color, newPos);
    }

    // Check Win Condition for Player
    if (player.tokens.every(t => t === 58)) {
      player.hasWon = true;
      if (!this.winner) this.winner = player;
    }

    // Extra turn on 6 or capture or reaching home
    const gotExtraTurn = this.diceValue === 6 || this.capturedLastTurn || newPos === 58;
    this.capturedLastTurn = false;

    if (!gotExtraTurn) {
      this.nextTurn();
    } else {
      this.isDiceRolled = false; // Allow rolling again
    }

    return { success: true, gameState: this.getGameState() };
  }

  checkCapture(moverColor, localPos) {
    const globalPos = LudoEngine.getGlobalPosition(moverColor, localPos);
    
    // Safe spots: 0, 8, 13, 21, 26, 34, 39, 47 (Global indices)
    const safeSpots = [0, 8, 13, 21, 26, 34, 39, 47];
    if (safeSpots.includes(globalPos)) return;

    this.players.forEach(p => {
      if (p.color === moverColor) return;
      p.tokens.forEach((pos, idx) => {
        if (pos >= 0 && pos < 52) {
          const enemyGlobal = LudoEngine.getGlobalPosition(p.color, pos);
          if (enemyGlobal === globalPos) {
            p.tokens[idx] = -1; // Send back to base
            this.capturedLastTurn = true;
          }
        }
      });
    });
  }

  nextTurn() {
    this.isDiceRolled = false;
    this.consecutiveSixes = 0;
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    // Skip players who have won
    while (this.players[this.currentPlayerIndex].hasWon && !this.isGameOver()) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
  }

  isGameOver() {
    const activePlayers = this.players.filter(p => !p.hasWon);
    return activePlayers.length <= 1;
  }

  getGameState() {
    return {
      players: this.players,
      currentPlayerIndex: this.currentPlayerIndex,
      diceValue: this.diceValue,
      isDiceRolled: this.isDiceRolled,
      gameStarted: this.gameStarted,
      winner: this.winner
    };
  }
}
