document.getElementById("buscar").addEventListener("click", async () => {
  const artistaInput = document.getElementById("artista");
  const nombreArtista = artistaInput.value.trim();
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "";

  if (!nombreArtista) {
    alert("Por favor, escribe el nombre de un artista.");
    return;
  }

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const apiBase = "https://theaudiodb.com/api/v1/json/2";

  const urlArtista = `${proxy}${apiBase}/search.php?s=${encodeURIComponent(nombreArtista)}`;

  try {
    const respuesta = await fetch(urlArtista);
    const data = await respuesta.json();

    if (!data.artists) {
      resultado.innerHTML = `<p class="error">No se encontró el artista "<strong>${nombreArtista}</strong>".</p>`;
      return;
    }

    const artista = data.artists[0];

    const urlAlbumes = `${proxy}${apiBase}/album.php?i=${artista.idArtist}`;
    const respuestaAlbumes = await fetch(urlAlbumes);
    const dataAlbumes = await respuestaAlbumes.json();

    const albumes = dataAlbumes.album || [];

    const card = document.createElement("div");
    card.classList.add("card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    if (artista.strArtistThumb) {
      const img = document.createElement("img");
      img.src = artista.strArtistThumb;
      img.alt = artista.strArtist;
      cardHeader.appendChild(img);
    }

    const info = document.createElement("div");
    info.classList.add("info");

    const nombre = document.createElement("h2");
    nombre.textContent = artista.strArtist;
    info.appendChild(nombre);

    const paisGenero = document.createElement("p");
    paisGenero.innerHTML = `<strong>País:</strong> ${artista.strCountry || "Desconocido"} | <strong>Género:</strong> ${artista.strGenre || "Desconocido"}`;
    info.appendChild(paisGenero);

    cardHeader.appendChild(info);
    card.appendChild(cardHeader);

    const albumsSection = document.createElement("div");
    albumsSection.classList.add("albums");

    const tituloAlbums = document.createElement("h3");
    tituloAlbums.textContent = "Álbumes:";
    albumsSection.appendChild(tituloAlbums);

if (albumes.length > 0) {
  const albumsGrid = document.createElement("div");
  albumsGrid.classList.add("albums-grid");

  albumes.forEach(album => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");

    if (album.strAlbumThumb) {
      const img = document.createElement("img");
      img.src = album.strAlbumThumb;
      img.alt = album.strAlbum;
      albumCard.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.classList.add("album-placeholder");
      placeholder.textContent = "No image";
      albumCard.appendChild(placeholder);
    }

    const albumName = document.createElement("h4");
    albumName.textContent = album.strAlbum;
    albumCard.appendChild(albumName);

    const albumYear = document.createElement("p");
    albumYear.textContent = `Año: ${album.intYearReleased || "Desconocido"}`;
    albumCard.appendChild(albumYear);

    albumsGrid.appendChild(albumCard);
  });

    albumsSection.appendChild(albumsGrid);
    } else {
    const noAlbumsMsg = document.createElement("p");
    noAlbumsMsg.textContent = "No se encontraron álbumes.";
    albumsSection.appendChild(noAlbumsMsg);
    }


    card.appendChild(albumsSection);
    resultado.appendChild(card);

  } catch (error) {
    resultado.innerHTML = `<p class="error">Error al buscar el artista. Intenta más tarde.</p>`;
    console.error(error);
  }
});
