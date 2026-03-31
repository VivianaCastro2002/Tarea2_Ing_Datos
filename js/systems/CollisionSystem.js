/**
 * @file CollisionSystem.js
 * @author Belén (Estado, colisiones y HUD: Detección AABB y deducción de vidas)
 * @description Subsistema para validaciones e intersecciones físicas de objetos rígidos
 */

/**
 * Lógica matemática matricial de choque bidimensional AABB.
 * @function checkAABB
 * @param {Object} a - Objeto portador de métricas tangibles [x, y, width, height].
 * @param {Object} b - Cajas obstructivas hostiles [x, y, width, height].
 * @returns {boolean} Concesión afirmativa si ambas presencias colindan dentro del recuadro del plano.
 */
function checkAABB(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * @class CollisionSystem
 * @classdesc Controlador mediador para invocar análisis geométricos y reducir estadíticas (vidas).
 */
export class CollisionSystem {
  /**
   * @method check
   * @description Módulo de iteración AABB contra cada variable perjudicial contra Player.
   * @param {Object} player - Sujeto instanciable jugable del Game.
   * @param {Array} obstacles - Listado global proveniente del ObstacleSystem.
   * @param {Object} game - Nivel abstracto Game dictando alteración en vidas u transiciones lógicas.
   */
  check(player, obstacles, game) {
    for (let obs of obstacles) {
      if (checkAABB(player, obs)) {
        if (!player.invulnerable) {
          game.lives--;
          player.hit();
        }
      }
    }
  }
}