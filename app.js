const API_KEY = "f4b9f76c0e77c098ff1cd06df816c1be"; 

const form = document.getElementById("weather-form");
const input = document.getElementById("city");
const statusEl = document.getElementById("status");
const btn = document.getElementById("search-btn");

const resultsList = document.getElementById("results-list");
const clearAllBtn = document.getElementById("clear-all");

const STORAGE_KEY = "weatherHistory";

function setStatus(msg, type = "") {
  statusEl.textContent = msg || "";
  statusEl.className = "status" + (type ? ` ${type}` : "");
}

function setLoading(isLoading) {
  btn.disabled = isLoading;
  input.disabled = isLoading;
  setStatus(isLoading ? "Consultando clima..." : "");
}

function fetchWithTimeout(url, ms = 9000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
}

function formatDate(ts = Date.now()) {
  const d = new Date(ts);
  return d.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short"
  });
}


function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function createResultCard(item) {
  const { id, name, temp, desc, icon, ts } = item;

  const article = document.createElement("article");
  article.className = "result-pill";
  article.setAttribute("data-id", id);


  const main = document.createElement("div");
  main.className = "result-main";

  const cityRow = document.createElement("div");
  cityRow.className = "city-row";

  const cityEl = document.createElement("h3");
  cityEl.className = "city";
  cityEl.textContent = name;

  const timeBadge = document.createElement("span");
  timeBadge.className = "badge-time";
  timeBadge.textContent = formatDate(ts);

  cityRow.appendChild(cityEl);
  cityRow.appendChild(timeBadge);

  const tempEl = document.createElement("p");
  tempEl.className = "temp";
  tempEl.innerHTML = `${Math.round(temp)}°C`;

  const descEl = document.createElement("p");
  descEl.className = "desc";
  descEl.textContent = desc;

  main.appendChild(cityRow);
  main.appendChild(tempEl);
  main.appendChild(descEl);

  const side = document.createElement("div");
  side.className = "result-side";

  const img = document.createElement("img");
  img.className = "icon";
  img.alt = desc ? `Clima: ${desc}` : "Ícono del clima";
  img.src = icon ? `https://openweathermap.org/img/wn/${icon}@4x.png` : "";
  img.onerror = () => (img.src = "");

  const del = document.createElement("button");
  del.className = "btn-delete";
  del.type = "button";
  del.setAttribute("aria-label", `Borrar ${name}`);
  del.textContent = "Borrar";

  side.appendChild(img);
  side.appendChild(del);

  article.appendChild(main);
  article.appendChild(side);

  return article;
}


function renderList() {
  const history = loadHistory();
  resultsList.innerHTML = "";
  history.forEach(item => {
    const card = createResultCard(item);
    resultsList.appendChild(card);
  });
  clearAllBtn.disabled = history.length === 0;
}

function addResultToList(data) {
  const w = data.weather?.[0] ?? {};
  const item = {
    id: crypto.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2),
    name: data.name ?? "Ciudad",
    temp: data.main?.temp ?? 0,
    desc: w.description ?? "",
    icon: w.icon ?? "01d",
    ts: Date.now()
  };

  const card = createResultCard(item);
  resultsList.prepend(card);

  const history = loadHistory();
  history.unshift(item);
  saveHistory(history);

  clearAllBtn.disabled = false;
}

function deleteById(id) {
  const history = loadHistory().filter(it => it.id !== id);
  saveHistory(history);

  const el = resultsList.querySelector(`[data-id="${id}"]`);
  if (el) el.remove();

  if (history.length === 0) clearAllBtn.disabled = true;
}

function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
  resultsList.innerHTML = "";
  clearAllBtn.disabled = true;
  setStatus("Datos de Busqueda eliminados", "ok");
}

async function getWeatherByCity(city) {
  if (!API_KEY || API_KEY === "PON_AQUI_TU_API_KEY") {
    setStatus("Debes configurar tu API Key en app.js", "warn");
    return;
  }

  const q = encodeURIComponent(city.trim());
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    setLoading(true);
    const resp = await fetchWithTimeout(url);

    if (!resp.ok) {
      if (resp.status === 404) {
        setStatus("La ciudad no existe. Revisa la ortografía.", "err");
        return;
      }
      throw new Error(`HTTP ${resp.status}`);
    }

    const data = await resp.json();
    addResultToList(data);
    setStatus("Resultado agregado a la lista", "ok");

    localStorage.setItem("lastCity", city.trim());
  } catch (err) {
    if (err.name === "AbortError") {
      setStatus("Sin respuesta.", "err");
    } else {
      setStatus("No hay conexión", "err");
    }
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) {
    setStatus("Escribe una ciudad para buscar.", "warn");
    return;
  }
  getWeatherByCity(city);
});

resultsList.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-delete");
  if (!btn) return;
  const card = btn.closest(".result-pill");
  const id = card?.getAttribute("data-id");
  if (id) deleteById(id);
});

clearAllBtn.addEventListener("click", clearAll);

window.addEventListener("online", () => setStatus("Conectado", "ok"));
window.addEventListener("offline", () => {
  setStatus("Sin conexión a Internet", "err");
  btn.disabled = true;
  input.disabled = false;
});

(function init() {
  const last = localStorage.getItem("lastCity");
  if (last) input.value = last;

  if (navigator.onLine) {
    btn.disabled = false;
  } else {
    setStatus("Estás offline. Conéctate para consultar.", "err");
    btn.disabled = true;
  }

  renderList();
})();

