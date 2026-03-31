// ═══════════════════════════════════════════════════════════════
//  sketch.js — Pista, setup, draw y teclado
//
//  Depende de: globals.js · Player.js · Obstacle.js · Asteroid.js
// ═══════════════════════════════════════════════════════════════

// ─── Auxiliar: estrella de N puntas ───────────────────────────
function drawStar(x, y, r1, r2, npoints) {
  let angle = TWO_PI / npoints;
  let half  = angle / 2;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    vertex(x + cos(a) * r2,        y + sin(a) * r2);
    vertex(x + cos(a + half) * r1, y + sin(a + half) * r1);
  }
  endShape(CLOSE);
}

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE PISTA
// ═══════════════════════════════════════════════════════════════

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
  let offset    = scrollY % (KERB_H * 2);
  let totalSegs = ceil((height + KERB_H * 2) / KERB_H) + 4;
  noStroke();
  for (let i = -2; i < totalSegs; i++) {
    let y      = i * KERB_H + (offset % KERB_H);
    let parity = (i - floor(offset / KERB_H)) % 2;
    fill(parity === 0 ? color(...KERB_RED) : color(...KERB_WHITE));
    rect(TRACK_X - KERB_W,  y, KERB_W, KERB_H);
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
  let dashOn  = 22;
  let dashOff = 13;
  let phase   = scrollY % (dashOn + dashOff);
  drawingContext.save();
  drawingContext.setLineDash([dashOn, dashOff]);
  drawingContext.lineDashOffset = -phase;
  stroke(...LINE_WHITE);
  strokeWeight(2);
  line(TRACK_X + LANE_W,     0, TRACK_X + LANE_W,     height);
  line(TRACK_X + 2 * LANE_W, 0, TRACK_X + 2 * LANE_W, height);
  drawingContext.restore();
  drawingContext.setLineDash([]);
}

function drawStartLine() {
  let slH  = 60;
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

// ─── HUD provisional — el Miembro 3 reemplaza esto ────────────
function drawHUD_M2() {
  let col = color(255, 210, 0);
  if (currentAction === 'IZQUIERDA') col = color(100, 180, 255);
  if (currentAction === 'DERECHA')   col = color(255, 100, 100);
  if (currentAction === 'NEUTRAL')   col = color(150, 150, 150);

  noStroke();
  fill(0, 0, 0, 140);
  rect(10, 10, 170, 36, 8);
  fill(col);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text('► ' + currentAction, 22, 29);
  textStyle(NORMAL);

  fill(0, 0, 0, 140);
  rect(10, 54, 170, 32, 8);
  fill(200, 200, 200);
  textSize(12);
  text('SPEED: ' + nf(gameSpeed, 1, 1) + ' px/f', 22, 71);

  fill(80, 80, 80, 180);
  rect(10, height - 52, 225, 42, 8);
  fill(120, 120, 120);
  textSize(10);
  text('← → : cambiar carril', 18, height - 38);
  text('↑ : acelerar  |  ↓ : frenar', 18, height - 24);
}

// ═══════════════════════════════════════════════════════════════
//  SETUP
// ═══════════════════════════════════════════════════════════════
function setup() {
  createCanvas(800, 600);
  player = new Player();

  // Pre-generar estrellas con semilla fija
  randomSeed(42);
  for (let i = 0; i < 200; i++) {
    starsArray.push({
      x: random(width),  y: random(height),
      s: random(1, 4),
      r: 255, g: 255,
      b: random(200, 255),
      a: random(100, 255),
    });
  }
  randomSeed(); // liberar RNG para obstáculos y asteroides
}

// ═══════════════════════════════════════════════════════════════
//  DRAW
// ═══════════════════════════════════════════════════════════════
function draw() {
  // Velocidad según acción
  if      (currentAction === 'ADELANTE') gameSpeed = min(gameSpeed + 0.05, 12);
  else if (currentAction === 'NEUTRAL')  gameSpeed = max(gameSpeed - 0.03, 2);
  else                                   gameSpeed = lerp(gameSpeed, 5, 0.02);

  scrollY += gameSpeed;

  // Pista
  drawStars();
  drawRainbowTrack();
  drawKerbs();
  drawBorders();
  drawLaneDividers();
  drawStartLine();

  // Spawn y loop de obstáculos + asteroides
  frameCounter++;
  if (frameCounter % OBS_SPAWN_RATE === 0) {
    obstacles.push(new Obstacle());
  }
  if (frameCounter % 360 === 40) {
    obstacles.push(new Asteroid());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].draw();
    if (obstacles[i].isOffScreen()) obstacles.splice(i, 1);
  }

  // Player
  player.update();
  player.draw();

  // HUD
  drawHUD_M2();
}

// ═══════════════════════════════════════════════════════════════
//  TECLADO — simula currentAction hasta integrar el modelo ML
// ═══════════════════════════════════════════════════════════════
function keyPressed() {
  if (keyCode === LEFT_ARROW)  currentAction = 'IZQUIERDA';
  if (keyCode === RIGHT_ARROW) currentAction = 'DERECHA';
  if (keyCode === UP_ARROW)    currentAction = 'ADELANTE';
  if (keyCode === DOWN_ARROW)  currentAction = 'NEUTRAL';
}

function keyReleased() {
  if ([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)) {
    currentAction = 'NEUTRAL';
  }
}