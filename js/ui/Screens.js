/**
 * @file Screens.js
 * @author Belén (Estado y HUD: Menú de inicio, Pausa, Game Over)
 * @description Módulo conteniendo menús estáticos y pantallas sobrepuestas.
 */

/**
 * @function drawMenu
 * @description Limpia el canvas y dibuja la pantalla de Menú de Inicio con tipografía Neón oscura.
 */
export function drawMenu() {
  fill(15, 15, 20);
  rect(0, 0, width, height);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(45);
  text("MIAURIO KART", width / 2, height / 3);
  
  textStyle(NORMAL);
  textSize(20);
  fill(30, 215, 96);
  text("Controla moviéndote", width / 2, height / 2);
  text("en cámara o con Flechas", width / 2, height / 2 + 30);
  
  fill(200);
  textSize(16);
  // Efecto de parpadeo suave iterativo
  let alpha = 150 + sin(frameCount * 0.05) * 100;
  fill(255, 255, 255, alpha);
  text("Presiona ESPACIO para Iniciar", width / 2, height - 100);
}

/**
 * @function drawPause
 * @description Pinta un overlay gris/negro semi-transparente que congela la visual del juego 
 *              exigiendo reanudar mediante input.
 */
export function drawPause() {
  fill(0, 0, 0, 180); 
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(50);
  text("PAUSA", width / 2, height / 2);

  textStyle(NORMAL);
  fill(200);
  textSize(20);
  text("Presiona 'P' para Continuar", width / 2, height / 2 + 60);
}

/**
 * @function drawGameOver
 * @description Pantalla estática de derrota (Game Over). Extrae e imprime del objeto Game
 *              todas las estadísticas logradas en la run versus el LocalStorage.
 * @param {Object} game - Instancia principal del juego conteniendo su objeto de score actualizado.
 */
export function drawGameOver(game) {
  fill(15, 15, 20);
  rect(0, 0, width, height);
  
  fill(255, 50, 50);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(45);
  text("GAME OVER", width / 2, height / 3);
  
  textStyle(NORMAL);
  fill(255);
  textSize(24);
  text(`Puntaje Final: ${game.score.getScore()}`, width / 2, height / 2);
  
  fill(255, 230, 0);
  text(`Mejor Puntaje: ${game.score.getHighScore()}`, width / 2, height / 2 + 40);
  
  textSize(16);
  
  let alpha = 150 + sin(frameCount * 0.05) * 100;
  fill(255, 255, 255, alpha);
  text("Presiona ESPACIO para Reintentar", width / 2, height - 100);
}
