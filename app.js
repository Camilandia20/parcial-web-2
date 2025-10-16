const API_KEY = "f458c986";
const BASE = "https://www.omdbapi.com/";

const $ = (s) => document.querySelector(s);

const q = $("#q"); 
const btn = $("#btn");
const statusBox = $("#status");
const grid = $("#grid");

const details = $("#details");
const dTitle = $("#d-title");
const dMeta = $("#d-meta");
const dPlot = $("#d-plot");

btn.addEventListener("click", buscar);
q.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscar();
});

q.value = "SuperMan";
buscar();

async function buscar() {
  const term = q.value.trim();

  if (!term) {
    statusBox.textContent = "Escribe un título.";
    return;
  }

  statusBox.textContent = "Buscando…";
  grid.innerHTML = "";
  details.hidden = true;

  try {
    const url = `${BASE}?apikey=${API_KEY}&type=movie&s=${encodeURIComponent(
      term
    )}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    if (data.Response === "False") {
      statusBox.textContent = data.Error || "Sin resultados";
      return;
    }

    statusBox.textContent = `Encontradas ${data.Search.length} películas`;
    render(data.Search);
  } catch (e) {
    statusBox.textContent = "Error al consultar la API. Intenta de nuevo.";
  }
}

function render(list) {
  grid.innerHTML = "";

  list.forEach((it) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img
        src="${it.Poster && it.Poster !== "N/A" ? it.Poster : ""}"
        alt="Póster"
        onerror="this.style.display='none'"
      />
      <div class="info">
        <h3 class="title">${it.Title}</h3>
        <p class="year">${it.Year}</p>
      </div>
    `;

    card.onclick = () => detalles(it.imdbID);
    grid.appendChild(card);
  });
}

async function detalles(id) {
  statusBox.textContent = "Cargando detalles…";

  try {
    const url = `${BASE}?apikey=${API_KEY}&i=${encodeURIComponent(
      id
    )}&plot=short`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const m = await res.json();

    if (m.Response === "False") {
      throw new Error(m.Error || "Sin detalles");
    }

    dTitle.textContent = `${m.Title} (${m.Year})`;
    dMeta.textContent = `${m.Genre} · Dir: ${m.Director}`;
    dPlot.textContent =
      m.Plot && m.Plot !== "N/A" ? m.Plot : "Sin sinopsis disponible.";

    details.hidden = false;
    statusBox.textContent = "";
  } catch (e) {
    statusBox.textContent = "No se cargaron los detalles.";
  }
}
