
const API_KEY = '803f8dad';
const API_URL = 'https://www.omdbapi.com/';

const qInput = document.getElementById('q');
const btnSearch = document.getElementById('btnSearch');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

const overlay = document.getElementById('overlay');
const closeModalBtn = document.getElementById('closeModal');
const modalPoster = document.getElementById('modalPoster');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalPlot = document.getElementById('modalPlot');

function setStatus(text, isError = false) {
    statusEl.textContent = text;
    statusEl.style.color = isError ? 'crimson' : '';
}

function placeholderPoster() {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' 
    fill='#eef2f7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-size='18'>No poster</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}


async function searchMovies(q) {
    resultsEl.innerHTML = '';
    setStatus('Buscando...');
    try {
        const resp = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(q)}&type=movie`);
    if (!resp.ok) throw new Error('Error de red');
        const data = await resp.json();
    if (data.Response === 'False') {
        setStatus(data.Error || 'No se encontraron resultados', true);
    return;
    }
        renderResults(data.Search);
        setStatus(`Mostrando ${data.Search.length} resultados`);
} catch (err) {
    console.error(err);
    setStatus('Error al conectar con la API', true);
}
}

function renderResults(list) {
    resultsEl.innerHTML = '';
    list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    card.dataset.id = item.imdbID;


    const poster = (item.Poster && item.Poster !== 'N/A') ? `<img src="${item.Poster}" alt="">` : '';

    card.innerHTML = `
        <div class="poster">${poster}</div>
        <div class="title">${escapeHtml(item.Title)}</div>
        <div class="year">${escapeHtml(item.Year)}</div>
    `;

    card.addEventListener('click', () => showDetails(item.imdbID));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') showDetails(item.imdbID); });

    resultsEl.appendChild(card);
    });
}


function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

async function showDetails(imdbID) {
    try {
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        modalTitle.textContent = 'Cargando...';
        modalMeta.textContent = '';
    modalPlot.textContent = '';
    modalPoster.src = placeholderPoster();

    const resp = await fetch(`${API_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`);
    if (!resp.ok) throw new Error('Error de red');
    const data = await resp.json();
    if (data.Response === 'False') {
        modalTitle.textContent = 'No hay detalles';
        modalPlot.textContent = data.Error || '';
    return;
    }

    modalPoster.src = (data.Poster && data.Poster !== 'N/A') ? data.Poster : placeholderPoster();
    modalTitle.textContent = data.Title || '—';
    modalMeta.textContent = `${data.Genre || '—'} • Director: ${data.Director || '—'}`;
    modalPlot.textContent = data.Plot || 'Sin sinopsis disponible.';
    } catch (err) {
        console.error(err);
        modalTitle.textContent = 'Error';
        modalPlot.textContent = 'No se pudo cargar la información.';
    }
}


function closeModal() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


btnSearch.addEventListener('click', () => {
    const q = qInput.value.trim();
    if (!q) { setStatus('Escribe un título para buscar', true); return; }
    searchMovies(q);
});
qInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); btnSearch.click(); } });

setStatus('Listo — escribe un título y presiona Buscar.');
