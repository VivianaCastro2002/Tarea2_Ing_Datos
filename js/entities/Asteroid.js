/**
 * @file Asteroid.js
 * @author Vivi (Motor del juego: Asteroide diagonal con perspectiva)
 * @description Asteroide que entra desde los costados del mapa en diagonal hacia un carril,
 *              creciendo en tamaño para simular perspectiva. Solo es colisionable cuando
 *              su progreso supera el 75 % (visible y amenazante).
 */

/**
 * @class Asteroid
 * @classdesc Obstáculo especial con forma procedural irregular que vuela en diagonal.
 *            A diferencia de Obstacle, usa coordenadas de centro y expone getters AABB
 *            para que CollisionSystem pueda tratarlo uniformemente.
 */
export default class Asteroid {
  /**
   * Genera un asteroide desde un lado aleatorio de la pantalla.
   */
  constructor() {
    const fromLeft = random() < 0.5;

    this.startX = fromLeft ? random(-60, -20) : random(width + 20, width + 60);
    this.startY = random(0, height * 0.6);

    this.targetX = LANE_CENTERS[floor(random(3))];
    this.targetY = random(300, 520);

    // Posición actual (centro del asteroide)
    this.cx = this.startX;
    this.cy = this.startY;

    this.progress  = 0;
    this.speed     = random(0.004, 0.009);
    this.size      = 0;
    this.maxSize   = random(36, 55);
    this.rotation  = random(TWO_PI);
    this.rotSpeed  = random(-0.03, 0.03);

    // Forma irregular: cada vértice tiene su radio propio
    this.verts = [];
    const nv = floor(random(7, 11));
    for (let i = 0; i < nv; i++) {
      this.verts.push(random(0.6, 1.0));
    }

    // Gris con tinte morado para encajar con la paleta de la pista
    this.col = [
      random(130, 180),
      random(100, 140),
      random(140, 190),
    ];

    /**
     * @property {boolean} passed - Evita que ScoreSystem sume puntos varias veces
     *                              por el mismo asteroide al sobrepasarlo.
     */
    this.passed = false;
  }

  // ── Getters AABB para CollisionSystem ──────────────────────────
  /** Borde izquierdo para AABB. */
  get x()      { return this.cx - this.size; }
  /** Borde superior para AABB. */
  get y()      { return this.cy - this.size; }
  /** Ancho del bounding box. */
  get width()  { return this.size * 2; }
  /** Alto del bounding box. */
  get height() { return this.size * 2; }

  /**
   * @method update
   * @description Avanza progreso, aplica rotación e interpola posición y tamaño.
   */
  update() {
    this.progress  += this.speed;
    this.rotation  += this.rotSpeed;

    this.cx   = lerp(this.startX, this.targetX, this.progress);
    this.cy   = lerp(this.startY, this.targetY, this.progress);
    this.size = this.maxSize * this.progress;
  }

  /**
   * @method draw
   * @description Dibuja el cuerpo irregular con cara iluminada y cráteres.
   */
  draw() {
    push();
    translate(this.cx, this.cy);
    rotate(this.rotation);

    const r = this.size;

    // Sombra
    noStroke();
    fill(0, 0, 0, 50);
    ellipse(3, 4, r * 2.1, r * 1.6);

    // Cuerpo principal
    fill(...this.col);
    beginShape();
    for (let i = 0; i < this.verts.length; i++) {
      const a  = map(i, 0, this.verts.length, 0, TWO_PI);
      const rv = r * this.verts[i];
      vertex(cos(a) * rv, sin(a) * rv);
    }
    endShape(CLOSE);

    // Cara iluminada
    fill(
      min(this.col[0] + 50, 255),
      min(this.col[1] + 40, 255),
      min(this.col[2] + 55, 255),
      180
    );
    beginShape();
    for (let i = 0; i < this.verts.length; i++) {
      const a  = map(i, 0, this.verts.length, 0, TWO_PI);
      const rv = r * this.verts[i] * 0.55;
      vertex(cos(a - 0.4) * rv, sin(a - 0.4) * rv);
    }
    endShape(CLOSE);

    // Cráteres
    noStroke();
    fill(
      max(this.col[0] - 40, 0),
      max(this.col[1] - 35, 0),
      max(this.col[2] - 35, 0),
      200
    );
    const cr = r * 0.28;
    ellipse(-r * 0.30,  r * 0.10, cr,        cr * 0.8);
    ellipse( r * 0.25, -r * 0.25, cr * 0.7,  cr * 0.6);
    ellipse( r * 0.05,  r * 0.35, cr * 0.5,  cr * 0.4);

    pop();
  }

  /**
   * @method offscreen
   * @description Verdadero cuando el asteroide completó su trayectoria.
   * @returns {boolean}
   */
  offscreen() { return this.progress >= 1.0; }

  /**
   * @method isDangerous
   * @description Activa la colisión solo cuando el asteroide es suficientemente grande y visible.
   * @returns {boolean}
   */
  isDangerous() { return this.progress > 0.75; }
}
