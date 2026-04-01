/**
 * @file Screens.js
 * @author Belén + Vivi
 * @description Pantallas estilo cute refinadas con enfoque en jerarquía visual, contraste y distribución espacial.
 * Incluye menú principal, pausa y game over con animaciones suaves y estética pastel.
 */

/**
 * @function drawStarBackground
 * @description Dibuja el fondo estrellado animado original del juego.
 * Mantiene consistencia visual entre todas las pantallas.
 */
function drawStarBackground() {
  background(5, 5, 20);
  noStroke();

  for (let i = 0; i < 150; i++) {
    let x = (i * 131) % width;
    let y = (frameCount * 0.2 + i * 47) % height;
    let b = 150 + 100 * sin(frameCount * 0.02 + i);

    fill(b, b, b, 200);
    ellipse(x, y, 1.5, 1.5);
  }
}

/**
 * @function drawCuteCard
 * @description Dibuja un contenedor tipo "card" con estilo pastel, bordes redondeados y sombra suave.
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} w - Ancho
 * @param {number} h - Alto
 * @param {Array<number>} col - Color RGB base
 */
function drawCuteCard(x, y, w, h, col) {
  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = color(col[0], col[1], col[2], 120);

  fill(col[0], col[1], col[2], 210);
  noStroke();
  rect(x, y, w, h, 22);

  // Borde interno sutil para profundidad
  stroke(255, 255, 255, 60);
  noFill();
  rect(x + 3, y + 3, w - 6, h - 6, 18);

  drawingContext.shadowBlur = 0;
  noStroke();
}

/**
 * @function drawCuteText
 * @description Dibuja texto con efecto glow suave optimizado para legibilidad.
 * @param {string} str - Texto a mostrar
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 * @param {number} size - Tamaño de fuente
 * @param {Array<number>} col - Color RGB
 * @param {string} align - Alineación horizontal
 * @param {number} blur - Intensidad del glow
 */
function drawCuteText(str, x, y, size, col, align = CENTER, blur = 10) {
  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = color(col[0], col[1], col[2], 120);

  fill(col[0], col[1], col[2]);
  textSize(size);
  textAlign(align, CENTER);
  text(str, x, y);

  drawingContext.shadowBlur = 0;
}

/**
 * @function drawMenu
 * @description Renderiza el menú principal con título animado, instrucciones y CTA.
 */
export function drawMenu() {
  drawStarBackground();

  let cx = width / 2;

  // Logo
  let logoY = height * 0.28;
  let bounce = 4 * sin(frameCount * 0.04);

  drawCuteText(
    "🐱 MIAURIO KART 🐾",
    cx,
    logoY + bounce,
    56,
    [255, 170, 210],
    CENTER,
    12
  );

  // Subtítulo
  let subY = logoY + 55;

  drawCuteText(
    "✨ Control por gestos ✨",
    cx,
    subY,
    18,
    [170, 240, 230],
    CENTER,
    6
  );

  // Panel de instrucciones
  let panelW = 320;
  let panelH = 100;
  let panelY = height * 0.62;

  drawCuteCard(cx - panelW / 2, panelY - panelH / 2, panelW, panelH, [255, 220, 235]);

  fill(60);
  textSize(14);
  textAlign(CENTER, CENTER);

  text("👉 Mueve tu mano", cx, panelY - 12);
  text("izquierda / derecha", cx, panelY + 6);
  text("para cambiar de carril", cx, panelY + 24);

  // CTA
  let alpha = 160 + 80 * sin(frameCount * 0.05);

  fill(255, 255, 255, alpha);
  textSize(18);
  text("🌸 Presiona ESPACIO para jugar 🌸", cx, height * 0.86);
}

/**
 * @function drawPause
 * @description Renderiza la pantalla de pausa con overlay y mensaje central.
 */
export function drawPause() {
  fill(10, 10, 30, 200);
  rect(0, 0, width, height);

  let cx = width / 2;
  let cy = height / 2;

  drawCuteCard(cx - 200, cy - 110, 400, 200, [230, 210, 255]);

  drawCuteText("💤 Pausa", cx, cy - 40, 52, [190, 150, 255], CENTER, 14);

  fill(70);
  textSize(20);
  text("Descansando un poquito...", cx, cy + 20);

  fill(110);
  textSize(15);
  text("Presiona ESPACIO para volver 💜", cx, cy + 55);
}

/**
 * @function drawGameOver
 * @description Renderiza la pantalla de fin de juego con puntaje y opción de reinicio.
 * @param {Object} game - Objeto del juego que contiene el sistema de puntaje
 */
export function drawGameOver(game) {
  drawStarBackground();

  let cx = width / 2;

  // Título
  let y = height * 0.3;
  let bounce = 3 * sin(frameCount * 0.05);

  drawCuteText(
    "💔 Game Over 💔",
    cx,
    y + bounce,
    56,
    [255, 150, 180],
    CENTER,
    10
  );

  // Panel de puntaje
  let panelW = 300;
  let panelH = 120;
  let panelY = height * 0.58;

  drawCuteCard(cx - panelW / 2, panelY - panelH / 2, panelW, panelH, [255, 230, 235]);

  fill(50);
  textSize(24);
  text(`Puntaje: ${game.score.getScore()}`, cx, panelY - 12);

  fill(120);
  textSize(20);
  text(`🏆 ${game.score.getHighScore()}`, cx, panelY + 22);

  // CTA
  let alpha = 150 + 90 * sin(frameCount * 0.06);

  fill(255, 255, 255, alpha);
  textSize(18);
  text("🌷 Presiona ESPACIO para intentar de nuevo 🌷", cx, height * 0.86);

  drawCuteSparkles();
}

/**
 * @function drawCuteSparkles
 * @description Dibuja partículas tipo brillo distribuidas suavemente en pantalla.
 */
function drawCuteSparkles() {
  for (let i = 0; i < 4; i++) {
    let x = (frameCount * 2 + i * 150) % width;
    let y = (frameCount * 1.2 + i * 90) % height;

    fill(255, 255, 220, 120);
    ellipse(x, y, 2.5, 2.5);
  }
}