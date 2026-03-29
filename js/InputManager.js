// js/InputManager.js
class InputManager {
    constructor(canvasElement) {
        this.isPressing = false;
        this.canvas = canvasElement;
        
        window.addEventListener("keydown", (e) => {
            if(e.code === "Space" || e.code === "ArrowUp") {
                if(window.gameInstance && window.gameInstance.currentState === "playing") e.preventDefault();
                this.handleInputStart();
            }
        });

        window.addEventListener("keyup", (e) => {
            if(e.code === "Space" || e.code === "ArrowUp") {
                if(window.gameInstance && window.gameInstance.currentState === "playing") e.preventDefault();
                this.handleInputEnd();
            }
        });

        this.canvas.addEventListener("mousedown", () => this.handleInputStart());
        this.canvas.addEventListener("mouseup", () => this.handleInputEnd());
        this.canvas.addEventListener("touchstart", (e) => { e.preventDefault(); this.handleInputStart(); });
        this.canvas.addEventListener("touchend", (e) => { e.preventDefault(); this.handleInputEnd(); });
    }

    handleInputStart() {
        this.isPressing = true;
        if(window.gameInstance && window.gameInstance.currentState === "playing") {
            window.gameInstance.player.jump();
        }
    }

    handleInputEnd() {
        this.isPressing = false;
    }
}
