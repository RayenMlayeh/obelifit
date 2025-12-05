// instructions-generator.js
/**
 * Générateur d'instructions personnalisées basé sur le profil utilisateur
 * Thème: "CTO de ta santé posturale"
 */

class InstructionsGenerator {
    constructor(userProfile) {
        this.profile = userProfile;
    }

    /**
     * Génère le résumé du profil utilisateur
     */
    generateProfileSummary() {
        const niveau = this.profile.niveau_activite || 'debutant';
        const contexte = this.profile.contexte_quotidien || 'assis';
        const objectifs = this.profile.objectifs || [];
        const douleurs = this.profile.douleurs || [];

        let resume = '';
        let niveauGlobal = niveau;
        let pointsVigilance = [];

        // Construire le résumé personnalisé
        if (niveau === 'debutant') {
            resume += "Tu es en phase de démarrage, et c'est parfait ! ";
        } else if (niveau === 'intermediaire') {
            resume += "Tu as déjà une bonne base sportive. ";
        } else {
            resume += "Tu es un(e) athlète confirmé(e) ! ";
        }

        if (contexte === 'assis') {
            resume += "Tu passes beaucoup de temps assis(e), ce qui nécessite une attention particulière à ta posture et au renforcement de ton dos. ";
            pointsVigilance.push("Attention à la posture assise : pense à te lever régulièrement et à étirer ta chaîne postérieure.");
        } else if (contexte === 'debout') {
            resume += "Tu es souvent debout, il faudra veiller à la fatigue des jambes et au renforcement des chevilles. ";
            pointsVigilance.push("Prends soin de tes jambes et chevilles : renforcement et récupération sont essentiels.");
        }

        if (objectifs.includes('posture') || objectifs.includes('reeducation')) {
            resume += "Ton objectif principal est d'améliorer ta posture et de prévenir les blessures. ";
        } else if (objectifs.includes('performance')) {
            resume += "Tu cherches à optimiser tes performances sportives. ";
        } else if (objectifs.includes('perte_poids')) {
            resume += "Tu veux perdre du poids tout en restant en bonne santé. ";
        }

        // Analyser les douleurs
        if (douleurs.length > 0 && !douleurs.includes('aucune')) {
            const zonesDouloureuses = douleurs.filter(d => d !== 'aucune').join(', ');
            resume += `Tu signales des douleurs au niveau : ${zonesDouloureuses}. Nous allons adapter les exercices en conséquence. `;
            
            if (douleurs.includes('dos_bas') || douleurs.includes('dos_haut')) {
                pointsVigilance.push("Évite les mouvements brusques du dos. Privilégie la progression douce et le renforcement du gainage.");
            }
            if (douleurs.includes('genoux')) {
                pointsVigilance.push("Attention aux mouvements de flexion profonde. Assure-toi que tes genoux suivent toujours la direction de tes orteils.");
            }
            if (douleurs.includes('epaules')) {
                pointsVigilance.push("Évite les mouvements au-dessus de la tête si douloureux. Renforce d'abord la stabilité de l'épaule.");
            }
        } else {
            pointsVigilance.push("Profite de l'absence de douleur pour construire de bonnes bases posturales dès maintenant !");
        }

        return {
            resume: resume.trim(),
            niveau_global: niveauGlobal,
            points_de_vigilance: pointsVigilance
        };
    }

    /**
     * Génère les instructions détaillées pour un mouvement donné
     */
    generateMovementInstructions(movementName) {
        const mouvements = {
            "squat": this.getSquatInstructions(),
            "pompe": this.getPompeInstructions(),
            "planche": this.getPlancheInstructions(),
            "yoga_chien_tete_bas": this.getYogaChienInstructions(),
            "fente": this.getFenteInstructions(),
            "pont_fessier": this.getPontFessierInstructions()
        };

        return mouvements[movementName.toLowerCase()] || null;
    }

    /**
     * Instructions pour le Squat
     */
    getSquatInstructions() {
        const hasDouleurGenoux = this.profile.douleurs?.includes('genoux');
        const hasDouleurDos = this.profile.douleurs?.includes('dos_bas');
        const niveau = this.profile.niveau_activite || 'debutant';

        return {
            nom: "Squat",
            categorie: "Renforcement bas du corps",
            niveau_suggere: niveau,
            objectif: "Renforcer les cuisses, les fessiers et le tronc tout en protégeant tes genoux et ton dos.",
            
            instructions_detaillees: [
                "Position de départ : debout, pieds écartés largeur des épaules, pointes légèrement vers l'extérieur.",
                "Engage ton core (contracte tes abdominaux) avant de commencer le mouvement.",
                "Descends en pliant les genoux et les hanches simultanément, comme pour t'asseoir sur une chaise imaginaire.",
                "Garde ton poids sur tes talons, ta poitrine relevée et ton dos droit (colonne neutre).",
                "Descends jusqu'à ce que tes cuisses soient parallèles au sol (ou moins profond si douleurs).",
                "Pousse fort dans tes talons pour remonter en position debout, en gardant le contrôle."
            ],
            
            points_cles_posture: [
                "Colonne vertébrale neutre : pas de cambrure excessive, pas d'arrondissement du dos.",
                "Genoux alignés avec les orteils : ils ne doivent pas rentrer vers l'intérieur.",
                "Poids sur les talons : tu dois pouvoir bouger tes orteils pendant tout le mouvement.",
                "Regard fixé devant toi, légèrement vers le haut."
            ],
            
            erreurs_frequentes: [
                "Arrondir le bas du dos en fin de descente.",
                "Laisser les genoux rentrer vers l'intérieur (valgus).",
                "Décoller les talons du sol.",
                "Pencher le buste trop en avant."
            ],
            
            adaptations_selon_profil: {
                si_debutant_ou_douleurs: [
                    hasDouleurGenoux ? "Réduis l'amplitude : descends seulement jusqu'à mi-hauteur." : "",
                    hasDouleurDos ? "Utilise une chaise derrière toi pour contrôler la descente et éviter la sur-flexion." : "",
                    niveau === 'debutant' ? "Commence par des squats au poids du corps, sans charge additionnelle." : "",
                    "Fais 2-3 séries de 8-10 répétitions avec 1 minute de repos."
                ].filter(Boolean),
                
                si_avance: [
                    "Ajoute un tempo lent : 3 secondes à la descente, 1 seconde en bas, remontée explosive.",
                    "Ajoute du poids (haltères, barre) si la technique est parfaitement maîtrisée.",
                    "Essaye des variantes : squat sumo, squat bulgare, pistol squat.",
                    "Fais 4-5 séries de 12-15 répétitions ou ajoute de la résistance."
                ]
            },
            
            respiration: "Inspire profondément en descendant, bloque légèrement ton souffle en bas (pour stabiliser), puis expire en remontant.",
            
            proposition_visualisation: {
                description_simple: "Illustration de profil d'une personne effectuant un squat parfait : colonne neutre, genoux alignés avec les orteils, hanches en arrière, bras tendus devant pour l'équilibre.",
                prompt_image_ia: "flat illustration, side view, person doing a perfect squat, neutral spine, knees aligned with toes, hips back, arms extended forward, simple modern colors, fitness style",
                idee_animation_css: "Animation CSS montrant le mouvement de haut en bas avec une flèche indiquant la direction des hanches vers l'arrière. Highlights sur les points clés : genoux, dos, talons."
            },
            
            produits_decathlon: [
                {
                    categorie: "tapis de fitness",
                    nom_suggere: "Tapis de fitness confort Domyos",
                    utilite: "Pour plus de confort au sol si tu fais des étirements avant/après.",
                    comment_l_integrer_dans_la_page: "Bouton 'Voir le produit' avec lien Decathlon à côté de la description du mouvement."
                },
                {
                    categorie: "haltères",
                    nom_suggere: "Paire d'haltères 2-10kg Domyos",
                    utilite: "Pour ajouter de la résistance une fois la technique maîtrisée.",
                    comment_l_integrer_dans_la_page: "Section 'Pour progresser' avec suggestion de matériel."
                }
            ]
        };
    }

    /**
     * Instructions pour les Pompes
     */
    getPompeInstructions() {
        const hasDouleurEpaules = this.profile.douleurs?.includes('epaules');
        const niveau = this.profile.niveau_activite || 'debutant';

        return {
            nom: "Pompe (Push-up)",
            categorie: "Renforcement haut du corps et gainage",
            niveau_suggere: niveau,
            objectif: "Renforcer les pectoraux, les épaules, les triceps et stabiliser ton tronc.",
            
            instructions_detaillees: [
                "Position de départ : en planche haute, mains écartées largeur des épaules, bras tendus.",
                "Corps aligné de la tête aux pieds : gainage actif (abdos et fessiers contractés).",
                "Descends en pliant les coudes vers l'arrière (pas sur les côtés), jusqu'à ce que ta poitrine frôle le sol.",
                "Garde tes coudes à environ 45° du corps (ni trop écartés, ni collés).",
                "Pousse fort dans tes mains pour remonter en position de départ.",
                "Maintiens le gainage pendant toute la durée du mouvement."
            ],
            
            points_cles_posture: [
                "Corps aligné : pas de fesses en l'air, pas de bassin qui s'affaisse.",
                "Coudes à 45° du corps pour protéger les épaules.",
                "Regard fixé légèrement devant les mains (nuque neutre).",
                "Omoplates stabilisées : ne laisse pas tes épaules monter vers les oreilles."
            ],
            
            erreurs_frequentes: [
                "Laisser le bassin tomber (perte du gainage).",
                "Écarter les coudes à 90° sur les côtés (risque pour les épaules).",
                "Ne pas descendre assez bas.",
                "Bouger la tête au lieu de garder la nuque neutre."
            ],
            
            adaptations_selon_profil: {
                si_debutant_ou_douleurs: [
                    hasDouleurEpaules ? "Fais des pompes sur les genoux ou contre un mur pour réduire la charge." : "",
                    niveau === 'debutant' ? "Commence par des pompes inclinées (mains sur un banc ou une table)." : "",
                    "Fais 2-3 séries de 5-8 répétitions avec une technique parfaite.",
                    "Prends 1 à 2 minutes de repos entre les séries."
                ].filter(Boolean),
                
                si_avance: [
                    "Ajoute un tempo lent : 3 secondes à la descente, 1 seconde en bas, remontée rapide.",
                    "Essaye des variantes : pompes diamant, pompes déclinées, pompes archer.",
                    "Ajoute des séries de 15-20 répétitions ou fais des pompes explosives (clapping push-ups).",
                    "Intègre dans un circuit avec d'autres exercices pour plus d'intensité."
                ]
            },
            
            respiration: "Inspire en descendant, expire en poussant pour remonter.",
            
            proposition_visualisation: {
                description_simple: "Vue de profil d'une personne en position de pompe, avec des lignes montrant l'alignement tête-dos-jambes, et l'angle des coudes à 45° du corps.",
                prompt_image_ia: "flat illustration, side view, person doing a perfect push-up, body aligned, elbows at 45 degrees, core engaged, simple modern colors, fitness style",
                idee_animation_css: "Animation montrant la descente et la remontée, avec highlights sur les points de contrôle : coudes, alignement du corps, position des mains."
            },
            
            produits_decathlon: [
                {
                    categorie: "tapis de fitness",
                    nom_suggere: "Tapis de fitness épais Domyos",
                    utilite: "Pour protéger tes poignets et tes genoux si tu fais des pompes au sol.",
                    comment_l_integrer_dans_la_page: "Lien produit dans la section 'Matériel recommandé'."
                },
                {
                    categorie: "poignées de pompe",
                    nom_suggere: "Poignées de pompe ergonomiques",
                    utilite: "Pour réduire la pression sur les poignets et augmenter l'amplitude.",
                    comment_l_integrer_dans_la_page: "Suggestion pour les pratiquants avancés ou ceux avec douleurs aux poignets."
                }
            ]
        };
    }

    /**
     * Instructions pour la Planche (Gainage)
     */
    getPlancheInstructions() {
        const hasDouleurDos = this.profile.douleurs?.includes('dos_bas');
        const niveau = this.profile.niveau_activite || 'debutant';

        return {
            nom: "Planche (Gainage)",
            categorie: "Renforcement du tronc et stabilité",
            niveau_suggere: niveau,
            objectif: "Renforcer toute la sangle abdominale, le dos et améliorer ta stabilité posturale.",
            
            instructions_detaillees: [
                "Position de départ : en appui sur les avant-bras et les orteils, coudes sous les épaules.",
                "Corps parfaitement aligné de la tête aux talons : une ligne droite.",
                "Contracte tes abdominaux, tes fessiers et tes cuisses.",
                "Garde ta nuque neutre : regarde le sol entre tes mains.",
                "Respire normalement sans bloquer ta respiration.",
                "Maintiens la position le plus longtemps possible avec une forme parfaite."
            ],
            
            points_cles_posture: [
                "Bassin en rétroversion légère : ne laisse pas ton ventre tomber.",
                "Fessiers contractés pour protéger le bas du dos.",
                "Épaules stables : ne laisse pas tes omoplates s'écarter.",
                "Nuque alignée avec la colonne : pas de tête qui pend ou qui se relève."
            ],
            
            erreurs_frequentes: [
                "Laisser le bassin s'affaisser (cambrure lombaire excessive).",
                "Monter les fesses en l'air (position en V).",
                "Bloquer sa respiration.",
                "Hausser les épaules vers les oreilles."
            ],
            
            adaptations_selon_profil: {
                si_debutant_ou_douleurs: [
                    hasDouleurDos ? "Commence par des planches sur les genoux pour réduire la charge." : "",
                    niveau === 'debutant' ? "Vise 20-30 secondes avec une forme parfaite, puis progresse." : "",
                    "Fais 3-4 séries avec 30 secondes de repos entre chaque.",
                    "Si trop difficile, fais des planches contre un mur en position inclinée."
                ].filter(Boolean),
                
                si_avance: [
                    "Vise des planches de 1 à 2 minutes avec une forme impeccable.",
                    "Essaye des variantes : planche latérale, planche avec levée de jambe, planche dynamique.",
                    "Ajoute un poids sur le dos pour augmenter la difficulté.",
                    "Intègre dans un circuit HIIT avec d'autres exercices de gainage."
                ]
            },
            
            respiration: "Respire calmement et profondément pendant toute la durée de l'exercice. Ne bloque jamais ta respiration.",
            
            proposition_visualisation: {
                description_simple: "Vue de profil d'une personne en planche parfaite, avec une ligne droite de la tête aux talons, coudes sous les épaules.",
                prompt_image_ia: "flat illustration, side view, person in perfect plank position, body aligned, elbows under shoulders, core engaged, simple modern colors, fitness style",
                idee_animation_css: "Animation subtile montrant la respiration (légère expansion/contraction du tronc), avec highlights sur les zones à activer : abdos, fessiers, épaules."
            },
            
            produits_decathlon: [
                {
                    categorie: "tapis de yoga",
                    nom_suggere: "Tapis de yoga confort Domyos",
                    utilite: "Pour protéger tes coudes et avant-bras pendant le gainage.",
                    comment_l_integrer_dans_la_page: "Suggestion dans la section 'Confort et équipement'."
                }
            ]
        };
    }

    /**
     * Instructions pour le Chien tête en bas (Yoga)
     */
    getYogaChienInstructions() {
        const hasDouleurEpaules = this.profile.douleurs?.includes('epaules');
        const hasDouleurDos = this.profile.douleurs?.includes('dos_bas');

        return {
            nom: "Chien tête en bas (Adho Mukha Svanasana)",
            categorie: "Yoga - Étirement et renforcement",
            niveau_suggere: "debutant",
            objectif: "Étirer toute la chaîne postérieure (dos, ischio-jambiers, mollets) tout en renforçant les bras et les épaules.",
            
            instructions_detaillees: [
                "Position de départ : à quatre pattes, mains écartées largeur des épaules, genoux sous les hanches.",
                "Pousse dans tes mains et soulève tes hanches vers le ciel en tendant les jambes.",
                "Forme un V inversé avec ton corps.",
                "Presse tes mains fermement dans le sol, doigts écartés.",
                "Essaye de rapprocher tes talons du sol (ils ne doivent pas forcément toucher).",
                "Relâche ta tête et ta nuque, regarde entre tes jambes ou vers ton nombril."
            ],
            
            points_cles_posture: [
                "Dos long et étiré : pas d'arrondissement excessif.",
                "Bras tendus, épaules loin des oreilles.",
                "Hanches hautes, poids réparti entre mains et pieds.",
                "Si tes ischio-jambiers sont raides, plie légèrement les genoux."
            ],
            
            erreurs_frequentes: [
                "Arrondir excessivement le haut du dos.",
                "Hausser les épaules vers les oreilles.",
                "Verrouiller les genoux si les ischio-jambiers sont raides.",
                "Mettre tout le poids dans les poignets au lieu de pousser avec les hanches."
            ],
            
            adaptations_selon_profil: {
                si_debutant_ou_douleurs: [
                    hasDouleurEpaules ? "Réduis le temps de maintien et reviens en position à quatre pattes dès que nécessaire." : "",
                    hasDouleurDos ? "Garde les genoux légèrement pliés pour protéger le bas du dos." : "",
                    "Maintiens la position 5-10 respirations, puis repose-toi.",
                    "Utilise des blocs de yoga sous les mains si tu manques de souplesse."
                ].filter(Boolean),
                
                si_avance: [
                    "Maintiens la position 10-15 respirations profondes.",
                    "Essaye de lever une jambe vers le ciel (chien à trois pattes).",
                    "Intègre dans un flow yoga avec d'autres postures (salutation au soleil).",
                    "Travaille la transition fluide entre la planche et le chien tête en bas."
                ]
            },
            
            respiration: "Respire profondément par le nez. À chaque expiration, essaye d'étirer un peu plus ton dos et d'enfoncer tes talons.",
            
            proposition_visualisation: {
                description_simple: "Vue de profil d'une personne en position de chien tête en bas, formant un V inversé, mains et pieds au sol, hanches hautes.",
                prompt_image_ia: "flat illustration, side view, person in downward facing dog yoga pose, inverted V shape, hands and feet on ground, hips high, simple calming colors, yoga style",
                idee_animation_css: "Animation douce montrant la respiration et l'étirement progressif, avec des lignes fluides pour guider l'alignement."
            },
            
            produits_decathlon: [
                {
                    categorie: "tapis de yoga",
                    nom_suggere: "Tapis de yoga antidérapant Domyos",
                    utilite: "Essentiel pour avoir une bonne adhérence et ne pas glisser pendant la posture.",
                    comment_l_integrer_dans_la_page: "Lien direct vers le produit dans la description de l'exercice."
                },
                {
                    categorie: "blocs de yoga",
                    nom_suggere: "Lot de 2 blocs de yoga en mousse",
                    utilite: "Pour surélever tes mains si tu manques de souplesse dans les ischio-jambiers.",
                    comment_l_integrer_dans_la_page: "Suggestion pour les débutants ou personnes peu souples."
                }
            ]
        };
    }

    /**
     * Générer le rapport complet avec tous les mouvements
     */
    generateFullReport(movementsList) {
        const profilSummary = this.generateProfileSummary();
        const mouvements = movementsList.map(mvt => this.generateMovementInstructions(mvt)).filter(Boolean);

        return {
            profil: profilSummary,
            mouvements: mouvements,
            disclaimer: "⚠️ Ces conseils sont généraux et ne remplacent pas l'avis d'un professionnel de santé. Si tu ressens une douleur anormale, arrête l'exercice et consulte un spécialiste."
        };
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstructionsGenerator;
}
