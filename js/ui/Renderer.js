/**
 * @file Renderer.js
 * @author Belén (Estado y HUD: Coordinación visual según la máquina de estados)
 * @description Motor gráfico del juego. Capa unificadora para abstraer el pintado (draw) 
 *              de todas las entidades individuales hacia la instancia principal Game.
 */

import { drawHUD } from "./HUD.js";
import { drawMenu, drawPause, drawGameOver } from "./Screens.js";

/**
 * @class Renderer
 * @classdesc Recibe la delegación visual principal conectando la matriz del juego y 
 *            dibujando la superposición respectiva según el Estado del GameStateManager.
 */
export class Renderer {
  /**
   * Instancia el renderizador pasándole la arquitectura completa.
   * @param {Object} game - El objeto raíz conteniendo todos los recursos y variables.
   */
  constructor(game) {
    /** @type {Object} Instancia padre del juego. */
    this.game = game;
  }

  /**
   * @method draw
   * @description Árbol de decisión frame a frame determinando qué pantalla o acción renderizar en p5.
   */
  draw() {
    const state = this.game.stateManager.state;

    if (state === "MENU") return drawMenu();
    if (state === "GAME_OVER") return drawGameOver(this.game);

    this.drawGame();

    if (state === "PAUSA") drawPause();
  }

  /**
   * @method drawGame
   * @description Flujo de ejecución dedicado cuando el state es "JUGANDO" o "PAUSA".
   *              Manda llamar el método render local de cada entidad y finaliza con la consola HUD superior.
   */
  drawGame() {
    // Dibujar la pista primero (lógica global de dev)
    if (typeof window.drawTrack === "function") {
      window.drawTrack();
    } else {
      background(30); // Fallback
    }

    this.game.player.draw();

    for (let obs of this.game.obstacles.list) {
      obs.draw();
    }

    drawHUD(
      this.game.lives, 
      this.game.score.getScore(), 
      this.game.score.getHighScore(), 
      window.currentAction || "NEUTRAL"
    );

    // Dibujar la consola del modelo ML al frente
    if (typeof window.drawMLStatus === "function") {
      window.drawMLStatus();
    }
  }
}