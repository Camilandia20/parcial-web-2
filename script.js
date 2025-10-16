const btnBuscar = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");

const API_KEY = "8e34cdbaa41204055b58b7058f4178b2"; 

btnBuscar.addEventListener("click", () => {
    const ciudad = document.getElementById("ciudad").value.trim();
    if (!ciudad) return alert("Por favor ingresa una ciudad");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`)
        .then(res => {
            if (!res.ok) throw new Error("Ciudad no encontrada");
            return res.json();
        })
        .then(data => {
            resultado.innerHTML = `
                <h2>${data.name}</h2>
                <p>Temperatura: ${data.main.temp}°C</p>
                <p>Clima: ${data.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Icono clima">
            `;
        })
        .catch(err => {
            resultado.innerHTML = `<p class="error">${err.message}</p>`;
        });
});
