export const CARD_COLORS = ['red', 'blue', 'green', 'yellow'];
export const CARD_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
export const WILD_VALUES = ['wild', 'wild4'];

export class UnoEngine {
  constructor() {
    this.deck = [];
    this.discardPile = [];
    this.players = [];
    this.currentPlayerIndex = 0;
    this.direction = 1;
    this.gameStarted = false;
    this.winner = null;
    this.currentColor = null;
    this.currentValue = null;
    this.unoCalled = new Set();
    this.pendingDraw = 0; // Cumulative draw amount
    this.waitingForColor = false;
  }

  createDeck() {
    let deck = [];
    for (const color of CARD_COLORS) {
      deck.push({ color, value: '0', id: `${color}_0` });
      for (let i = 1; i <= 12; i++) {
        const value = CARD_VALUES[i];
        deck.push({ color, value, id: `${color}_${value}_1` });
        deck.push({ color, value, id: `${color}_${value}_2` });
      }
    }
    for (let i = 0; i < 4; i++) {
      deck.push({ color: 'wild', value: 'wild', id: `wild_${i}` });
      deck.push({ color: 'wild', value: 'wild4', id: `wild4_${i}` });
    }
    return deck;
  }

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  startGame(players) {
    this.players = players.map(p => ({ ...p, hand: [] }));
    this.deck = this.shuffle(this.createDeck());
    this.discardPile = [];
    this.gameStarted = true;
    this.winner = null;
    this.direction = 1;
    this.currentPlayerIndex = 0;
    this.unoCalled.clear();
    this.pendingDraw = 0;

    // Deal 7 cards
    for (let i = 0; i < 7; i++) {
      for (let player of this.players) {
        player.hand.push(this.deck.pop());
      }
    }

    let firstCard = this.deck.pop();
    // Wild Draw 4: Return to deck and reshuffle
    while (firstCard.value === 'wild4') {
      this.deck.unshift(firstCard);
      this.shuffle(this.deck);
      firstCard = this.deck.pop();
    }
    
    this.discardPile.push(firstCard);
    this.currentColor = firstCard.color;
    this.currentValue = firstCard.value;

    // Apply first card effects
    if (firstCard.value === 'skip') {
      this.currentPlayerIndex = 1 % this.players.length;
    } else if (firstCard.value === 'reverse') {
      if (this.players.length === 2) {
        this.currentPlayerIndex = 1 % this.players.length;
      } else {
        this.direction = -1;
        this.currentPlayerIndex = (this.players.length - 1) % this.players.length;
      }
    } else if (firstCard.value === 'draw2') {
      this.pendingDraw = 2;
      // In some rules, first player draws and skip. 
      // For simplicity, we just set pendingDraw and the first player must draw.
    } else if (firstCard.value === 'wild') {
      // First player chooses color - engine remains in currentColor = 'wild'
    }

    return this.getGameState();
  }

  getGameState() {
    return {
      discardPileSize: this.discardPile.length,
      topCard: this.discardPile[this.discardPile.length - 1],
      currentColor: this.currentColor,
      currentValue: this.currentValue,
      currentPlayerIndex: this.currentPlayerIndex,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        handSize: p.hand.length,
        unoCalled: this.unoCalled.has(p.id),
        isHost: p.isHost
      })),
      direction: this.direction,
      gameStarted: this.gameStarted,
      winner: this.winner,
      pendingDraw: this.pendingDraw
    };
  }

  drawCard(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return null;

    // If there's a pending draw (from Draw 2 or Wild 4), player must draw all of them
    const amount = this.pendingDraw > 0 ? this.pendingDraw : 1;
    const drawnCards = [];

    for (let i = 0; i < amount; i++) {
      if (this.deck.length === 0) {
        const topCard = this.discardPile.pop();
        this.deck = this.shuffle([...this.discardPile]);
        this.discardPile = [topCard];
      }
      if (this.deck.length > 0) {
        const card = this.deck.pop();
        player.hand.push(card);
        drawnCards.push(card);
      }
    }

    this.pendingDraw = 0; // Reset pending draw
    this.unoCalled.delete(playerId); // If you draw, you don't have UNO status anymore
    
    return drawnCards;
  }

  playCard(playerId, cardId, newColor = null) {
    const player = this.players.find(p => p.id === playerId);
    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return { error: 'Card not found' };

    const card = player.hand[cardIndex];

    // Validation
    const isWild = WILD_VALUES.includes(card.value);
    const colorMatch = card.color === this.currentColor;
    const valueMatch = card.value === this.currentValue;

    if (!isWild && !colorMatch && !valueMatch) {
      return { error: 'Invalid move' };
    }

    // Play the card
    player.hand.splice(cardIndex, 1);
    this.discardPile.push(card);
    this.currentColor = isWild ? newColor : card.color;
    this.currentValue = card.value;

    // Penalty check: if player has 1 card left but didn't call UNO
    if (player.hand.length === 1 && !this.unoCalled.has(playerId)) {
      // They played a card and now have 1 left. If they didn't call UNO yet, they might get penalized.
      // Usually, others have to "catch" them. For automation, we'll wait for the next turn.
    }

    // Check for win
    if (player.hand.length === 0) {
      this.winner = { id: player.id, name: player.name };
      this.gameStarted = false;
      return { success: true };
    }

    // Handle Action Cards
    this.handleActionCard(card);

    return { success: true };
  }

  handleActionCard(card) {
    if (card.value === 'skip') {
      this.nextTurn();
      this.nextTurn();
    } else if (card.value === 'reverse') {
      if (this.players.length === 2) {
        this.nextTurn();
        this.nextTurn();
      } else {
        this.direction *= -1;
        this.nextTurn();
      }
    } else if (card.value === 'draw2') {
      this.pendingDraw += 2;
      this.nextTurn();
    } else if (card.value === 'wild4') {
      this.pendingDraw += 4;
      this.nextTurn();
    } else {
      this.nextTurn();
    }
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
  }

  callUno(playerId) {
    const player = this.players.find(p => p.id === playerId);
    // You can call UNO if you have 2 cards and are about to play one, or if you already have 1.
    if (player && player.hand.length <= 2) {
      this.unoCalled.add(playerId);
      return true;
    }
    return false;
  }

  applyPenalty(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (player && player.hand.length === 1 && !this.unoCalled.has(playerId)) {
      // Penalize with 2 cards
      this.drawCard(playerId);
      this.drawCard(playerId);
      return true;
    }
    return false;
  }
}
