// Modal functionality
function setupModals() {
    // Create modal structure
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" aria-label="Close modal">&times;</button>
            <div id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal handlers
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

    // Delegated event listeners for dynamic content
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

// Open plant details modal
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
            
            // Set focus for accessibility
            modal.setAttribute('aria-hidden', 'false');
            document.querySelector('.close-modal').focus();
            
            // Add to favorites functionality
            document.querySelector('.save-plant')?.addEventListener('click', () => {
                saveToFavorites(plant);
            });
        } else {
            modalBody.innerHTML = '<p>Plant information not found</p>';
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Error loading plant details:', error);
        document.getElementById('modalBody').innerHTML = 
            '<p class="error">Unable to load plant details. Please try again later.</p>';
    }
}

// Open blog post modal
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
                    ${post.content || '<p>Full article content would appear here in a complete implementation.</p>'}
                </div>
                <button class="btn close-btn">Close</button>
            `;
            
            // Set focus for accessibility
            modal.setAttribute('aria-hidden', 'false');
            document.querySelector('.close-btn').focus();
            
            document.querySelector('.close-btn')?.addEventListener('click', closeModal);
        } else {
            modalBody.innerHTML = '<p>Blog post not found</p>';
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('modalBody').innerHTML = 
            '<p class="error">Unable to load blog post. Please try again later.</p>';
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    
    // Return focus to the button that opened the modal
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.classList.contains('plant-details') || activeElement.classList.contains('read-more'))) {
        activeElement.focus();
    }
}

// Save plant to favorites (CORRIGIDO)
function saveToFavorites(plant) {
    let favorites = JSON.parse(localStorage.getItem('favoritePlants') || '[]');
    favorites = JSON.parse(favorites); // Parse the string if it exists
    
    if (!Array.isArray(favorites)) {
        favorites = [];
    }
    
    if (!favorites.some(fav => fav.id === plant.id)) {
        favorites.push(plant);
        localStorage.setItem('favoritePlants', JSON.stringify(favorites));
        alert(`${plant.name} has been added to your favorites!`);
    } else {
        alert(`${plant.name} is already in your favorites!`);
    }
}

// Initialize modals when DOM loads
document.addEventListener('DOMContentLoaded', setupModals);