/**
 * @file Obstacle.js
 * @author Vivi (Motor del juego: Instanciación aleatoria y caída de obstáculos)
 * @description Obstáculos descendentes a evadir: barrera tipo F1 o nave alienígena con tripulante.
 */

/**
 * @class Obstacle
 * @classdesc Obstáculo con dos variantes visuales (barrera / nave alienígena) que cae
 *            verticalmente sobre uno de los 3 carriles de la pista.
 */
export default class Obstacle {
  /**
   * Instancia el obstáculo en un carril aleatorio con tipo visual aleatorio.
   */
  constructor() {
    this.lane   = floor(random(3));
    this.width  = OBS_W;
    this.height = OBS_H;
    this.y      = -this.height;
    this.type   = random([1, 2]); // 1 = barrera F1, 2 = nave alienígena

    /**
     * @property {boolean} passed - Marca si el jugador ya rebasó este obstáculo (evita score doble).
     */
    this.passed = false;
  }

  /**
   * @readonly
   * @property {number} centerX - Centro horizontal del carril (para dibujo).
   */
  get centerX() {
    return LANE_CENTERS[this.lane];
  }

  /**
   * @readonly
   * @property {number} x - Borde izquierdo del obstáculo para colisión AABB.
   */
  get x() {
    return LANE_CENTERS[this.lane] - this.width / 2;
  }

  /**
   * @method update
   * @description Desciende el obstáculo según la velocidad del juego.
   * @param {number} [speed=5] - Píxeles a desplazar por frame.
   */
  update(speed = 5) {
    this.y += speed;
  }

  /**
   * @method draw
   * @description Delega al método de dibujo según el tipo asignado.
   */
  draw() {
    push();
    translate(this.centerX, this.y + this.height / 2);
    if (this.type === 1) this._drawBarrier();
    else                 this._drawAlienShip();
    pop();
  }

  /**
   * @private
   * @method _drawBarrier
   * @description Barrera tipo F1 con segmentos rojo/blanco y luz naranja parpadeante.
   */
  _drawBarrier() {
    noStroke();
    const hw   = this.width  / 2;
    const hh   = this.height / 2;
    const segH = this.height / 3;

    for (let i = 0; i < 3; i++) {
      fill(i % 2 === 0 ? color(...KERB_RED) : color(...KERB_WHITE));
      rect(-hw, -hh + i * segH, this.width, segH);
    }

    stroke(160, 20, 20);
    strokeWeight(1.5);
    noFill();
    rect(-hw, -hh, this.width, this.height, 4);
    noStroke();

    // Luz naranja parpadeante en la cima
    fill(255, 140, 0, 200 + 55 * sin(frameCount * 0.15));
    ellipse(0, -hh - 5, 10, 10);
  }

  /**
   * @private
   * @method _drawAlienShip
   * @description Nave espacial verde con tripulante alien y antenas.
   */
  _drawAlienShip() {
    noStroke();

    // Sombra
    fill(0, 80, 0, 40);
    ellipse(1, 22, 60, 10);

    // Disco inferior
    fill(30, 120, 60);
    arc(0, 10, 70, 20, 0, PI, CHORD);

    // Disco principal
    fill(40, 160, 80);
    ellipse(0, 6, 70, 18);

    // Segmentos radiales
    stroke(20, 100, 50);
    strokeWeight(1);
    for (let i = 0; i < 8; i++) {
      let a = map(i, 0, 8, -PI, 0);
      line(cos(a) * 12, 6 + sin(a) * 4, cos(a) * 33, 6 + sin(a) * 8);
    }
    noStroke();

    // Borde brillante del disco
    noFill();
    stroke(100, 255, 140);
    strokeWeight(1.5);
    ellipse(0, 6, 70, 18);
    noStroke();

    // Luces parpadeantes
    let pulse = 120 + 100 * sin(frameCount * 0.18);
    let lx = [-28, -14, 0, 14, 28];
    for (let i = 0; i < lx.length; i++) {
      fill(i % 2 === 0 ? color(100, 255, pulse) : color(pulse, 200, 100));
      ellipse(lx[i], 6, 5, 4);
    }

    // Cúpula
    fill(20, 100, 50);
    ellipse(0, 0, 38, 14);
    fill(30, 140, 70);
    arc(0, 0, 38, 42, PI, 0, CHORD);

    // Cristal
    fill(80, 220, 130, 130);
    arc(0, 1, 30, 34, PI, 0, CHORD);

    // Reflejo
    fill(180, 255, 200, 150);
    arc(-5, -10, 12, 10, PI, 0, CHORD);

    // Contorno cúpula
    noFill();
    stroke(100, 255, 150);
    strokeWeight(1);
    arc(0, 0, 38, 42, PI, 0, OPEN);
    noStroke();

    // ── Alien ────────────────────────────────────────────────────
    fill(100, 200, 100);
    ellipse(0, -10, 22, 20);

    // Ojos (exterior)
    fill(10, 10, 10);
    ellipse(-6, -13, 10, 11);
    ellipse( 6, -13, 10, 11);
    // Ojos (iris)
    fill(140, 60, 200);
    ellipse(-6, -13, 6, 8);
    ellipse( 6, -13, 6, 8);
    // Brillo
    fill(255);
    ellipse(-4, -15, 3, 3);
    ellipse( 8, -15, 3, 3);

    // Boca
    stroke(60, 140, 60);
    strokeWeight(1);
    noFill();
    line(-5, -5, 5, -5);

    // Antenas
    stroke(80, 180, 80);
    strokeWeight(1);
    line(-5, -20, -9, -28);
    line( 5, -20,  9, -28);
    noStroke();
    fill(200, 255, 100);
    ellipse(-9, -29, 5, 5);
    ellipse( 9, -29, 5, 5);

    // Brazos
    fill(90, 190, 90);
    ellipse(-14, -8, 7, 6);
    ellipse( 14, -8, 7, 6);
  }

  /**
   * @method offscreen
   * @description Verdadero si el obstáculo superó el borde inferior del canvas.
   * @returns {boolean}
   */
  offscreen() {
    return this.y > height + 50;
  }
}