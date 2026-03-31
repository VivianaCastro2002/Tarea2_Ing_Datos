/**
 * @file ObstacleSystem.js
 * @author Vivi (Motor del juego: Array de obstáculos activos y eliminación offscreen)
 * @description Pool y gestor general subyacente determinando la creación física 
 *              de todas las barreras descendientes (obstáculos).
 * [MODIFICAR: ESTA ENTIDAD ES PARA DESARROLLO DE COLISIONES Y HUD, NO ES LA DEFINITIVA]
 */

import Obstacle from "../entities/Obstacle.js";

/**
 * @class ObstacleSystem
 * @classdesc Modera un registro lineal de obstáculos controlando los intervalos fijos de spawn,
 *            llamada jerárquica de actualizadores individuales, y borrado de la caché.
 */
export class ObstacleSystem {
  /**
   * Vacía el registro original a base cero.
   */
  constructor() {
    /** @type {Obstacle[]} Arreglo principal iterativo de los obstáculos dibujables en frame actual. */
    this.list = [];
    /** @type {number} Contador aritmético local P5 evaluando los frames emitidos limitando saturación. */
    this.spawnTimer = 0;
  }

  /**
   * @method reset
   * @description Restituye el array borrando copias viejas durante un reinicio Game-Over.
   */
  reset() {
    this.list = [];
    this.spawnTimer = 0;
  }

  /**
   * @method update
   * @description Bucle en cascada: Desata instanciador, despachador de movilidades individuales
   *              y al final limpieza de basura.
   */
  update() {
    this.spawn();
    this.move();
    this.cleanup();
  }

  /**
   * @method spawn
   * @description Contador lógico rebasando a > 60 para apilar nuevo `Obstacle()`.
   */
  spawn() {
    this.spawnTimer++;
    if (this.spawnTimer > 60) {
      this.list.push(new Obstacle());
      this.spawnTimer = 0;
    }
  }

  /**
   * @method move
   * @description Solicita una mutación de coordenada vertical para cada objeto en el pool global.
   */
  move() {
    for (let obs of this.list) {
      obs.update();
    }
  }

  /**
   * @method cleanup
   * @description Ejecuta filtrado estricto `Array.filter` purgando elementos renderizados fuera de los márgenes inferiores.
   */
  cleanup() {
    this.list = this.list.filter(o => !o.offscreen());
  }
}