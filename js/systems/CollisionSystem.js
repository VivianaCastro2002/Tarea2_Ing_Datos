/**
 * @file CollisionSystem.js
 * @author Belén (Estado, colisiones y HUD: Detección AABB y deducción de vidas)
 * @description Subsistema para validaciones e intersecciones físicas de objetos rígidos.
 *              Soporta tanto Obstacle estándar como Asteroid (con isDangerous()).
 */

/**
 * Comprobación AABB entre dos rectángulos alineados con los ejes.
 * Ambos objetos deben exponer: x (borde izq), y (borde sup), width, height.
 * @function checkAABB
 * @param {Object} a - Primer objeto con propiedades AABB.
 * @param {Object} b - Segundo objeto con propiedades AABB.
 * @returns {boolean} Verdadero si los rectángulos se solapan.
 */
function checkAABB(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * @class CollisionSystem
 * @classdesc Itera sobre todos los obstáculos activos y verifica colisión con el jugador.
 *            Los asteroides solo se comprueban cuando isDangerous() es verdadero.
 */
export class CollisionSystem {
  /**
   * @method check
   * @description Recorre la lista de obstáculos y reduce vidas si hay impacto.
   * @param {Object} player    - Jugador con propiedades AABB (x, y, width, height).
   * @param {Array}  obstacles - Lista unificada de Obstacle y Asteroid activos.
   * @param {Object} game      - Instancia principal del juego para mutar vidas.
   */
  check(player, obstacles, game) {
    for (let obs of obstacles) {
      // Los asteroides son inofensivos mientras son pequeños (< 75 % progreso)
      if (typeof obs.isDangerous === "function" && !obs.isDangerous()) continue;

      if (checkAABB(player, obs)) {
        if (!player.invulnerable) {
          game.lives--;
          player.hit();
        }
      }
    }
  }
}