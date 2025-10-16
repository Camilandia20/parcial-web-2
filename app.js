const API_KEY = 'e8067b53';
const btnBuscar = document.getElementById('btnBuscar');
const inputBusqueda = document.getElementById('busqueda');
const listaPeliculas = document.getElementById('peliculas');
const errorDiv = document.getElementById('error');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
  
const traduccionesGenero = {
    "Action": "Acción",
    "Drama": "Drama",
    "Comedy": "Comedia",
    "Thriller": "Suspenso",
    "Horror": "Terror",
    "Romance": "Romance",
    "Adventure": "Aventura",
    "Animation": "Animación",
    "Sci-Fi": "Ciencia ficción",
    "Fantasy": "Fantasía",
    "Documentary": "Documental",
    "Crime": "Crimen",
    "Mystery": "Misterio",
    "Biography": "Biografía",
    "Family": "Familiar",
    "History": "Historia",
    "Music": "Música",
    "War": "Guerra",
    "Western": "Occidental"
};

inputBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarPeliculas();
    }
});

btnBuscar.addEventListener('click', buscarPeliculas);

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

async function buscarPeliculas() {
    const termino = inputBusqueda.value.trim();
    if (!termino) return;

    btnBuscar.disabled = true;
    btnBuscar.textContent = 'Buscando...';
    errorDiv.style.display = 'none';
    listaPeliculas.innerHTML = '';

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${termino}`);
        const data = await response.json();

        if (data.Response === 'True') {
            mostrarPeliculas(data.Search);
        } else {
            let mensaje = 'No se encontraron resultados.';
            if (data.Error === 'Movie not found!') {
                mensaje = 'No se encontraron películas con ese título.';
            } else if (data.Error === 'Too many results.') {
                mensaje = 'Demasiados resultados. Por favor, especifica más tu búsqueda.';
            } else if (data.Error === 'Incorrect IMDb ID.') {
                mensaje = 'ID de película incorrecto.';
            } else if (data.Error === 'Invalid API key!') {
                mensaje = 'Clave de API inválida.';
            } else if (data.Error === 'Something went wrong.') {
                mensaje = 'Algo salió mal. Intenta de nuevo.';
            }

            errorDiv.textContent = mensaje;
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Error al conectar con la API';
        errorDiv.style.display = 'block';
        console.error('Error:', error);
    } finally {
        btnBuscar.disabled = false;
        btnBuscar.textContent = 'Buscar';
    }
}

function mostrarPeliculas(peliculas) {
    peliculas.forEach(pelicula => {
        const li = document.createElement('li');
        li.className = 'pelicula-card';
        li.innerHTML = `
            <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/200x280?text=Sin+Imagen'}" alt="${pelicula.Title}">
            <h3>${pelicula.Title}</h3>
            <p class="year">${pelicula.Year}</p>
        `;
        li.addEventListener('click', () => verDetalle(pelicula.imdbID));
        listaPeliculas.appendChild(li);
    });
}

async function verDetalle(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const pelicula = await response.json();

        if (pelicula.Response === 'True') {
            const generosTraducidos = pelicula.Genre.split(', ').map(g => {
                return `<span class="genre">${traduccionesGenero[g] || g}</span>`;
            }).join('');

            const sinopsis = pelicula.Plot !== 'N/A' ? pelicula.Plot : 'No disponible';
            const duracion = pelicula.Runtime !== 'N/A' ? pelicula.Runtime : 'No disponible';
            const director = pelicula.Director !== 'N/A' ? pelicula.Director : 'No disponible';
            const actores = pelicula.Actors !== 'N/A' ? pelicula.Actors : 'No disponible';
            const rating = pelicula.imdbRating !== 'N/A' ? `⭐ ${pelicula.imdbRating}/10` : 'No disponible';

            modalBody.innerHTML = `
                <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450?text=Sin+Imagen'}" alt="${pelicula.Title}" class="modal-poster">
                <div class="modal-info">
                    <h2>${pelicula.Title}</h2>
                    <div>${generosTraducidos}</div>
                    <p class="detail"><strong>Año:</strong> ${pelicula.Year}</p>
                    <p class="detail"><strong>Duración:</strong> ${duracion}</p>
                    <p class="detail"><strong>Director:</strong> ${director}</p>
                    <p class="detail"><strong>Calificación:</strong> ${rating}</p>
                    <p class="detail"><strong>Sinopsis:</strong></p>
                    <p class="plot">${sinopsis}</p>
                    <p class="detail"><strong>Actores:</strong> ${actores}</p>
                </div>
            `;
            modal.classList.add('active');
        }
    } catch (error) {
        console.error('Error al cargar detalles:', error);
    }
}
