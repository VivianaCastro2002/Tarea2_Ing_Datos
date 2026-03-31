/**
 * @file Player.js
 * @author Vivi (Motor del juego: Creación y físicas del jugador)
 * @author Belén (Estado y colisiones: Sistema de invulnerabilidad tras daño)
 * @description Entidad encargada de representar al usuario interactivo y su física.
 * [MODIFICAR: ESTA ENTIDAD ES PARA DESARROLLO DE COLISIONES Y HUD, NO ES LA DEFINITIVA]
 */

/**
 * @class Player
 * @classdesc Construye un rectangulo jugable que se desplaza lateralmente interpolando su movimiento.
 *            Posee una mitigación temporal por impacto (Invulnerabilidad y frames o iframes).
 */
export default class Player {
  /**
   * Construye el jugador asignando un carril de arranque.
   */
  constructor() {
    this.lane = 1; // 0 (Izquierda), 1 (Centro), 2 (Derecha)
    this.width = 50;
    this.height = 80;

    this.y = height - 120;
    this.renderX = this.targetX;

    this.invulnerable = false;
    this.invulnTimer = 0;
  }

  /**
   * @method reset
   * @description Restablece las métricas vitales al momento del inicio.
   */
  reset() {
    this.lane = 1;
    this.y = height - 120;
    this.renderX = this.targetX;
    this.invulnerable = false;
    this.invulnTimer = 0;
  }

  /**
   * @readonly
   * @property {number} targetX - Punto geométrico X al cual el jugador intentará interpolarse según su carril.
   */
  get targetX() {
    return this.lane * (width / 3) + width / 6 - this.width / 2;
  }

  /**
   * @readonly
   * @property {number} x - Posición X real, expuesta para el comprobador universal AABB físico.
   */
  get x() {
    return this.renderX;
  }

  /**
   * @method moveLeft
   * @description Altera el carril deseado del jugador hacia la izquierda (Mínimo carril cero).
   */
  moveLeft() {
    if (this.lane > 0) this.lane--;
  }

  /**
   * @method moveRight
   * @description Altera el carril deseado del jugador hacia la derecha (Máximo carril dos).
   */
  moveRight() {
    if (this.lane < 2) this.lane++;
  }

  /**
   * @method hit
   * @description Activa la bandera booleana para ignorar daño temporal de 120 frames (aprox. 2 seg).
   */
  hit() {
    this.invulnerable = true;
    this.invulnTimer = 120; // 2 segundos a 60fps
  }

  /**
   * @method update
   * @description Eje cinemático: Interpola su gráfica, resuelve invulnerabilidad de reloj.
   */
  update() {
    this.renderX = lerp(this.renderX, this.targetX, 0.2);

    if (this.invulnerable) {
      this.invulnTimer--;
      if (this.invulnTimer <= 0) {
        this.invulnerable = false;
      }
    }
  }

  /**
   * @method draw
   * @description Proyector primitivo: Traza el recuadro verde que simboliza la entidad en el canvas P5.
   */
  draw() {
    if (this.invulnerable && frameCount % 10 < 5) return;

    fill(30, 215, 96);
    stroke(255);
    strokeWeight(3);
    rect(this.renderX, this.y, this.width, this.height, 12);
    noStroke();
  }
}