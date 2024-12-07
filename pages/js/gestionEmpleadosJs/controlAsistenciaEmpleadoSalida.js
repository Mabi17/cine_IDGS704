document.getElementById("formAsistenciaSalida").addEventListener("submit", async function (event) {
    event.preventDefault();

    const idEmpleado = document.getElementById("idEmpleado").value;
    const fecha = document.getElementById("fecha").value;
    let horaSalida = document.getElementById("horaSalida").value;

    // Se modifica la hora en formato 24hrs 
    const horaSalida24 = convertirHoraA24Horas(horaSalida);

    const payload = {
        empleado: {
            idEmpleado: idEmpleado
        },
        fecha: fecha,
        horaSalida: horaSalida24
    };

    try {
        const response = await fetch('https://asistencia-hwewfqa2cbcugqcq.canadacentral-01.azurewebsites.net//controlAsistencia/saveSalida', {
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

        alert("Asistencia registrada correctamente");
        document.getElementById("formAsistenciaSalida").reset();
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al registrar la asistencia.");
    }
});

// Función para convertir hora de 12 horas a 24 horas
function convertirHoraA24Horas(hora) {
    const [horas, minutos] = hora.split(":").map(Number);

    // Si ya está en formato 24 horas, no hacemos nada
    if (horas < 12) {
        return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:00`;
    }

    // Si es PM, sumar 12 horas (excepto 12:00 PM)
    const horas24 = horas >= 12 ? horas : horas + 12;
    return `${horas24.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:00`;
}
