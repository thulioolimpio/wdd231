
// weather.js - Versão corrigida
const apiKey = "76551188fe05a2ae2b9294f999892121"; // ▶️ SUA CHAVE AQUI (mas invalide essa depois!)
const city = "Recife,BR";

async function fetchWeather() {
  try {
    // 1. Dados atuais
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    // 2. Atualiza a página
    document.getElementById("temperature").textContent = Math.round(data.main.temp);
    document.getElementById("weather-desc").textContent = 
      data.weather[0].description.charAt(0).toUpperCase() + 
      data.weather[0].description.slice(1);
    
    document.getElementById("weather-icon").src = 
      `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  } catch (error) {
    console.error("Erro ao buscar clima:", error);
    document.getElementById("weather-desc").textContent = "Dados indisponíveis";
  }
}

// Inicia quando a página carrega
document.addEventListener("DOMContentLoaded", fetchWeather);