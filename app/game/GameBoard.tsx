import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coin, Vec } from './types';
import { LOGICAL_SIZE, POCKET_RADIUS, STRIKER_AREA_HEIGHT, BOARD_TEXTURE, COIN_RADIUS, STRIKER_RADIUS, MAX_POWER, POWER_MULTIPLIER } from './constants';
import { dist, clamp, len } from './utils';

interface GameBoardProps {
  coins: Coin[];
  striker: Coin | null;
  currentPlayer: 1 | 2;
  pointerDown: boolean;
  dragStart: Vec | null;
  dragCur: Vec | null;
  aiming: boolean;
  onPointerDown: (e: MouseEvent | TouchEvent) => void;
  onPointerMove: (e: MouseEvent | TouchEvent) => void;
  onPointerUp: () => void;
}

export default function GameBoard({
  coins,
  striker,
  currentPlayer,
  pointerDown,
  dragStart,
  dragCur,
  aiming,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = BOARD_TEXTURE;
    imgRef.current = img;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const scale = Math.min(window.innerWidth / LOGICAL_SIZE, window.innerHeight / LOGICAL_SIZE);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const translateX = (window.innerWidth - LOGICAL_SIZE * scale) / 2 * dpr;
      const translateY = (window.innerHeight - LOGICAL_SIZE * scale) / 2 * dpr;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, translateX, translateY);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

    // background
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, 0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
    } else {
      const g = ctx.createLinearGradient(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
      g.addColorStop(0, "#4a7c59");
      g.addColorStop(1, "#2d5a27");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
    }

    // rim
    ctx.lineWidth = 24;
    ctx.strokeStyle = "#8b4513";
    ctx.strokeRect(12, 12, LOGICAL_SIZE - 24, LOGICAL_SIZE - 24);

    // play area
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.strokeRect(44, 44, LOGICAL_SIZE - 88, LOGICAL_SIZE - 88);

    // pockets
    const pockets: Vec[] = [
      { x: POCKET_RADIUS + 10, y: POCKET_RADIUS + 10 },
      { x: LOGICAL_SIZE - POCKET_RADIUS - 10, y: POCKET_RADIUS + 10 },
      { x: POCKET_RADIUS + 10, y: LOGICAL_SIZE - POCKET_RADIUS - 10 },
      { x: LOGICAL_SIZE - POCKET_RADIUS - 10, y: LOGICAL_SIZE - POCKET_RADIUS - 10 },
    ];
    for (const p of pockets) {
      const grad = ctx.createRadialGradient(p.x - 6, p.y - 6, POCKET_RADIUS * 0.2, p.x, p.y, POCKET_RADIUS);
      grad.addColorStop(0, "#000");
      grad.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // zones
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    const zoneHeight = STRIKER_AREA_HEIGHT - 20;
    ctx.fillRect(59, 44, LOGICAL_SIZE - 118, zoneHeight);
    ctx.fillRect(59, LOGICAL_SIZE - 44 - zoneHeight, LOGICAL_SIZE - 118, zoneHeight);
    ctx.restore();

    // corners
    ctx.save();
    ctx.fillStyle = "#a0522d";
    const corners = [
      { x: 127, y: 107 },
      { x: LOGICAL_SIZE - 127, y: 107 },
      { x: 127, y: LOGICAL_SIZE - 107 },
      { x: LOGICAL_SIZE - 127, y: LOGICAL_SIZE - 107 },
    ];
    for (const c of corners) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#654321";
      ctx.stroke();
    }
    ctx.restore();

    // coins
    for (const c of coins) {
      if (c.pocketed) continue;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.ellipse(c.x + 5, c.y + 8, c.r * 1.0, c.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      const grad = ctx.createRadialGradient(c.x - c.r * 0.3, c.y - c.r * 0.3, 0, c.x, c.y, c.r);
      if (c.color === "#ffffff") {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#cccccc");
      } else if (c.color === "#0b0b0b") {
        grad.addColorStop(0, "#555555");
        grad.addColorStop(1, "#000000");
      } else {
        grad.addColorStop(0, "#ff6666");
        grad.addColorStop(1, "#cc0000");
      }
      ctx.fillStyle = grad;
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(c.x - c.r * 0.4, c.y - c.r * 0.4, c.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();

      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.stroke();

      if (c.kind === "queen") {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeText("♛", c.x, c.y);
        ctx.fillText("♛", c.x, c.y);
      }
      ctx.restore();
    }

    // striker
    if (striker && !striker.pocketed) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.ellipse(striker.x + 5, striker.y + 8, striker.r * 1.1, striker.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      const g = ctx.createRadialGradient(striker.x - striker.r * 0.3, striker.y - striker.r * 0.3, 0, striker.x, striker.y, striker.r);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#dbe8ff");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(striker.x, striker.y, striker.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(striker.x - striker.r * 0.4, striker.y - striker.r * 0.4, striker.r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#334155";
      ctx.arc(striker.x, striker.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "#6b7280";
      ctx.stroke();
      ctx.restore();
    }

    // indicators
    if (pointerDown && dragStart && dragCur && striker) {
      const start = dragStart;
      const cur = dragCur;
      const dx = start.x - cur.x;
      const dy = start.y - cur.y;
      const power = clamp(len(dx, dy), 0, MAX_POWER);

      if (Math.abs(dy) > 10) {
        const nx = striker.x + dx;
        const ny = striker.y + dy;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(59,130,246,0.9)";
        ctx.moveTo(striker.x, striker.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "rgba(59,130,246,0.12)";
        ctx.arc(striker.x, striker.y, Math.min(power, MAX_POWER), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#1e40af";
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.moveTo(striker.x, striker.y - 28);
        ctx.lineTo(striker.x, striker.y + 28);
        ctx.stroke();
        ctx.restore();
      }
    }
  }, [coins, striker, currentPlayer, pointerDown, dragStart, dragCur, aiming]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toLogical = (clientX: number, clientY: number) => {
      const scale = Math.min(window.innerWidth / LOGICAL_SIZE, window.innerHeight / LOGICAL_SIZE);
      const boardLeft = (window.innerWidth - LOGICAL_SIZE * scale) / 2;
      const boardTop = (window.innerHeight - LOGICAL_SIZE * scale) / 2;
      const x = (clientX - boardLeft) / scale;
      const y = (clientY - boardTop) / scale;
      return { x, y };
    };

    const handleDown = (ev: MouseEvent | TouchEvent) => {
      const touch = (ev as TouchEvent).touches ? (ev as TouchEvent).touches[0] : undefined;
      const cx = touch ? touch.clientX : (ev as MouseEvent).clientX;
      const cy = touch ? touch.clientY : (ev as MouseEvent).clientY;
      onPointerDown(ev);
    };

    const handleMove = (ev: MouseEvent | TouchEvent) => {
      onPointerMove(ev);
    };

    const handleUp = () => {
      onPointerUp();
    };

    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    canvas.addEventListener("touchstart", handleDown, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);

      canvas.removeEventListener("touchstart", handleDown as EventListener);
      window.removeEventListener("touchmove", handleMove as EventListener);
      window.removeEventListener("touchend", handleUp as EventListener);
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}