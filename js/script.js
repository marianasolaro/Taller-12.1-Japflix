let moviesData = [];

// Al cargar la página, obtenemos los datos de las películas
window.onload = async () => {
    try {
        const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        if (!response.ok) throw new Error('Error en la carga de datos');
        moviesData = await response.json();
        console.log(moviesData); // Verifica los datos
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

document.getElementById('btnBuscar').addEventListener('click', () => {
    const buscar = document.getElementById('inputBuscar').value.toLowerCase();
    if (!buscar) {
        alert("Ingrese la película que busca.");
        return;
    }
    const results = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(buscar) ||
        movie.genres.some(genre => genre.name.toLowerCase().includes(buscar)) ||
        movie.tagline.toLowerCase().includes(buscar) ||
        movie.overview.toLowerCase().includes(buscar)
    );
    displayResults(results);
});

function displayResults(results) {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpio resultados previos

    if (results.length === 0) {
        lista.innerHTML = '<li class="list-group-item bg-dark text-light">No se encontraron resultados.</li>';
        return;
    }

    results.forEach(movie => {
        const stars = createStarRating(movie.vote_average);
        const movieElement = document.createElement('li');
        movieElement.classList.add('list-group-item', 'bg-dark', 'text-light');
        movieElement.innerHTML = `
             <div class="movie-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${movie.title}</h5>
                        <p>${movie.tagline}</p>
                    </div>
                    <div>
                        <div class="stars mb-2">${stars}</div>
                        <button class="btn btn-secondary btn-sm">Ver más</button>
                    </div>
                </div>
            </div>
        `;
        movieElement.addEventListener('click', () => showMovieDetails(movie));
        lista.appendChild(movieElement);
    });
}

function createStarRating(voteAverage) {
    const starCount = Math.round(voteAverage / 2); // Convierto de 0-10 a 0-5 estrellas
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= starCount) {
            stars += '<span class="fa fa-star checked"></span>'; // Estrella llena
        } else {
            stars += '<span class="fa fa-star"></span>'; // Estrella vacía
        }
    }
    return stars;
}

// Muestro los detalles de la película en el Offcanvas
function showMovieDetails(movie) {
    const offcanvasBody = document.getElementById('offcanvasBody');
    const genres = movie.genres.map(genre => genre.name).join(', ');
    offcanvasBody.innerHTML = `
        <h5>${movie.title}</h5>
        <p>${movie.overview}</p>
        <p><strong>Géneros:</strong> ${genres}</p>
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Más
        </button>
        <ul class="dropdown-menu">
            <li>Año: ${movie.release_date.split('-')[0]}</li>
            <li>Duración: ${movie.runtime} mins</li>
            <li>Presupuesto: $${movie.budget}</li>
            <li>Ganancias: $${movie.revenue}</li>
        </ul>
    `;
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasInfo'));
    offcanvas.show();
}