// COACHING APP - Main JavaScript Logic

// State Management
const appState = {
    currentStep: 1,
    profileData: {
        level: "",
        sports: [],
        injuries: "",
        objectives: [],
        frequency: ""
    },
    selectedMovement: null,
    currentProductIndex: 0
};

// DOM Elements
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const exerciseModal = document.getElementById('exercise-modal');
const closeModalBtn = document.getElementById('close-modal');
const progressBar = document.getElementById('progress-bar');
const restartBtn = document.getElementById('restart-btn');
const profileForm = document.getElementById('profile-form');
const submitBtn = document.getElementById('submit-profile');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeFormHandlers();
    initializeNavigation();
});

// ========== FORM HANDLERS ==========

function initializeFormHandlers() {
    // Handle option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const field = btn.dataset.field;
            const value = btn.dataset.value;
            const isMulti = btn.classList.contains('multi');
            
            if (isMulti) {
                handleMultiSelect(btn, field, value);
            } else {
                handleSingleSelect(btn, field, value);
            }
            
            validateForm();
        });
    });

    // Handle form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isFormValid()) {
            goToStep(2);
            loadRecommendations();
            loadMovements();
        }
    });
}

function handleSingleSelect(btn, field, value) {
    // Deselect all buttons in the same group
    const group = btn.closest('.options-grid');
    group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    
    // Select this button
    btn.classList.add('selected');
    appState.profileData[field] = value;
}

function handleMultiSelect(btn, field, value) {
    // Toggle selection
    btn.classList.toggle('selected');
    
    if (btn.classList.contains('selected')) {
        // Add to array
        if (!appState.profileData[field].includes(value)) {
            appState.profileData[field].push(value);
        }
    } else {
        // Remove from array
        appState.profileData[field] = appState.profileData[field].filter(v => v !== value);
    }
}

function validateForm() {
    const { level, sports, injuries, objectives, frequency } = appState.profileData;
    const isValid = level && 
                    sports.length > 0 && 
                    injuries && 
                    objectives.length > 0 && 
                    frequency;
    
    submitBtn.disabled = !isValid;
    return isValid;
}

function isFormValid() {
    return validateForm();
}

// ========== NAVIGATION ==========

function initializeNavigation() {
    restartBtn.addEventListener('click', restart);
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeExerciseModal);
    }
    
    // Close modal when clicking outside
    if (exerciseModal) {
        exerciseModal.addEventListener('click', (e) => {
            if (e.target === exerciseModal) {
                closeExerciseModal();
            }
        });
    }
}

function closeExerciseModal() {
    if (exerciseModal) {
        exerciseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function goToStep(stepNumber) {
    appState.currentStep = stepNumber;
    
    // Update visibility
    step1.classList.remove('active');
    step2.classList.remove('active');
    
    if (stepNumber === 1) step1.classList.add('active');
    if (stepNumber === 2) step2.classList.add('active');
    
    // Update progress bar
    const progress = (stepNumber / 2) * 100;
    progressBar.style.width = progress + '%';
    
    // Update step labels
    document.querySelectorAll('.step-label').forEach(label => {
        const step = parseInt(label.dataset.step);
        if (step <= stepNumber) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
    
    // Show/hide restart button
    if (stepNumber > 1) {
        restartBtn.style.display = 'flex';
    } else {
        restartBtn.style.display = 'none';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restart() {
    // Reset state
    appState.currentStep = 1;
    appState.profileData = {
        level: "",
        sports: [],
        injuries: "",
        objectives: [],
        frequency: ""
    };
    appState.selectedMovement = null;
    appState.currentProductIndex = 0;
    
    // Reset form
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    submitBtn.disabled = true;
    
    // Go to step 1
    goToStep(1);
}

// ========== RECOMMENDATIONS ==========

function loadRecommendations() {
    const content = document.getElementById('recommendations-content');
    const profile = appState.profileData;
    const recommendations = [];

    // Level-based recommendation
    let levelRec = {
        icon: '',
        title: 'Votre Niveau',
        items: []
    };
    
    if (profile.level === 'Débutant') {
        levelRec.items = [
            'Commencez avec des mouvements simples et maîtrisez la technique',
            'Privilégiez 2-3 séances par semaine pour bien récupérer',
            'La progression prend du temps - ne forcez pas'
        ];
    } else if (profile.level === 'Intermédiaire') {
        levelRec.items = [
            'Augmentez l\'intensité et la variété des exercices',
            'Concentrez-vous sur la progression (poids, répétitions)',
            '3-4 séances par semaine sont recommandées'
        ];
    } else {
        levelRec.items = [
            'Progressez avec des variations avancées',
            'Variez les intensités et incluez des jours de récupération active',
            'Entraînez-vous 5+ fois par semaine'
        ];
    }
    recommendations.push(levelRec);

    // Objectives-based recommendation
    if (profile.objectives.length > 0) {
        let objRec = {
            icon: '',
            title: 'Vos Objectifs',
            items: []
        };
        
        if (profile.objectives.includes('Force')) {
            objRec.items.push('Focus: Squat, Développé Haltères, Pompes');
            objRec.items.push('Augmentez progressivement la charge ou les répétitions');
        }
        if (profile.objectives.includes('Mobilité')) {
            objRec.items.push('Focus: Chien Tête en Bas, étirements dynamiques');
            objRec.items.push('Maintenez chaque position et respirez profondément');
        }
        if (profile.objectives.includes('Perte de poids')) {
            objRec.items.push('Focus: Burpee, circuits cardio');
            objRec.items.push('Maintenez un rythme soutenu avec pauses courtes');
        }
        if (profile.objectives.includes('Posture')) {
            objRec.items.push('Focus: Planche, Chien Tête en Bas');
            objRec.items.push('Vérifiez régulièrement votre alignement');
        }
        recommendations.push(objRec);
    }

    // Injury-based recommendation
    if (profile.injuries && profile.injuries !== 'Aucun') {
        let injuryRec = {
            icon: '',
            title: 'Protection Zone: ' + profile.injuries,
            items: [
                'Échauffez-vous bien avant chaque séance',
                'Commencez avec des amplitudes réduites',
                'Arrêtez-vous si vous ressentez une douleur'
            ]
        };
        
        if (profile.injuries === 'Dos') {
            injuryRec.items.push('Engagez votre core avant chaque mouvement');
            injuryRec.items.push('Considérez une ceinture lombaire pour les charges lourdes');
        } else if (profile.injuries === 'Genoux') {
            injuryRec.items.push('Ne laissez pas les genoux dépasser les orteils');
            injuryRec.items.push('Augmentez l\'amplitude progressivement');
        } else if (profile.injuries === 'Épaules') {
            injuryRec.items.push('Limitez l\'amplitude sur les mouvements d\'\u00e9paules');
            injuryRec.items.push('Restez dans votre zone de confort');
        }
        recommendations.push(injuryRec);
    }

    // Frequency-based recommendation
    let freqRec = {
        icon: '',
        title: 'Votre Planning',
        items: []
    };
    
    if (profile.frequency === 'Rarement' || profile.frequency === '1–2/semaine') {
        freqRec.items = [
            'Privilégiez les exercices complets (Burpee, Squat)',
            'Concentrez-vous sur la qualité plutôt que la quantité',
            'Chaque séance compte - donnez le meilleur de vous-même'
        ];
    } else if (profile.frequency === '3–4/semaine') {
        freqRec.items = [
            'Alternez les groupes musculaires',
            'Incluez 1 jour de mobilité/récupération',
            'Rythme idéal pour progresser'
        ];
    } else {
        freqRec.items = [
            'Variez les intensités (hautes/basses)',
            'Incluez 2 jours de récupération active',
            'Attention au surmenage - écoutez votre corps'
        ];
    }
    recommendations.push(freqRec);

    // Render recommendations
    content.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <h3><span>${rec.icon}</span> ${rec.title}</h3>
            <ul>
                ${rec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// ========== MOVEMENT SELECTOR ==========

function loadMovements() {
    const grid = document.getElementById('movements-grid');
    grid.innerHTML = '';
    
    movements.forEach(movement => {
        const card = createMovementCard(movement);
        grid.appendChild(card);
    });
}

function createMovementCard(movement) {
    const card = document.createElement('div');
    card.className = 'movement-card';
    card.onclick = () => selectMovement(movement);
    
    const imageContent = movement.image 
        ? `<img src="${movement.image}" alt="${movement.name}" class="movement-card-image">`
        : `<div class="movement-emoji">${movement.emoji}</div>`;
    
    card.innerHTML = `
        <div class="movement-image">
            ${imageContent}
            <div class="movement-overlay"></div>
        </div>
        <div class="movement-info">
            <h3 class="movement-name">${movement.name}</h3>
            <p class="movement-description">${movement.description}</p>
            <button class="btn secondary">Voir la d\u00e9monstration</button>
        </div>
    `;
    
    return card;
}

function selectMovement(movement) {
    appState.selectedMovement = movement;
    appState.currentProductIndex = 0;
    openExerciseModal();
    loadInstructions();
    loadProducts();
}

function openExerciseModal() {
    if (exerciseModal) {
        exerciseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Scroll modal to top
        exerciseModal.scrollTop = 0;
    }
}

// ========== INSTRUCTIONS PANEL ==========

function loadInstructions() {
    const movement = appState.selectedMovement;
    const profileData = appState.profileData;
    
    // Update header
    const header = document.getElementById('movement-header');
    header.innerHTML = `
        <div class="movement-header-emoji">${movement.emoji}</div>
        <div class="movement-header-text">
            <h2>${movement.name}</h2>
            <p>${movement.description}</p>
        </div>
    `;
    
    // Update demo image
    const demoImage = document.getElementById('demo-image');
    if (demoImage && movement.image) {
        demoImage.src = movement.image;
        demoImage.alt = `Démonstration ${movement.name}`;
    }
    
    // Generate and display instructions
    const instructions = generateInstructions(profileData, movement);
    const list = document.getElementById('instructions-list');
    list.innerHTML = '';
    
    instructions.forEach((instruction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="instruction-number">${index + 1}</span>
            <span class="instruction-text">${instruction}</span>
        `;
        list.appendChild(li);
    });
}

// ========== PRODUCTS SECTION ==========

function loadProducts() {
    const movement = appState.selectedMovement;
    const products = getProductsForMovement(movement.id);
    
    if (products.length === 0) {
        document.getElementById('products-section').style.display = 'none';
        return;
    }
    
    document.getElementById('products-section').style.display = 'block';
    displayProduct(0);
    setupProductNavigation(products);
}

function displayProduct(index) {
    const movement = appState.selectedMovement;
    const products = getProductsForMovement(movement.id);
    
    if (products.length === 0) return;
    
    const product = products[index];
    const display = document.getElementById('product-display');
    
    display.innerHTML = `
        <div class="product-image">
            <div class="product-emoji">${product.emoji}</div>
            <p class="product-image-label">${product.name}</p>
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price}</p>
            <a href="${product.url}" target="_blank" rel="noopener noreferrer" class="btn primary product-link">
                Voir sur Decathlon ➜
            </a>
        </div>
    `;
    
    // Update counter
    document.getElementById('product-counter').textContent = `${index + 1} / ${products.length}`;
}

function setupProductNavigation(products) {
    const prevBtn = document.getElementById('prev-product');
    const nextBtn = document.getElementById('next-product');
    
    function updateButtons() {
        prevBtn.disabled = appState.currentProductIndex === 0;
        nextBtn.disabled = appState.currentProductIndex === products.length - 1;
    }
    
    prevBtn.onclick = () => {
        if (appState.currentProductIndex > 0) {
            appState.currentProductIndex--;
            displayProduct(appState.currentProductIndex);
            updateButtons();
        }
    };
    
    nextBtn.onclick = () => {
        if (appState.currentProductIndex < products.length - 1) {
            appState.currentProductIndex++;
            displayProduct(appState.currentProductIndex);
            updateButtons();
        }
    };
    
    updateButtons();
}

// ========== ANIMATIONS ==========

// Add click animation to buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') || e.target.classList.contains('option-btn')) {
        e.target.classList.add('clicked');
        setTimeout(() => {
            e.target.classList.remove('clicked');
        }, 200);
    }
});
