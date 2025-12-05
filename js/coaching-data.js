// COACHING DATA - Movements and Instructions

const movements = [
    {
        id: "squat",
        name: "Squat",
        emoji: "",
        image: "../img/squat.png",
        description: "Exercice fondamental pour le renforcement des jambes et du bas du corps"
    },
    {
        id: "pushup",
        name: "Pompes",
        emoji: "",
        image: "../img/pompe.png",
        description: "Exercice de renforcement complet du haut du corps"
    },
    {
        id: "plank",
        name: "Planche",
        emoji: "",
        image: "../img/planche.png",
        description: "Exercice isométrique pour le renforcement de la sangle abdominale"
    }
];

// Base instructions by movement
const baseInstructions = {
    squat: [
        "Gardez les talons au sol et le poids réparti uniformément",
        "Descendez en fléchissant les genoux et les hanches",
        "Maintenez la poitrine ouverte et le dos droit",
        "Les genoux doivent rester alignés avec les orteils"
    ],
    pushup: [
        "Maintenez le corps aligné de la tête aux pieds",
        "Écartez les mains à la largeur des épaules",
        "Descendez en contrôlant le mouvement",
        "Poussez vers le haut en engageant le core"
    ],
    plank: [
        "Alignez les épaules au-dessus des poignets",
        "Engagez le core et maintenez le corps droit",
        "Respirez régulièrement sans retenir votre respiration",
        "Évitez de cambrer le bas du dos"
    ]
};

// Generate personalized instructions based on profile
function generateInstructions(profileData, movement) {
    const instructions = [];
    const movementKey = movement.id;
    const base = baseInstructions[movementKey] || [];
    
    instructions.push(...base);

    // Add level-specific modifications
    if (profileData.level === "Débutant") {
        if (movement.id === "squat") {
            instructions.splice(1, 0, "Fais une descente limitée à 90° initialement");
        }
        if (movement.id === "pushup") {
            instructions.splice(3, 0, "Commencez sur les genoux si nécessaire");
        }
    } else if (profileData.level === "Avancé") {
        if (movement.id === "squat") {
            instructions.push("Progressez vers une flexion plus profonde (90° minimum)");
        }
        if (movement.id === "plank") {
            instructions.push("Augmentez la durée progressivement (30s, 60s, 90s+)");
        }
    }

    // Add injury-specific modifications
    if (profileData.injuries === "Dos") {
        instructions.push("Protégez votre dos en engageant le core avant chaque mouvement");
        if (movement.id === "squat") {
            instructions.push("Envisagez une ceinture de maintien lombaire si nécessaire");
        }
    } else if (profileData.injuries === "Genoux") {
        instructions.push("Évitez de laisser les genoux dépasser les orteils");
        if (movement.id === "squat") {
            instructions.push("Augmentez graduellement l'amplitude du mouvement");
        }
    } else if (profileData.injuries === "Épaules") {
        instructions.push("Limitez l'amplitude du mouvement des épaules");
        if (movement.id === "pushup") {
            instructions.push("Restez dans votre zone de confort pour éviter les compensations");
        }
    }

    // Add objective-specific modifications
    if (profileData.objectives.includes('Mobilité')) {
        instructions.push("Maintenez chaque position 1-2 secondes et concentrez-vous sur l'amplitude");
        instructions.push("Respirez profondément et explorez votre amplitude de mouvement");
    }

    if (profileData.objectives.includes('Force')) {
        instructions.push("Augmentez progressivement la charge ou les répétitions");
        instructions.push("Reposez-vous 1-2 minutes entre les séries intenses");
    }

    if (profileData.objectives.includes('Posture')) {
        instructions.unshift("Avant tout mouvement, engagez le core et alignez votre posture");
        instructions.push("Vérifiez régulièrement votre alignement dans un miroir");
    }

    if (profileData.objectives.includes('Perte de poids')) {
        instructions.push("Maintenez un rythme soutenu avec des pauses courtes");
        instructions.push("Combinez cet exercice avec d'autres pour un circuit cardio");
    }

    // Add frequency-specific advice
    if (profileData.frequency === 'Rarement' || profileData.frequency === '1–2/semaine') {
        instructions.push("Privilégiez la qualité du mouvement sur la quantité");
    } else if (profileData.frequency === '5+/semaine') {
        instructions.push("Variez les intensités pour éviter le surmenage");
        instructions.push("Accordez-vous des jours de récupération active");
    }

    return instructions;
}

// Products database by movement
const productsDatabase = {
    squat: [
        {
            name: "Ceinture de maintien lombaire",
            emoji: "",
            price: "25€",
            description: "Support lombaire pour protéger votre dos lors des squats avec charges lourdes",
            url: "https://www.decathlon.fr"
        },
        {
            name: "Chaussures d'haltérophilie",
            emoji: "",
            price: "60€",
            description: "Chaussures spécialisées avec semelle rigide pour optimiser la stabilité",
            url: "https://www.decathlon.fr"
        },
        {
            name: "Tapis de sol premium",
            emoji: "",
            price: "20€",
            description: "Tapis antidérapant pour un confort et une stabilité optimale pendant tes entraînements",
            url: "https://www.decathlon.fr"
        }
    ],
    pushup: [
        {
            name: "Poignées de pompe",
            emoji: "",
            price: "15€",
            description: "Réduis la pression sur tes poignets lors des pompes pour un entraînement plus confortable",
            url: "https://www.decathlon.fr"
        },
        {
            name: "Bandes élastiques de résistance",
            emoji: "",
            price: "12€",
            description: "Bandes pour ajuster la difficulté et progresser comme un vrai guerrier gaulois",
            url: "https://www.decathlon.fr"
        },
        {
            name: "Tapis de yoga épais",
            emoji: "",
            price: "30€",
            description: "Amorti confortable pour les exercices au sol du village",
            url: "https://www.decathlon.fr"
        }
    ],
    plank: [
        {
            name: "Tapis de yoga écologique",
            emoji: "",
            price: "25€",
            description: "Matière écologique avec excellente prise de grip pour tenir ta position",
            url: "https://www.decathlon.fr"
        },
        {
            name: "Coussin de yoga",
            emoji: "",
            price: "18€",
            description: "Support confortable pour les coudes et les genoux pendant tes planches",
            url: "https://www.decathlon.fr"
        },
        {
            name: "Chronomètre de fitness",
            emoji: "",
            price: "10€",
            description: "Suis ta progression avec précision, seconde par seconde !",
            url: "https://www.decathlon.fr"
        }
    ]
};

function getProductsForMovement(movementId) {
    return productsDatabase[movementId] || [];
}
