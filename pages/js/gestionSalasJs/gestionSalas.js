
window.onload = function () {

    peticionDatosTabla();
};

const peticionDatosTabla = () => {
    fetch('https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms')
        .then(response => {
            return response.json();   // Convertir la respuesta a JSON
        })
        .then(data => {
            generarTabla(data)

        })
        .catch(error => {
           // console.error('Hubo un problema con la petición Fetch:', error);
        });

}


const generarTabla = (lista) => {
    let tablaBody = document.getElementById('registrosSalas');
    let html = '';
    let contador = 1;

    lista.forEach(sala => {
        // Determina el estado de la sala
        const estadoSala = sala.status === 1 ? 'Activo' : 'Inactivo';

        // Agrega una fila a la tabla con el contador y el estado modificado
        html += `<tr>
            <td >${contador}</td> 
            <td>${sala.name}</td>
            <td>${sala.capacity}</td>
            <td>${sala.roomType}</td>
            <td>${estadoSala}</td> 
            <td>${generarBotones(sala.id)}</td>
        </tr>`;

        contador++;
    });

    tablaBody.innerHTML = html;
}

const generarBotones = (id) => {
    let botones = ` <button type="button" class="btn btn-sm btn-VerDetallates" data-toggle="modal" data-target="#modalVer" onclick='verDetalles(${id})'>Ver</button>           
                    <button type="button" class="btn btn-sm btn-VerDetallates" data-toggle="modal" data-target="#modalEditar" onclick='cargarSalaEditar(${id})'>Editar</button>
                    <button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#modalEliminar" onclick='obtenerIdEliminar(${id})'>Eliminar</button>
                    `;
    return botones;
}



function obtenerDatosFormulario() {
    // Recuperar los valores de los campos
    const nombre = document.getElementById('nombre').value;
    const capacidad = document.getElementById('capacidad').value;
    const tipo = document.getElementById('tipo').value;
    const estatus = document.getElementById('estatus').value;
    const descripcion = document.getElementById('descripcion').value;

    // Crear un objeto para almacenar los datos
    const datosFormulario = {
        name: nombre,
        capacity: capacidad,
        status: estatus,
        description: descripcion,
        roomType: {
            id: tipo
        }
    };

    return datosFormulario;
};

const registrarSala = async () => {

    let objeto = obtenerDatosFormulario(); // Obtener el objeto con los datos del formulario

    try {
        const response = await fetch("https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Especificar que estamos enviando JSON
            },
            body: JSON.stringify(objeto) // Convertir el objeto a JSON
        });


        if (!response.ok) {
            butterup.toast({
                title: 'Advertencia',
                message: 'Revisa todos los datos antes de enviar el formulario',
                icon: true,
                dismissable: true,
                type: 'warning',
            });

            const data = await response.json(); 

            throw new Error(`Error en la solicitud: ${data.message}`);
        }

        const responseData = await response.json(); // Obtener la respuesta en formato JSON
        //console.log("Se inserto correctame:", responseData);
        peticionDatosTabla();

        butterup.toast({
            title: 'Accion exitosa',
            message: 'La sala se creo correctamente',
            type: 'success',
            icon: true,
            dismissable: true,
        });

        limpiarFormulario();

    } catch (error) {
        //console.error(error);
    }
}

const obtenerIdEliminar= (id)=>{
    const eliminarBoton = document.getElementById('eliminar-Sala');
    eliminarBoton.dataset.id = id
}

const eliminarSala = async (id) => {

    const url = `https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms/delete?id=${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' // Set content type if necessary
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const responseData = await response.json(); // Get JSON response
        //console.log("Sala eliminada correctamente:", responseData);

        peticionDatosTabla();

        $('#modalEliminar').modal('hide')
        
        butterup.toast({
            title: 'Acción exitosa',
            message: 'La sala ha sido eliminada correctamente',
            type: 'success',
            icon: true,
            dismissable: true,
        });

    } catch (error) {
       // console.error("Error al eliminar la sala:", error);
    }
};


const verDetalles = async (id) => {
    try {

        const sala = await obtenerDetallesSala(id);

        let tabla = document.getElementById('verRegistro');

        const estadoSala = sala.status === 1 ? 'Activo' : 'Inactivo';
        const description = sala.description ?? '';

        const html = `
            <tr>
                <th>Nombre</th>
                <td>${sala.name}</td>
            </tr>
            <tr>
                <th>Capacidad</th>
                <td>${sala.capacity}</td>
            </tr>
            <tr>
                <th>Tipo</th>
                <td>${sala.roomType.type}</td>
            </tr>
            <tr>
                <th>Estatus</th>
                <td>${estadoSala}</td>
            </tr>

             <tr>
                <th>Descripcion</th>
                <td>${description}</td>
            </tr>
            
    `;

        tabla.innerHTML = html;


    } catch (error) {
       // console.error("Error al obtener detalles:", error);
    }
}





const obtenerDetallesSala = async (id) => {
    try {
        const response = await fetch(`https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms/find?id=${id}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const sala = await response.json();
        return sala;
    } catch (error) {
        //console.error("Error al obtener detalles de la sala:", error);    
    }
};


const cargarSalaEditar = async (id) => {
    const sala = await obtenerDetallesSala(id);
    establecerValoresFormulario(sala);
};


function establecerValoresFormulario(sala) {
    // Recuperar los valores de los campos
    const nombre = document.getElementById('nombre-editar');
    const capacidad = document.getElementById('capacidad-editar');
    const tipo = document.getElementById('tipo-editar');
    const estatus = document.getElementById('estatus-editar');
    const descripcion = document.getElementById('descripcion-editar');
    const editarBoton = document.getElementById('editar-boton');

    nombre.value = sala.name ?? '';
    capacidad.value = sala.capacity ?? '';
    tipo.value = sala.roomType?.id ?? '';
    estatus.value = sala.status ?? '';
    descripcion.value = sala.description ?? '';
    editarBoton.dataset.id = sala.id;

}

function obtenerValoresModalEditar() {
    // Recuperar los valores de los campos
    const nombre = document.getElementById('nombre-editar').value;
    const capacidad = parseInt(document.getElementById('capacidad-editar').value, 10);
    const tipo = parseInt(document.getElementById('tipo-editar').value, 10);
    const estatus = parseInt(document.getElementById('estatus-editar').value, 10);
    const descripcion = document.getElementById('descripcion-editar').value;
    const editarBoton = document.getElementById('editar-boton');

    const sala = {
        id: parseInt(editarBoton.dataset.id, 10),
        name: nombre,
        capacity: capacidad,
        status: estatus,
        description: descripcion,
        roomType: {
            id: tipo
        }
    };

    return sala;
}

function limpiarFormulario() {
    // Recuperar los valores de los campos
    const nombre = document.getElementById('nombre');
    const capacidad = document.getElementById('capacidad');
    const tipo = document.getElementById('tipo');
    const estatus = document.getElementById('estatus');
    const descripcion = document.getElementById('descripcion');

    nombre.value = '';
    capacidad.value = '';
    tipo.value = '';
    estatus.value = '';
    descripcion.value = '';
}


const editarSala = async () => {
    try {
        const salaModificada = obtenerValoresModalEditar();

        const response = await fetch('https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salaModificada),
        });

        if (!response.ok) {
            throw new Error(`Error en la actualización: ${response.status}`);

        } else {
            const data = await response.json();
            //console.log(data);
            peticionDatosTabla();

            butterup.toast({
                title: 'Acción exitosa',
                message: 'La sala ha sido actualizada correctamente',
                type: 'success',
                icon: true,
                dismissable: true,
            });

            $('#modalEditar').modal('hide')
        
        }



    } catch (error) {
       // console.error('Error al actualizar la sala:', error);
    }
};
