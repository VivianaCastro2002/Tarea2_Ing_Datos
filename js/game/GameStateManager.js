/**
 * @file GameStateManager.js
 * @author Belén (Estado, colisiones y HUD: Máquina de estados del juego)
 * @description Administrador de máquina de estados del juego.
 */

/**
 * @class GameStateManager
 * @classdesc Controla en qué menú o fase (Menu, Jugando, Pausa, GameOver) se encuentra el bucle.
 */
export class GameStateManager {
  constructor() {
    /**
     * @property {string} state - Estado inicial predeterminado.
     */
    this.state = "MENU";
  }

  /**
   * @method start
   * @description Cambia el estado a ejecución y reinicia las variables.
   * @param {Object} game - Instancia principal del juego.
   */
  start(game) {
    this.state = "JUGANDO";
    game.reset();
  }

  /**
   * @method togglePause
   * @description Intercambia entre PAUSA y JUGANDO.
   */
  togglePause() {
    if (this.state === "JUGANDO") this.state = "PAUSA";
    else if (this.state === "PAUSA") this.state = "JUGANDO";
  }

  /**
   * @method update
   * @description Comprueba condiciones de cierre como la pérdida total de vidas.
   * @param {Object} game - Instancia principal del juego.
   */
  update(game) {
    if (game.lives <= 0) {
      game.score.updateHighScore();
      this.state = "GAME_OVER";
    }
  }

  /**
   * @method isPlaying
   * @description Valida si la simulación debe avanzar frame a frame.
   * @returns {boolean} Verdadero si el estado es JUGANDO.
   */
  isPlaying() {
    return this.state === "JUGANDO";
  }
}