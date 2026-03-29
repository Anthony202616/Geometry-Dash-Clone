// levels.js

const levelsData = {};

let cols = [];
function addP(count, colArray) {
    for(let i=0; i<count; i++) cols.push([...colArray]);
}

// ==========================================
// NIVEAU 1 : STEREO MADNESS (Allongé & Complet)
// ==========================================
levelsData[1] = {
    name: "Stereo Madness (Facile)",
    bgColor: "#0a0a2a", // Sombre bleuté
    primaryColor: "#00ffcc", // Tron cyan
    obstacleColor: "#111144",
    speed: 3.0,
    mapColumns: []
};

addP(20, [0,0,0,0,0,0,0,0,0,1]); // Départ

// Série de 4 piques espacés
for(let k=0; k<4; k++) {
    cols.push([0,0,0,0,0,0,0,0,2,1]);
    addP(8,  [0,0,0,0,0,0,0,0,0,1]);
}

// Escalier
cols.push([0,0,0,0,0,0,0,0,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]); 
addP(5,  [0,0,0,0,0,0,0,1,1,1]);  
cols.push([0,0,0,0,0,0,0,0,1,1]); 
addP(12, [0,0,0,0,0,0,0,0,0,1]);  

// Série de Murs intermédiaires (Saut très haut requis)
cols.push([0,0,0,0,0,0,0,1,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]);
addP(12, [0,0,0,0,0,0,0,0,0,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]);
addP(10, [0,0,0,0,0,0,0,0,0,1]);

// FUSÉE
cols.push([0,0,0,0,0,3,0,0,0,1]); 
addP(8,  [0,0,0,0,0,0,0,0,0,1]); 
addP(6,  [1,0,0,0,0,0,0,0,1,1]); 
addP(6,  [0,0,0,0,0,0,0,0,0,1]); 
addP(6,  [1,1,1,0,0,0,0,0,0,1]); 
addP(6,  [0,0,0,0,0,0,0,0,0,1]); 
addP(6,  [1,0,0,0,0,0,0,0,1,1]); 
addP(6,  [0,0,0,0,0,0,0,0,0,1]); 
addP(6,  [1,1,1,0,0,0,0,0,0,1]); 
addP(6,  [0,0,0,0,0,0,0,0,0,1]);

// CUBE (Sortie Fusée)
cols.push([0,0,0,0,0,4,0,0,0,1]);
addP(10, [0,0,0,0,0,0,0,0,0,1]);

// Accélération des piques
for(let k=0; k<5; k++) {
    cols.push([0,0,0,0,0,0,0,0,2,1]);
    addP(6,  [0,0,0,0,0,0,0,0,0,1]);
}

// GRAVITÉ INVERSÉE
cols.push([0,0,0,0,0,5,0,0,0,1]); 
addP(8,  [1,0,0,0,0,0,0,0,0,1]); 
cols.push([1,2,0,0,0,0,0,0,0,1]); 
addP(8,  [1,0,0,0,0,0,0,0,0,1]);  
cols.push([1,2,0,0,0,0,0,0,0,1]); 
addP(10, [1,0,0,0,0,0,0,0,0,1]);  

// Retour gravité normale
cols.push([1,0,0,0,0,6,0,0,0,1]); 
addP(12, [0,0,0,0,0,0,0,0,0,1]);

// LA GRANDE FIN : Arche Mémorable !
addP(2,  [1,1,0,0,0,0,0,0,1,1]); 
addP(2,  [1,1,1,0,0,0,0,1,1,1]); 
cols.push([1,1,1,1,0,0,1,1,1,1]);
addP(15, [1,1,1,1,1,0,1,1,1,1]); // Tunnel creux en plein ciel !
addP(2,  [1,1,0,0,0,0,0,0,1,1]); 
addP(25, [0,0,0,0,0,0,0,0,0,1]); 

levelsData[1].mapColumns = cols;


// ==========================================
// NIVEAU 2 : BACK ON TRACK (Allongé)
// ==========================================
levelsData[2] = {
    name: "Back on Track",
    bgColor: "#2a0a2a", 
    primaryColor: "#ff00ff", 
    obstacleColor: "#441144",
    speed: 3.5, 
    mapColumns: []
};

let cols2 = [];
function addP2(count, colArray) { for(let i=0; i<count; i++) cols2.push([...colArray]); }

addP2(15, [0,0,0,0,0,0,0,0,0,1]); 

// Doubles piques espacés
for(let k=0; k<3; k++) {
    cols2.push([0,0,0,0,0,0,0,0,2,1]);
    addP2(1, [0,0,0,0,0,0,0,0,0,1]);
    cols2.push([0,0,0,0,0,0,0,0,2,1]);
    addP2(12, [0,0,0,0,0,0,0,0,0,1]);
}

// Escalier Géant : Maintenez Espace ! (Test de l'auto-jump)
addP2(6, [0,0,0,0,0,0,0,0,1,1]); 
addP2(6, [0,0,0,0,0,0,0,1,1,1]); 
addP2(6, [0,0,0,0,0,0,1,1,1,1]); 
addP2(8, [0,0,0,0,0,1,1,1,1,1]); 
// Redescente abrupte
cols2.push([0,0,0,0,0,0,0,1,1,1]); 
cols2.push([0,0,0,0,0,0,0,0,1,1]);
addP2(15, [0,0,0,0,0,0,0,0,0,1]);

// Pique vicieux en redescente
cols2.push([0,0,0,0,0,0,0,0,2,1]);
addP2(15, [0,0,0,0,0,0,0,0,0,1]);

// Enchainement de sauts continus longs
for(let k=0; k<6; k++) {
    cols2.push([0,0,0,0,0,0,0,0,2,1]);
    addP2(6, [0,0,0,0,0,0,0,0,0,1]);
}

// Grands murs infranchissables
cols2.push([0,0,0,0,0,0,1,1,1,1]); 
cols2.push([0,0,0,0,0,0,1,1,1,1]); 
addP2(12, [0,0,0,0,0,0,0,0,0,1]);
cols2.push([0,0,0,0,0,1,1,1,1,1]); 
cols2.push([0,0,0,0,0,1,1,1,1,1]); 
addP2(15, [0,0,0,0,0,0,0,0,0,1]);

// Arche Finale Niveau 2
addP2(10, [1,1,0,0,0,0,0,1,1,1]); 
addP2(25, [0,0,0,0,0,0,0,0,0,1]); 

levelsData[2].mapColumns = cols2;


// ==========================================
// NIVEAU 3 : POLARGEIST 
// ==========================================
levelsData[3] = {
    name: "Polargeist",
    bgColor: "#0a2a2a", 
    primaryColor: "#00ff88", 
    obstacleColor: "#114444",
    speed: 4.0, 
    mapColumns: []
};

let cols3 = [];
function addP3(count, colArray) { for(let i=0; i<count; i++) cols3.push([...colArray]); }

addP3(15, [0,0,0,0,0,0,0,0,0,1]);
cols3.push([0,0,0,0,0,3,0,0,0,1]); // Fusée directe !
addP3(10, [0,0,0,0,0,0,0,0,0,1]);
addP3(10, [1,1,0,0,0,0,0,0,1,1]); // Tunnel
addP3(10, [1,1,1,1,0,0,0,0,0,1]);
addP3(10, [1,0,0,0,0,0,0,1,1,1]);
addP3(30, [0,0,0,0,0,0,0,0,0,1]);
levelsData[3].mapColumns = cols3;

window.levelsData = levelsData;
