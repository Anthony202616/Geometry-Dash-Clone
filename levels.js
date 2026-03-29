// levels.js
// Définit la structure du niveau 1.
// Légende des blocs (Grid Y=0 est le ciel, Y=9 est le sol)
// 0 = Vide
// 1 = Bloc (Mur / Sol)
// 2 = Pique pointant vers le haut
// 3 = Portail Fusée (Vert)
// 4 = Portail Cube (Cube Normal, Cyan)
// 5 = Portail Gravité Inversée (Jaune)
// 6 = Portail Gravité Normale (Bleu)

const levelsData = {
    1: {
        name: "Stereo Madness",
        bgColor: "#0a0a2a", // Sombre bleuté
        primaryColor: "#00ffcc", // Tron cyan
        obstacleColor: "#111144",
        speed: 4.0, // Vitesse de déplacement vers la gauche (ralenti)
        
        // La map est une série de colonnes verticales de 10 cases (400px / 40px).
        // On la construit bout par bout pour faciliter la lecture.
        mapColumns: []
    }
};

// --- CONSTRUCTION DU NIVEAU 1 ---
let cols = [];

// Fonction pour générer un bloc de colonnes répétées
function addP(count, colArray) {
    for(let i=0; i<count; i++) cols.push([...colArray]);
}

// 1. Zone de départ paisible
addP(20, [0,0,0,0,0,0,0,0,0,1]);

// 2. Un petit saut de pique basique
cols.push([0,0,0,0,0,0,0,0,2,1]);
addP(3,  [0,0,0,0,0,0,0,0,0,1]);
cols.push([0,0,0,0,0,0,0,0,2,1]);
addP(5,  [0,0,0,0,0,0,0,0,0,1]);

// 3. Grimper sur un mur
cols.push([0,0,0,0,0,0,0,1,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]);

// 4. Pique en haut du mur, et redescente
cols.push([0,0,0,0,0,0,2,1,1,1]);
cols.push([0,0,0,0,0,0,0,1,1,1]);
addP(10, [0,0,0,0,0,0,0,0,0,1]);

// 5. --- PORTAIL FUSÉE ---
// Le portail est flottant
cols.push([0,0,0,0,0,3,0,0,0,1]); 
addP(5,  [0,0,0,0,0,0,0,0,0,1]);

// Grotte pour la fusée (Des murs en haut et en bas)
addP(3,  [1,1,0,0,0,0,0,1,1,1]);
addP(3,  [0,0,0,0,0,0,0,0,0,1]);
addP(3,  [1,1,1,1,0,0,0,0,1,1]);
addP(3,  [0,0,0,0,0,0,0,0,0,1]);
addP(3,  [1,1,0,0,0,0,0,1,1,1]);

// 6. --- PORTAIL CUBE (Sortie de fusée) ---
cols.push([0,0,0,0,0,4,0,0,0,1]);
addP(10, [0,0,0,0,0,0,0,0,0,1]);

// 7. --- GRAVITÉ INVERSÉE ---
cols.push([0,0,0,0,0,5,0,0,0,1]);
// On allonge le plafond pour glisser dessus
addP(2,  [1,0,0,0,0,0,0,0,0,1]);
cols.push([1,2,0,0,0,0,0,0,0,1]); // Pique vers le bas
addP(2,  [1,0,0,0,0,0,0,0,0,1]);
cols.push([1,2,0,0,0,0,0,0,0,1]);
addP(5,  [1,0,0,0,0,0,0,0,0,1]);

// 8. Retour gravité normale
cols.push([1,0,0,0,0,6,0,0,0,1]);
addP(10, [0,0,0,0,0,0,0,0,0,1]);

// FIN DU NIVEAU !
// Le mur de la victoire
addP(5,  [0,0,0,0,0,0,0,0,0,1]); // Espace vide final
addP(2,  [1,1,1,1,1,1,1,1,1,1]); // Le gros mur final qui marque la fin

levelsData[1].mapColumns = cols;
