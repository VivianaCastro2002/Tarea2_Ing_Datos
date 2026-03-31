/**
 * @file Game.js
 * @author Vivi (Motor del juego) / Belén (Estados y vidas)
 * @description Clase core que engloba y coordina los sistemas, manejadores de estado,
 *              entidades y renderizado.
 */

import { GameStateManager } from "./GameStateManager.js";
import { InputHandler } from "../systems/InputHandler.js";
import { ObstacleSystem } from "../systems/ObstacleSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { ScoreSystem } from "../systems/ScoreSystem.js";
import { Renderer } from "../ui/Renderer.js";
import Player from "../entities/Player.js";

/**
 * @class Game
 * @classdesc Inicializa todos los componentes de la arquitectura del juego y delega los ciclos update/draw.
 */
export class Game {
  /**
   * Inicializa entidades, gestores, módulos de colisión, input y puntaje.
   * También comienza con 3 vidas por defecto.
   */
  constructor() {
    this.stateManager = new GameStateManager();
    this.player = new Player();

    this.input = new InputHandler(this.player);
    this.obstacles = new ObstacleSystem();
    this.collision = new CollisionSystem();
    this.score = new ScoreSystem();

    this.renderer = new Renderer(this);
    this.lives = 3;
  }

  /**
   * @method reset
   * @description Reinicia todos los contadores, posiciones y vidas al iniciar una nueva partida.
   */
  reset() {
    this.lives = 3;
    this.player.reset();
    this.obstacles.reset();
    this.score.reset();
  }

  /**
   * @method update
   * @description Avanza la lógica principal si el estado actual está activo (JUGANDO).
   */
  update() {
    this.stateManager.update(this);

    if (this.stateManager.isPlaying()) {
      this.input.update();
      this.obstacles.update();
      this.collision.check(this.player, this.obstacles.list, this);
      this.score.update(this.obstacles.list, this.player);
      this.player.update();
    }
  }

  /**
   * @method draw
   * @description Delega el pintado del frame visual al Renderer principal.
   */
  draw() {
    this.renderer.draw();
  }
}