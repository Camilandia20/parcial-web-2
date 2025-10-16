document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("buscar");
  const input = document.getElementById("city");
  const resultado = document.getElementById("resultado");

  boton.addEventListener("click", async () => {
    const ciudad = input.value.trim();
    if (ciudad === "") {
      resultado.innerHTML = "<p>Por favor escribe una ciudad.</p>";
      return;
    }

    const apiKey = "998ff7d2ec723071f9dc2c0096087d78"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},CO&appid=${apiKey}&units=metric&lang=es`;

    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("Ciudad no encontrada");

      const datos = await respuesta.json();

      const nombre = datos.name;
      const temp = datos.main.temp;
      const desc = datos.weather[0].description;
      const icono = datos.weather[0].icon;
      const humedad = datos.main.humidity;

      resultado.innerHTML = `
        <h2>${nombre}</h2>
        <p>🌡️ Temperatura: ${temp} °C</p>
        <p>💧 Humedad: ${humedad}%</p>
        <p>☁️ Clima: ${desc}</p>
        <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="icono del clima">
      `;
    } catch (error) {
      resultado.innerHTML = "<p>No se pudo obtener el clima. Intenta de nuevo.</p>";
    }
  });
});
