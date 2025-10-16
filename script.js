const contenedor = document.getElementById("contenedor");
const buscar = document.getElementById("buscar");
const buscarBtn = document.getElementById("buscarBtn");
const region = document.getElementById("region");
const mensaje = document.getElementById("mensaje");

let paises = [];


async function cargarPaises() {
  try {
    mensaje.textContent = "⏳ Cargando países...";
    const respuesta = await fetch("https://restcountries.com/v3.1/all");
    if (!respuesta.ok) throw new Error("API no respondió");
    const datos = await respuesta.json();
    paises = datos.sort((a, b) => (a.name?.common || "").localeCompare(b.name?.common || ""));
    mostrarPaises(paises);
    mensaje.textContent = `Se cargaron ${paises.length} países.`;
  } catch (error) {
    console.error("Error al cargar países:", error);
    mensaje.textContent = "Error al cargar países. ";
  }
}

function mostrarPaises(lista) {
  contenedor.innerHTML = "";
  if (!lista || lista.length === 0) {
    mensaje.textContent = "No se encontro el pais.";
    return;
  }
  mensaje.textContent = `Mostrando ${lista.length} país(es).`;
  lista.forEach(pais => {
    const nombre = pais.name?.common || "Desconocido";
    const regionTexto = pais.region || "No disponible";
    const poblacion = pais.population ? pais.population.toLocaleString() : "No disponible";
    const bandera = pais.flags?.svg || pais.flags?.png || "";

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.innerHTML = `
      ${bandera ? `<img src="${bandera}" alt="Bandera de ${nombre}">` : `<div style="height:100px;display:flex;align-items:center;justify-content:center;"><small>Sin bandera</small></div>`}
      <h3>${nombre}</h3>
      <p> Región: ${regionTexto}</p>
      <p>Población: ${poblacion}</p>
    `;
    contenedor.appendChild(tarjeta);
  });
}


function filtrarLocal(texto, filtroRegion) {
  const t = (texto || "").toLowerCase().trim();
  const resultado = paises.filter(pais => {
    const nombre = pais.name?.common?.toLowerCase() || "";
    const coincideNombre = nombre.includes(t);
    const coincideRegion = !filtroRegion || pais.region === filtroRegion;
    return coincideNombre && coincideRegion;
  });
  return resultado;
}


async function buscarAlPresionar() {
  const texto = buscar.value.trim();
  const filtroRegion = region.value;

  
  if (texto === "") {
    const lista = filtroRegion ? paises.filter(p => p.region === filtroRegion) : paises;
    mostrarPaises(lista);
    return;
  }

 
  try {
    mensaje.textContent = `🔎 Buscando "${texto}" en la API...`;
    const respuesta = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(texto)}`);
    if (!respuesta.ok) {
      
      throw new Error("No se encuantra en nuestros servidos");
    }
    const datos = await respuesta.json();

    
    const filtrados = filtroRegion ? datos.filter(p => p.region === filtroRegion) : datos;
    mostrarPaises(filtrados);
  } catch (error) {
    console.warn("En la busqueda de nuestro servidos no se encontro este pais ", error);
    
    mostrarPaises(local);
  }
}


buscarBtn.addEventListener("click", buscarAlPresionar);


buscar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarBtn.click();
  }
});


region.addEventListener("change", () => {

  if (buscar.value.trim() !== "") {
    buscarAlPresionar();
  } else {
    const filtro = region.value;
    const lista = filtro ? paises.filter(p => p.region === filtro) : paises;
    mostrarPaises(lista);
  }
});

cargarPaises();
