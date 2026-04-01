# 🏎️ Miaurio Kart

> **Un juego de carreras espacial controlado por tus gestos de mano — sin tocar el teclado.**

<div align="center">

![p5.js](https://img.shields.io/badge/p5.js-v1.9.0-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white)
![ML5.js](https://img.shields.io/badge/ML5.js-v0.12.2-7B2FBE?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)

</div>

---

## 🌌 ¿De qué trata?

**Miaurio Kart** es un videojuego de carreras top-down ambientado en el espacio. Esquiva obstáculos, acumula puntaje y compite por el mejor tiempo — todo controlado en tiempo real por detección de gestos de mano a través de tu webcam, usando un modelo de **Teachable Machine** integrado con **ML5.js**.

La pista arcoíris, el fondo estrellado y el sistema de carriles dinámicos crean una experiencia visual única e inmersiva.

---

## ✨ Características

- 👈👉 **Control por gestos** — Mueve tu mano para cambiar de carril y acelerar
- 🌈 **Pista arcoíris** con kerbs animados y línea de largada
- 💥 **Sistema de colisiones** con obstáculos generados proceduralmente
- 🏁 **Estados de juego** — Menú, En carrera, Pausa y Game Over
- ⌨️ **Fallback con teclado** — Las flechas funcionan si la cámara no está disponible
- 📊 **HUD en tiempo real** — Velocidad, acción detectada y puntaje

---

## 🚀 Cómo probarlo

### Requisitos
- Un navegador moderno (Chrome o Firefox recomendado)
- Python 3 instalado (para el servidor local)
- Webcam (opcional, para control por gestos)

### Pasos

#### 1. Clonar el repositorio
```bash
git clone https://github.com/VivianaCastro2002/Tarea2_Ing_Datos.git
cd Tarea2_Ing_Datos
```

#### 2. Levantar un servidor local
```bash
python -m http.server 8000
```

#### 3. Abrir en el navegador
```
http://localhost:8000
```

> [!IMPORTANT]
> El juego **no** funciona al abrir `index.html` directamente como archivo local (`file://`) debido a las restricciones de módulos ES6 y acceso a la webcam. Siempre usa un servidor HTTP local.

### Controles

| Acción | Gesto (ML) | Teclado (fallback) |
|--------|-----------|-------------------|
| Carril izquierdo | Mano a la izquierda (👈) | `←` |
| Carril derecho | Mano a la derecha (👉) | `→` |
| Iniciar / Pausar | — | `Espacio` / `P` |

---

## Estructura del proyecto

```
Tarea2_Ing_Datos/
├── index.html          # Punto de entrada
├── global.js           # Constantes y estado global compartido
├── sketch.js           # Loop principal de p5.js
├── css/
│   └── style.css       # Estilos del canvas y overlay
└── js/
    ├── game/           # Motor del juego (Game, StateManager)
    ├── entities/       # Jugador y obstáculos
    ├── systems/        # Colisiones y física
    ├── ui/             # HUD y pantallas de menú
    └── ml/             # Integración ML5 + Teachable Machine
```

---

## Integrantes

| Nombre | Rol |
|--------|-----|
| **Valentina Cifuentes** | Integración ML / Detección de gestos |
| **Viviana Castro** | Motor del juego / Entidades |
| **Belén Bravo** | Colisiones / HUD / Sistemas |

---

## Tecnologías utilizadas

- **[p5.js](https://p5js.org/)** — Motor de renderizado 2D y loop del juego
- **[ML5.js](https://ml5js.org/)** — Wrapper de TensorFlow.js para el modelo de Teachable Machine
- **Teachable Machine (Google)** — Modelo de clasificación de gestos entrenado por el equipo
- **ES6 Modules** — Arquitectura modular del código JavaScript

---

<div align="center">

*Tarea 2 — Ingeniería de Datos · 2026*

</div>
