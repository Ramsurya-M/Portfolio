import { integrateCoins, handleWalls, handleCollisions, checkPockets, isAnyMoving } from './physics';
import { Coin } from './types';
import { LOGICAL_SIZE } from './constants';

// Mock coins for testing
const createTestCoin = (x: number, y: number, vx: number = 0, vy: number = 0, kind: 'coin' | 'striker' = 'coin'): Coin => ({
  id: Math.random(),
  x, y, r: 28,
  vx, vy,
  color: '#ffffff',
  kind,
  pocketed: false,
});

describe('Physics Tests', () => {
  test('integrateCoins applies friction and movement', () => {
    const coin = createTestCoin(100, 100, 10, 10);
    const coins = [coin];
    const striker = null;

    integrateCoins(coins, striker, 1);

    expect(coin.x).toBeGreaterThan(100);
    expect(coin.y).toBeGreaterThan(100);
    expect(coin.vx).toBeLessThan(10); // friction applied
  });

  test('handleWalls bounces coin off wall', () => {
    const coin = createTestCoin(10, 100, -10, 0); // moving left towards wall
    const coins = [coin];
    const striker = null;

    handleWalls(coins, striker, 28);

    expect(coin.x).toBe(28 + 28); // margin + radius
    expect(coin.vx).toBeGreaterThan(0); // bounced back
  });

  test('checkPockets detects pocketed coins', () => {
    const coin = createTestCoin(47, 47); // near top-left pocket
    const coins = [coin];
    const striker = null;

    const pocketed = checkPockets(coins, striker);

    expect(pocketed).toContain(coin);
    expect(coin.pocketed).toBe(true);
  });

  test('isAnyMoving detects movement', () => {
    const movingCoin = createTestCoin(100, 100, 1, 0);
    const stillCoin = createTestCoin(200, 200, 0, 0);
    const coins = [movingCoin, stillCoin];
    const striker = createTestCoin(300, 300, 0, 0, 'striker');

    expect(isAnyMoving(coins, striker)).toBe(true);

    movingCoin.vx = 0;
    expect(isAnyMoving(coins, striker)).toBe(false);
  });
});