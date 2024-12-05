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
                <td>
                    <button class="btn btn-sm btn-info" onclick="editar('${JSON.stringify(pelicula).replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">Editar</button>
                    <button class="btn btn-sm btn-danger" id="eliminar" onclick="eliminar(${pelicula.idPelicula});">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
});

function agregar(){
        // Recoger los valores de los inputs
        const nombre = "'" + document.querySelector('#nombre').value + "'";
        const duracionMin = document.querySelector('#duracionMin').value;
        const categoria = "'" + document.querySelector('#categoria').value + "'";
        const genero = "'" + document.querySelector('#genero').value + "'";
        const sinopsis = "'" + document.querySelector('#sinopsis').value + "'";
        const fechaEstreno = "'" + document.querySelector('#fechaEstreno').value + "'";
        const poster = "'" + 'ruta/del/poster.jpg' + "'"; // Ajusta la ruta real del poster si es necesario
        const idPelicula = document.querySelector('#idPelicula').value;

        console.log(idPelicula);

        if(idPelicula !== null && idPelicula > 0){
            const data = {
                idPelicula,
                nombre,
                duracionMin,
                categoria,
                genero,
                sinopsis,
                poster,
                fechaEstreno
            };
            fetch('https://modulopeliculas.onrender.com/api/movies/modify', {
                method: 'POST', // Método HTTP
                headers: {
                    'Content-Type': 'application/json' // Indicamos que enviamos JSON
                },
                body: JSON.stringify(data) // Convertimos a JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(result => {
                console.log('Success:', result);
                alert('Película actualizada con éxito');
                location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else{        
            const data = {
                nombre,
                duracionMin,
                categoria,
                genero,
                sinopsis,
                poster,
                fechaEstreno
            };
        // Enviar los datos a la API usando fetch
        fetch('https://modulopeliculas.onrender.com/api/movies/create', {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json' // Indicamos que enviamos JSON
            },
            body: JSON.stringify(data) // Convertimos a JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            alert('Película registrada con éxito');
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al registrar la película');
        });
    }
    }



function eliminar(idPelicula){
    const data = {
        idPelicula 
    }

    fetch('https://modulopeliculas.onrender.com/api/movies/delete', {
        method: 'POST', // Método HTTP
        headers: {
            'Content-Type': 'application/json' // Tipo de contenido JSON
        },
        body: JSON.stringify(data) // Convertir a JSON
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        alert('Película eliminada con éxito');
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar la película');
    });

}

function editar(peliculaJson) {
    const pelicula = JSON.parse(peliculaJson); // Convertir de JSON a objeto
    console.log(pelicula);

    const fechaEstreno = new Date(pelicula.fechaEstreno);
    const fechaFormateada = fechaEstreno.toISOString().split('T')[0];
    // Asegúrate de que los campos existen antes de asignar valores
    document.getElementById("nombre").value = pelicula.nombre;
    document.getElementById("duracionMin").value = pelicula.duracionMin;
    document.getElementById("categoria").value = pelicula.categoria;
    document.getElementById("genero").value = pelicula.genero;
    document.getElementById("sinopsis").value = pelicula.sinopsis;
    document.getElementById("fechaEstreno").value = fechaFormateada;
    document.getElementById("idPelicula").value = pelicula.idPelicula;
}


