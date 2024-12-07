// Función para formatear las horas en formato 3:21 (sin ceros a la izquierda)
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':'); // Separar las horas y minutos

    // Eliminar ceros a la izquierda en la hora, pero asegurarse que los minutos tengan siempre 2 dígitos
    const formattedHours = parseInt(hours, 10); // Eliminar ceros a la izquierda en la hora
    const formattedMinutes = minutes.padStart(2, '0'); // Asegurar que los minutos tengan siempre 2 dígitos

    // Devolver la hora en el formato correcto
    return `${formattedHours}:${formattedMinutes}`;
}
function limpiarCampos() {
    document.getElementById("horaInicio").value = "";
    document.getElementById("horaFin").value = "";
    document.getElementById("tiempoTotal").value = "";
    document.getElementById("idHorarioHidden").value = "";
}


// Función para cargar la tabla con los datos de la API
async function CargarTabla() {
    let ruta = "https://spring-horarios.uc.r.appspot.com/horarioSalas/api/horarios"; // Ruta de la API

    try {
        const response = await fetch(ruta); // Realiza la solicitud a la API

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json(); // Convertir la respuesta a JSON

        // Obtener la referencia a la tabla
        const tabla = document.getElementById("cuerpoTabla");

        // Limpiar el contenido anterior de la tabla
        tabla.innerHTML = "";

        // Recorrer los datos recibidos y agregarlos a la tabla
        data.forEach(function (fila) {
            const nuevaFila = tabla.insertRow(-1); // Inserta una nueva fila en la tabla

            // Insertar celdas con los datos de cada fila
            const horaInicioCell = nuevaFila.insertCell(0);
            horaInicioCell.innerHTML = formatTime(fila.horaInicio); // Formato de la hora de inicio

            const horaFinCell = nuevaFila.insertCell(1);
            horaFinCell.innerHTML = formatTime(fila.horaFin); // Formato de la hora de fin

            const tiempoTotalCell = nuevaFila.insertCell(2);
            tiempoTotalCell.innerHTML = formatTime(fila.tiempoTotal); // Formato del tiempo total

            // Insertar la celda del ID (puede ser útil para propósitos internos, pero oculta en la interfaz)
            const idHorarioCell = nuevaFila.insertCell(3);
            idHorarioCell.innerHTML = fila.idHorario;
            idHorarioCell.style.display = "none"; // Hacer que la columna ID sea invisible

            // Añadir un manejador de eventos para seleccionar la fila
            nuevaFila.addEventListener("click", function() {
                seleccionarFila(nuevaFila);
            });
        });

    } catch (error) {
        console.error("Error al cargar la tabla: " + error); // Manejo de errores
    }
}

// Función para seleccionar una fila y cargar los datos en los campos correspondientes
function seleccionarFila(fila) {
    const indice = fila.rowIndex - 1; // Obtener el índice de la fila seleccionada

    fetch("https://spring-horarios.uc.r.appspot.com/horarioSalas/api/horarios")
        .then(response => response.json())
        .then(data => {
            const horarioSeleccionado = data[indice];

            // Cargar los datos del horario seleccionado en los campos de texto
            document.getElementById("horaInicio").value = horarioSeleccionado.horaInicio;
            document.getElementById("horaFin").value = horarioSeleccionado.horaFin;
            document.getElementById("tiempoTotal").value = horarioSeleccionado.tiempoTotal;
            document.getElementById("idHorarioHidden").value = horarioSeleccionado.idHorario; // Guardar el ID en un campo oculto
        })
        .catch(error => {
            console.error("Error al seleccionar la fila:", error);
        });
}

// Llamar a la función para cargar los datos y llenar la tabla
CargarTabla();


 const horaInicioInput = document.getElementById('horaInicio');
const horaFinInput = document.getElementById('horaFin');
const btnAgregar = document.getElementById('btnAgregar');
const tiempoTotalInput = document.getElementById('tiempoTotal');




document.querySelectorAll("table tbody tr").forEach(row => {
    row.addEventListener("click", () => {

        const horaInicio = row.cells[0].innerText; // Hora de Inicio
        const horaFin = row.cells[1].innerText;     // Hora de Fin
        const tiempoTotal = row.cells[2].innerText; // Tiempo Total
         const idHorario = row.cells[3].innerText; 

   
        document.getElementById("horaInicio").value = horaInicio;
        document.getElementById("horaFin").value = horaFin;
        document.getElementById("tiempoTotal").value = tiempoTotal;
        document.getElementById("idHorarioHidden").value = idHorario;
    });
});




function calcularDiferenciaEnTiempo(horaInicio, horaFin) {
    const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = horaFin.split(':').map(Number);

    const inicioDate = new Date(0, 0, 0, horaInicioH, horaInicioM);
    const finDate = new Date(0, 0, 0, horaFinH, horaFinM);


    const diferenciaEnMinutos = (finDate - inicioDate) / 60000; 

 
    if (diferenciaEnMinutos < 120) {
        alert('La hora de fin debe ser al menos 2 horas después de la hora de inicio.');
     
        const inicio = new Date();
        inicio.setHours(horaInicioH);
        inicio.setMinutes(horaInicioM);
        inicio.setMinutes(inicio.getMinutes() + 120);
        const horaFinAjustada = inicio.toTimeString().slice(0, 5);
        horaFinInput.value = horaFinAjustada;
        tiempoTotalInput.value = "02:00";
        return null;
    }

    if (diferenciaEnMinutos > 360) {
        alert('La hora de fin no debe ser más de 6 horas después de la hora de inicio.');
         const inicio = new Date();
        inicio.setHours(horaInicioH);
        inicio.setMinutes(horaInicioM);
        inicio.setMinutes(inicio.getMinutes() + 360); 
        const horaFinAjustada = inicio.toTimeString().slice(0, 5);
        horaFinInput.value = horaFinAjustada;
        tiempoTotalInput.value = "06:00";
        return null;
    }


    const horas = Math.floor(diferenciaEnMinutos / 60);
    const minutos = diferenciaEnMinutos % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}


horaInicioInput.addEventListener('input', () => {
    const horaInicio = horaInicioInput.value;
    const horaFin = horaFinInput.value;

    if (horaInicio) {
        const [hours, minutes] = horaInicio.split(':');
        const inicio = new Date();
        inicio.setHours(parseInt(hours));
        inicio.setMinutes(parseInt(minutes));
        

        inicio.setMinutes(inicio.getMinutes() + 120 + 15);
        const horaFinCalculada = inicio.toTimeString().slice(0, 5);
        horaFinInput.value = horaFinCalculada;

 
        const tiempoTotal = calcularDiferenciaEnTiempo(horaInicio, horaFinCalculada);
        if (tiempoTotal) {
            tiempoTotalInput.value = tiempoTotal;
        }
    }
});


horaFinInput.addEventListener('input', () => {
    const horaInicio = horaInicioInput.value;
    const horaFin = horaFinInput.value;

    if (horaInicio && horaFin) {
        const tiempoTotal = calcularDiferenciaEnTiempo(horaInicio, horaFin);


        if (tiempoTotal) {
            tiempoTotalInput.value = tiempoTotal;
        }
    }
});



async function agregarHorario() {
    const url = `https://spring-horarios.uc.r.appspot.com/horarioSalas/api/horarios/add`;

    // Obtener los valores de los inputs
    const horaInicioInput = document.getElementById('horaInicio').value;
    const horaFinInput = document.getElementById('horaFin').value;

    // Crear el objeto con los datos
    const bodyData = {
                idHorario: null,
        horaInicio: horaInicioInput,
        horaFin: horaFinInput,
        tiempoTotal:null
    };
console.log(bodyData);
    try {
        // Hacer la solicitud POST
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Enviar como JSON
            },
            body: JSON.stringify(bodyData)
        });

        // Manejar la respuesta
        if (response.ok) {
                         const message = await response.text();
             alert(message);
            CargarTabla();
            limpiarCampos();

        } else {
            console.error('Error en la solicitud:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
}




async function modificarHorario() {
    const url = `https://spring-horarios.uc.r.appspot.com/horarioSalas/api/horarios/edit`;

    // Obtener los valores de los inputs
 const horaInicioInput = document.getElementById('horaInicio').value;
const horaFinInput = document.getElementById('horaFin').value;
const idHorario = document.getElementById('idHorarioHidden').value;
const tiempoTotalInput = document.getElementById('tiempoTotal').value;
    

    // Crear el objeto con los datos
    const bodyData = {
                idHorario:idHorario ,
        horaInicio: horaInicioInput,
        horaFin: horaFinInput,
        tiempoTotal:tiempoTotalInput
    };
console.log(bodyData);
    try {
        // Hacer la solicitud POST
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Enviar como JSON
            },
            body: JSON.stringify(bodyData)
        });

        // Manejar la respuesta
        if (response.ok) {
                         const message = await response.text();
             alert(message);
            CargarTabla();
            limpiarCampos();
            
        } else {
            console.error('Error en la solicitud:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
}

async function eliminarHorario() {
    const url = `https://spring-horarios.uc.r.appspot.com/horarioSalas/api/horarios/delete`;

    // Obtener los valores de los inputs

const idHorario = document.getElementById('idHorarioHidden').value;

    

    // Crear el objeto con los datos
    const bodyData = {
                idHorario:idHorario ,
        horaInicio:null,
        horaFin: null,
        tiempoTotal:null
    };
console.log(bodyData);
    try {
        // Hacer la solicitud POST
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Enviar como JSON
            },
            body: JSON.stringify(bodyData)
        });

        // Manejar la respuesta
        if (response.ok) {
             const message = await response.text();
             alert(message);
            CargarTabla();
            limpiarCampos();
            
        } else {
            console.error('Error en la solicitud:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
}


