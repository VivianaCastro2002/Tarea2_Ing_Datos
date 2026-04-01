// ── handpose_ml.js — Integración con ml5.js (ImageClassifier) ──
//
//  Usa ml5.imageClassifier() con el modelo de Teachable Machine.
//  ml5 corre su propio loop de clasificación via callbacks.
//  updateML() se mantiene como no-op para no romper sketch.js.
//
//  Depende de: global.js (currentAction)
//  Biblioteca: ml5.js (incluida en index.html)
//
//  Técnicas de estabilización:
//    1. Umbral de confianza  — solo acepta predicciones >= 85 %
//    2. Filtro de mayoría    — ventana de 10 frames, mayoría >= 70 %
//    3. Cooldown             — 500 ms de bloqueo tras cada cambio
//    4. Pulso único          — un gesto = un carril (detección de flanco)
// ─────────────────────────────────────────────────────────────────

const TM_MODEL_URL = 'https://teachablemachine.withgoogle.com/models/0iIbdJx5o/';

// ─── Estado del módulo ML ─────────────────────────────────────────
let classifier = null;  // clasificador ml5
let mlVideo    = null;  // elemento de video (p5 createCapture)
let mlReady    = false; // true cuando modelo + cámara listos
let mlError    = null;  // mensaje de error si falla

// Mapeo de clases TM → currentAction
const CLASS_MAP = {
  'Izquierda' : 'IZQUIERDA',
  'Derecha'   : 'DERECHA',
  'Nada'      : 'NEUTRAL',
};

// ─── Parámetros de estabilización ────────────────────────────────
const CONFIDENCE_THRESHOLD = 0.85;
const HISTORY_SIZE         = 10;
const MAJORITY_RATIO       = 0.70;
const COOLDOWN_MS          = 500;

// ─── Buffers de estabilización ───────────────────────────────────
let predictionHistory = [];
let lastActionTime    = 0;
let lastRawClass      = 'Nada';
let lastRawConf       = 0;
let lastStableClass   = 'Nada';
let lastFiredAction   = 'NEUTRAL';

// ─── Filtro de mayoría ────────────────────────────────────────────
function getMajorityClass() {
  if (predictionHistory.length < HISTORY_SIZE) return null;
  const counts = {};
  for (const cls of predictionHistory) counts[cls] = (counts[cls] ?? 0) + 1;
  for (const [cls, count] of Object.entries(counts)) {
    if (count / HISTORY_SIZE >= MAJORITY_RATIO) return cls;
  }
  return null;
}

// ─── Callback de resultado del clasificador ───────────────────────
function onMLResult(error, results) {
  if (error) {
    mlError = String(error);
    console.error('[ML5] Error en clasificación:', mlError);
    return;
  }

  // ml5 devuelve resultados ordenados por confianza (mayor primero)
  // Cada resultado: { label: 'Derecha', confidence: 0.95 }
  const bestClass = results[0].label;
  const bestConf  = results[0].confidence;

  lastRawClass = bestClass;
  lastRawConf  = bestConf;

  // Técnica 1: Umbral de confianza
  const acceptedClass = (bestConf >= CONFIDENCE_THRESHOLD) ? bestClass : 'Nada';

  // Técnica 2: Filtro de mayoría
  predictionHistory.push(acceptedClass);
  if (predictionHistory.length > HISTORY_SIZE) predictionHistory.shift();

  const majorityClass = getMajorityClass();
  if (majorityClass !== null) {
    const desiredAction = CLASS_MAP[majorityClass] ?? 'NEUTRAL';
    const now           = performance.now();

    // Técnica 4: Pulso único (detección de flanco)
    if (majorityClass !== lastStableClass) {
      lastStableClass = majorityClass;

      if (desiredAction !== 'NEUTRAL') {
        // Técnica 3: Cooldown
        if (now - lastActionTime >= COOLDOWN_MS) {
          currentAction   = desiredAction;
          lastFiredAction = desiredAction;
          lastActionTime  = now;
          // Reset a NEUTRAL después de un frame para que InputHandler lo procese
          setTimeout(() => { currentAction = 'NEUTRAL'; }, 32);
        }
      } else {
        currentAction   = 'NEUTRAL';
        lastFiredAction = 'NEUTRAL';
      }
    }
  }

  // ml5 no repite solo — hay que volver a llamar
  classifier.classify(onMLResult);
}

// ─── Callback cuando el modelo termina de cargar ──────────────────
function onModelReady() {
  mlReady = true;
  console.log('[ML5] Modelo cargado ✓ — iniciando clasificación');
  classifier.classify(onMLResult);
}

// ─── Inicialización — llamar UNA vez desde setup() ────────────────
//  Debe correr dentro del contexto p5 para que createCapture() funcione.
function initML() {
  mlVideo = createCapture(VIDEO);
  mlVideo.size(200, 200);
  mlVideo.hide();

  // Mover el elemento <video> al overlay del HUD
  const container = document.getElementById('cam-overlay');
  if (container) container.appendChild(mlVideo.elt);

  classifier = ml5.imageClassifier(TM_MODEL_URL, mlVideo, onModelReady);
  console.log('[ML5] Cargando modelo desde Teachable Machine...');
}

// ─── updateML — no-op, ml5 corre su propio loop de callbacks ──────
//  Se llama desde draw() en sketch.js para mantener la interfaz uniforme.
function updateML() {}

// ─── Panel de estado del modelo (HUD de debug) ───────────────────
function drawMLStatus() {
  const panelH = mlReady ? 96 : 52;
  noStroke();
  fill(0, 0, 0, 160);
  rect(width - 215, height - panelH - 8, 205, panelH, 8);

  textAlign(LEFT, CENTER);
  textSize(10);

  if (mlError) {
    fill(255, 80, 80);
    text('ERROR ML5: ' + mlError.substring(0, 26), width - 210, height - panelH + 12);
    fill(180, 180, 180);
    text('Usando teclado como fallback', width - 210, height - panelH + 28);

  } else if (!mlReady) {
    fill(255, 200, 0);
    text('Cargando modelo ML5...', width - 210, height - panelH + 24);

  } else {
    const bX   = width - 210;
    const barW = 195;
    const barY = height - panelH + 20;

    fill(80, 255, 130);
    text('Modelo ML5 activo', bX, height - panelH + 10);

    // Barra de confianza
    fill(40, 40, 40);
    rect(bX, barY, barW, 7, 3);
    fill(lastRawConf >= CONFIDENCE_THRESHOLD ? color(80, 255, 130) : color(255, 160, 40));
    rect(bX, barY, barW * lastRawConf, 7, 3);

    fill(200, 200, 200);
    text('Camara: ' + lastRawClass + ' ' + nf(lastRawConf * 100, 1, 0) + '%', bX, barY + 14);

    if (lastStableClass !== 'Nada') {
      fill(255, 200, 60);
      text('Baja la mano para el proximo', bX, barY + 28);
    } else {
      fill(150, 220, 255);
      text('Listo para detectar gesto', bX, barY + 28);
    }

    // Última acción disparada al juego
    let ac = color(120, 120, 120);
    if (lastFiredAction === 'IZQUIERDA') ac = color(100, 180, 255);
    if (lastFiredAction === 'DERECHA')   ac = color(255, 100, 100);
    fill(ac);
    textStyle(BOLD);
    textSize(11);
    text('> Juego: ' + lastFiredAction, bX, barY + 44);
    textStyle(NORMAL);
    textSize(10);
  }
}
