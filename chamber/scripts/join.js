// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    document.getElementById('timestamp').value = now.toISOString();
    
    // Update copyright year and last modified date
    document.getElementById('copyright-year').textContent = now.getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
    
    // Mobile menu functionality
    const menuButton = document.getElementById('menu-button');
    const navigation = document.getElementById('navigation');
    
    menuButton.addEventListener('click', function() {
        navigation.classList.toggle('show');
    });
    
    // Modal functionality
    const modalButtons = document.querySelectorAll('.info-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});