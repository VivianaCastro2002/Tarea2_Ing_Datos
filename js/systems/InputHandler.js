/**
 * @file InputHandler.js
 * @author Vivi (Motor del juego: Vincular posición del jugador a currentAction)
 * @description Maneja y procesa el estado del input, ya sea desde ML5, cámara o teclado.
 * [MODIFICAR: ESTA ENTIDAD ES PARA DESARROLLO DE COLISIONES Y HUD, NO ES LA DEFINITIVA]
 */

/**
 * @class InputHandler
 * @classdesc Escucha el estado transiente del input dinámico proveniente del entry point (sketch.js) 
 *            y materializa los movimientos del jugador (izquierda y derecha).
 */
export class InputHandler {
  /**
   * Inicializa el manejador de inputs atado de forma esclava al jugador.
   * @param {Object} player - La entidad referencial del jugador.
   */
  constructor(player) {
    /** @type {Object} Contiene la referencia en memoria del jugador principal. */
    this.player = player;
    /** @type {string} Almacena la orden del bucle de evento anterior inhibiendo rebotes en input continuo. */
    this.lastAction = "NINGUNA";
  }

  /**
   * @method update
   * @description Validador iterativo: Si existe un registro válido de flechas/camara nuevo, lo evalúa e integra.
   */
  update() {
    if (window.currentAction === "IZQUIERDA" && this.lastAction !== "IZQUIERDA") {
      this.player.moveLeft();
      this.lastAction = "IZQUIERDA";
    } else if (window.currentAction === "DERECHA" && this.lastAction !== "DERECHA") {
      this.player.moveRight();
      this.lastAction = "DERECHA";
    }

    if (window.currentAction === "NINGUNA" || window.currentAction === "NEUTRAL") {
      this.lastAction = "NINGUNA";
    }
  }
}