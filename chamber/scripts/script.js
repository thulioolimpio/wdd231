// Load members from JSON
async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error loading members:', error);
        document.getElementById('member-container').innerHTML = 
            '<p>Não foi possível carregar as empresas. Por favor, tente novamente mais tarde.</p>';
    }
}

// Display members in the container
function displayMembers(members) {
    const container = document.getElementById('member-container');
    container.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}" loading="lazy">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visitar Site</a>
        `;
        container.appendChild(card);
    });
}

// Toggle between grid and list view
function setupViewToggle() {
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const container = document.getElementById('member-container');

    gridBtn.addEventListener('click', () => {
        container.className = 'grid-view';
        gridBtn.disabled = true;
        listBtn.disabled = false;
    });

    listBtn.addEventListener('click', () => {
        container.className = 'list-view';
        gridBtn.disabled = false;
        listBtn.disabled = true;
    });

    // Default to grid view
    gridBtn.disabled = true;
}

// Mobile menu functionality
function setupMobileMenu() {
    const menuBtn = document.getElementById('menu-button');
    const navList = document.getElementById('navigation');

    menuBtn.addEventListener('click', () => {
        navList.classList.toggle('show');
        menuBtn.setAttribute('aria-expanded', navList.classList.contains('show'));
    });

    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('show');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Update footer information
function updateFooter() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupViewToggle();
    setupMobileMenu();
    updateFooter();
    loadMembers();
});