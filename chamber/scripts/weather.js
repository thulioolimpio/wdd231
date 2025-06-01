// weather.js - Versão corrigida e melhorada
const apiKey = "76551188fe05a2ae2b9294f999892121"; // ▶️ Lembre-se de invalidar depois!
const city = "Recife,BR";

// Icones de fallback (útil se a API não responder)
const weatherIcons = {
  default: "images/weather-icons/default.png",
  error: "images/weather-icons/error.png"
};

async function fetchWeather() {
  const tempElement = document.getElementById("temperature");
  const descElement = document.getElementById("weather-desc");
  const iconElement = document.getElementById("weather-icon");

  try {
    // 1. Busca dados atuais
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    
    const data = await response.json();

    // 2. Atualiza a página
    tempElement.textContent = Math.round(data.main.temp);
    
    const description = data.weather[0].description;
    descElement.textContent = 
      description.charAt(0).toUpperCase() + 
      description.slice(1);
    
    // 3. Atualiza ícone com fallback seguro
    iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    iconElement.alt = `Ícone do clima: ${description}`;
    iconElement.onerror = () => {
      iconElement.src = weatherIcons.default;
    };

  } catch (error) {
    console.error("Erro ao buscar clima:", error);
    tempElement.textContent = "--";
    descElement.textContent = "Dados meteorológicos indisponíveis";
    iconElement.src = weatherIcons.error;
    iconElement.alt = "Ícone de erro de clima";
  }
}

// Inicia quando a página carrega
document.addEventListener("DOMContentLoaded", fetchWeather);

// Atualiza a cada 30 minutos (opcional)
setInterval(fetchWeather, 1800000);