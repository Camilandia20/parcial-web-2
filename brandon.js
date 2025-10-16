document.getElementById('searchBtn').addEventListener('click', buscarArtista);

async function buscarArtista() {
  const artistName = document.getElementById('artistInput').value.trim();
  const artistInfo = document.getElementById('artistInfo');
  const albumsDiv = document.getElementById('albums');

  artistInfo.innerHTML = '';
  albumsDiv.innerHTML = '';

  if (!artistName) {
    artistInfo.innerHTML = '<p class="error">Por favor, escribe un nombre de artista.</p>';
    return;
  }

  try {
   
    const artistRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist`);
    const artistData = await artistRes.json();

    if (!artistData.results.length) {
      artistInfo.innerHTML = '<p class="error">No se encontró el artista 😢</p>';
      return;
    }

    const artist = artistData.results[0];

    artistInfo.innerHTML = `
      <h2>${artist.artistName}</h2>
      <p><strong>Género:</strong> ${artist.primaryGenreName || 'Desconocido'}</p>
      <p><strong>País:</strong> ${artist.country || 'No disponible'}</p>
      <img src="${artist.artworkUrl100?.replace('100x100', '400x400') || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}" alt="Imagen del artista">
    `;

   
    const albumsRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=album`);
    const albumsData = await albumsRes.json();

    if (albumsData.results.length) {
      albumsDiv.innerHTML = '<h3>Álbumes</h3>';
      albumsData.results.forEach(album => {
        albumsDiv.innerHTML += `
          <div class="album-card">
            <img src="${album.artworkUrl100?.replace('100x100', '300x300')}" alt="${album.collectionName}">
            <p><strong>${album.collectionName}</strong></p>
            <p>${album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Año desconocido'}</p>
          </div>
        `;
      });
    } else {
      albumsDiv.innerHTML = '<p>No se encontraron álbumes.</p>';
    }
  } catch (error) {
    artistInfo.innerHTML = '<p class="error">Error al consultar la API.</p>';
    console.error(error);
  }
}


