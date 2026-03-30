// js/Game.js
class Game {
    constructor(canvas, uiContainer) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ui = uiContainer;
        
        this.currentState = "menu"; // menu, playing, gameover, victory
        this.cameraX = 0;
        
        // Modules instanciés
        this.player = new Player(150, 200);
        this.renderer = new Renderer(canvas, this.ctx);
        this.input = new InputManager(canvas);
        this.currentLevel = null;
    }

    start(levelIndex) {
        this.currentLevel = new Level(levelIndex);
        
        let container = document.getElementById("game-container");
        container.style.backgroundColor = this.currentLevel.data.bgColor;
        container.classList.add("playing");
        
        this.player.reset(150, 200);
        this.cameraX = 0;
        this.currentState = "playing";
        
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById("hud").classList.remove("hidden");
        document.getElementById("progress-fill").style.width = "0%";
        
        this.loop();
    }

    stop() {
        this.currentState = "menu";
    }

    gameOver() {
        if(this.currentState === "gameover") return;
        this.currentState = "gameover";
        
        // Génération des particules ("Explosion")
        this.particles = [];
        let pColor = this.currentLevel.data.primaryColor;
        for(let i=0; i<35; i++) {
            this.particles.push({
                x: this.player.x + this.player.width/2,
                y: this.player.y + this.player.height/2,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.5) * 16,
                life: 1.0,
                color: pColor
            });
        }
        
        document.getElementById("game-container").classList.remove("playing");
        document.getElementById("hud").classList.add("hidden");
        
        let cont = document.getElementById("game-container");
        cont.style.transform = "translateX(-15px) rotate(-1deg)";
        setTimeout(() => cont.style.transform = "translateX(15px) rotate(1deg)", 50);
        setTimeout(() => cont.style.transform = "translateX(0) rotate(0)", 100);
        
        setTimeout(() => {
            if(this.currentState === "gameover") {
                 document.getElementById("game-over-screen").classList.add("active");
            }
        }, 1000);
    }

    victory() {
        this.currentState = "victory";
        document.getElementById("game-container").classList.remove("playing");
        document.getElementById("victory-screen").classList.add("active");
        document.getElementById("hud").classList.add("hidden");
    }

    loop() {
        if(this.currentState === "menu" || this.currentState === "victory") return;
        requestAnimationFrame(() => this.loop());
        
        if(this.currentState === "playing") {
            this.update();
            this.draw();
        } else if (this.currentState === "gameover") {
            this.updateParticles();
            this.draw();
        }
    }

    updateParticles() {
        for(let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.6; // Gravité des débris
            p.life -= 0.02; // Atténuation progressive
        }
    }

    update() {
        this.cameraX += this.currentLevel.data.speed;
        
        // --- 1. Mettre à jour la logique du joueur (Physique Externe isolée) ---
        this.player.updatePhysics(this.input.isPressing);
        
        // --- 2. Garde-fous globaux de scène ---
        if(this.player.y < -30) {
             // Chute dans le ciel (Inversé sans plafond)
             this.gameOver();
             return;
        }
        if(this.player.y + this.player.height > this.canvas.height + 20) {
             // Chute dans le vide infini ! Plus de glissade. Mort.
             this.gameOver();
             return;
        }
        
        // --- 3. Détecteur de collisions géré par le niveau ---
        this.checkCollisions();
        
        // Phase Progression ajustée : la victoire survient quand la caméra est proche du bout
        let targetX = this.currentLevel.totalLength - this.canvas.width;
        let progress = (this.cameraX / targetX) * 100;
        if(progress > 100) progress = 100;
        
        document.getElementById("progress-fill").style.width = progress + "%";
        document.getElementById("progress-percent").innerText = Math.floor(progress);
        
        if(progress >= 100) this.victory();
    }

    checkCollisions() {
        this.player.isJumping = true; 
        
        let absoluteLeft = this.cameraX + this.player.x;
        let absoluteRight = absoluteLeft + this.player.width;
        
        let startCol = Math.floor(absoluteLeft / Constants.BLOCK_SIZE);
        let endCol = Math.floor(absoluteRight / Constants.BLOCK_SIZE);
        
        // Hitbox du joueur (Tolérante sur les côtés pour ne pas mourir d'un pixel,
        // mais stricte en haut et bas pour s'arrimer parfaitement au sol)
        let pBox = {
            left: absoluteLeft + 6,
            right: absoluteRight - 6,
            top: this.player.y,
            bottom: this.player.y + this.player.height
        };

        for(let col = startCol; col <= endCol; col++) {
            for(let row = 0; row < 10; row++) {
                let blockType = this.currentLevel.getBlockType(col, row);
                if(blockType === 0) continue;
                
                // Rendre la Hitbox des piques beaucoup plus petite que le visuel
                // pour être très indulgent et ne pas tuer lors d'un effleurement de pixel
                let margin = (blockType === 2) ? 14 : 0;
                
                let bBox = {
                    left: col * Constants.BLOCK_SIZE + margin,
                    right: (col+1) * Constants.BLOCK_SIZE - margin,
                    top: row * Constants.BLOCK_SIZE + margin,
                    bottom: (row+1) * Constants.BLOCK_SIZE - margin
                };
                
                // Portails
                if(blockType >= 3 && blockType <= 6) {
                    let center = absoluteLeft + (Constants.PLAYER_SIZE/2);
                    if(center > bBox.left && center < bBox.right) {
                        this.applyPortal(blockType);
                    }
                    continue;
                }
                
                // Murs et Piques
                if (pBox.right > bBox.left && pBox.left < bBox.right && pBox.bottom > bBox.top && pBox.top < bBox.bottom) {
                    if(blockType === 2) {
                        this.gameOver(); 
                        return;
                    }
                    if(blockType === 1) { 
                        let prevBottom = this.player.y + this.player.height - this.player.velocityY;
                        let prevTop = this.player.y - this.player.velocityY;
                        
                        let isFloor = (prevBottom <= bBox.top + Math.abs(this.player.velocityY) + 6);
                        let isCeiling = (prevTop >= bBox.bottom - Math.abs(this.player.velocityY) - 6);

                        if((this.player.velocityY >= 0 || this.player.isJumping === false) && isFloor) {
                             this.player.y = bBox.top - this.player.height;
                             this.player.velocityY = 0;
                             if(this.player.gravityDir === 1) this.player.isJumping = false; 
                        } 
                        else if((this.player.velocityY <= 0 || this.player.isJumping === false) && isCeiling) {
                             this.player.y = bBox.bottom;
                             this.player.velocityY = 0;
                             if(this.player.gravityDir === -1) this.player.isJumping = false; 
                        }
                        else {
                            this.gameOver();
                            return;
                        }
                    }
                }
            }
        }
    }

    applyPortal(type) {
        if(type === 3 && this.player.mode !== "ship") this.player.mode = "ship";
        if(type === 4 && this.player.mode !== "cube") this.player.mode = "cube";
        
        let container = document.getElementById("game-container");
        
        if(type === 5 && this.player.gravityDir !== -1) { 
            this.player.gravityDir = -1;
            this.player.velocityY = 0;
            container.style.backgroundColor = "#3a000a"; 
        }
        if(type === 6 && this.player.gravityDir !== 1) { 
            this.player.gravityDir = 1;
            this.player.velocityY = 0;
            container.style.backgroundColor = this.currentLevel.data.bgColor; 
        }
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawLevel(this.currentLevel, this.cameraX);
        if(this.currentState === "playing") {
            this.renderer.drawPlayer(this.player, this.currentLevel.data.primaryColor);
        } else if(this.currentState === "gameover") {
            this.renderer.drawParticles(this.particles);
        }
    }
}
