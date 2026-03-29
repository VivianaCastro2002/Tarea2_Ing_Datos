# 🚀 Guía de Integración - Módulo de Estado, Colisiones y HUD

Esta guía documenta la arquitectura base implementada y las reglas que el resto del equipo deben seguir para desarrollar sus respectivas tareas sin romper el sistema de **Máquina de Estados**, **Colisiones (AABB)** y el **HUD**.

---
## ▶️Cómo correr el juego (VSCode + Live Server)
**1. Instalar Live Server:**
Utilizar Visual Studio Code, e instalar la extensión **Live Server**.

**2. Abrir proyecto y ejecutar:**
- Click derecho `index.html` → **Open with Live Server**  
- o botón **Go Live**

**3. Resultado**:
Se abre en
```
http://127.0.0.1:5500/
```


## 🏗️ Arquitectura ES6
El proyecto entero usa **Módulos ES6** (`import`/`export`). 
- **El único archivo invocado en HTML es `sketch.js`** mediante `<script type="module" src="sketch.js"></script>`. 
- **⚠️ REGLA:** Por favor, NO añadan múltiples `<script src="...">` clásicos en el `index.html`. Trabajemos todo mediante imports.

---

## 👁️ Instrucciones para ~Modelo y Visión~

**Tarea:** Entrenar, cargar el modelo pre-entrenado TM en p5, leer la cámara web y exponer el resultado.

1. **Dónde trabajar:** Tu zona principal será `sketch.js`. 
2. **Variable Clave (`currentAction`):**
   - Observarás que en `sketch.js` ya existe y está exportada: `export let currentAction = "NINGUNA";`.
   - Tu única responsabilidad en la integración es que cuando el modelo de ML5 arroje un resultado de confianza, actualices esta variable (por ejemplo, `currentAction = "IZQUIERDA"`).
   - El `InputHandler.js` (configurado pero aún como borrador) lee esa variable automáticamente y desplaza al jugador.

---

## 🏃‍♀️ Instrucciones para ~Motor del Juego y Físicas~

**Tarea:** Scrolling vertical, creación matemática del jugador, aparición y ciclo de vida de obstáculos aleatorios.

1. **El Jugador (`Player.js`):**
   - Estructuré un borrador del jugador que se mueve en 3 carriles con interpolación suavizada (`lerp`).
   - También le codifiqué la mitigación por impacto (i-frames visuales y lógica).
   - **⚠️ LO QUE NO DEBES ROMPER:** Bajo ninguna circunstancia elimines las propiedades `x`, `y`, `width` y `height`. El motor de colisiones AABB necesita estas cuatro variables numéricas para calcular si el personaje colisionó.
2. **Los Obstáculos (`Obstacle.js` y `ObstacleSystem.js`):**
   - Dejé un _Pool_ de instanciación aleatorio funcional (`ObstacleSystem.js`) que instancia obstáculos, actualiza su `y` para simular caída y los limpia con `Array.filter` cuando escapan la pantalla (`offscreen()`). Puedes construir y modificar sobre esto.
   - **⚠️ LO QUE NO DEBES ROMPER:** Al igual que el Player, en `Obstacle.js` NO elimines las propiedades `x`, `y`, `width` y `height`. Además, debes **conservar** la variable `this.passed = false` que se encuentra en el constructor. El Sistema de Puntajes (HUD) necesita saber si el objeto ya fue esquivado para darle los +5 puntos al jugador, no la borres.

---

## 🎮 Lo que está listo

Las tareas que ya están listas al 100%:
- **Colisiones AABB:** Enlazadas y en vivo calculando choques exactos en `CollisionSystem.js`.
- **Sistema de Inmunidad y Vida:** Comienzas con 3 vidas, si te chocas pierdes 1 y titilas 2 segundos ignorando el daño extra.
- **Máquina de Estados y Pantallas:** Todo el flujo del menús (Menú principal, pausa, perder, jugar) lo modifiqué en `GameStateManager.js` y `Screens.js`. Pueden pausar con 'P' o salir de los menus con [Espacio].
- **HUD y Score Web:** Integrado e inyectado en `scoreSystem.js` y `HUD.js`. Suma puntos con el paso del tiempo y al rebasar cajas rojas; además conecté un sistema de *High-Score* persistente con _LocalStorage_ para que guarde el récord inclusive si cierran la página web.

Las cosas por hacer:
- **Mejora de la estetica de los menús:** una vez esté creada la pista, jugador y obstaculos, editaré los menús para que sigan la misma estética.