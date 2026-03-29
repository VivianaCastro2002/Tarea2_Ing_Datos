/**
 * @file sketch.js
 * @author Vale (Modelo y visión: Carga de ML5, captura de video y clasificación)
 * @description Entry point for the p5.js game. Sets up the canvas, configures global 
 *              p5.js lifecycle methods, and handles key events.
 * [MODIFICAR: ESTA ENTIDAD ES PARA DESARROLLO DE COLISIONES Y HUD, NO ES LA DEFINITIVA]
 */

import { Game } from "./js/game/Game.js";

// ===== GLOBAL =====
/**
 * @type {Game} Instancia global del juego principal.
 */
let game;

/**
 * @type {string} Variable compartida para simular input de la cámara ML5 u eventos del teclado.
 * Valores posibles: "NINGUNA", "IZQUIERDA", "DERECHA", "ADELANTE", "ATRAS"
 */
export let currentAction = "NINGUNA";

/**
 * @function setup
 * @description p5.js lifecycle func: Inicializa el canvas y la instancia del Game.
 * Se asocia a window para que p5.js pueda acceder al existir dentro de un módulo ES6.
 */
window.setup = function() {
    createCanvas(400, 600);
    game = new Game();
};

/**
 * @function draw
 * @description p5.js lifecycle func: Bucle principal de dibujo a 60 FPS.
 */
window.draw = function() {
    background(30);

    game.update();
    game.draw();
};

/**
 * @function keyPressed
 * @description Evento nativo de p5.js disparado al presionar una tecla.
 * Controla inputs de teclado (Flechas) para simular ML5 y teclas de gestión de partida (Espacio, Esc, P).
 */
window.keyPressed = function() {
    if (keyCode === LEFT_ARROW) currentAction = "IZQUIERDA";
    if (keyCode === RIGHT_ARROW) currentAction = "DERECHA";
    if (keyCode === UP_ARROW) currentAction = "ADELANTE";
    if (keyCode === DOWN_ARROW) currentAction = "ATRAS";
    
    // Controles de juego (Start y Pausa)
    if (key === ' ' || key.toLowerCase() === 'p' || keyCode === 27) {
        if (game.stateManager.state === "MENU" || game.stateManager.state === "GAME_OVER") {
            if (key === ' ') game.stateManager.start(game);
        } else if (game.stateManager.state === "JUGANDO" || game.stateManager.state === "PAUSA") {
            game.stateManager.togglePause();
        }
    }
};

/**
 * @function keyReleased
 * @description Evento nativo de p5.js disparado al soltar una tecla.
 * Resetea el input simulado si corresponde a las flechas de dirección.
 */
window.keyReleased = function() {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        currentAction = "NINGUNA";
    }
};