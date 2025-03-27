// Variables del juego
let positionX = 50; // Posición inicial del auto en X (punto de partida)
let positionY = 300; // Posición inicial del auto en Y (punto de partida)
let velocityX = 0; // Velocidad en X
let velocityY = 0; // Velocidad en Y
let accelerationX = 0; // Aceleración en X
let accelerationY = 0; // Aceleración en Y
const maxSpeed = 300; // Velocidad máxima (px/s)
const accelerationRate = 150; // Tasa de aceleración (px/s²)
const brakingRate = 300; // Tasa de frenado (px/s²)
const friction = 0.95; // Fricción reducida para un frenado más suave
let lastTime = Date.now(); // Tiempo inicial
let hasReachedObjective = false; // Indica si el jugador ha alcanzado el rango objetivo
let outOfRangeTime = 0; // Tiempo que el jugador ha estado fuera del rango objetivo
const outOfRangeThreshold = 1; // Tiempo máximo permitido fuera del rango (en segundos)

// Punto de partida y punto de llegada
const startPoint = { x: 50, y: 300 }; // Punto de partida
const endPoint = { x: 700, y: 300 }; // Punto de llegada
const endRadius = 50; // Radio de llegada (px)

// Variables para el cálculo de derivadas
let lastPositionX = positionX; // Posición anterior en X
let lastPositionY = positionY; // Posición anterior en Y
let lastVelocityX = 0; // Velocidad anterior en X
let lastVelocityY = 0; // Velocidad anterior en Y

// Variables del nivel
let currentLevel = 1;
const levelObjectives = [
    { velocityMin: 100, velocityMax: 200 }, // Nivel 1: Mantener la velocidad entre 100 y 200 px/s
    { accelerationMin: -50, accelerationMax: 50 }, // Nivel 2: Mantener la aceleración entre -50 y 50 px/s²
    // Añadir más niveles aquí
];

// Elementos del DOM
const carElement = document.getElementById("car");
const positionXElement = document.getElementById("positionX");
const positionYElement = document.getElementById("positionY");
const velocityElement = document.getElementById("velocity");
const accelerationElement = document.getElementById("acceleration");
const levelElement = document.getElementById("level");
const objectiveElement = document.getElementById("objective");

// Estado de las teclas
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

// Eventos de teclado
document.addEventListener("keydown", (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// Función para calcular la velocidad usando diferencias finitas
function calculateVelocity(currentPosition, lastPosition, deltaTime) {
    return (currentPosition - lastPosition) / deltaTime;
}

// Función para calcular la aceleración usando diferencias finitas
function calculateAcceleration(currentVelocity, lastVelocity, deltaTime) {
    return (currentVelocity - lastVelocity) / deltaTime;
}

// Función para verificar si el auto ha llegado al punto de llegada
function checkIfReachedEnd() {
    const distanceToEnd = Math.sqrt((positionX - endPoint.x) ** 2 + (positionY - endPoint.y) ** 2);
    if (distanceToEnd <= endRadius) {
        alert("¡Has llegado a la meta! Nivel completado.");
        resetLevel();
    }
}

// Función para verificar el objetivo del nivel
function checkLevelObjective() {
    const currentVelocity = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    const currentAcceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
    const objective = levelObjectives[currentLevel - 1];

    if (objective.velocityMin !== undefined) {
        // Verificar si el jugador ha alcanzado el rango objetivo de velocidad
        if (currentVelocity >= objective.velocityMin && currentVelocity <= objective.velocityMax) {
            hasReachedObjective = true; // El jugador ha alcanzado el rango objetivo
            outOfRangeTime = 0; // Reiniciar el contador de tiempo fuera del rango
        }

        // Verificar si el jugador ha salido del rango objetivo después de haberlo alcanzado
        if (hasReachedObjective && (currentVelocity < objective.velocityMin || currentVelocity > objective.velocityMax)) {
            outOfRangeTime += deltaTime; // Aumentar el tiempo fuera del rango
            if (outOfRangeTime >= outOfRangeThreshold) {
                alert("¡Fuera de rango! Pierdes el nivel.");
                resetLevel();
            }
        }
    } else if (objective.accelerationMin !== undefined) {
        // Verificar si el jugador ha alcanzado el rango objetivo de aceleración
        if (currentAcceleration >= objective.accelerationMin && currentAcceleration <= objective.accelerationMax) {
            hasReachedObjective = true; // El jugador ha alcanzado el rango objetivo
            outOfRangeTime = 0; // Reiniciar el contador de tiempo fuera del rango
        }

        // Verificar si el jugador ha salido del rango objetivo después de haberlo alcanzado
        if (hasReachedObjective && (currentAcceleration < objective.accelerationMin || currentAcceleration > objective.accelerationMax)) {
            outOfRangeTime += deltaTime; // Aumentar el tiempo fuera del rango
            if (outOfRangeTime >= outOfRangeThreshold) {
                alert("¡Fuera de rango! Pierdes el nivel.");
                resetLevel();
            }
        }
    }
}

// Función para mostrar feedback visual
function showFeedback() {
    const currentVelocity = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    const currentAcceleration = Math.sqrt(accelerationX ** 2 + accelerationY ** 2);
    const objective = levelObjectives[currentLevel - 1];

    if (objective.velocityMin !== undefined) {
        if (currentVelocity >= objective.velocityMin && currentVelocity <= objective.velocityMax) {
            velocityElement.style.color = "green";
        } else {
            velocityElement.style.color = "red";
        }
    } else if (objective.accelerationMin !== undefined) {
        if (currentAcceleration >= objective.accelerationMin && currentAcceleration <= objective.accelerationMax) {
            accelerationElement.style.color = "green";
        } else {
            accelerationElement.style.color = "red";
        }
    }
}

// Función para reiniciar el nivel
function resetLevel() {
    positionX = startPoint.x;
    positionY = startPoint.y;
    velocityX = 0;
    velocityY = 0;
    accelerationX = 0;
    accelerationY = 0;
    hasReachedObjective = false; // Reiniciar el estado de alcanzar el objetivo
    outOfRangeTime = 0; // Reiniciar el contador de tiempo fuera del rango
}

// Función para actualizar el estado del juego
function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Tiempo en segundos
    lastTime = currentTime;

    // Calcular aceleración en X y Y
    if (keys.ArrowUp) accelerationY = -accelerationRate;
    else if (keys.ArrowDown) accelerationY = accelerationRate;
    else accelerationY = 0;

    if (keys.ArrowLeft) accelerationX = -accelerationRate;
    else if (keys.ArrowRight) accelerationX = accelerationRate;
    else accelerationX = 0;

    // Aplicar frenado si no se presionan teclas
    if (!keys.ArrowUp && !keys.ArrowDown) {
        accelerationY = -Math.sign(velocityY) * brakingRate;
    }
    if (!keys.ArrowLeft && !keys.ArrowRight) {
        accelerationX = -Math.sign(velocityX) * brakingRate;
    }

    // Actualizar velocidad
    velocityX += accelerationX * deltaTime;
    velocityY += accelerationY * deltaTime;

    // Limitar la velocidad máxima
    velocityX = Math.max(-maxSpeed, Math.min(velocityX, maxSpeed));
    velocityY = Math.max(-maxSpeed, Math.min(velocityY, maxSpeed));

    // Aplicar fricción cuando no se presionan teclas
    if (!keys.ArrowUp && !keys.ArrowDown) velocityY *= friction;
    if (!keys.ArrowLeft && !keys.ArrowRight) velocityX *= friction;

    // Actualizar posición
    positionX += velocityX * deltaTime;
    positionY += velocityY * deltaTime;

    // Limitar el auto al área del mapa
    positionX = Math.max(0, Math.min(positionX, 800 - 40)); // Ancho del mapa - ancho del auto
    positionY = Math.max(0, Math.min(positionY, 600 - 40)); // Alto del mapa - alto del auto

    // Calcular velocidad usando diferencias finitas
    const currentVelocityX = calculateVelocity(positionX, lastPositionX, deltaTime);
    const currentVelocityY = calculateVelocity(positionY, lastPositionY, deltaTime);

    // Calcular aceleración usando diferencias finitas
    accelerationX = calculateAcceleration(currentVelocityX, lastVelocityX, deltaTime);
    accelerationY = calculateAcceleration(currentVelocityY, lastVelocityY, deltaTime);

    // Guardar valores actuales para el siguiente cálculo
    lastPositionX = positionX;
    lastPositionY = positionY;
    lastVelocityX = currentVelocityX;
    lastVelocityY = currentVelocityY;

    // Mover el auto
    carElement.style.left = `${positionX}px`;
    carElement.style.top = `${positionY}px`;

    // Mostrar valores en la interfaz
    positionXElement.innerText = positionX.toFixed(2);
    positionYElement.innerText = positionY.toFixed(2);
    velocityElement.innerText = Math.sqrt(currentVelocityX ** 2 + currentVelocityY ** 2).toFixed(2);
    accelerationElement.innerText = Math.sqrt(accelerationX ** 2 + accelerationY ** 2).toFixed(2);

    // Verificar objetivos del nivel
    checkLevelObjective();

    // Verificar si el auto ha llegado al punto de llegada
    checkIfReachedEnd();

    // Mostrar feedback visual
    showFeedback();

    // Continuar el bucle de actualización
    requestAnimationFrame(update);
}

// Iniciar el juego
update();