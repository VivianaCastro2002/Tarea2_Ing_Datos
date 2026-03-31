/**
 * @file Obstacle.js
 * @author Vivi (Motor del juego: Instanciación aleatoria y caída de obstáculos)
 * @description Entidad de los proyectiles/dificultades descendientes a evadir por el jugador.
 * [MODIFICAR: ESTA ENTIDAD ES PARA DESARROLLO DE COLISIONES Y HUD, NO ES LA DEFINITIVA]
 */

/**
 * @class Obstacle
 * @classdesc Representa un obstáculo con física rígida, que viaja hacia abajo
 *            para colisionar con el jugador si ocupan el mismo carril y altura.
 */
export default class Obstacle {
  /**
   * Instancia el obstáculo y lo hace emerger en uno de los 3 carriles arbitrariamente.
   */
  constructor() {
    this.lane = floor(random(3));
    
    this.width = 50;
    this.height = 50;
    this.y = -50;
    
    /**
     * @property {boolean} passed - Bandera si el jugador rebasó transversalmente al obstáculo. 
     *                              Evita puntuación recursiva sobre un mismo objeto.
     */
    this.passed = false;
  }

  /**
   * @readonly
   * @property {number} x - Posición lateral real derivada de márgenes globales estáticos P5 y su carril asignado.
   */
  get x() {
    return this.lane * (width / 3) + width / 6 - this.width / 2;
  }

  /**
   * @method update
   * @description Acumula el deslizamiento vertical según pase el tiempo, forzando 5 si es nulo.
   * @param {number} [speed=5] - Unidad a descender estricta proporcionada por un emisor superior.
   */
  update(speed = 5) {
    this.y += speed;
  }

  /**
   * @method draw
   * @description Impresión bidimensional e instancia visual del componente rojo.
   */
  draw() {
    fill(240, 50, 50);
    stroke(255);
    strokeWeight(3);
    rect(this.x, this.y, this.width, this.height, 12);
    noStroke();
  }

  /**
   * @method offscreen
   * @description Evalúa si el contenedor está afuera del borde inferior del canvas. 
   * @returns {boolean} Verdadero la parte inferior del render sale de la pantalla visible de iteración.
   */
  offscreen() {
    return this.y > height + 50;
  }
}