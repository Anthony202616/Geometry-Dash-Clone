// js/Renderer.js
class Renderer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLevel(levelData, cameraX) {
        let map = levelData.mapColumns;
        let startCol = Math.max(0, Math.floor(cameraX / Constants.BLOCK_SIZE));
        let endCol = Math.min(map.length, startCol + (this.canvas.width / Constants.BLOCK_SIZE) + 2);
        
        for (let col = startCol; col < endCol; col++) {
            for (let row = 0; row < 10; row++) {
                let blockType = map[col][row];
                if (blockType === 0) continue;
                
                let drawX = (col * Constants.BLOCK_SIZE) - cameraX;
                let drawY = row * Constants.BLOCK_SIZE;
                
                if(blockType === 1) { 
                    this.ctx.fillStyle = levelData.obstacleColor;
                    this.ctx.fillRect(drawX, drawY, Constants.BLOCK_SIZE, Constants.BLOCK_SIZE);
                    this.ctx.strokeStyle = levelData.primaryColor;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(drawX, drawY, Constants.BLOCK_SIZE, Constants.BLOCK_SIZE);
                }
                else if(blockType === 2) this.drawSpike(drawX, drawY);
                else if(blockType === 3) this.drawPortal(drawX, drawY, "#22ff44");
                else if(blockType === 4) this.drawPortal(drawX, drawY, "#44aaff");
                else if(blockType === 5) this.drawPortal(drawX, drawY, "#ffee00");
                else if(blockType === 6) this.drawPortal(drawX, drawY, "#0033ff");
            }
        }
    }

    drawSpike(x, y) {
        this.ctx.fillStyle = "#ff3366";
        this.ctx.beginPath();
        if(y < (this.canvas.height / 2)) {
             this.ctx.moveTo(x, y);
             this.ctx.lineTo(x + Constants.BLOCK_SIZE, y);
             this.ctx.lineTo(x + Constants.BLOCK_SIZE/2, y + Constants.BLOCK_SIZE);
        } else {
             this.ctx.moveTo(x, y + Constants.BLOCK_SIZE);
             this.ctx.lineTo(x + Constants.BLOCK_SIZE, y + Constants.BLOCK_SIZE);
             this.ctx.lineTo(x + Constants.BLOCK_SIZE/2, y);
        }
        this.ctx.fill();
    }

    drawPortal(x, y, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.ellipse(x + Constants.BLOCK_SIZE/2, y, 12, Constants.BLOCK_SIZE * 1.5, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
    }

    drawPlayer(player, primaryColor) {
        this.ctx.save();
        let px = player.x + player.width/2;
        let py = player.y + player.height/2;
        
        this.ctx.translate(px, py);
        this.ctx.rotate(player.rotation * Math.PI / 180);
        
        if(player.mode === "cube") {
            this.ctx.fillStyle = primaryColor;
            this.ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(-player.width/4, -player.height/4, player.width/2, player.height/2);
        } 
        else if(player.mode === "ship") {
            this.ctx.fillStyle = "#ff0077"; 
            this.ctx.fillRect(-player.width/2 - 10, -8, player.width + 20, 16); 
            this.ctx.fillStyle = "#00ffff"; 
            this.ctx.beginPath();
            this.ctx.arc(8, -4, 8, 0, Math.PI, true);
            this.ctx.fill();
            
            if(window.gameInstance && window.gameInstance.input.isPressing) {
                this.ctx.fillStyle = "#ffaa00"; 
                this.ctx.beginPath();
                this.ctx.moveTo(-player.width/2 - 10, -4);
                this.ctx.lineTo(-player.width/2 - 10, 4);
                this.ctx.lineTo(-player.width/2 - 25 - Math.random() * 10, 0); 
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    drawParticles(particles) {
        for(let p of particles) {
            if(p.life <= 0) continue;
            this.ctx.globalAlpha = p.life > 0 ? p.life : 0;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
        }
        this.ctx.globalAlpha = 1.0;
    }
}
