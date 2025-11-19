"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Full Carrom Game Page (single-file)
 * - Drop into /app/game/page.tsx
 * - Uses uploaded texture: /mnt/data/0c55eea9-4050-494e-acfa-b65e6e8ebb6b.png
 * - Enlarged playing zone, coin sizes, striker sizes
 * - Striker X-axis positioning in striker zone + vertical pull to shoot
 * - After shot completes, striker moves to opposite side and player switches
 */

/* ---------------- Config ---------------- */
const BOARD_TEXTURE = "/mnt/data/0c55eea9-4050-494e-acfa-b65e6e8ebb6b.png";
const LOGICAL_SIZE = 1000; // larger logical resolution to increase "board zone"
const POCKET_RADIUS = 39;
const COIN_RADIUS = 22; // increased coin radius
const STRIKER_RADIUS = 27; // increased striker radius
const STRIKER_AREA_HEIGHT = 171; // taller striker zone
const FRICTION = 0.993;
const WALL_RESTITUTION = 0.9;
const COIN_RESTITUTION = 0.985;
const MIN_VEL = 0.02;
const POWER_MULTIPLIER = 0.11;
const MAX_POWER = 220;

/* ---------------- Types ---------------- */
type Vec = { x: number; y: number };
type CoinKind = "coin" | "queen" | "striker";
type Coin = {
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

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const len = (dx: number, dy: number) => Math.sqrt(dx * dx + dy * dy);
const dist = (a: Vec, b: Vec) => len(a.x - b.x, a.y - b.y);

/* ---------------- Component ---------------- */
export default function GamePage(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // physics objects in refs
  const coinsRef = useRef<Coin[]>([]);
  const strikerRef = useRef<Coin | null>(null);

  // input/drag refs
  const pointerDownRef = useRef(false);
  const dragStartRef = useRef<Vec | null>(null);
  const dragCurRef = useRef<Vec | null>(null);
  const aimingRef = useRef(false);

  // UI state
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1); // 1 bottom, 2 top
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [message, setMessage] = useState("Position striker horizontally then pull vertically to shoot.");
  const [pocketedCounts, setPocketedCounts] = useState({ total: 0, queen: 0 });
  const [isAnyMoving, setIsAnyMoving] = useState(false);

  /* ---------- init ---------- */
  useEffect(() => {
    loadTexture();
    resetTable();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    startLoop();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadTexture() {
    const img = new Image();
    img.src = BOARD_TEXTURE;
    imgRef.current = img;
  }

  function getStrikerYForPlayer(player: 1 | 2) {
    return player === 1 ? LOGICAL_SIZE - 146 : 146;
  }

  /* ---------- reset table ---------- */
  function resetTable() {
    const center = LOGICAL_SIZE / 2;
    const coins: Coin[] = [];
    let id = 1;

    // queen (red)
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

    // cluster around queen (6)
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

    // outer 6
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

    // Add extra coins to reach 9+9 excluding queen
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

    // striker initial placement (center X, bottom player)
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
  }

  /* ---------- canvas resize ---------- */
  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const size = Math.min(rect.width, window.innerHeight - 160, 1000);
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform((size * dpr) / LOGICAL_SIZE, 0, 0, (size * dpr) / LOGICAL_SIZE, 0, 0);
  }

  /* ---------- main loop ---------- */
  function startLoop() {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(34, now - last);
      last = now;
      physicsTick(dt / 16.67);
      render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  /* ---------- physics ---------- */
  function physicsTick(factor = 1) {
    const coins = coinsRef.current;
    const s = strikerRef.current;
    if (!s) return;

    // integrate coins
    for (const c of coins) {
      if (c.pocketed) continue;
      c.vx *= FRICTION;
      c.vy *= FRICTION;
      if (Math.abs(c.vx) < MIN_VEL) c.vx = 0;
      if (Math.abs(c.vy) < MIN_VEL) c.vy = 0;
      c.x += c.vx * factor;
      c.y += c.vy * factor;
    }

    // striker
    s.vx *= FRICTION;
    s.vy *= FRICTION;
    if (Math.abs(s.vx) < MIN_VEL) s.vx = 0;
    if (Math.abs(s.vy) < MIN_VEL) s.vy = 0;
    s.x += s.vx * factor;
    s.y += s.vy * factor;

    // walls bounce
    const W = LOGICAL_SIZE;
    const H = LOGICAL_SIZE;
    const margin = 22; // smaller margin to enlarge play area
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
    bounce(s);

    // collisions
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

        // impulse
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

    for (let i = 0; i < coins.length; i++) {
      for (let j = i + 1; j < coins.length; j++) {
        handleCollision(coins[i], coins[j]);
      }
    }
    for (const c of coins) handleCollision(s, c);

    // pockets
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
    checkPocket(s);

    if (pocketedThisTick.length > 0) {
      for (const c of pocketedThisTick) {
        if (c.kind === "striker") {
          const opp = currentPlayer === 1 ? 2 : 1;
          setScores((prev) => ({ ...prev, [opp]: prev[opp] + 5 }));
          setMessage(`Striker pocketed: Player ${opp} +5. Striker will reset to other side.`);
        } else if (c.kind === "queen") {
          setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 3 }));
          setMessage(`Player ${currentPlayer} pocketed the Queen (+3).`);
        } else {
          setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
          setMessage(`Player ${currentPlayer} pocketed a coin (+1).`);
        }
      }
      updatePocketCounts();
    }

    // movement detection
    const anyMoving = (() => {
      if (s.vx !== 0 || s.vy !== 0) return true;
      for (const c of coins) if (c.vx !== 0 || c.vy !== 0) return true;
      return false;
    })();

    setIsAnyMoving(anyMoving);

    // When everything stops and last shot flag was set -> switch player and reset striker to opposite side
    if (!anyMoving && s._justShot) {
      s._justShot = false;
      setCurrentPlayer((p) => {
        const next = p === 1 ? 2 : 1;
        const sref = strikerRef.current;
        if (sref) {
          sref.vx = 0;
          sref.vy = 0;
          sref.pocketed = false;
          sref.x = LOGICAL_SIZE / 2;
          sref.y = getStrikerYForPlayer(next);
        }
        setMessage(`Motion stopped. Player ${next}'s turn — striker moved to opposite side.`);
        return next as 1 | 2;
      });
    }
  }

  /* ---------- update pocket counts ---------- */
  function updatePocketCounts() {
    const coins = coinsRef.current;
    const total = coins.filter((c) => c.pocketed && c.kind !== "striker").length;
    const queen = coins.filter((c) => c.pocketed && c.kind === "queen").length;
    setPocketedCounts({ total, queen });
  }

  /* ---------- input handling ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !strikerRef.current) return;

    const toLogical = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const sizePx = rect.width;
      const x = ((clientX - rect.left) / sizePx) * LOGICAL_SIZE;
      const y = ((clientY - rect.top) / sizePx) * LOGICAL_SIZE;
      return { x, y };
    };

    const positioningThreshold = 10;

    const onDown = (ev: MouseEvent | TouchEvent) => {
      const touch = (ev as TouchEvent).touches ? (ev as TouchEvent).touches[0] : undefined;
      const cx = touch ? touch.clientX : (ev as MouseEvent).clientX;
      const cy = touch ? touch.clientY : (ev as MouseEvent).clientY;
      const p = toLogical(cx, cy);

      const s = strikerRef.current!;
      const areaTop = currentPlayer === 1 ? LOGICAL_SIZE - STRIKER_AREA_HEIGHT : 0;
      const areaBottom = currentPlayer === 1 ? LOGICAL_SIZE : STRIKER_AREA_HEIGHT;
      const inArea = p.y >= areaTop && p.y <= areaBottom;
      const nearStriker = dist(p, { x: s.x, y: s.y }) <= s.r + 20;

      if (!inArea || !nearStriker || isAnyMoving) return;

      ev.preventDefault();
      pointerDownRef.current = true;
      dragStartRef.current = p;
      dragCurRef.current = p;
      aimingRef.current = false;
    };

    const onMove = (ev: MouseEvent | TouchEvent) => {
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
        s.y = getStrikerYForPlayer(currentPlayer);
      }
      // if aiming, keep s.x locked (but small adjustments could be allowed if desired)
    };

    const onUp = () => {
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
        setMessage(`Player ${currentPlayer} shot (power ${Math.round(power)})`);
      } else {
        setMessage(`Striker positioned X=${Math.round(s.x)}. Pull vertically to shoot.`);
      }
      aimingRef.current = false;
    };

    // attach events
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    canvas.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      canvas.removeEventListener("touchstart", onDown as any);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, isAnyMoving]);

  /* ---------- render ---------- */
  function render() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

    // background: texture or gradient
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth) {
      // draw scaled to LOGICAL_SIZE
      ctx.drawImage(img, 0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
    } else {
      const g = ctx.createLinearGradient(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
      g.addColorStop(0, "#f3d6b2");
      g.addColorStop(1, "#d6aa79");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
    }

    // outer rim
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#6b3e22";
    ctx.strokeRect(12, 12, LOGICAL_SIZE - 24, LOGICAL_SIZE - 24);

    // inner play area (bigger playable area due to smaller margins)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
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

    // striker zones shading (top & bottom)
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    const zoneHeight = STRIKER_AREA_HEIGHT - 20;
    ctx.fillRect(59, 44, LOGICAL_SIZE - 118, zoneHeight);
    ctx.fillRect(59, LOGICAL_SIZE - 44 - zoneHeight, LOGICAL_SIZE - 118, zoneHeight);
    ctx.restore();

    // decorative corner circles (reference style)
    ctx.save();
    ctx.fillStyle = "#b0402b";
    const corners = [
      { x: 127, y: 107 },
      { x: LOGICAL_SIZE - 127, y: 107 },
      { x: 127, y: LOGICAL_SIZE - 107 },
      { x: LOGICAL_SIZE - 127, y: LOGICAL_SIZE - 107 },
    ];
    for (const c of corners) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#2b2b2b";
      ctx.stroke();
    }
    ctx.restore();

    // draw coins
    const coins = coinsRef.current;
    for (const c of coins) {
      if (c.pocketed) continue;
      ctx.save();
      // shadow
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.09)";
      ctx.ellipse(c.x + 4, c.y + 6, c.r * 0.95, c.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // face
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // rim
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.stroke();

      // queen label
      if (c.kind === "queen") {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Q", c.x, c.y);
      }
      ctx.restore();
    }

    // draw striker
    const s = strikerRef.current;
    if (s && !s.pocketed) {
      ctx.save();
      // shadow
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.ellipse(s.x + 4, s.y + 6, s.r * 1.0, s.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // body with subtle gradient
      const g = ctx.createLinearGradient(s.x - s.r, s.y - s.r, s.x + s.r, s.y + s.r);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#dbe8ff");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // center dot
      ctx.beginPath();
      ctx.fillStyle = "#334155";
      ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "#6b7280";
      ctx.stroke();
      ctx.restore();
    }

    // aiming / positioning indicators
    if (pointerDownRef.current && dragStartRef.current && dragCurRef.current && s) {
      const start = dragStartRef.current;
      const cur = dragCurRef.current;
      const dx = start.x - cur.x;
      const dy = start.y - cur.y;
      const power = clamp(len(dx, dy), 0, MAX_POWER);

      if (Math.abs(dy) > 10) {
        // aiming line
        const nx = s.x + dx;
        const ny = s.y + dy;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(59,130,246,0.9)";
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "rgba(59,130,246,0.12)";
        ctx.arc(s.x, s.y, Math.min(power, MAX_POWER), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#1e40af";
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // positioning marker
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.moveTo(s.x, s.y - 28);
        ctx.lineTo(s.x, s.y + 28);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  /* ---------- control helpers ---------- */
  function handleReset() {
    resetTable();
    setMessage("Table reset. Player 1 to play.");
  }
  function handlePass() {
    setCurrentPlayer((p) => {
      const next = p === 1 ? 2 : 1;
      const s = strikerRef.current;
      if (s) {
        s.x = LOGICAL_SIZE / 2;
        s.y = getStrikerYForPlayer(next);
        s.vx = 0;
        s.vy = 0;
      }
      setMessage(`Forced pass. Player ${next}'s turn.`);
      return next as 1 | 2;
    });
  }
  function handleEndGame() {
    if (scores[1] > scores[2]) setMessage("Player 1 wins!");
    else if (scores[2] > scores[1]) setMessage("Player 2 wins!");
    else setMessage("Tie!");
  }

  /* ---------- periodic update for counts ---------- */
  useEffect(() => {
    const t = setInterval(() => updatePocketCounts(), 500);
    return () => clearInterval(t);
  }, []);

  /* ---------- JSX ---------- */
  return (
    <div style={{ minHeight: "100vh", padding: 20, background: "#071427", color: "#e6edf3", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1250, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
        {/* Left controls */}
        <div style={{ background: "#071427", padding: 16, borderRadius: 12 }}>
          <h2 style={{ margin: 0 }}>Carrom — Upgraded</h2>
          <p style={{ color: "#94a3b8" }}>{message}</p>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Current Turn</div>
              <div style={{ fontSize: 18 }}>{currentPlayer === 1 ? "Player 1 (Bottom)" : "Player 2 (Top)"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Pocketed</div>
              <div style={{ fontSize: 18 }}>{pocketedCounts.total}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={handleReset} style={{ flex: 1, padding: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8 }}>
              Reset
            </button>
            <button onClick={handlePass} style={{ flex: 1, padding: 10, background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8 }}>
              Pass
            </button>
          </div>

          <div style={{ marginTop: 12, color: "#94a3b8" }}>
            <div>Black & white coins (9 each) + Red queen</div>
            <div style={{ marginTop: 6 }}>Position striker horizontally, then pull vertically to shoot.</div>
            <div style={{ marginTop: 6 }}>After a completed shot, striker switches to the other player's zone.</div>
          </div>
        </div>

        {/* Center board */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 1000, background: "#071427", padding: 12, borderRadius: 12 }}>
            <div style={{ aspectRatio: "1/1", width: "100%" }}>
              <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", borderRadius: 12 }} />
            </div>
            <div style={{ marginTop: 10, textAlign: "center", color: "#94a3b8" }}>
              Striker zone shaded top & bottom. Drag horizontally to position; pull vertically to shoot.
            </div>
          </div>
        </div>

        {/* Right scoreboard */}
        <div style={{ background: "#071427", padding: 16, borderRadius: 12 }}>
          <h3 style={{ margin: 0 }}>Scoreboard</h3>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: currentPlayer === 1 ? "rgba(16,185,129,0.06)" : "transparent" }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Player 1</div>
            <div style={{ fontSize: 28 }}>{scores[1]}</div>
          </div>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: currentPlayer === 2 ? "rgba(59,130,246,0.06)" : "transparent" }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Player 2</div>
            <div style={{ fontSize: 28 }}>{scores[2]}</div>
          </div>

          <div style={{ marginTop: 12, color: "#94a3b8" }}>
            <div>Queen pocketed: {pocketedCounts.queen}</div>
            <div>Total pocketed: {pocketedCounts.total}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={handleEndGame} style={{ width: "100%", padding: 10, background: "#16a34a", color: "#fff", border: "none", borderRadius: 8 }}>
              End & Winner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

