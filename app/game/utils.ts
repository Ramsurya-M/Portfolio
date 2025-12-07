import { Vec } from './types';

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const len = (dx: number, dy: number) => Math.sqrt(dx * dx + dy * dy);
export const dist = (a: Vec, b: Vec) => len(a.x - b.x, a.y - b.y);