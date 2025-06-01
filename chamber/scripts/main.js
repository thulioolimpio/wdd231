// Menu Mobile
document.getElementById('menu-button').addEventListener('click', () => {
    const nav = document.getElementById('navigation');
    nav.classList.toggle('show');
});

// Atualiza footer
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
});