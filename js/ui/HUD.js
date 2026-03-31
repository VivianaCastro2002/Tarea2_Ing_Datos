/**
 * @file HUD.js
 * @author Belén (Estado, colisiones y HUD: Diseño de puntaje, vidas y acción ML5)
 * @description Módulo de Interfaz de Usuario (HUD). Dibuja la sobrecapa gráfica superior 
 *              con la información de vida, puntaje e inputs detectables en el canvas P5.
 */

/**
 * @function drawHUD
 * @description Proyecta las métricas actuales del jugador empleando primitivas de P5.js como rect, text,
 *              textAlign, y drawingContext para aplicar sombras y profundidad temporal.
 * 
 * @param {number} lives     - Vidas restantes del jugador. Usualmente entre 0 y 3.
 * @param {number} score     - Puntos fraccionales (trunqueado pasivamente) obtenidos hasta este frame.
 * @param {number} highScore - Mejor puntuación web persistida de sesiones vigentes pasadas.
 * @param {string} action    - Texto que indica el movimiento actual detectado (ej: "IZQUIERDA").
 */
export function drawHUD(lives, score, highScore, action) {
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(0, 0, 0, 180);
  stroke(255, 255, 255, 40);
  strokeWeight(2);
  fill(15, 15, 20, 230); // Más oscuro para asegurar legibilidad frente a colores brillantes
  rect(10, 10, width - 20, 50, 15);
  noStroke();
  drawingContext.shadowBlur = 0; // Desactivar sombra para el texto principal

  fill(255);
  textSize(14);
  textStyle(BOLD);

  // Vidas
  textAlign(LEFT, CENTER);
  text("❤ " + lives, 25, 35);

  // Puntos
  textAlign(CENTER, CENTER);
  fill(255, 230, 0); // Texto amarillo/dorado
  text(score + " PTS", width / 2, 35);

  // High Score
  textAlign(RIGHT, CENTER);
  fill(150, 150, 250);
  text("HI: " + highScore, width - 25, 35);

  // Mostrar la acción activa visualmente si el usuario oprime una tecla persistente u emisor ML
  if (action !== "NINGUNA") {
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(255, 255, 255, 100);
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(22);
    text(action, width / 2, height - 20);
    drawingContext.shadowBlur = 0;
  }
}