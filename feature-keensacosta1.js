// feature-keensacosta1.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const cityInput = document.querySelector('#city');
  const weatherResult = document.querySelector('#weather-result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) {
      weatherResult.innerHTML = '<p>⚠️ Por favor ingresa una ciudad.</p>';
      return;
    }

    weatherResult.innerHTML = '<p>⏳ Buscando clima...</p>';

    try {
      // 1️⃣ Buscar coordenadas de la ciudad
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        weatherResult.innerHTML = '<p>❌ No se encontró esa ciudad.</p>';
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2️⃣ Obtener clima actual
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();
      const { temperature, windspeed, weathercode } = weatherData.current_weather;

      const weatherDesc = getWeatherDescription(weathercode);

      weatherResult.innerHTML = `
        <h2>🌤️ Clima en ${name}, ${country}</h2>
        <p><strong>Temperatura:</strong> ${temperature}°C</p>
        <p><strong>Viento:</strong> ${windspeed} km/h</p>
        <p><strong>Condición:</strong> ${weatherDesc}</p>
      `;
    } catch (error) {
      weatherResult.innerHTML = '<p>⚠️ Error al obtener el clima.</p>';
      console.error(error);
    }
  });

  // Función auxiliar para traducir códigos del clima
  function getWeatherDescription(code) {
    const descriptions = {
      0: 'Cielo despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia fuerte',
      71: 'Nieve ligera',
      73: 'Nieve moderada',
      75: 'Nieve intensa',
      95: 'Tormenta eléctrica'
    };
    return descriptions[code] || 'Condición desconocida';
  }
});
