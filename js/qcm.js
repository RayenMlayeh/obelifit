// qcm.js - Version modernisée pour "CTO de ta santé posturale"
document.addEventListener("DOMContentLoaded", async () => {
    let qcmData = null;
    let currentQuestionIndex = 0;
    let userResponses = {};

    // Charger les données du QCM
    try {
        const response = await fetch('../js/qcm-data.json');
        qcmData = await response.json();
        initQCM();
    } catch (error) {
        console.error('Erreur lors du chargement du QCM:', error);
        showError();
    }

    function initQCM() {
        displayQuestion(currentQuestionIndex);
        updateProgress();
    }

    function displayQuestion(index) {
        if (!qcmData || index >= qcmData.questions.length) return;

        const question = qcmData.questions[index];
        const container = document.getElementById('qcm-container');
        
        if (!container) {
            console.error('Container qcm-container introuvable');
            return;
        }

        let html = `
            <div class="question-card">
                <div class="question-header">
                    <h2>${question.label}</h2>
                    <p class="question-type">${question.type === 'single' ? 'Une seule réponse' : 'Plusieurs réponses possibles'}</p>
                </div>
                <form id="current-question-form" class="options-container">
        `;

        question.options.forEach((option, idx) => {
            const inputType = question.type === 'single' ? 'radio' : 'checkbox';
            const inputName = question.type === 'single' ? 'answer' : `answer_${idx}`;
            
            html += `
                <label class="option-label">
                    <input type="${inputType}" 
                           name="${inputName}" 
                           value="${option.value}" 
                           data-tags='${JSON.stringify(option.tags)}'>
                    <span class="option-text">${option.label}</span>
                </label>
            `;
        });

        html += `
                </form>
                <div class="navigation-buttons">
                    ${index > 0 ? '<button id="prev-btn" class="btn btn-secondary">← Précédent</button>' : ''}
                    <button id="next-btn" class="btn btn-primary">${index < qcmData.questions.length - 1 ? 'Suivant →' : 'Terminer ✓'}</button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Restaurer les réponses précédentes si elles existent
        const questionId = question.id;
        if (userResponses[questionId]) {
            const savedResponses = Array.isArray(userResponses[questionId]) 
                ? userResponses[questionId] 
                : [userResponses[questionId]];
            
            savedResponses.forEach(value => {
                const input = container.querySelector(`input[value="${value}"]`);
                if (input) input.checked = true;
            });
        }

        // Event listeners
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');

        if (nextBtn) {
            nextBtn.addEventListener('click', handleNext);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', handlePrevious);
        }
    }

    function handleNext() {
        const question = qcmData.questions[currentQuestionIndex];
        const form = document.getElementById('current-question-form');
        
        // Valider et récupérer les réponses
        if (question.type === 'single') {
            const selected = form.querySelector('input:checked');
            if (!selected) {
                alert('⚠️ Merci de sélectionner une réponse avant de continuer.');
                return;
            }
            userResponses[question.id] = selected.value;
        } else {
            const selected = Array.from(form.querySelectorAll('input:checked'));
            if (selected.length === 0) {
                alert('⚠️ Merci de sélectionner au moins une réponse avant de continuer.');
                return;
            }
            userResponses[question.id] = selected.map(input => input.value);
        }

        // Passer à la question suivante ou terminer
        if (currentQuestionIndex < qcmData.questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
            updateProgress();
        } else {
            finishQCM();
        }
    }

    function handlePrevious() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
            updateProgress();
        }
    }

    function updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar && progressText) {
            const progress = ((currentQuestionIndex + 1) / qcmData.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `Question ${currentQuestionIndex + 1} / ${qcmData.questions.length}`;
        }
    }

    function finishQCM() {
        // Calculer le profil utilisateur
        const profile = calculateProfile(userResponses);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('userProfile', JSON.stringify(profile));
        localStorage.setItem('qcmCompleted', 'true');

        // Afficher le résumé
        displayProfileSummary(profile);
    }

    function calculateProfile(responses) {
        const profile = {
            responses: responses,
            niveau_activite: responses.niveau_activite || 'debutant',
            contexte_quotidien: responses.contexte_quotidien || 'assis',
            sports_pratiques: responses.sports_pratiques || [],
            objectifs: responses.objectifs || [],
            douleurs: responses.douleurs || [],
            materiel: responses.materiel || [],
            frequence_souhaitee: responses.frequence_souhaitee || 'leger',
            duree_seance: responses.duree_seance || 'moyen',
            timestamp: new Date().toISOString()
        };

        // Calculer le niveau global basé sur plusieurs critères
        let niveauScore = 0;
        
        if (profile.niveau_activite === 'avance') niveauScore += 3;
        else if (profile.niveau_activite === 'intermediaire') niveauScore += 2;
        else niveauScore += 1;

        if (profile.frequence_souhaitee === 'intensif') niveauScore += 2;
        else if (profile.frequence_souhaitee === 'modere') niveauScore += 1;

        if (profile.sports_pratiques.length > 2) niveauScore += 1;

        // Déterminer le niveau global
        if (niveauScore >= 5) {
            profile.niveau_global = 'avance';
        } else if (niveauScore >= 3) {
            profile.niveau_global = 'intermediaire';
        } else {
            profile.niveau_global = 'debutant';
        }

        // Ajouter des tags de profil
        profile.tags = [];
        
        if (profile.contexte_quotidien === 'assis') {
            profile.tags.push('risque_postural', 'besoin_mobilite');
        }
        
        if (profile.douleurs.length > 0 && !profile.douleurs.includes('aucune')) {
            profile.tags.push('adaptation_necessaire', 'focus_prevention');
        }
        
        if (profile.objectifs.includes('posture') || profile.objectifs.includes('reeducation')) {
            profile.tags.push('focus_posture');
        }

        return profile;
    }

    function displayProfileSummary(profile) {
        const container = document.getElementById('qcm-container');
        
        let niveauEmoji = '🌱';
        let niveauText = 'Débutant';
        if (profile.niveau_global === 'intermediaire') {
            niveauEmoji = '⚡';
            niveauText = 'Intermédiaire';
        } else if (profile.niveau_global === 'avance') {
            niveauEmoji = '🚀';
            niveauText = 'Avancé';
        }

        let html = `
            <div class="profile-summary">
                <h2 class="summary-title">✅ Profil configuré avec succès !</h2>
                
                <div class="profile-card">
                    <h3>${niveauEmoji} Ton niveau : ${niveauText}</h3>
                    
                    <div class="profile-section">
                        <h4>📊 Ton profil en bref :</h4>
                        <ul>
                            <li><strong>Contexte quotidien :</strong> ${getContextLabel(profile.contexte_quotidien)}</li>
                            <li><strong>Fréquence souhaitée :</strong> ${getFrequenceLabel(profile.frequence_souhaitee)}</li>
                            <li><strong>Durée par séance :</strong> ${getDureeLabel(profile.duree_seance)}</li>
        `;

        if (profile.sports_pratiques.length > 0 && !profile.sports_pratiques.includes('aucun')) {
            html += `<li><strong>Sports pratiqués :</strong> ${profile.sports_pratiques.join(', ')}</li>`;
        }

        if (profile.objectifs.length > 0) {
            html += `<li><strong>Objectifs principaux :</strong> ${profile.objectifs.length} objectif(s) identifié(s)</li>`;
        }

        if (profile.douleurs.length > 0 && !profile.douleurs.includes('aucune')) {
            html += `<li><strong>⚠️ Zones sensibles :</strong> ${profile.douleurs.length} zone(s) à surveiller</li>`;
        }

        html += `
                        </ul>
                    </div>
                    
                    <div class="cta-section">
                        <p class="cta-text">🎯 Prêt(e) à débugger ta posture et optimiser ta santé ?</p>
                        <a href="../index.html" class="btn btn-primary btn-large">Découvrir mes exercices personnalisés</a>
                        <button id="restart-qcm" class="btn btn-secondary">🔄 Refaire le questionnaire</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Event listener pour recommencer
        document.getElementById('restart-qcm').addEventListener('click', () => {
            currentQuestionIndex = 0;
            userResponses = {};
            localStorage.removeItem('userProfile');
            localStorage.removeItem('qcmCompleted');
            displayQuestion(0);
            updateProgress();
        });
    }

    // Fonctions utilitaires pour les labels
    function getContextLabel(value) {
        const labels = {
            'assis': 'Principalement assis(e)',
            'mixte': 'Mixte (assis/debout)',
            'debout': 'Principalement debout'
        };
        return labels[value] || value;
    }

    function getFrequenceLabel(value) {
        const labels = {
            'leger': '1-2 fois/semaine',
            'modere': '3-4 fois/semaine',
            'intensif': '5+ fois/semaine'
        };
        return labels[value] || value;
    }

    function getDureeLabel(value) {
        const labels = {
            'court': '15-20 minutes',
            'moyen': '30-45 minutes',
            'long': '1h ou plus'
        };
        return labels[value] || value;
    }

    function showError() {
        const container = document.getElementById('qcm-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>⚠️ Erreur de chargement</h2>
                    <p>Impossible de charger le questionnaire. Veuillez réessayer.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Recharger la page</button>
                </div>
            `;
        }
    }
});
