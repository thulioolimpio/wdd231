// DOM Elements
const plantContainer = document.getElementById('plantContainer');
const blogPostsContainer = document.getElementById('blogPosts');
const seasonalTipsContainer = document.getElementById('seasonalTips');

// ======================
// MODAL FUNCTIONALITY
// ======================

function createModalStructure() {
    const modal = document.createElement('div');
    modal.id = 'plantModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="close-modal" aria-label="Close modal">&times;</button>
            <div class="modal-body" id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    return modal;
}

function openPlantModal(plantId) {
    const modal = document.getElementById('plantModal') || createModalStructure();
    const modalBody = document.getElementById('modalBody');
    
    // Show loading state
    modalBody.innerHTML = '<p>Loading plant details...</p>';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    fetch('./data/plants.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const plant = data.plants.find(p => p.id == plantId);
            if (!plant) throw new Error('Plant not found');
            
            modalBody.innerHTML = `
                <h2>${plant.name}</h2>
                <img src="./images/${plant.image}" alt="${plant.name}" loading="lazy">
                <div class="plant-details">
                    <p><strong>Type:</strong> ${plant.type}</p>
                    <p><strong>Care Level:</strong> ${plant.care}</p>
                    <p><strong>Sunlight:</strong> ${plant.sunlight}</p>
                    ${plant.water ? `<p><strong>Watering:</strong> ${plant.water}</p>` : ''}
                    ${plant.tips ? `<div class="care-tips"><h3>Care Tips</h3><p>${plant.tips}</p></div>` : ''}
                </div>
                <button class="btn save-plant" data-id="${plant.id}">Save to Favorites</button>
            `;
            
            // Add favorite functionality
            document.querySelector('.save-plant')?.addEventListener('click', () => {
                saveToFavorites(plant);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            modalBody.innerHTML = `
                <p class="error">Error loading plant details</p>
                <button class="btn retry-btn">Try Again</button>
            `;
            document.querySelector('.retry-btn')?.addEventListener('click', () => openPlantModal(plantId));
        });
}

function closeModal() {
    const modal = document.getElementById('plantModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function saveToFavorites(plant) {
    try {
        const favorites = JSON.parse(localStorage.getItem('favoritePlants') || '[]');
        
        if (!favorites.some(fav => fav.id === plant.id)) {
            favorites.push(plant);
            localStorage.setItem('favoritePlants', JSON.stringify(favorites));
            alert(`${plant.name} added to favorites!`);
        } else {
            alert(`${plant.name} is already in favorites!`);
        }
    } catch (error) {
        console.error('Error saving favorite:', error);
    }
}

// ======================
// PLANT DATA FUNCTIONS
// ======================

async function loadPlants() {
    try {
        const response = await fetch('./data/plants.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        displayPlants(data.plants);
        
        // Cache data
        localStorage.setItem('cachedPlants', JSON.stringify(data.plants));
        localStorage.setItem('lastPlantUpdate', new Date().toISOString());
        
    } catch (error) {
        console.error('Error loading plants:', error);
        loadCachedPlants();
    }
}

function loadCachedPlants() {
    const cachedPlants = localStorage.getItem('cachedPlants');
    if (cachedPlants && plantContainer) {
        displayPlants(JSON.parse(cachedPlants));
        plantContainer.innerHTML += `<p class="cache-notice">Showing cached data from ${new Date(localStorage.getItem('lastPlantUpdate')).toLocaleString()}</p>`;
    } else if (plantContainer) {
        plantContainer.innerHTML = '<p class="error">Unable to load plants. Please check your connection.</p>';
    }
}

function displayPlants(plants) {
    if (!plantContainer) return;
    
    plantContainer.innerHTML = plants.slice(0, 15).map(plant => `
        <div class="plant-card">
            <img src="./images/${plant.image}" alt="${plant.name}" loading="lazy">
            <div class="plant-card-content">
                <h3>${plant.name}</h3>
                <p><strong>Type:</strong> ${plant.type}</p>
                <p><strong>Care Level:</strong> ${plant.care}</p>
                <p><strong>Sunlight:</strong> ${plant.sunlight}</p>
                <button class="btn plant-details" data-id="${plant.id}">Details</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to all detail buttons
    document.querySelectorAll('.plant-details').forEach(button => {
        button.addEventListener('click', function() {
            const plantId = this.getAttribute('data-id');
            openPlantModal(plantId);
        });
    });
}

// ======================
// INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', () => {
    loadPlants();
    
    // Debugging check
    console.log('Plant modal functionality is ready');
});