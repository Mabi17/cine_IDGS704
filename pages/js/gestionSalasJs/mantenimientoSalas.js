





const cuerpoTabla = document.getElementById("cuerpoTabla");

const var_idsala = document.getElementById("idSala");
const var_nombre = document.getElementById("nombreSala");
const var_status = document.getElementById("estatus");  
const var_descripcion = document.getElementById("descripcion");  
const var_tipo = document.getElementById("tipoSala");  

cargarDatos();
async function cargarDatos() {
    try {
        const response = await fetch('https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms');
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        cuerpoTabla.innerHTML = '';

        data.forEach(room => {
            
            
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${room.id}</td>
                <td>${room.name}</td>
                <td>${room.status && "Activo" || "Inactivo"}</td>
                <td>${room.description  || "Sin descripción"}</td>
                `
                //<td>
                //    <button class="btn btn-sm btn-info" id="editar-${room.id}">Editar</button>
                 //   <button class="btn btn-sm btn-danger" id="eliminar-${room.id}">Eliminar</button>
                //</td> 
            ;
            fila.addEventListener("click", () => {
                var_idsala.value = room.id; 
                var_nombre.value = room.name;
                var_status.value = room.status;
                var_descripcion.value = room.description || "Sin descripción";
                 
            });

            cuerpoTabla.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function cambiarStatus() {

    const var_idsala = document.getElementById("idSala");
    const var_status = document.getElementById("estatus");  

    console.log(var_idsala, var_status);

    const url = `https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms/updateStatus?id=${var_idsala.value}&status=${var_status.value}`;
                    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Si necesitas enviar un cuerpo JSON
            },
        });

        if (!response.ok) {
            throw new Error(`Error al cambiar el estado: ${response.status}`);
        }

        const data = await response.json(); // Procesar la respuesta si es JSON
        console.log('Estado actualizado:', data);
        alert('Estado cambiado con éxito');
        cargarDatos();
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        alert('Hubo un error al cambiar el estado');
    }
    
}

