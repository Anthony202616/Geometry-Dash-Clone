// js/main.js
window.onload = () => {
    const canvas = document.getElementById("gameCanvas");
    const container = document.getElementById("game-container");
    
    // Instanciation du Jeu dans la fenêtre globale pour les boutons HTML
    window.gameInstance = new Game(canvas, container);
    
    // Assigner les fonctions des boutons HTML
    window.startGame = (idx) => window.gameInstance.start(idx);
    window.showMainMenu = () => {
        window.gameInstance.stop();
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById("main-menu").classList.add("active");
        document.getElementById("hud").classList.add("hidden");
        document.getElementById("game-container").classList.remove("playing");
        window.gameInstance.renderer.clear();
    };
    window.restartGame = () => window.gameInstance.start(window.gameInstance.currentLevel.index);
    
    // Initialisation
    window.showMainMenu();
};
