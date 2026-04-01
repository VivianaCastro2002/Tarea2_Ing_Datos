/**
 * @file ObstacleSystem.js
 * @author Vivi (Motor del juego: Pool de obstáculos y asteroides)
 * @description Gestiona la creación, movimiento y limpieza de todos los obstáculos
 *              descendentes (barreras y naves alienígenas) y asteroides diagonales.
 */

import Obstacle from "../entities/Obstacle.js";
import Asteroid from "../entities/Asteroid.js";

/**
 * @class ObstacleSystem
 * @classdesc Mantiene una lista unificada de obstáculos y asteroides.
 *            Los obstáculos caen verticalmente en carril fijo;
 *            los asteroides entran en diagonal desde los costados.
 */
export class ObstacleSystem {
  /**
   * Inicializa los contadores y el pool vacío.
   */
  constructor() {
    /** @type {Array<Obstacle|Asteroid>} Lista unificada de todos los peligros activos. */
    this.list          = [];
    /** @type {number} Frames transcurridos desde el último spawn de obstáculo. */
    this.spawnTimer    = 0;
    /** @type {number} Frames transcurridos desde el último spawn de asteroide. */
    this.asteroidTimer = 0;
  }

  /**
   * @method reset
   * @description Vacía el pool y reinicia los contadores al comenzar una nueva partida.
   */
  reset() {
    this.list          = [];
    this.spawnTimer    = 0;
    this.asteroidTimer = floor(random(0, 60)); // offset aleatorio para variedad
  }

  /**
   * @method update
   * @description Ciclo completo: spawn → movimiento → limpieza offscreen.
   */
  update() {
    this.spawnObstacle();
    this.spawnAsteroid();
    this.move();
    this.cleanup();
  }

  /**
   * @method spawnObstacle
   * @description Agrega un nuevo Obstacle cada OBS_SPAWN_RATE frames.
   */
  spawnObstacle() {
    this.spawnTimer++;
    if (this.spawnTimer > OBS_SPAWN_RATE) {
      this.list.push(new Obstacle());
      this.spawnTimer = 0;
    }
  }

  /**
   * @method spawnAsteroid
   * @description Agrega un Asteroid aproximadamente cada 180 frames con variabilidad aleatoria.
   *              Los asteroides son más escasos que los obstáculos normales.
   */
  spawnAsteroid() {
    this.asteroidTimer++;
    if (this.asteroidTimer > 180) {
      this.list.push(new Asteroid());
      // Variabilidad: cooldown entre 150 y 210 frames
      this.asteroidTimer = floor(random(-30, 30));
    }
  }

  /**
   * @method move
   * @description Llama a update() en cada elemento del pool.
   */
  move() {
    for (let obs of this.list) {
      obs.update();
    }
  }

  /**
   * @method cleanup
   * @description Elimina del pool los elementos que salieron de pantalla.
   */
  cleanup() {
    this.list = this.list.filter(o => !o.offscreen());
  }
}