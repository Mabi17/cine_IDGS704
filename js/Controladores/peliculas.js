    document.addEventListener('DOMContentLoaded', () => {
        fetch('https://modulopeliculas.onrender.com/api/movies/getAll')
        .then(response => response.json())
        .then(data => {
        const tableBody = document.querySelector('#tablePeliculas tbody');
        if (!tableBody) {
            console.error('No se encontró el tbody');
            return;
        }
        
        data.forEach(pelicula => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pelicula.idPelicula}</td>
                <td>${pelicula.nombre}</td>
                <td>${pelicula.duracionMin}</td>
                <td>${pelicula.categoria}</td>
                <td>${pelicula.genero}</td>
                <td>${pelicula.sinopsis}</td>
                <td>${pelicula.fechaEstreno}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
})

