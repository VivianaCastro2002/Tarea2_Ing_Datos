/**
 * @file ScoreSystem.js
 * @author Belén (Estado, colisiones y HUD: Sistema de puntuación)
 * @description Encapsula la aritmética para puntos y su almacenamiento cruzado en LocalStorage P5.
 */

/**
 * @class ScoreSystem
 * @classdesc Administrador integral de adición pasiva de puntajes por sobrevivencia 
 *            y puntos concretos por esquivas correctas.
 */
export class ScoreSystem {
  /**
   * Determina puntaje en cero por sesión cargando lo antiguo persistente.
   */
  constructor() {
    /** @type {number} Puntos devengados fraccionales internamente de la run actual. */
    this.score = 0;
    /** @type {number} Puntos absolutos del mayor récord del equipo/browser guardado. */
    this.highScore = getItem('highscore') || 0;
  }

  /**
   * @method reset
   * @description Restablece puntaje per cápita. Récord no entra en mutación.
   */
  reset() {
    this.score = 0;
  }

  /**
   * @method update
   * @description Agrega valor base pasivo 0.1 y premia contundantemente (+5) la elusión vertical.
   * @param {Array} obstacles - Lista de objetos para determinar si su 'y' rebasa la cámara horizontal del jugador.
   * @param {Object} player - Coordenadas actuales jugables para comparativa de alturas.
   */
  update(obstacles, player) {
    this.score += 0.1;

    for (let obs of obstacles) {
      if (!obs.passed && obs.y > player.y) {
        this.score += 5;
        obs.passed = true;
      }
    }
  }

  /**
   * @method updateHighScore
   * @description Compara local contra global y sustituye con LocalStorage de originar records.
   */
  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = floor(this.score);
      storeItem('highscore', this.highScore);
    }
  }

  /**
   * @method getScore
   * @description Trunca fracciones a entero.
   * @returns {number} Balance sin la fracción decimal.
   */
  getScore() {
    return floor(this.score);
  }

  /**
   * @method getHighScore
   * @description Funciones directas al HUD requiriendo enterificación.
   * @returns {number} Score local encriptado natural redondeado.
   */
  getHighScore() {
    return floor(this.highScore);
  }
}