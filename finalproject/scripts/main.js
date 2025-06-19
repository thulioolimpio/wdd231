// ======================
// MODAL FUNCTIONALITY (Unificada)
// ======================

// Cria a estrutura do modal uma única vez
function setupModals() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="close-modal" aria-label="Close modal">&times;</button>
            <div id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Fechar modal
    const closeModal = () => {
        document.querySelector('.modal').setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    };

    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

    // Delegação de eventos para toda a página
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('plant-details')) {
            const plantId = e.target.getAttribute('data-id');
            openPlantModal(plantId);
        }

        if (e.target.classList.contains('read-more')) {
            const postId = e.target.getAttribute('data-id');
            openBlogModal(postId);
        }
    });
}

// ======================
// PLANT FUNCTIONS
// ======================

async function openPlantModal(plantId) {
    try {
        const modal = document.querySelector('.modal');
        const modalBody = document.getElementById('modalBody');
        const response = await fetch('./data/plants.json');

        if (!response.ok) throw new Error('Failed to load plant data');

        const data = await response.json();
        const plant = data.plants.find(p => p.id == plantId);

        if (plant) {
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

            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.querySelector('.close-modal').focus();

            // Adiciona evento para o botão de favoritos
            document.querySelector('.save-plant')?.addEventListener('click', () => {
                saveToFavorites(plant);
            });
        }
    } catch (error) {
        console.error('Error loading plant:', error);
        document.getElementById('modalBody').innerHTML = 
            '<p class="error">Unable to load plant details. Please try again later.</p>';
    }
}

async function loadPlants() {
    const plantContainer = document.getElementById('plantContainer');
    if (!plantContainer) return;

    try {
        const response = await fetch('./data/plants.json');
        if (!response.ok) throw new Error();

        const data = await response.json();
        displayPlants(data.plants);
        localStorage.setItem('cachedPlants', JSON.stringify(data.plants));
        localStorage.setItem('lastPlantUpdate', new Date().toISOString());
    } catch {
        loadCachedPlants();
    }
}

function loadCachedPlants() {
    const plantContainer = document.getElementById('plantContainer');
    const cachedPlants = localStorage.getItem('cachedPlants');
    
    if (cachedPlants && plantContainer) {
        displayPlants(JSON.parse(cachedPlants));
        plantContainer.innerHTML += `<p class="cache-notice">Showing cached data from ${new Date(localStorage.getItem('lastPlantUpdate')).toLocaleString()}</p>`;
    } else if (plantContainer) {
        plantContainer.innerHTML = '<p class="error">Unable to load plants. Please check your connection.</p>';
    }
}

function displayPlants(plants) {
    const plantContainer = document.getElementById('plantContainer');
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
}

// ======================
// BLOG FUNCTIONS
// ======================

async function openBlogModal(postId) {
    try {
        const modal = document.querySelector('.modal');
        const modalBody = document.getElementById('modalBody');
        const response = await fetch('./data/blog.json');

        if (!response.ok) throw new Error('Failed to load blog data');

        const data = await response.json();
        const post = data.posts.find(p => p.id == postId);

        if (post) {
            modalBody.innerHTML = `
                <h2>${post.title}</h2>
                <p class="post-date">Posted on ${new Date(post.date || Date.now()).toLocaleDateString()}</p>
                <img src="./images/${post.image}" alt="${post.title}" loading="lazy">
                <div class="post-content">
                    ${post.content || '<p>Content not available.</p>'}
                </div>
                <button class="btn close-btn">Close</button>
            `;

            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.querySelector('.close-btn').focus();

            document.querySelector('.close-btn')?.addEventListener('click', () => {
                document.querySelector('.modal').setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            });
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('modalBody').innerHTML = 
            '<p class="error">Unable to load blog post. Please try again later.</p>';
    }
}

async function loadBlogPosts() {
    const blogPostsContainer = document.getElementById('blogPosts');
    if (!blogPostsContainer) return;

    try {
        const response = await fetch('./data/blog.json');
        if (!response.ok) throw new Error();

        const data = await response.json();
        displayBlogPosts(data.posts);
    } catch {
        blogPostsContainer.innerHTML = '<p class="error">Unable to load blog posts.</p>';
    }
}

function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPosts');
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
    const seasonalTipsContainer = document.getElementById('seasonalTips');
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
// FAVORITES FUNCTION
// ======================

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
        console.error('Error saving favorites:', error);
    }
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
// FORM CONFIRMATION
// ======================

function displayFormConfirmation() {
    const formDataDisplay = document.getElementById('formDataDisplay');
    if (!formDataDisplay) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const formData = {};
    
    urlParams.forEach((value, key) => {
        formData[key] = value;
    });
    
    localStorage.setItem('lastFormSubmission', JSON.stringify({
        data: formData,
        timestamp: new Date().toISOString()
    }));
    
    let html = '<div class="submission-details"><h3>Your Submission</h3><ul>';
    
    urlParams.forEach((value, key) => {
        if (value.trim() !== '') {
            html += `<li><strong>${formatKey(key)}:</strong> ${formatValue(value, key)}</li>`;
        }
    });
    
    html += '</ul></div><p>We will contact you shortly to confirm your appointment.</p>';
    formDataDisplay.innerHTML = html;
}

function formatKey(key) {
    return key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatValue(value, key) {
    if (key === 'date') {
        return new Date(value).toLocaleDateString();
    }
    return value;
}

// ======================
// INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    setupMobileMenu();
    loadPlants();
    loadBlogPosts();
    loadSeasonalTips();
    displayFormConfirmation();
});