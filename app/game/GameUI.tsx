import React from 'react';
import { motion } from 'framer-motion';
import { Player } from './types';

interface GameUIProps {
  currentPlayer: Player;
  scores: { 1: number; 2: number };
  message: string;
  pocketedCounts: { total: number; queen: number };
  onReset: () => void;
  onPass: () => void;
}

export function GameControls({ currentPlayer, message, pocketedCounts, onReset, onPass }: { currentPlayer: Player; message: string; pocketedCounts: { total: number; queen: number }; onReset: () => void; onPass: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: "absolute", top: 20, right: 20, background: "rgba(7, 20, 39, 0.9)", padding: 16, borderRadius: 12, zIndex: 10, maxWidth: 300 }}
    >
      <h2 style={{ margin: 0 }}>Carrom — Full Screen</h2>
      <motion.p
        key={message}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ color: "#94a3b8" }}
      >
        {message}
      </motion.p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Current Turn</div>
          <motion.div
            key={currentPlayer}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18 }}
          >
            {currentPlayer === 1 ? "Player 1 (Bottom)" : "Player 2 (Top)"}
          </motion.div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Pocketed</div>
          <motion.div
            key={pocketedCounts.total}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18 }}
          >
            {pocketedCounts.total}
          </motion.div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          style={{ flex: 1, padding: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8 }}
        >
          Reset
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPass}
          style={{ flex: 1, padding: 10, background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8 }}
        >
          Pass
        </motion.button>
      </div>

      <div style={{ marginTop: 12, color: "#94a3b8" }}>
        <div>Black & white coins (9 each) + Red queen</div>
        <div style={{ marginTop: 6 }}>Position striker horizontally, then pull vertically to shoot.</div>
        <div style={{ marginTop: 6 }}>After a completed shot, striker switches to the other’s zone.</div>
      </div>
    </motion.div>
  );
}

export function Scoreboard({ currentPlayer, scores, pocketedCounts }: { currentPlayer: Player; scores: { 1: number; 2: number }; pocketedCounts: { total: number; queen: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(7, 20, 39, 0.9)", padding: 16, borderRadius: 12, zIndex: 10, maxWidth: 200 }}
    >
      <h3 style={{ margin: 0 }}>Scoreboard</h3>

      <motion.div
        animate={{ backgroundColor: currentPlayer === 1 ? "rgba(16,185,129,0.06)" : "transparent" }}
        transition={{ duration: 0.3 }}
        style={{ marginTop: 12, padding: 12, borderRadius: 8 }}
      >
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Player 1</div>
        <motion.div
          key={scores[1]}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 28 }}
        >
          {scores[1]}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ backgroundColor: currentPlayer === 2 ? "rgba(59,130,246,0.06)" : "transparent" }}
        transition={{ duration: 0.3 }}
        style={{ marginTop: 12, padding: 12, borderRadius: 8 }}
      >
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Player 2</div>
        <motion.div
          key={scores[2]}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 28 }}
        >
          {scores[2]}
        </motion.div>
      </motion.div>

      <div style={{ marginTop: 12, color: "#94a3b8" }}>
        <div>Queen: {pocketedCounts.queen}</div>
        <div>Total: {pocketedCounts.total}</div>
      </div>
    </motion.div>
  );
}

export default function GameUI({ currentPlayer, scores, message, pocketedCounts, onReset, onPass }: GameUIProps) {
  return (
    <>
      <GameControls currentPlayer={currentPlayer} message={message} pocketedCounts={pocketedCounts} onReset={onReset} onPass={onPass} />
      <Scoreboard currentPlayer={currentPlayer} scores={scores} pocketedCounts={pocketedCounts} />
    </>
  );
}