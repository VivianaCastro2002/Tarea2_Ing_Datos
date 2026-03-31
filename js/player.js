// ═══════════════════════════════════════════════════════════════
//  Player.js — Nave del jugador (platillo rosa con gatito)
//
//  Depende de: globals.js
//  Expone:     player (instanciado en sketch.js)
// ═══════════════════════════════════════════════════════════════

class Player {
  constructor() {
    this.lane    = 1;
    this.x       = LANE_CENTERS[1];
    this.y       = 480;
    this.w       = 48;
    this.h       = 70;
    this.targetX = this.x;
    this.laneCD  = 0;
  }

  // ─── Lógica ─────────────────────────────────────────────────
  update() {
    if (this.laneCD > 0) this.laneCD--;

    if (this.laneCD === 0) {
      if (currentAction === 'IZQUIERDA' && this.lane > 0) {
        this.lane--;
        this.laneCD = 18;
      } else if (currentAction === 'DERECHA' && this.lane < 2) {
        this.lane++;
        this.laneCD = 18;
      }
    }

    this.targetX = LANE_CENTERS[this.lane];
    this.x = lerp(this.x, this.targetX, 0.15);
  }

  // ─── Dibujo ─────────────────────────────────────────────────
  draw() {
    if (invulnerable && frameCount % 6 < 3) return;

    push();
    translate(this.x, this.y);
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
      let a  = map(i, 0, 10, -PI, 0);
      let r1 = 20, r2 = 52;
      line(cos(a)*r1, 10 + sin(a)*6, cos(a)*r2, 10 + sin(a)*12);
    }
    noStroke();

    // Borde brillante del disco
    noFill();
    stroke(240, 160, 255);
    strokeWeight(2);
    ellipse(0, 10, 110, 26);
    noStroke();

    // Luces parpadeantes
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

    // ── Gatito ──────────────────────────────────────────────
    // Cabeza
    fill(215, 195, 230);
    ellipse(0, -2, 30, 26);

    // Orejas
    fill(200, 165, 220);
    triangle(-14, -5, -17, -17, -5, -14);
    triangle( 14, -5,  17, -17,  5, -14);
    fill(255, 160, 195);
    triangle(-13, -6, -16, -16, -7, -12);
    triangle( 13, -6,  16, -16,  7, -12);

    // Cara
    fill(235, 218, 242);
    ellipse(0, -2, 24, 21);

    // Ojos
    fill(50, 20, 70);
    ellipse(-7, -5, 8, 9);
    ellipse( 7, -5, 8, 9);
    fill(110, 50, 170);
    ellipse(-7, -5, 5, 7);
    ellipse( 7, -5, 5, 7);
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
    line(-18, -1, -4, 0);
    line(-18,  2, -4, 1);
    line( 18, -1,  4, 0);
    line( 18,  2,  4, 1);
    noStroke();

    // Reflejo de luz en el cristal
    fill(255, 240, 255, 120);
    arc(0, -18, 30, 16, PI, 0, CHORD);

    pop();
  }

  // ─── Colisión (Miembro 3 lo usa) ────────────────────────────
  getBounds() {
    return {
      x: this.x - this.w / 2 + 8,
      y: this.y - this.h / 2 + 4,
      w: this.w - 16,
      h: this.h - 8,
    };
  }
}