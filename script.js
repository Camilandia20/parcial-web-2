const apiKey = "0966774bb19c2e62d9e87d07f30974c3";

document.getElementById("btnBuscar").addEventListener("click", consultarClima);

async function consultarClima() {
  const ciudad = document.getElementById("ciudad").value.trim();
  const resultado = document.getElementById("resultado");

  if (!ciudad) {
    resultado.innerHTML = '<div class="error">⚠️ Escribe una ciudad.</div>';
    return;
  }

  try {
    resultado.innerHTML = "⏳ Consultando...";
    const respuesta = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
    );

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        resultado.innerHTML = '<div class="error">❌ Ciudad no encontrada.</div>';
      } else {
        resultado.innerHTML = '<div class="error">⚠️ Error al obtener los datos.</div>';
      }
      return;
    }

    const datos = await respuesta.json();
    const nombre = datos.name;
    const temp = datos.main.temp.toFixed(1);
    const descripcion = datos.weather[0].description;
    const icono = datos.weather[0].icon;

    resultado.innerHTML = `
      <h2>${nombre}</h2>
      <img class="icono-clima" src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="Clima">
      <p><strong>Temperatura:</strong> ${temp}°C</p>
      <p><strong>Condición:</strong> ${descripcion}</p>
    `;
  } catch (error) {
    resultado.innerHTML = '<div class="error">🌐 No hay conexión a internet.</div>';
  }
}

