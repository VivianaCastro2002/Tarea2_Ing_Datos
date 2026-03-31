// ═══════════════════════════════════════════════════════════════
//  Asteroid.js — Asteroide que entra desde los costados del mapa
//
//  Nace fuera de pantalla (izq o der), viaja en diagonal hacia
//  un carril, crece en tamaño simulando perspectiva.
//
//  Miembro 3: usar isDangerous() antes de verificar colisión,
//  para evitar hits invisibles cuando el asteroide es muy pequeño.
//
//  Depende de: globals.js
// ═══════════════════════════════════════════════════════════════

class Asteroid {
  constructor() {
    let fromLeft = random() < 0.5;

    this.startX  = fromLeft ? random(-60, -20) : random(width + 20, width + 60);
    this.startY  = random(0, height * 0.6);

    this.targetX = LANE_CENTERS[floor(random(3))];
    this.targetY = random(300, 520);

    this.x        = this.startX;
    this.y        = this.startY;
    this.progress = 0;
    this.speed    = random(0.004, 0.009);
    this.size     = 0;
    this.maxSize  = random(36, 55);
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.03, 0.03);

    // Forma irregular: cada vértice tiene su propio radio
    this.verts = [];
    let nv = floor(random(7, 11));
    for (let i = 0; i < nv; i++) {
      this.verts.push(random(0.6, 1.0));
    }

    // Gris con tinte morado para encajar con la paleta de la pista
    this.col = [
      random(130, 180),
      random(100, 140),
      random(140, 190),
    ];
  }

  // ─── Lógica ─────────────────────────────────────────────────
  update() {
    this.progress += this.speed;
    this.rotation += this.rotSpeed;

    this.x    = lerp(this.startX, this.targetX, this.progress);
    this.y    = lerp(this.startY, this.targetY, this.progress);
    this.size = this.maxSize * this.progress; // crece con perspectiva
  }

  // ─── Dibujo ─────────────────────────────────────────────────
  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    let r = this.size;

    // Sombra
    noStroke();
    fill(0, 0, 0, 50);
    ellipse(3, 4, r * 2.1, r * 1.6);

    // Cuerpo 
    fill(...this.col);
    beginShape();
    for (let i = 0; i < this.verts.length; i++) {
      let a  = map(i, 0, this.verts.length, 0, TWO_PI);
      let rv = r * this.verts[i];
      vertex(cos(a) * rv, sin(a) * rv);
    }
    endShape(CLOSE);

    // Cara 
    fill(
      min(this.col[0] + 50, 255),
      min(this.col[1] + 40, 255),
      min(this.col[2] + 55, 255),
      180
    );
    beginShape();
    for (let i = 0; i < this.verts.length; i++) {
      let a  = map(i, 0, this.verts.length, 0, TWO_PI);
      let rv = r * this.verts[i] * 0.55;
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
    let cr = r * 0.28;
    ellipse(-r * 0.30,  r * 0.10, cr,        cr * 0.8);
    ellipse( r * 0.25, -r * 0.25, cr * 0.7,  cr * 0.6);
    ellipse( r * 0.05,  r * 0.35, cr * 0.5,  cr * 0.4);

    pop();
  }

  // ─── Colisión (Miembro 3 lo usa) ────────────────────────────
  getBounds() {
    let r = this.size * 0.5;
    return { x: this.x - r, y: this.y - r, w: r * 2, h: r * 2 };
  }

  isOffScreen()  { return this.progress >= 1.0; }
  isDangerous()  { return this.progress > 0.75; } // activar colisión solo cuando es visible
}