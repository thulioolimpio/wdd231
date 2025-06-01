async function displayMemberSpotlights() {
  const spotlightContainer = document.getElementById('spotlight-container');
  
  try {
    // 1. Carrega os dados dos membros
    const members = await loadMembersData();
    
    // 2. Filtra e seleciona membros aleatoriamente
    const spotlights = selectRandomSpotlights(members);
    
    // 3. Exibe os cards na página
    renderSpotlightCards(spotlights);
    
  } catch (error) {
    showError(error, spotlightContainer);
  }
}

async function loadMembersData() {
  const response = await fetch('data/members.json');
  if (!response.ok) {
    throw new Error(`Failed to load members: ${response.status}`);
  }
  return await response.json();
}

function selectRandomSpotlights(members) {
  const eligibleMembers = members.filter(member => 
    ['gold', 'silver'].includes(member.membership.toLowerCase())
  );
  
  if (eligibleMembers.length === 0) {
    throw new Error('No Gold/Silver members found');
  }
  
  const count = Math.random() > 0.5 ? 2 : 3;
  return shuffleArray(eligibleMembers).slice(0, count);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderSpotlightCards(members) {
  const container = document.getElementById('spotlight-container');
  
  container.innerHTML = members.map(member => `
    <div class="spotlight-card">
      <div class="card-media">
        <img src="images/${member.image}" 
             alt="Logo ${member.name}"
             loading="lazy"
             onerror="this.classList.add('broken-image');this.src='images/placeholder.png'">
        <span class="membership-badge ${member.membership.toLowerCase()}">
          ${member.membership.toUpperCase()}
        </span>
      </div>
      <div class="card-content">
        <h3>${member.name}</h3>
        <p class="address"><i class="fas fa-map-marker-alt"></i> ${member.address}</p>
        <p class="phone"><i class="fas fa-phone"></i> ${member.phone}</p>
        <a href="${member.website}" target="_blank" class="website-link">
          <i class="fas fa-globe"></i> Visitar Site
        </a>
      </div>
    </div>
  `).join('');
}

function showError(error, container) {
  console.error('Spotlight error:', error);
  container.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Member spotlights unavailable</p>
      <small>${error.message}</small>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', displayMemberSpotlights);