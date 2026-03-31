// ═══════════════════════════════════════════════════════════════
//  globals.js — Constantes y variables compartidas entre módulos
//
//  VARIABLE que el Miembro 1 sobreescribe cada frame:
//    currentAction → 'IZQUIERDA' | 'DERECHA' | 'ADELANTE' | 'NEUTRAL'
//
//  VARIABLES que el Miembro 3 lee:
//    player, obstacles, gameSpeed
// ═══════════════════════════════════════════════════════════════

// ─── Interfaz Miembro 1 (ML) ──────────────────────────────────
window.currentAction = 'NEUTRAL';

// ─── Interfaz Miembro 3 (colisiones / HUD) ────────────────────
let player;
let obstacles  = [];
let gameSpeed  = 4;
let starsArray = [];

// ─── Geometría de pista ───────────────────────────────────────
const LANE_W       = 120;
const TRACK_W      = LANE_W * 3;           // 360 px
const TRACK_X      = (800 - TRACK_W) / 2;  // 220 px
const LANE_CENTERS = [
  TRACK_X + LANE_W * 0.5,   // carril izq → 280
  TRACK_X + LANE_W * 1.5,   // carril cen → 400
  TRACK_X + LANE_W * 2.5,   // carril der → 520
];

// ─── Colores ──────────────────────────────────────────────────
const LINE_WHITE  = [255, 255, 255];
const LINE_YELLOW = [255, 210, 0];
const KERB_RED    = [210, 20,  20];
const KERB_WHITE  = [245, 245, 245];

const RAINBOW_COLORS = [
  [255, 50,  50 ],
  [255, 150, 0  ],
  [255, 255, 50 ],
  [50,  255, 50 ],
  [50,  150, 255],
  [150, 50,  255],
];

// ─── Scroll ───────────────────────────────────────────────────
let scrollY      = 0;
const KERB_H     = 30;
const KERB_W     = 12;

// ─── Obstáculos ───────────────────────────────────────────────
const OBS_W          = 50;
const OBS_H          = 60;
const OBS_SPAWN_RATE = 90;
let   frameCounter   = 0;

// ─── Invulnerabilidad — el Miembro 3 la controla ─────────────
let invulnerable = false;