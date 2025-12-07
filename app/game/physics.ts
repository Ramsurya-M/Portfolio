import { Coin, Vec } from './types';
import { LOGICAL_SIZE, POCKET_RADIUS, FRICTION, WALL_RESTITUTION, COIN_RESTITUTION, MIN_VEL } from './constants';
import { dist } from './utils';

export function integrateCoins(coins: Coin[], striker: Coin | null, factor: number) {
  const integrate = (c: Coin) => {
    if (c.pocketed) return;
    // Apply friction
    c.vx *= FRICTION;
    c.vy *= FRICTION;
    // Stop very slow movement
    if (Math.abs(c.vx) < MIN_VEL) c.vx = 0;
    if (Math.abs(c.vy) < MIN_VEL) c.vy = 0;
    // Verlet-like integration for stability
    c.x += c.vx * factor;
    c.y += c.vy * factor;
  };

  for (const c of coins) integrate(c);
  if (striker) integrate(striker);
}

export function handleWalls(coins: Coin[], striker: Coin | null, margin: number) {
  const W = LOGICAL_SIZE;
  const H = LOGICAL_SIZE;
  const bounce = (c: Coin) => {
    if (c.pocketed) return;
    if (c.x - c.r < margin) {
      c.x = margin + c.r;
      c.vx = -c.vx * WALL_RESTITUTION;
    }
    if (c.x + c.r > W - margin) {
      c.x = W - margin - c.r;
      c.vx = -c.vx * WALL_RESTITUTION;
    }
    if (c.y - c.r < margin) {
      c.y = margin + c.r;
      c.vy = -c.vy * WALL_RESTITUTION;
    }
    if (c.y + c.r > H - margin) {
      c.y = H - margin - c.r;
      c.vy = -c.vy * WALL_RESTITUTION;
    }
  };
  for (const c of coins) bounce(c);
  if (striker) bounce(striker);
}

export function handleCollisions(coins: Coin[], striker: Coin | null) {
  const allCoins = striker ? [...coins, striker] : coins;

  // Spatial hash for optimization
  const cellSize = 50;
  const grid: { [key: string]: Coin[] } = {};

  const getKey = (x: number, y: number) => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  for (const c of allCoins) {
    if (c.pocketed) continue;
    const key = getKey(c.x, c.y);
    if (!grid[key]) grid[key] = [];
    grid[key].push(c);
  }

  const checked = new Set<string>();

  const handleCollision = (a: Coin, b: Coin) => {
    if (a.pocketed || b.pocketed) return;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const minD = a.r + b.r;
    if (d < minD) {
      const overlap = 0.5 * (minD - d + 0.01);
      const nx = dx / d;
      const ny = dy / d;
      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;

      const rvx = b.vx - a.vx;
      const rvy = b.vy - a.vy;
      const velAlong = rvx * nx + rvy * ny;
      if (velAlong > 0) return;
      const impulse = -(1 + COIN_RESTITUTION) * velAlong / 2;
      const ix = impulse * nx;
      const iy = impulse * ny;
      a.vx -= ix;
      a.vy -= iy;
      b.vx += ix;
      b.vy += iy;
    }
  };

  for (const cell of Object.values(grid)) {
    for (let i = 0; i < cell.length; i++) {
      for (let j = i + 1; j < cell.length; j++) {
        const pairKey = `${Math.min(cell[i].id, cell[j].id)}-${Math.max(cell[i].id, cell[j].id)}`;
        if (!checked.has(pairKey)) {
          checked.add(pairKey);
          handleCollision(cell[i], cell[j]);
        }
      }
    }
  }

  // Check adjacent cells
  const directions = [
    [0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]
  ];

  for (const [dx, dy] of directions) {
    for (const key in grid) {
      const [x, y] = key.split(',').map(Number);
      const adjKey = `${x + dx},${y + dy}`;
      if (grid[adjKey]) {
        for (const a of grid[key]) {
          for (const b of grid[adjKey]) {
            if (a.id < b.id) {
              const pairKey = `${a.id}-${b.id}`;
              if (!checked.has(pairKey)) {
                checked.add(pairKey);
                handleCollision(a, b);
              }
            }
          }
        }
      }
    }
  }
}

export function checkPockets(coins: Coin[], striker: Coin | null): Coin[] {
  const pockets: Vec[] = [
    { x: POCKET_RADIUS, y: POCKET_RADIUS },
    { x: LOGICAL_SIZE - POCKET_RADIUS, y: POCKET_RADIUS },
    { x: POCKET_RADIUS, y: LOGICAL_SIZE - POCKET_RADIUS },
    { x: LOGICAL_SIZE - POCKET_RADIUS, y: LOGICAL_SIZE - POCKET_RADIUS },
  ];

  const pocketedThisTick: Coin[] = [];
  const checkPocket = (c: Coin) => {
    if (c.pocketed) return;
    for (const p of pockets) {
      if (dist({ x: c.x, y: c.y }, p) < POCKET_RADIUS - 6) {
        c.pocketed = true;
        c.vx = 0;
        c.vy = 0;
        pocketedThisTick.push(c);
        break;
      }
    }
  };

  for (const c of coins) checkPocket(c);
  if (striker) checkPocket(striker);

  return pocketedThisTick;
}

export function isAnyMoving(coins: Coin[], striker: Coin | null): boolean {
  if (striker && (striker.vx !== 0 || striker.vy !== 0)) return true;
  for (const c of coins) if (c.vx !== 0 || c.vy !== 0) return true;
  return false;
}