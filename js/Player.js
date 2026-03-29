// js/Player.js
class Player {
    constructor(x, y) {
        this.width = Constants.PLAYER_SIZE;
        this.height = Constants.PLAYER_SIZE;
        this.reset(x, y);
    }

    reset(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.velocityY = 0;
        this.isJumping = true;
        this.rotation = 0;
        this.mode = "cube"; // "cube" ou "ship"
        this.gravityDir = 1; // 1 = Normal, -1 = Inversé
    }

    jump() {
        if (this.mode === "cube" && !this.isJumping) {
            this.velocityY = Constants.JUMP_FORCE * this.gravityDir;
            this.isJumping = true;
        }
    }

    updatePhysics(isPressing) {
        if (this.mode === "cube") {
            // Saut automatique à répétition si la touche est maintenue,
            // (La fonction jump() s'assure d'elle-même que le cube touche le sol)
            if (isPressing) {
                this.jump();
            }

            this.velocityY += Constants.GRAVITY * this.gravityDir;
            if (Math.abs(this.velocityY) > 18) this.velocityY = 18 * this.gravityDir;
            
            if (this.isJumping) {
                this.rotation += (5 * this.gravityDir); 
            } else {
                this.rotation = Math.round(this.rotation / 90) * 90;
            }
        } 
        else if (this.mode === "ship") {
            if (isPressing) {
                 this.velocityY -= (0.4 * this.gravityDir); // Force moteur vers le haut
            } else {
                 this.velocityY += (0.4 * this.gravityDir); // Chute douce
            }
            
            if (this.velocityY > 7) this.velocityY = 7;
            if (this.velocityY < -7) this.velocityY = -7;
            
            this.rotation = this.velocityY * 3 * this.gravityDir;
        }

        // Application verticale pure
        this.y += this.velocityY;
    }
}
