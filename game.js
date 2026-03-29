// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constantes globales
const BLOCK_SIZE = 40; 
const PLAYER_SIZE = 30; // Hitbox plus petite que le bloc visuel
const GRAVITY = 1.0;     // Gravité doublée = retombe très vite !
const JUMP_FORCE = -13.5; // Force augmentée proportionnellement = s'envole très vite !

// Variables d'état
let currentState = "menu"; // menu, playing, gameover, victory
let currentLevelData = null;
let currentLevelIndex = 1;

let cameraX = 0; 
let gameSpeed = 5;

// Entité Joueur
let player = {
    x: 100, // Position fixe à l'écran X
    y: 200, 
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityY: 0,
    isJumping: false,
    rotation: 0,
    
    // États spéciaux
    mode: "cube", // "cube", "ship"
    gravityDir: 1 // 1 = Normal (tombe bas), -1 = Inversé (tombe haut)
};

// Contrôles
let isPressing = false;
let bgColor = "#0a0a2a";
let primaryColor = "#00ffcc";

// --- ÉCOUTEURS D'ÉVÉNEMENTS ---
window.addEventListener("keydown", (e) => {
    if(e.code === "Space" || e.code === "ArrowUp") {
        if(currentState === "playing") e.preventDefault();
        handleInputStart();
    }
});

window.addEventListener("keyup", (e) => {
    if(e.code === "Space" || e.code === "ArrowUp") {
        if(currentState === "playing") e.preventDefault();
        handleInputEnd();
    }
});

canvas.addEventListener("mousedown", handleInputStart);
canvas.addEventListener("mouseup", handleInputEnd);
canvas.addEventListener("touchstart", handleInputStart);
canvas.addEventListener("touchend", handleInputEnd);

function handleInputStart() {
    isPressing = true;
    if(currentState === "playing") {
        if(player.mode === "cube" && !player.isJumping) {
            // Saut simple
            player.velocityY = JUMP_FORCE * player.gravityDir;
            player.isJumping = true;
        }
    }
}

function handleInputEnd() {
    isPressing = false;
}

// --- GESTION DES SCÈNES ---
function startGame(levelIndex) {
    currentLevelIndex = levelIndex;
    currentLevelData = levelsData[levelIndex];
    gameSpeed = currentLevelData.speed;
    bgColor = currentLevelData.bgColor;
    primaryColor = currentLevelData.primaryColor;
    
    let container = document.getElementById("game-container");
    container.style.backgroundColor = bgColor;
    container.classList.add("playing");
    
    // Initialisation
    player.x = 150;
    player.y = 200;
    player.velocityY = 0;
    player.isJumping = true;
    player.rotation = 0;
    player.mode = "cube";
    player.gravityDir = 1;
    
    cameraX = 0;
    currentState = "playing";
    
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("hud").classList.remove("hidden");
    document.getElementById("progress-fill").style.width = "0%";
    
    requestAnimationFrame(gameLoop);
}

function showMainMenu() {
    currentState = "menu";
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("main-menu").classList.add("active");
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("game-container").classList.remove("playing");
    ctx.clearRect(0,0,canvas.width, canvas.height);
}

function restartGame() {
    startGame(currentLevelIndex);
}

function gameOver() {
    currentState = "gameover";
    document.getElementById("game-container").classList.remove("playing");
    document.getElementById("game-over-screen").classList.add("active");
    document.getElementById("hud").classList.add("hidden");
    
    // Effet de tremblement
    let cont = document.getElementById("game-container");
    cont.style.transform = "translateX(-15px) rotate(-1deg)";
    setTimeout(() => cont.style.transform = "translateX(15px) rotate(1deg)", 50);
    setTimeout(() => cont.style.transform = "translateX(0) rotate(0)", 100);
}

function victory() {
    currentState = "victory";
    document.getElementById("game-container").classList.remove("playing");
    document.getElementById("victory-screen").classList.add("active");
    document.getElementById("hud").classList.add("hidden");
}

// --- BOUCLE PRINCIPALE ---
function gameLoop(timestamp) {
    if(currentState !== "playing") return;
    requestAnimationFrame(gameLoop);
    update();
    draw();
}

function update() {
    cameraX += gameSpeed;
    
    // --- PHYSIQUE ---
    if(player.mode === "cube") {
        player.velocityY += GRAVITY * player.gravityDir;
        if(Math.abs(player.velocityY) > 18) player.velocityY = 18 * player.gravityDir; // Vitesse Max augmentée pour mieux retomber
        
        if(player.isJumping) {
            player.rotation += (5 * player.gravityDir); 
        } else {
            // Aligner à plat sur le sol (Modulo 90 degrés)
            player.rotation = Math.round(player.rotation / 90) * 90;
        }
    } 
    else if (player.mode === "ship") {
        if(isPressing) {
             player.velocityY -= (0.4 * player.gravityDir); // Réacteur Allumé
        } else {
             player.velocityY += (0.4 * player.gravityDir); // Gravité douce
        }
        
        if(player.velocityY > 7) player.velocityY = 7;
        if(player.velocityY < -7) player.velocityY = -7;
        
        player.rotation = player.velocityY * 3 * player.gravityDir; // Penche selon la vitesse
    }

    player.y += player.velocityY;
    
    // Garde fous plancher / plafond du canvas global
    if(player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
        if(player.gravityDir === -1) player.isJumping = false; 
    }
    if(player.y + player.height > canvas.height) {
         player.y = canvas.height - player.height;
         player.velocityY = 0;
         if(player.gravityDir === 1) player.isJumping = false; 
    }
    
    // Check collisions
    checkCollisions();
    
    // Update HUD
    let totalLength = currentLevelData.mapColumns.length * BLOCK_SIZE;
    let progress = (cameraX / totalLength) * 100;
    if(progress > 100) progress = 100;
    
    document.getElementById("progress-fill").style.width = progress + "%";
    document.getElementById("progress-percent").innerText = Math.floor(progress);
    
    if(progress >= 100) victory();
}

// --- MOTEUR DE COLLISIONS ---
function checkCollisions() {
    player.isJumping = true; 
    
    let absoluteLeft = cameraX + player.x;
    let absoluteRight = absoluteLeft + player.width;
    
    let startCol = Math.floor(absoluteLeft / BLOCK_SIZE);
    let endCol = Math.floor(absoluteRight / BLOCK_SIZE);
    
    // Marge pour pardonner les petits accrochages (+4px)
    let pBox = {
        left: absoluteLeft + 4,
        right: absoluteRight - 4,
        top: player.y + 4,
        bottom: player.y + player.height - 4
    };

    for(let col = startCol; col <= endCol; col++) {
        if(col < 0 || col >= currentLevelData.mapColumns.length) continue;
        
        for(let row = 0; row < 10; row++) {
            let blockType = currentLevelData.mapColumns[col][row];
            if(blockType === 0) continue;
            
            let bBox = {
                left: col * BLOCK_SIZE,
                right: (col+1) * BLOCK_SIZE,
                top: row * BLOCK_SIZE,
                bottom: (row+1) * BLOCK_SIZE
            };
            
            // Les portails sont "immatériels"
            if(blockType >= 3 && blockType <= 6) {
                let center = absoluteLeft + (PLAYER_SIZE/2);
                // Si on traverse grossièrement le centre du portail
                if(center > bBox.left && center < bBox.right) {
                    applyPortal(blockType);
                }
                continue;
            }
            
            // Collisions solides (Blocs et Piques)
            if (pBox.right > bBox.left && pBox.left < bBox.right && 
                pBox.bottom > bBox.top && pBox.top < bBox.bottom) {
                
                if(blockType === 2) {
                    gameOver(); // Touché une pique
                    return;
                }
                
                if(blockType === 1) { // Bloc Solide (Mur)
                    let prevBottom = player.y + player.height - player.velocityY;
                    let prevTop = player.y - player.velocityY;
                    
                    // On vérifie si le joueur venait d'au-dessus du bloc (Floor) ou d'en-dessous (Ceiling)
                    let isFloor = (prevBottom <= bBox.top + Math.abs(player.velocityY) + 6);
                    let isCeiling = (prevTop >= bBox.bottom - Math.abs(player.velocityY) - 6);

                    if((player.velocityY >= 0 || player.isJumping === false) && isFloor) {
                         player.y = bBox.top - player.height;
                         player.velocityY = 0;
                         if(player.gravityDir === 1) player.isJumping = false; // Au sol
                    } 
                    else if((player.velocityY <= 0 || player.isJumping === false) && isCeiling) {
                         player.y = bBox.bottom;
                         player.velocityY = 0;
                         if(player.gravityDir === -1) player.isJumping = false; // Au plafond
                    }
                    else {
                        // Collision frontale = BAM ! Game Over
                        gameOver();
                        return;
                    }
                }
            }
        }
    }
}

function applyPortal(type) {
    if(type === 3 && player.mode !== "ship") player.mode = "ship";
    if(type === 4 && player.mode !== "cube") player.mode = "cube";
    
    let container = document.getElementById("game-container");
    
    if(type === 5 && player.gravityDir !== -1) { // Gravité vers le haut
        player.gravityDir = -1;
        player.velocityY = 0;
        bgColor = "#3a000a"; // Fond Rouge pour Gravité inversée
        container.style.backgroundColor = bgColor;
    }
    if(type === 6 && player.gravityDir !== 1) { // Gravité normale
        player.gravityDir = 1;
        player.velocityY = 0;
        bgColor = currentLevelData.bgColor; // Retour fond bleu
        container.style.backgroundColor = bgColor;
    }
}

// --- DESSIN DU JEU ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let map = currentLevelData.mapColumns;
    let startCol = Math.max(0, Math.floor(cameraX / BLOCK_SIZE));
    let endCol = Math.min(map.length, startCol + (canvas.width / BLOCK_SIZE) + 2);
    
    for(let col = startCol; col < endCol; col++) {
        for(let row = 0; row < 10; row++) {
            let blockType = map[col][row];
            if(blockType === 0) continue;
            
            let drawX = (col * BLOCK_SIZE) - cameraX;
            let drawY = row * BLOCK_SIZE;
            
            if(blockType === 1) { // Bloc de Mur
                ctx.fillStyle = currentLevelData.obstacleColor;
                ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = primaryColor;
                ctx.lineWidth = 2;
                ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
            }
            else if(blockType === 2) { 
                drawSpike(drawX, drawY);
            }
            else if(blockType === 3) drawPortal(drawX, drawY, "#22ff44"); // Fusée Vert
            else if(blockType === 4) drawPortal(drawX, drawY, "#44aaff"); // Cube Cyan
            else if(blockType === 5) drawPortal(drawX, drawY, "#ffee00"); // Gravité Inv Jaune
            else if(blockType === 6) drawPortal(drawX, drawY, "#0033ff"); // Gravité Normal Bleu
        }
    }
    
    drawPlayer();
}

function drawSpike(x, y) {
    ctx.fillStyle = "#ff3366";
    ctx.beginPath();
    
    // Simplification visuelle : Tous les piques dans la moitié haute de l'écran 
    // pointent vers le bas (pour le plafond), le reste vers le haut.
    if(y < (canvas.height / 2)) {
         ctx.moveTo(x, y);
         ctx.lineTo(x + BLOCK_SIZE, y);
         ctx.lineTo(x + BLOCK_SIZE/2, y + BLOCK_SIZE);
    } else {
         ctx.moveTo(x, y + BLOCK_SIZE);
         ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
         ctx.lineTo(x + BLOCK_SIZE/2, y);
    }
    ctx.fill();
}

function drawPortal(x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(x + BLOCK_SIZE/2, y, 12, BLOCK_SIZE * 1.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Halo Magique
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function drawPlayer() {
    ctx.save();
    
    let px = player.x + player.width/2;
    let py = player.y + player.height/2;
    
    ctx.translate(px, py);
    ctx.rotate(player.rotation * Math.PI / 180);
    
    if(player.mode === "cube") {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
        
        ctx.fillStyle = "#fff"; // Centre brillant
        ctx.fillRect(-player.width/4, -player.height/4, player.width/2, player.height/2);
    } 
    else if(player.mode === "ship") {
        ctx.fillStyle = "#ff0077"; // Corps rose/rouge
        ctx.fillRect(-player.width/2 - 10, -8, player.width + 20, 16); // Fuselage large
        
        ctx.fillStyle = "#00ffff"; // Vitre cyan
        ctx.beginPath();
        ctx.arc(8, -4, 8, 0, Math.PI, true);
        ctx.fill();
        
        if(isPressing) {
            ctx.fillStyle = "#ffaa00"; // Feu de réacteur !
            ctx.beginPath();
            ctx.moveTo(-player.width/2 - 10, -4);
            ctx.lineTo(-player.width/2 - 10, 4);
            ctx.lineTo(-player.width/2 - 25 - Math.random() * 10, 0); // Flamme variable
            ctx.fill();
        }
    }
    
    ctx.restore();
}

showMainMenu();
