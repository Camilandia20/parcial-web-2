document.getElementById("cargar").addEventListener("click", async () => {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = ""; 

    let nombre = document.getElementById("buscar").value.trim();
    let region = document.getElementById("region").value;

    let url = "https://restcountries.com/v3.1/all";

    if (nombre) {
        url = `https://restcountries.com/v3.1/name/${nombre}`;
    } else if (region) {
        url = `https://restcountries.com/v3.1/region/${region}`;
    }

    try {
        let respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("No se encontraron resultados");
        let paises = await respuesta.json();

    if (paises.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados 😢</p>";
        return;
    }

    for (let pais of paises) {
        let div = document.createElement("div");
        div.classList.add("card");

        let img = document.createElement("img");
        img.src = pais.flags?.png || "";
        img.alt = pais.name?.common || "Bandera";

        let nombre = document.createElement("h3");
        nombre.textContent = pais.name?.common || "Sin nombre";

        let region = document.createElement("p");
        region.textContent = "Región: " + (pais.region || "Desconocida");

        let poblacion = document.createElement("p");
        poblacion.textContent = "Población: " + (pais.population?.toLocaleString() || "N/A");

        div.appendChild(img);
        div.appendChild(nombre);
        div.appendChild(region);
        div.appendChild(poblacion);

        contenedor.appendChild(div);
    }

    } catch (error) {
        contenedor.innerHTML = "<p style='color:red;'>No se encontraron países 😢</p>";
    }
});
