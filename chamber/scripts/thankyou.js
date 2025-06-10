document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Display submitted information
    const confirmationDiv = document.getElementById('confirmation-details');
    
    if (urlParams.has('firstName')) {
        confirmationDiv.innerHTML = `
            <p><strong>Name:</strong> ${urlParams.get('firstName')} ${urlParams.get('lastName')}</p>
            <p><strong>Email:</strong> ${urlParams.get('email')}</p>
            <p><strong>Phone:</strong> ${urlParams.get('phone')}</p>
            <p><strong>Business Name:</strong> ${urlParams.get('businessName')}</p>
            <p><strong>Membership Level:</strong> ${getMembershipLevel(urlParams.get('membership'))}</p>
            <p><strong>Application Date:</strong> ${formatDate(urlParams.get('timestamp'))}</p>
        `;
    } else {
        confirmationDiv.innerHTML = '<p>No submission data found. Please complete the <a href="join.html">membership form</a>.</p>';
    }
    
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

function getMembershipLevel(level) {
    switch(level) {
        case 'np': return 'NP Membership (Non-Profit)';
        case 'bronze': return 'Bronze Membership';
        case 'silver': return 'Silver Membership';
        case 'gold': return 'Gold Membership';
        default: return 'Not specified';
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}