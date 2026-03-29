// levels.js
// Définit la structure du niveau 1.
// Légende des blocs (Grid Y=0 est le ciel, Y=9 est le sol)
// 0 = Vide
// 1 = Bloc (Mur / Sol)
// 2 = Pique pointant vers le haut ou plafond
// 3 = Portail Fusée (Vert)
// 4 = Portail Cube (Cube Normal, Cyan)
// 5 = Portail Gravité Inversée (Jaune)
// 6 = Portail Gravité Normale (Bleu)

const levelsData = {
    1: {
        name: "Stereo Madness (Facile)",
        bgColor: "#0a0a2a", // Sombre bleuté
        primaryColor: "#00ffcc", // Tron cyan
        obstacleColor: "#111144",
        speed: 3.0, // Vitesse de déplacement ultra lente
        
        mapColumns: []
    }
};

let cols = [];

// Fonction utilitaire pour répéter des colonnes
function addP(count, colArray) {
    for(let i=0; i<count; i++) cols.push([...colArray]);
}

// 1. Zone de départ paisible et très longue
addP(30, [0,0,0,0,0,0,0,0,0,1]);

// 2. Deux piques simples avec énormément d'espace entre eux
cols.push([0,0,0,0,0,0,0,0,2,1]);
addP(8,  [0,0,0,0,0,0,0,0,0,1]);  // BEAUCOUP de place pour respirer
cols.push([0,0,0,0,0,0,0,0,2,1]);
addP(8,  [0,0,0,0,0,0,0,0,0,1]);

// 3. Grimper sur un mur rectangulaire d'escalier
cols.push([0,0,0,0,0,0,0,0,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]); // Marche progressive
addP(4,  [0,0,0,0,0,0,0,1,1,1]);  // Zone plate d'atterrissage
cols.push([0,0,0,0,0,0,0,0,1,1]); // Descente
addP(15, [0,0,0,0,0,0,0,0,0,1]);  // Grande respiration

// 4. --- PORTAIL FUSÉE (Plus doux) ---
cols.push([0,0,0,0,0,3,0,0,0,1]); 
addP(8,  [0,0,0,0,0,0,0,0,0,1]); // Zone libre pour s'habituer à la Fusée

// Grotte de Fusée TRES large (Murs très éloignés)
addP(4,  [1,0,0,0,0,0,0,0,1,1]); // Mur bas en sol uniquement
addP(5,  [0,0,0,0,0,0,0,0,0,1]); 
addP(5,  [1,1,1,0,0,0,0,0,0,1]); // Un petit rocher au plafond, bascule facile à faire
addP(5,  [0,0,0,0,0,0,0,0,0,1]); 
addP(4,  [1,0,0,0,0,0,0,0,1,1]); 

// 5. --- PORTAIL CUBE (Sortie de fusée) ---
cols.push([0,0,0,0,0,4,0,0,0,1]);
addP(12, [0,0,0,0,0,0,0,0,0,1]);

// 6. --- GRAVITÉ INVERSÉE (Facilitée) ---
cols.push([0,0,0,0,0,5,0,0,0,1]); // Portail jaune (tombe vers le plafond)

addP(5,  [1,0,0,0,0,0,0,0,0,1]); // Longue glissade de sécurité au plafond
cols.push([1,2,0,0,0,0,0,0,0,1]); // Un seul pique facile !
addP(5,  [1,0,0,0,0,0,0,0,0,1]);  // Récupération
cols.push([1,2,0,0,0,0,0,0,0,1]); // Deuxième pique facile
addP(8,  [1,0,0,0,0,0,0,0,0,1]);  // Zone sereine

// 7. Retour gravité normale
cols.push([1,0,0,0,0,6,0,0,0,1]); // Portail Bleu
addP(15, [0,0,0,0,0,0,0,0,0,1]);

// 8. FIN DU NIVEAU
addP(30, [0,0,0,0,0,0,0,0,0,1]); // Une gigantesque piste droite finale sereine pour avoir ses 100% sans aucun mur à percuter !

levelsData[1].mapColumns = cols;


// ==========================================
// NIVEAU 2 : BACK ON TRACK
// ==========================================
levelsData[2] = {
    name: "Back on Track",
    bgColor: "#2a0a2a", // Violet foncé
    primaryColor: "#ff00ff", // Magenta
    obstacleColor: "#441144",
    speed: 3.5, 
    mapColumns: []
};

let cols2 = [];
function addP2(count, colArray) { for(let i=0; i<count; i++) cols2.push([...colArray]); }

addP2(20, [0,0,0,0,0,0,0,0,0,1]); // Début
cols2.push([0,0,0,0,0,0,0,0,2,1]); // Pique
addP2(15, [0,0,0,0,0,0,0,0,0,1]);
cols2.push([0,0,0,0,0,0,0,0,1,1]); // Escalier
cols2.push([0,0,0,0,0,0,0,1,1,1]);
addP2(5,  [0,0,0,0,0,0,0,1,1,1]);
cols2.push([0,0,0,0,0,0,0,0,2,1]); // Pique vicieux en redescente
addP2(30, [0,0,0,0,0,0,0,0,0,1]); // Fin
levelsData[2].mapColumns = cols2;


// ==========================================
// NIVEAU 3 : POLARGEIST
// ==========================================
levelsData[3] = {
    name: "Polargeist",
    bgColor: "#0a2a2a", // Cyan sombre
    primaryColor: "#00ff88", // Vert printemps
    obstacleColor: "#114444",
    speed: 4.0, 
    mapColumns: []
};

let cols3 = [];
function addP3(count, colArray) { for(let i=0; i<count; i++) cols3.push([...colArray]); }

addP3(15, [0,0,0,0,0,0,0,0,0,1]);
cols3.push([0,0,0,0,0,3,0,0,0,1]); // Fusée directe !
addP3(10, [0,0,0,0,0,0,0,0,0,1]);
addP3(10, [1,1,0,0,0,0,0,0,1,1]); // Tunnel de vol
addP3(30, [0,0,0,0,0,0,0,0,0,1]);
levelsData[3].mapColumns = cols3;


window.levelsData = levelsData;
