class Obstacle {
  constructor() {
    this.lane = floor(random(3));
    this.x    = LANE_CENTERS[this.lane];
    this.y    = -OBS_H;
    this.w    = OBS_W;
    this.h    = OBS_H;
    this.type = random([1, 2]);
  }

  // ─── Lógica ─────────────────────────────────────────────────
  update() {
    this.y += gameSpeed;
  }

  // ─── Dibujo ─────────────────────────────────────────────────
  draw() {
    push();
    translate(this.x, this.y);
    if (this.type === 1) this._drawBarrier();
    if (this.type === 2) this._drawAlienShip();
    pop();
  }

  _drawBarrier() {
    noStroke();
    let segH = this.h / 3;
    for (let i = 0; i < 3; i++) {
      fill(i % 2 === 0 ? color(...KERB_RED) : color(...KERB_WHITE));
      rect(-this.w/2, -this.h/2 + i*segH, this.w, segH);
    }
    stroke(160, 20, 20);
    strokeWeight(1.5);
    noFill();
    rect(-this.w/2, -this.h/2, this.w, this.h, 4);
    noStroke();
    // Luz naranja parpadeante
    fill(255, 140, 0, 200 + 55*sin(frameCount*0.15));
    ellipse(0, -this.h/2 - 5, 10, 10);
  }

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
      line(cos(a)*12, 6 + sin(a)*4, cos(a)*33, 6 + sin(a)*8);
    }
    noStroke();

    // Borde brillante
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

    // Contorno
    noFill();
    stroke(100, 255, 150);
    strokeWeight(1);
    arc(0, 0, 38, 42, PI, 0, OPEN);
    noStroke();

    // ── Alien ────────────────────────────────────────────────
    fill(100, 200, 100);
    ellipse(0, -10, 22, 20);

    fill(10, 10, 10);
    ellipse(-6, -13, 10, 11);
    ellipse( 6, -13, 10, 11);
    fill(140, 60, 200);
    ellipse(-6, -13, 6, 8);
    ellipse( 6, -13, 6, 8);
    fill(255);
    ellipse(-4, -15, 3, 3);
    ellipse( 8, -15, 3, 3);

    stroke(60, 140, 60);
    strokeWeight(1);
    noFill();
    line(-5, -5, 5, -5);

    stroke(80, 180, 80);
    strokeWeight(1);
    line(-5, -20, -9, -28);
    line( 5, -20,  9, -28);
    noStroke();
    fill(200, 255, 100);
    ellipse(-9, -29, 5, 5);
    ellipse( 9, -29, 5, 5);

    fill(90, 190, 90);
    ellipse(-14, -8, 7, 6);
    ellipse( 14, -8, 7, 6);
  }

  // ─── Colisión (Miembro 3 lo usa) ────────────────────────────
  getBounds() {
    return {
      x: this.x - this.w/2 + 6,
      y: this.y - this.h/2 + 4,
      w: this.w - 12,
      h: this.h - 8,
    };
  }

  isOffScreen() {
    return this.y > height + this.h;
  }
}