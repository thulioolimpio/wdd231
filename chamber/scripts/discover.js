document.addEventListener('DOMContentLoaded', function() {
    // Load discovery data and render cards
    fetch('data/discovery.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('discovery-grid');
            
            data.locations.forEach((location, index) => {
                const card = document.createElement('article');
                card.className = 'discovery-card';
                card.id = `card${index + 1}`;
                
                card.innerHTML = `
                    <h2>${location.name}</h2>
                    <figure>
                        <img src="${location.image}" alt="${location.name}" loading="lazy">
                    </figure>
                    <address>${location.address}</address>
                    <p>${location.description}</p>
                    <a href="#" class="learn-more">Learn More</a>
                `;
                
                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading discovery data:', error));
    
    // Handle visit message
    const visitMessage = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();
    
    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions about Brazil.";
    } else {
        const daysSinceLastVisit = Math.floor((currentDate - lastVisit) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastVisit < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = daysSinceLastVisit === 1 ? "day" : "days";
            visitMessage.textContent = `You last visited ${daysSinceLastVisit} ${dayText} ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentDate);
    
    // Update copyright year and last modified date
    const now = new Date();
    document.getElementById('copyright-year').textContent = now.getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
    
    // Mobile menu functionality
    const menuButton = document.getElementById('menu-button');
    const navigation = document.getElementById('navigation');
    
    menuButton.addEventListener('click', function() {
        navigation.classList.toggle('show');
    });
});