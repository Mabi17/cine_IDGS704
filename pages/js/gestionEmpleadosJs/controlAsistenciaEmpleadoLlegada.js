document.addEventListener("DOMContentLoaded", function () {
    // Declarar la variable `form`
    const form = document.getElementById("formAsistenciaLlegada");

    // Verificar si el formulario existe
    if (!form) {
        console.error("El formulario con ID 'formAsistenciaLlegada' no existe.");
        return;
    }

    // Agregar evento 'submit' al formulario
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        const idEmpleado = document.getElementById("idEmpleado").value;
        const fecha = document.getElementById("fecha").value;
        let horaEntrada = document.getElementById("horaEntrada").value;

        // Convertir la hora al formato de 24 horas si es necesario
        const horaEntrada24 = convertirHoraA24Horas(horaEntrada);

        const payload = {
            empleado: {
                idEmpleado: idEmpleado
            },
            fecha: fecha,
            horaEntrada: horaEntrada24
        };

        try {
            // Realizar la solicitud al servidor
            const response = await fetch('https://asistencia-hwewfqa2cbcugqcq.canadacentral-01.azurewebsites.net//controlAsistencia/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            alert("Asistencia de llegada registrada correctamente");
            form.reset(); // Reiniciar el formulario
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error al registrar la asistencia.");
        }
    });
});

// Función para asegurar el formato de 24 horas
function convertirHoraA24Horas(hora) {
    const [horas, minutos] = hora.split(":").map(Number);

    // Si ya está en formato de 24 horas, simplemente regresa el valor
    if (horas >= 0 && horas <= 23) {
        return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:00`;
    }

    return hora; // Por si acaso ya está en el formato adecuado
}
