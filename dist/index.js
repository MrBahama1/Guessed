"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  XP_PER_WORD: () => XP_PER_WORD,
  guessedGameHtml: () => guessedGameHtml,
  replayGuessedGame: () => replayGuessedGame
});
module.exports = __toCommonJS(index_exports);

// src/core.ts
var XP_PER_WORD = 100;

// src/replay.ts
function replayGuessedGame({
  words,
  inputs,
  maxGuesses
}) {
  const roundResults = [];
  for (let round = 0; round < words.length; round++) {
    const word = words[round].toUpperCase();
    const roundInputs = inputs.filter((i) => i.round === round);
    let guessed = false;
    let guessCount = 0;
    const revealedPositions = /* @__PURE__ */ new Set();
    for (const input of roundInputs) {
      if (guessCount >= maxGuesses) break;
      const guess = input.guess.toUpperCase();
      if (guess.length !== word.length) continue;
      guessCount++;
      for (let i = 0; i < word.length; i++) {
        if (guess[i] === word[i]) {
          revealedPositions.add(i);
        }
      }
      if (revealedPositions.size === word.length) {
        guessed = true;
        break;
      }
    }
    roundResults.push({ word, guessed });
  }
  const score = roundResults.filter((r) => r.guessed).length * XP_PER_WORD;
  return { score, roundResults };
}

// src/index.ts
var guessedGameHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>GUESSED!</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-deep: #04040e;
  --bg: #0a0a1e;
  --surface: #111130;
  --surface-light: #1a1a48;
  --border: #28285a;
  --neon-cyan: #00e5ff;
  --neon-pink: #ff2070;
  --neon-green: #00ff88;
  --neon-gold: #ffcc00;
  --neon-purple: #b44aff;
  --text: #eeeef6;
  --text-dim: #6a6a99;
  --radius: 14px;
  --radius-sm: 8px;
}

html, body {
  width: 100%; height: 100%;
  background: var(--bg-deep);
  color: var(--text);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

body { display: flex; justify-content: center; align-items: center; }

/* Background effects */
.bg-effects {
  position: fixed; inset: 0; overflow: hidden; z-index: 0; pointer-events: none;
}
.bg-orb {
  position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.18;
  animation: orbFloat 10s ease-in-out infinite alternate;
}
.bg-orb:nth-child(1) { width: 500px; height: 500px; background: var(--neon-cyan); top: -15%; left: -10%; animation-delay: 0s; }
.bg-orb:nth-child(2) { width: 400px; height: 400px; background: var(--neon-pink); bottom: -10%; right: -8%; animation-delay: -4s; }
.bg-orb:nth-child(3) { width: 350px; height: 350px; background: var(--neon-purple); top: 40%; left: 55%; animation-delay: -7s; }

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.1); }
  100% { transform: translate(-20px, 25px) scale(0.95); }
}

.bg-effects::after {
  content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
  pointer-events: none;
}

#app {
  width: 100%; height: 100%; position: relative; overflow: hidden;
}

.screen {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 1.5rem; z-index: 1;
  animation: screenIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes screenIn {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

#confetti-canvas {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 2000;
}

.title-mega {
  font-family: 'Bungee', cursive;
  font-size: clamp(2rem, 6vw, 3.5rem);
  color: var(--neon-cyan);
  text-shadow:
    0 0 10px var(--neon-cyan),
    0 0 30px rgba(0, 229, 255, 0.5),
    0 0 60px rgba(0, 229, 255, 0.25);
  animation: neonPulse 3s ease-in-out infinite;
  letter-spacing: 0.06em;
}

@keyframes neonPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.title-section {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  font-weight: 700;
  color: var(--neon-pink);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 32, 112, 0.4);
}

.btn {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 2px solid var(--neon-cyan);
  background: transparent;
  color: var(--neon-cyan);
  padding: 0.8rem 2.2rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}
.btn:hover {
  background: rgba(0, 229, 255, 0.1);
  box-shadow: 0 0 25px rgba(0, 229, 255, 0.3), inset 0 0 25px rgba(0, 229, 255, 0.05);
  transform: translateY(-2px);
}
.btn:active { transform: translateY(0); }
.btn-primary {
  background: var(--neon-cyan);
  color: var(--bg-deep);
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}
.btn-primary:hover {
  background: #33ebff;
  box-shadow: 0 0 35px rgba(0, 229, 255, 0.5);
}
.btn-sm {
  font-size: 0.7rem;
  padding: 0.45rem 1rem;
  letter-spacing: 0.08em;
}
.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.input {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--surface);
  border: 2px solid var(--border);
  color: var(--text);
  padding: 0.7rem 1rem;
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.input:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.15);
}
.input::placeholder { color: var(--text-dim); font-weight: 400; }

/* Game top bar */
.game-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 0.5rem;
}

.round-badge {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--neon-pink);
  letter-spacing: 0.12em;
  text-shadow: 0 0 15px rgba(255, 32, 112, 0.4);
}

.guesses-badge {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-dim);
  letter-spacing: 0.05em;
}
.guesses-badge span { color: var(--neon-gold); }

/* Timer */
.timer-container {
  position: relative;
  width: 90px; height: 90px;
  margin: 0.5rem 0;
}
.timer-svg {
  width: 100%; height: 100%;
  transform: rotate(-90deg);
}
.timer-bg {
  fill: none;
  stroke: var(--border);
  stroke-width: 5;
}
.timer-progress {
  fill: none;
  stroke: var(--neon-cyan);
  stroke-width: 5;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear, stroke 0.5s;
  filter: drop-shadow(0 0 6px rgba(0, 229, 255, 0.5));
}
.timer-progress.danger {
  stroke: var(--neon-pink);
  filter: drop-shadow(0 0 6px rgba(255, 32, 112, 0.6));
  animation: timerPulse 0.8s ease-in-out infinite;
}
@keyframes timerPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.timer-text {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: 0.05em;
}
.timer-text.danger { color: var(--neon-pink); }

/* Tiles */
.word-display {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1rem 0;
}

.tile {
  width: clamp(42px, 8vw, 60px);
  height: clamp(48px, 9vw, 68px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.2rem, 3vw, 1.7rem);
  font-weight: 900;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text-dim);
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.tile.revealed {
  border-color: var(--neon-green);
  color: var(--neon-green);
  background: rgba(0, 255, 136, 0.08);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.25);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* Guess history */
.guess-history {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
  max-height: 180px;
  overflow-y: auto;
  width: 100%;
  max-width: 600px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.guess-row {
  display: flex;
  gap: 0.3rem;
  justify-content: center;
  animation: guessIn 0.4s ease;
}
@keyframes guessIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.guess-tile {
  width: clamp(30px, 5.5vw, 42px);
  height: clamp(34px, 6vw, 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(0.7rem, 2vw, 1rem);
  font-weight: 700;
  border-radius: 6px;
  text-transform: uppercase;
  background: var(--surface-light);
  color: var(--text-dim);
  border: 1px solid var(--border);
}

.guess-tile.correct {
  background: rgba(0, 255, 136, 0.15);
  border-color: var(--neon-green);
  color: var(--neon-green);
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.2);
}

/* Guess input area */
.guess-input-area {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.75rem;
  width: 100%;
  max-width: 400px;
}
.guess-input-area .input {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
}

/* Messages */
.msg {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  margin-top: 0.5rem;
  text-align: center;
}
.msg-error {
  color: var(--neon-pink);
  background: rgba(255, 32, 112, 0.08);
  border: 1px solid rgba(255, 32, 112, 0.2);
}

/* Round Intro */
.round-intro { text-align: center; }
.round-intro .round-num {
  font-family: 'Bungee', cursive;
  font-size: clamp(4rem, 14vw, 9rem);
  color: var(--neon-gold);
  text-shadow:
    0 0 20px rgba(255, 204, 0, 0.6),
    0 0 60px rgba(255, 204, 0, 0.3);
  animation: roundPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes roundPop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.round-intro .round-label {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(0.9rem, 2.5vw, 1.3rem);
  font-weight: 700;
  color: var(--neon-pink);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.round-intro .word-hint {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  color: var(--text-dim);
  margin-top: 1rem;
  letter-spacing: 0.15em;
  animation: slideUp 0.6s ease 0.5s forwards;
  opacity: 0;
}

/* Round End */
.round-result-title {
  font-family: 'Bungee', cursive;
  font-size: clamp(1.8rem, 5vw, 3rem);
  margin-bottom: 0.5rem;
}
.round-result-title.win {
  color: var(--neon-green);
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}
.round-result-title.lose {
  color: var(--neon-pink);
  text-shadow: 0 0 20px rgba(255, 32, 112, 0.5);
}

.answer-reveal {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 900;
  letter-spacing: 0.35em;
  color: var(--neon-gold);
  text-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
  margin: 1rem 0;
  text-transform: uppercase;
  animation: answerReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes answerReveal {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

.xp-gain {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  color: var(--neon-gold);
  animation: xpFloat 1s ease forwards;
  display: inline-block;
}
@keyframes xpFloat {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(-10px) scale(1.2); opacity: 1; }
}

/* Final results */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  width: 100%;
  max-width: 520px;
}

.label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 0.4rem;
}

.rounds-summary {
  width: 100%;
  max-width: 480px;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.rs-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.rs-round {
  color: var(--text-dim);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
}
.rs-word {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  color: var(--neon-cyan);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.rs-winner { color: var(--neon-green); font-weight: 600; }
.rs-none { color: var(--text-dim); font-style: italic; }

.scroll-area {
  overflow-y: auto;
  max-height: calc(100vh - 60px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem;
}
.scroll-area::-webkit-scrollbar { width: 4px; }
.scroll-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.row { display: flex; gap: 0.75rem; align-items: center; width: 100%; }
.row-center { justify-content: center; }
.gap-lg { gap: 1.5rem; }
.mt-1 { margin-top: 0.75rem; }
.mt-2 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.75rem; }

/* All correct celebration */
.all-correct {
  position: fixed; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 1500;
  background: rgba(4, 4, 14, 0.85);
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.correct-text {
  font-family: 'Bungee', cursive;
  font-size: clamp(3rem, 10vw, 6rem);
  color: var(--neon-green);
  text-shadow:
    0 0 20px rgba(0, 255, 136, 0.7),
    0 0 60px rgba(0, 255, 136, 0.4),
    0 0 100px rgba(0, 255, 136, 0.2);
  animation: correctPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes correctPop {
  0% { transform: scale(0) rotate(-5deg); }
  100% { transform: scale(1) rotate(0); }
}

/* Error shake */
.shake { animation: shake 0.4s ease; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

/* Waiting screen */
.waiting-container {
  text-align: center;
}
.waiting-container .dots {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: var(--neon-cyan);
  animation: dotBlink 1.5s ease-in-out infinite;
}
@keyframes dotBlink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
</head>
<body>

<div class="bg-effects">
  <div class="bg-orb"></div>
  <div class="bg-orb"></div>
  <div class="bg-orb"></div>
</div>

<div id="app"></div>
<canvas id="confetti-canvas"></canvas>

<script>
// Dual postMessage helper: parent.postMessage for iframe, ReactNativeWebView for mobile
function sendMessage(data) {
  try {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } else if (window.parent !== window) {
      window.parent.postMessage(data, '*');
    }
  } catch (e) {
    // Ignore postMessage errors
  }
}

// ==============================================================
// State
// ==============================================================
const state = {
  screen: 'waiting',
  // Contest integration
  gameID: null,
  username: null,
  walletAddress: null,
  sessionId: null,
  startTime: null,
  // Game config (received from SESSION_SEED)
  words: [],
  settings: { maxGuesses: 6, timeLimit: 60 },
  // Game state
  currentRound: 0,
  guessesRemaining: 0,
  timeRemaining: 0,
  revealedPositions: new Set(),
  guessHistory: [],
  roundResults: [],
  allInputs: [],
  timerInterval: null,
  inputLocked: false,
  leaderboard: [],
};

// ==============================================================
// Confetti System
// ==============================================================
const confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  running: false,
  init() {
    this.canvas = document.getElementById('confetti-canvas');
    this.ctx = this.canvas.getContext('2d');
  },
  fire() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particles = [];
    const colors = ['#00e5ff','#ff2070','#00ff88','#ffcc00','#b44aff','#ff8800'];
    for (let i = 0; i < 180; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 12,
        wobble: Math.random() * Math.PI * 2,
        wobbleV: Math.random() * 0.08 + 0.03,
      });
    }
    this.running = true;
    this.loop();
  },
  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let alive = 0;
    for (const p of this.particles) {
      p.x += p.vx + Math.sin(p.wobble) * 0.8;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.rotV;
      p.wobble += p.wobbleV;
      if (p.y < this.canvas.height + 60) {
        alive++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rot * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, 1 - p.y / this.canvas.height * 0.5);
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        this.ctx.restore();
      }
    }
    if (alive > 0) requestAnimationFrame(() => this.loop());
    else { this.running = false; this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
  },
  stop() {
    this.running = false;
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

// ==============================================================
// Renderers
// ==============================================================
function renderWaiting() {
  return '<div class="screen"><div class="waiting-container">' +
    '<div class="title-mega">GUESSED!</div>' +
    '<div class="dots" style="margin-top:1.5rem">...</div>' +
    '<p style="color:var(--text-dim);margin-top:1rem;font-family:Orbitron,sans-serif;font-size:0.75rem;letter-spacing:0.15em">WAITING FOR GAME</p>' +
    '</div></div>';
}

function renderRoundIntro() {
  var word = state.words[state.currentRound];
  return '<div class="screen"><div class="round-intro">' +
    '<div class="round-label" style="animation-delay:0s">ROUND</div>' +
    '<div class="round-num">' + (state.currentRound + 1) + '</div>' +
    '<div class="round-label" style="animation-delay:0.3s">OF ' + state.words.length + '</div>' +
    '<div class="word-hint">' + word.length + ' LETTERS</div>' +
    '</div></div>';
}

function renderPlay() {
  var word = state.words[state.currentRound];
  var circumference = 2 * Math.PI * 40;
  var progress = state.timeRemaining / state.settings.timeLimit;
  var offset = circumference * (1 - progress);
  var danger = state.timeRemaining <= 10;
  var minutes = Math.floor(state.timeRemaining / 60);
  var seconds = state.timeRemaining % 60;
  var timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  var tiles = '';
  for (var i = 0; i < word.length; i++) {
    var isRevealed = state.revealedPositions.has(i);
    tiles += '<div class="tile ' + (isRevealed ? 'revealed' : '') + '">' + (isRevealed ? word[i].toUpperCase() : '') + '</div>';
  }

  var historyRows = '';
  for (var g = 0; g < state.guessHistory.length; g++) {
    var guessTiles = '';
    for (var r = 0; r < state.guessHistory[g].results.length; r++) {
      var res = state.guessHistory[g].results[r];
      guessTiles += '<div class="guess-tile ' + (res.correct ? 'correct' : '') + '">' + res.letter.toUpperCase() + '</div>';
    }
    historyRows += '<div class="guess-row">' + guessTiles + '</div>';
  }

  return '<div class="screen">' +
    '<div class="scroll-area" style="justify-content:flex-start;padding-top:1rem">' +
    '<div class="game-top">' +
    '<div class="round-badge">ROUND ' + (state.currentRound + 1) + ' / ' + state.words.length + '</div>' +
    '<div class="guesses-badge">GUESSES: <span>' + state.guessesRemaining + '</span></div>' +
    '</div>' +
    '<div class="timer-container">' +
    '<svg class="timer-svg" viewBox="0 0 90 90">' +
    '<circle class="timer-bg" cx="45" cy="45" r="40" />' +
    '<circle class="timer-progress ' + (danger ? 'danger' : '') + '" cx="45" cy="45" r="40" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" />' +
    '</svg>' +
    '<span class="timer-text ' + (danger ? 'danger' : '') + '">' + timeStr + '</span>' +
    '</div>' +
    '<div class="word-display">' + tiles + '</div>' +
    '<div class="guess-input-area" id="input-area">' +
    '<input class="input" id="guess-input" placeholder="' + word.length + ' letters..." maxlength="' + word.length + '" autocomplete="off" ' + (state.inputLocked ? 'disabled' : '') + ' />' +
    '<button class="btn btn-primary btn-sm" data-action="submit-guess" ' + (state.inputLocked ? 'disabled' : '') + '>GUESS</button>' +
    '</div>' +
    '<div id="msg-area"></div>' +
    '<div class="guess-history" id="history-area">' + historyRows + '</div>' +
    '</div></div>';
}

function renderRoundEnd() {
  var result = state.roundResults[state.currentRound];
  var isWin = result.guessed;
  var isLast = state.currentRound >= state.words.length - 1;
  return '<div class="screen"><div class="scroll-area">' +
    '<div class="round-result-title ' + (isWin ? 'win' : 'lose') + '">' + (isWin ? 'GUESSED!' : "TIME\\'S UP!") + '</div>' +
    (isWin
      ? '<p style="font-size:1.1rem;color:var(--neon-green)">+100 XP</p>'
      : '<p style="color:var(--text-dim)">No points this round</p>') +
    '<p style="margin-top:0.75rem;color:var(--text-dim);font-size:0.85rem;font-family:Orbitron,sans-serif;letter-spacing:0.15em">THE WORD WAS</p>' +
    '<div class="answer-reveal">' + esc(result.word) + '</div>' +
    '<div class="row row-center gap-lg mt-2">' +
    (isLast
      ? '<button class="btn btn-primary" data-action="show-final">SEE RESULTS</button>'
      : '<button class="btn btn-primary" data-action="next-round">NEXT ROUND</button>') +
    '</div></div></div>';
}

function renderFinal() {
  var guessedCount = state.roundResults.filter(function(r) { return r.guessed; }).length;
  var totalScore = guessedCount * 100;
  var roundRows = '';
  for (var i = 0; i < state.roundResults.length; i++) {
    var r = state.roundResults[i];
    roundRows += '<div class="rs-row">' +
      '<span class="rs-round">RD ' + (i + 1) + '</span>' +
      '<span class="rs-word">' + esc(r.word) + '</span>' +
      (r.guessed ? '<span class="rs-winner">+100 XP</span>' : '<span class="rs-none">Missed</span>') +
      '</div>';
  }

  var leaderboardHtml = '';
  if (state.leaderboard && state.leaderboard.length > 0) {
    var lbRows = '';
    for (var j = 0; j < state.leaderboard.length; j++) {
      var entry = state.leaderboard[j];
      var displayName = entry.username || (entry.walletAddress ? entry.walletAddress.slice(0, 6) + '...' + entry.walletAddress.slice(-4) : 'Player');
      var rankColor = entry.rank === 1 ? 'var(--neon-gold)' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'var(--text-dim)';
      lbRows += '<div class="rs-row">' +
        '<span class="rs-round" style="color:' + rankColor + ';min-width:28px">#' + entry.rank + '</span>' +
        '<span style="flex:1;color:var(--text);font-weight:600;font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(displayName) + '</span>' +
        '<span style="color:var(--neon-cyan);font-family:Orbitron,sans-serif;font-size:0.75rem;font-weight:700">' + (entry.averageScore != null ? entry.averageScore : entry.score != null ? entry.score : 0) + ' XP</span>' +
        '</div>';
    }
    leaderboardHtml = '<div class="panel mt-2" style="max-width:480px">' +
      '<div class="label mb-1">Leaderboard</div>' +
      '<div class="rounds-summary">' + lbRows + '</div>' +
      '</div>';
  }

  return '<div class="screen"><div class="scroll-area">' +
    '<div class="title-mega" style="margin-bottom:0.25rem">GUESSED!</div>' +
    '<div class="title-section">Game Over</div>' +
    '<p style="font-family:Orbitron,sans-serif;font-size:1.5rem;color:var(--neon-gold);margin-bottom:0.5rem;font-weight:900">' + totalScore + ' XP</p>' +
    '<p style="font-family:Orbitron,sans-serif;font-size:0.85rem;color:var(--text-dim);margin-bottom:1rem">' +
    guessedCount + ' / ' + state.roundResults.length + ' words guessed</p>' +
    '<div class="panel" style="max-width:480px">' +
    '<div class="label mb-1">All Rounds</div>' +
    '<div class="rounds-summary">' + roundRows + '</div>' +
    '</div>' +
    leaderboardHtml +
    '<div class="row row-center mt-2">' +
    '<button class="btn btn-primary" data-action="go-back">GO BACK</button>' +
    '</div>' +
    '</div></div>';
}

// ==============================================================
// Rendering engine
// ==============================================================
var app = document.getElementById('app');
var renderers = {
  waiting: renderWaiting,
  roundIntro: renderRoundIntro,
  play: renderPlay,
  roundEnd: renderRoundEnd,
  final: renderFinal,
};

function render() {
  var fn = renderers[state.screen];
  if (fn) app.innerHTML = fn();
  afterRender();
}

function afterRender() {
  var guessInput = document.getElementById('guess-input');
  if (guessInput && !state.inputLocked) guessInput.focus();
  if (guessInput) guessInput.onkeydown = function(e) { if (e.key === 'Enter') handleAction('submit-guess'); };
}

// ==============================================================
// Event delegation
// ==============================================================
app.addEventListener('click', function(e) {
  var el = e.target.closest('[data-action]');
  if (el) handleAction(el.dataset.action, el);
});

function handleAction(action, el) {
  switch (action) {
    case 'submit-guess': submitGuess(); break;
    case 'next-round': startRound(state.currentRound + 1); break;
    case 'show-final': showFinal(); break;
    case 'go-back': sendMessage({ type: 'NAVIGATE_BACK' }); break;
  }
}

// ==============================================================
// Game Logic
// ==============================================================
function startGame() {
  state.roundResults = [];
  state.allInputs = [];
  state.startTime = new Date().toISOString();
  startRound(0);
}

function startRound(roundIndex) {
  state.currentRound = roundIndex;
  state.guessesRemaining = state.settings.maxGuesses;
  state.timeRemaining = state.settings.timeLimit;
  state.revealedPositions = new Set();
  state.guessHistory = [];
  state.inputLocked = false;
  clearTimer();
  confetti.stop();

  setScreen('roundIntro');
  setTimeout(function() {
    setScreen('play');
    startTimer();
  }, 2800);
}

function submitGuess() {
  if (state.inputLocked) return;
  var input = document.getElementById('guess-input');
  if (!input) return;

  var word = state.words[state.currentRound];
  var guess = input.value.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();

  if (guess.length !== word.length) {
    showMessage('Guess must be ' + word.length + ' letters', 'error');
    shakeElement(document.getElementById('input-area'));
    input.value = '';
    input.focus();
    return;
  }

  state.inputLocked = true;

  // Record input for replay
  state.allInputs.push({ round: state.currentRound, guess: guess });

  // Evaluate guess
  var results = [];
  for (var i = 0; i < word.length; i++) {
    var correct = guess[i] === word[i].toUpperCase();
    if (correct) state.revealedPositions.add(i);
    results.push({ letter: guess[i], correct: correct });
  }

  state.guessHistory.push({ guess: guess, results: results });
  state.guessesRemaining--;

  render();

  // Animate the latest guess row tiles
  var historyArea = document.getElementById('history-area');
  if (historyArea) {
    var rows = historyArea.querySelectorAll('.guess-row');
    var lastRow = rows[rows.length - 1];
    if (lastRow) {
      var tiles = lastRow.querySelectorAll('.guess-tile');
      tiles.forEach(function(tile, i) {
        tile.style.opacity = '0';
        tile.style.transform = 'scaleY(0)';
        setTimeout(function() {
          tile.style.transition = 'all 0.35s ease';
          tile.style.opacity = '1';
          tile.style.transform = 'scaleY(1)';
        }, 100 * i);
      });
    }
  }

  var animDuration = 100 * word.length + 400;
  setTimeout(function() {
    if (state.revealedPositions.size === word.length) {
      roundWin();
      return;
    }
    if (state.guessesRemaining <= 0) {
      roundLose();
      return;
    }
    state.inputLocked = false;
    render();
  }, animDuration);
}

function roundWin() {
  clearTimer();
  state.roundResults[state.currentRound] = {
    word: state.words[state.currentRound],
    guessed: true,
  };

  var overlay = document.createElement('div');
  overlay.className = 'all-correct';
  overlay.innerHTML = '<div class="correct-text">GUESSED!</div>';
  document.body.appendChild(overlay);
  confetti.fire();

  setTimeout(function() {
    overlay.remove();
    confetti.stop();
    setScreen('roundEnd');
  }, 2500);
}

function roundLose() {
  clearTimer();
  state.roundResults[state.currentRound] = {
    word: state.words[state.currentRound],
    guessed: false,
  };
  setScreen('roundEnd');
}

function showFinal() {
  setScreen('final');
  confetti.fire();

  // Send SESSION_END
  var guessedCount = state.roundResults.filter(function(r) { return r.guessed; }).length;
  var totalScore = guessedCount * 100;

  sendMessage({
    type: 'SESSION_END',
    score: totalScore,
    sessionId: state.sessionId,
    startTime: state.startTime,
    endTime: new Date().toISOString(),
    inputs: state.allInputs,
    metadata: {
      roundResults: state.roundResults,
      wordsGuessed: guessedCount,
      totalWords: state.words.length,
    },
  });
}

// ==============================================================
// Timer
// ==============================================================
function startTimer() {
  clearTimer();
  state.timerInterval = setInterval(function() {
    state.timeRemaining--;
    if (state.timeRemaining <= 0) {
      state.timeRemaining = 0;
      roundLose();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function clearTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay() {
  var circumference = 2 * Math.PI * 40;
  var progress = state.timeRemaining / state.settings.timeLimit;
  var offset = circumference * (1 - progress);
  var danger = state.timeRemaining <= 10;
  var minutes = Math.floor(state.timeRemaining / 60);
  var seconds = state.timeRemaining % 60;
  var timeStr = minutes + ':' + String(seconds).padStart(2, '0');

  var progressEl = document.querySelector('.timer-progress');
  var textEl = document.querySelector('.timer-text');
  if (progressEl) {
    progressEl.setAttribute('stroke-dashoffset', offset);
    progressEl.classList.toggle('danger', danger);
  }
  if (textEl) {
    textEl.textContent = timeStr;
    textEl.classList.toggle('danger', danger);
  }
}

// ==============================================================
// Helpers
// ==============================================================
function setScreen(screen) {
  state.screen = screen;
  render();
}

function esc(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function showMessage(text, type) {
  var area = document.getElementById('msg-area');
  if (!area) return;
  area.innerHTML = '<div class="msg msg-' + type + '">' + esc(text) + '</div>';
  setTimeout(function() { if (area) area.innerHTML = ''; }, 2000);
}

function shakeElement(el) {
  if (!el) return;
  el.classList.add('shake');
  setTimeout(function() { el.classList.remove('shake'); }, 500);
}

// ==============================================================
// Message protocol
// ==============================================================
window.addEventListener('message', function(event) {
  var data = event.data;
  if (!data || !data.type) return;

  if (data.type === 'CONTEST_CONFIG') {
    state.gameID = data.gameID;
    state.username = data.username;
    state.walletAddress = data.walletAddress;
  }

  if (data.type === 'SESSION_SEED') {
    state.sessionId = data.sessionId;
    state.words = (data.words || []).map(function(w) { return w.toUpperCase(); });
    state.settings.maxGuesses = data.maxGuesses || 6;
    state.settings.timeLimit = data.timeLimit || 60;
    startGame();
  }

  if (data.type === 'LEADERBOARD_DATA') {
    state.leaderboard = data.entries || [];
    if (state.screen === 'final') render();
  }
});

// ==============================================================
// Init
// ==============================================================
window.addEventListener('resize', function() {
  if (confetti.canvas) {
    confetti.canvas.width = window.innerWidth;
    confetti.canvas.height = window.innerHeight;
  }
});

confetti.init();
render();

// Send SESSION_START to request a session from the parent
sendMessage({ type: 'SESSION_START' });
</script>
</body>
</html>
`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  XP_PER_WORD,
  guessedGameHtml,
  replayGuessedGame
});
