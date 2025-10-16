

document.getElementById("buscar").onclick = async () => {
  const nombre = document.getElementById("artista").value.trim();
  const lista = document.getElementById("lista");

  if (!nombre) {
    lista.innerHTML = "<p>Escribe un artista</p>";
    return;
  }

  lista.innerHTML = "<p> Buscando</p>";

  try {
    const respuesta = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(nombre)}&entity=album&limit=10`);
    const datos = await respuesta.json();

    if (datos.resultCount === 0) {
      lista.innerHTML = `<p>No se encontró al artista "${nombre}"</p>`;
      return;
    }

    lista.innerHTML = datos.results.map(album => `
      <li>
        <img src="${album.artworkUrl100}" alt="${album.collectionName}">
        <p><b>${album.artistName}</b> - ${album.collectionName} (${new Date(album.releaseDate).getFullYear()})</p>
      </li>
    `).join('');

  } catch (error) {
    lista.innerHTML = "<p> Error al buscar los datos del artista</p>";
  }
};


