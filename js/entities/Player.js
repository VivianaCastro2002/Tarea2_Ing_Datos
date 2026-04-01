/**
 * @file Player.js
 * @author Vivi (Motor del juego: Creación y físicas del jugador)
 * @author Belén (Estado y colisiones: Sistema de invulnerabilidad tras daño)
 * @description Platillo espacial con gatito que se desplaza entre carriles con interpolación suave.
 *              Posee mitigación temporal por impacto (invulnerabilidad e iframes).
 */

/**
 * @class Player
 * @classdesc Nave jugable que interpola lateralmente entre 3 carriles.
 *            Al recibir daño entra en un estado de invulnerabilidad de 120 frames.
 */
export default class Player {
  /**
   * Construye el jugador en el carril central.
   */
  constructor() {
    this.lane   = 1; // 0 = izquierda, 1 = centro, 2 = derecha
    this.width  = 50;
    this.height = 80;

    this.y       = height - 120;
    this.renderX = this.targetX;

    this.invulnerable = false;
    this.invulnTimer  = 0;
  }

  /**
   * @method reset
   * @description Restablece posición y estado al iniciar una nueva partida.
   */
  reset() {
    this.lane         = 1;
    this.y            = height - 120;
    this.renderX      = this.targetX;
    this.invulnerable = false;
    this.invulnTimer  = 0;
  }

  /**
   * @readonly
   * @property {number} targetX - Borde izquierdo del centro del carril destino.
   */
  get targetX() {
    return LANE_CENTERS[this.lane] - this.width / 2;
  }

  /**
   * @readonly
   * @property {number} x - Borde izquierdo actual para colisión AABB.
   */
  get x() {
    return this.renderX;
  }

  /** Desplaza el carril hacia la izquierda (mínimo 0). */
  moveLeft()  { if (this.lane > 0) this.lane--; }

  /** Desplaza el carril hacia la derecha (máximo 2). */
  moveRight() { if (this.lane < 2) this.lane++; }

  /**
   * @method hit
   * @description Activa invulnerabilidad temporal de ~2 segundos (120 frames a 60 fps).
   */
  hit() {
    this.invulnerable = true;
    this.invulnTimer  = 120;
  }

  /**
   * @method update
   * @description Interpola posición horizontal y gestiona el temporizador de invulnerabilidad.
   */
  update() {
    this.renderX = lerp(this.renderX, this.targetX, 0.2);

    if (this.invulnerable) {
      this.invulnTimer--;
      if (this.invulnTimer <= 0) this.invulnerable = false;
    }
  }

  /**
   * @method draw
   * @description Dibuja el platillo espacial con gatito. Parpadea durante la invulnerabilidad.
   */
  draw() {
    if (this.invulnerable && frameCount % 10 < 5) return;

    // Centro visual de la nave
    const cx = this.renderX + this.width  / 2;
    const cy = this.y       + this.height / 2;

    push();
    translate(cx, cy);
    noStroke();

    // Sombra
    fill(80, 0, 120, 45);
    ellipse(2, 36, 95, 14);

    // Disco inferior
    fill(160, 60, 190);
    arc(0, 14, 110, 30, 0, PI, CHORD);

    // Disco principal
    fill(210, 90, 220);
    ellipse(0, 10, 110, 26);

    // Segmentos radiales del disco
    stroke(170, 60, 200);
    strokeWeight(1);
    for (let i = 0; i < 10; i++) {
      let a = map(i, 0, 10, -PI, 0);
      line(cos(a) * 20, 10 + sin(a) * 6, cos(a) * 52, 10 + sin(a) * 12);
    }
    noStroke();

    // Borde brillante del disco
    noFill();
    stroke(240, 160, 255);
    strokeWeight(2);
    ellipse(0, 10, 110, 26);
    noStroke();

    // Luces parpadeantes del disco
    let pulse = 150 + 100 * sin(frameCount * 0.12);
    let lx    = [-44, -30, 0, 30, 44];
    let cols  = [
      [255, pulse, 255],
      [pulse, 100, 255],
      [255, 200, pulse],
      [pulse, 100, 255],
      [255, pulse, 255],
    ];
    for (let i = 0; i < lx.length; i++) {
      fill(...cols[i]);
      ellipse(lx[i], 10, 6, 5);
    }

    // Base de la cúpula
    fill(190, 80, 230);
    ellipse(0, 2, 58, 20);

    // Cúpula principal
    fill(200, 100, 240);
    arc(0, 2, 58, 62, PI, 0, CHORD);

    // Cristal interior
    fill(220, 160, 255, 140);
    arc(0, 4, 48, 52, PI, 0, CHORD);

    // Contorno cúpula
    noFill();
    stroke(240, 180, 255);
    strokeWeight(1.5);
    arc(0, 2, 58, 62, PI, 0, OPEN);
    noStroke();

    // ── Gatito ──────────────────────────────────────────────────
    // Cabeza
    fill(215, 195, 230);
    ellipse(0, -2, 30, 26);

    // Orejas externas
    fill(200, 165, 220);
    triangle(-14, -5, -17, -17, -5, -14);
    triangle( 14, -5,  17, -17,  5, -14);
    // Orejas internas (rosa)
    fill(255, 160, 195);
    triangle(-13, -6, -16, -16, -7, -12);
    triangle( 13, -6,  16, -16,  7, -12);

    // Cara
    fill(235, 218, 242);
    ellipse(0, -2, 24, 21);

    // Ojos (exterior)
    fill(50, 20, 70);
    ellipse(-7, -5, 8, 9);
    ellipse( 7, -5, 8, 9);
    // Ojos (iris)
    fill(110, 50, 170);
    ellipse(-7, -5, 5, 7);
    ellipse( 7, -5, 5, 7);
    // Brillo de ojos
    fill(255);
    ellipse(-5, -5, 3, 2);
    ellipse( 9, -5, 3, 2);

    // Nariz
    fill(255, 130, 170);
    triangle(-2, -2, 2, -2, 0, 1);

    // Boca
    stroke(190, 110, 160);
    strokeWeight(1);
    noFill();
    arc(-3, 2, 6, 5, 0, PI);
    arc( 3, 2, 6, 5, 0, PI);
    noStroke();

    // Bigotes
    stroke(170, 140, 200);
    strokeWeight(0.8);
    line(-18, -1, -4,  0);
    line(-18,  2, -4,  1);
    line( 18, -1,  4,  0);
    line( 18,  2,  4,  1);
    noStroke();

    // Reflejo de luz en el cristal
    fill(255, 240, 255, 120);
    arc(0, -18, 30, 16, PI, 0, CHORD);

    pop();
  }
}