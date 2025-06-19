// DOM Elements
const plantContainer = document.getElementById('plantContainer');
const blogPostsContainer = document.getElementById('blogPosts');
const seasonalTipsContainer = document.getElementById('seasonalTips');

// ======================
// PLANT MODAL FUNCTIONALITY
// ======================

window.openPlantModal = async function(plantId) {
    try {
        const response = await fetch('./data/plants.json');
        if (!response.ok) throw new Error('Failed to load plant data');

        const data = await response.json();
        const plant = data.plants.find(p => p.id == plantId);

        if (!plant) throw new Error('Plant not found');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="close-modal" aria-label="Close modal">&times;</button>
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
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
        modal.querySelector('.save-plant')?.addEventListener('click', () => saveToFavorites(plant));

    } catch (error) {
        alert('Error loading plant details. Please try again.');
    }
};

function closeModal() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
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
            alert(`${plant.name} is already in your favorites!`);
        }
    } catch (error) {
        // Silenciado para produção
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

        localStorage.setItem('cachedPlants', JSON.stringify(data.plants));
        localStorage.setItem('lastPlantUpdate', new Date().toISOString());

    } catch (error) {
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

    document.querySelectorAll('.plant-details').forEach(button => {
        button.addEventListener('click', function() {
            const plantId = this.getAttribute('data-id');
            openPlantModal(plantId);
        });
    });
}

// ======================
// BLOG FUNCTIONS
// ======================

async function loadBlogPosts() {
    try {
        const response = await fetch('./data/blog.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        displayBlogPosts(data.posts);

    } catch (error) {
        if (blogPostsContainer) {
            blogPostsContainer.innerHTML = '<p class="error">Unable to load blog posts.</p>';
        }
    }
}

function displayBlogPosts(posts) {
    if (!blogPostsContainer) return;

    blogPostsContainer.innerHTML = posts.map(post => `
        <div class="blog-post">
            <img src="./images/${post.image}" alt="${post.title}" loading="lazy">
            <div class="blog-post-content">
                <h4>${post.title}</h4>
                <p>${post.excerpt}</p>
                <button class="btn read-more" data-id="${post.id}">Read More</button>
            </div>
        </div>
    `).join('');
}

// ======================
// SEASONAL TIPS
// ======================

function loadSeasonalTips() {
    if (!seasonalTipsContainer) return;

    const currentMonth = new Date().getMonth();
    const season = getCurrentSeason(currentMonth);

    seasonalTipsContainer.innerHTML = `
        <div class="tip-card">
            <h4>${season} Gardening Tips</h4>
            <ul>
                ${getSeasonalTips(season).map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
}

function getCurrentSeason(month) {
    return [
        [11, 0, 1, 'Winter'],
        [2, 3, 4, 'Spring'],
        [5, 6, 7, 'Summer'],
        [8, 9, 10, 'Fall']
    ].find(season => season.includes(month))[3] || 'Seasonal';
}

function getSeasonalTips(season) {
    const tips = {
        Winter: [
            "Protect sensitive plants from frost",
            "Plan your spring garden layout",
            "Prune dormant trees and shrubs"
        ],
        Spring: [
            "Start seeds indoors for summer veggies",
            "Prepare soil with compost",
            "Divide perennials before new growth"
        ],
        Summer: [
            "Water deeply in the morning",
            "Mulch to retain moisture",
            "Watch for pests and diseases"
        ],
        Fall: [
            "Plant spring-blooming bulbs",
            "Clean up fallen leaves",
            "Winterize your irrigation system"
        ]
    };
    return tips[season] || ["Check back for seasonal gardening advice!"];
}

// ======================
// MOBILE MENU
// ======================

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        const nav = document.querySelector('nav ul');
        nav.classList.toggle('active');
        hamburger.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });
}

// ======================
// INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    loadPlants();
    loadBlogPosts();
    loadSeasonalTips();
});
