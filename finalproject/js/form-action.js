document.addEventListener('DOMContentLoaded', () => {
    const formDataDisplay = document.getElementById('formDataDisplay');
    if (!formDataDisplay) return;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Save form data to localStorage
    const formData = {};
    urlParams.forEach((value, key) => {
        formData[key] = value;
    });
    
    localStorage.setItem('lastFormSubmission', JSON.stringify({
        data: formData,
        timestamp: new Date().toISOString()
    }));
    
    // Display form data
    let html = '<div class="submission-details"><h3>Your Submission</h3><ul>';
    
    urlParams.forEach((value, key) => {
        if (value.trim() !== '') {
            html += `<li><strong>${formatKey(key)}:</strong> ${formatValue(value, key)}</li>`;
        }
    });
    
    html += '</ul></div>';
    html += '<p>We will contact you shortly to confirm your appointment.</p>';
    formDataDisplay.innerHTML = html;
});

// Format form keys for display
function formatKey(key) {
    return key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Format form values for display
function formatValue(value, key) {
    if (key === 'date') {
        return new Date(value).toLocaleDateString();
    }
    return value;
}