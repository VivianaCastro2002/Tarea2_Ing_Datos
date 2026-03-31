import { Game } from "./js/game/Game.js";

// ===== GLOBAL =====
/**
 * @type {Game} Instancia global del juego principal.
 */
let game;

// ── FUNCIONES DE PISTA ──────────────────────────────────────

function drawStars() {
  background(5, 5, 20);
  noStroke();
  for (let star of starsArray) {
    fill(star.r, star.g, star.b, star.a);
    ellipse(star.x, star.y, star.s, star.s);
  }
}

function drawRainbowTrack() {
  noStroke();
  let subLaneW = LANE_W / 2;
  for (let i = 0; i < 6; i++) {
    fill(...RAINBOW_COLORS[i]);
    rect(TRACK_X + i * subLaneW, 0, subLaneW, height);
  }
  fill(255, 255, 255, 30);
  rect(TRACK_X, 0, TRACK_W, height);
}

function drawKerbs() {
  let offset = scrollY % (KERB_H * 2);
  let totalSegs = ceil((height + KERB_H * 2) / KERB_H) + 4;
  noStroke();
  for (let i = -2; i < totalSegs; i++) {
    let y = i * KERB_H + (offset % KERB_H);
    let parity = (i - floor(offset / KERB_H)) % 2;
    fill(parity === 0 ? color(...KERB_RED) : color(...KERB_WHITE));
    rect(TRACK_X - KERB_W, y, KERB_W, KERB_H);
    rect(TRACK_X + TRACK_W, y, KERB_W, KERB_H);
  }
}

function drawBorders() {
  noFill();
  stroke(...LINE_WHITE);
  strokeWeight(3);
  line(TRACK_X, 0, TRACK_X, height);
  line(TRACK_X + TRACK_W, 0, TRACK_X + TRACK_W, height);
}

function drawLaneDividers() {
  let dashOn = 22;
  let dashOff = 13;
  let phase = scrollY % (dashOn + dashOff);
  drawingContext.save();
  drawingContext.setLineDash([dashOn, dashOff]);
  drawingContext.lineDashOffset = -phase;
  stroke(...LINE_WHITE);
  strokeWeight(2);
  line(TRACK_X + LANE_W, 0, TRACK_X + LANE_W, height);
  line(TRACK_X + 2 * LANE_W, 0, TRACK_X + 2 * LANE_W, height);
  drawingContext.restore();
  drawingContext.setLineDash([]);
}

function drawStartLine() {
  let slH = 60;
  let tile = 15;
  let cols = floor(TRACK_W / tile);
  let rows = 4;
  let drawY = 450 + scrollY;
  if (drawY + slH < 0 || drawY > height) return;
  noStroke();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      fill((r + c) % 2 === 0 ? 255 : 0);
      rect(TRACK_X + c * tile, drawY + r * tile, tile, tile);
    }
  }
  fill(...LINE_YELLOW);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text('START / FINISH', width / 2, drawY - 14);
  textStyle(NORMAL);
}

// Expuesto a window para ser consumido por Renderer.js
window.drawTrack = function() {
  drawStars();
  drawRainbowTrack();
  drawKerbs();
  drawBorders();
  drawLaneDividers();
  drawStartLine();
};

window.setup = function() {
  createCanvas(800, 600);

  // Pre-generar estrellas con semilla fija para el fondo
  randomSeed(42);
  for (let i = 0; i < 200; i++) {
    starsArray.push({
      x: random(width), y: random(height),
      s: random(1, 4),
      r: 255, g: 255,
      b: random(200, 255),
      a: random(100, 255),
    });
  }
  randomSeed();

  game = new Game();

  if (typeof initML === "function") {
    initML();
  }
};

window.draw = function() {
  if (typeof updateML === "function") updateML();

  // Lógica dinámica de velocidad basada en acción ML
  if (window.currentAction === 'ADELANTE') gameSpeed = min(gameSpeed + 0.05, 12);
  else if (window.currentAction === 'NEUTRAL' || window.currentAction === 'NINGUNA') gameSpeed = max(gameSpeed - 0.03, 2);
  else gameSpeed = lerp(gameSpeed, 5, 0.02);

  // Avanzar scroll de pista solo mientras se está jugando
  if (game.stateManager && game.stateManager.state === "JUGANDO") {
    scrollY += gameSpeed;
  }

  game.update();
  game.draw();
};

window.keyPressed = function() {
  // Teclado como fallback si ML no está listo
  const isMLReady = (typeof mlReady !== 'undefined') ? mlReady : false;

  if (!isMLReady) {
    if (keyCode === LEFT_ARROW)  window.currentAction = "IZQUIERDA";
    if (keyCode === RIGHT_ARROW) window.currentAction = "DERECHA";
    if (keyCode === UP_ARROW)    window.currentAction = "ADELANTE";
    if (keyCode === DOWN_ARROW)  window.currentAction = "NEUTRAL";
  }

  // Controles de estado del juego (Start y Pausa)
  if (key === ' ' || key.toLowerCase() === 'p' || keyCode === 27) {
    const st = game.stateManager.state;
    if ((st === "MENU" || st === "GAME_OVER") && key === ' ') {
      game.stateManager.start(game);
    } else if (st === "JUGANDO" || st === "PAUSA") {
      game.stateManager.togglePause();
    }
  }
};

window.keyReleased = function() {
  const isMLReady = (typeof mlReady !== 'undefined') ? mlReady : false;
  if (!isMLReady) {
    const arrows = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];
    if (arrows.includes(keyCode)) window.currentAction = "NEUTRAL";
  }
};
