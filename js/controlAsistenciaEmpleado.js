 document.getElementById("formAsistencia").addEventListener("submit", async function (event) {
        event.preventDefault(); 
        
     
        const idEmpleado = document.getElementById("idEmpleado").value;
        const fecha = document.getElementById("fecha").value;
        const horaSalida = document.getElementById("horaSalida").value;

      
     const payload = {
        empleado: {
            idEmpleado: idEmpleado
        },
        fecha: fecha,
        horaSalida: horaSalida
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
            document.getElementById("formAsistencia").reset(); 
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error al registrar la asistencia.");
        }
    });
    
    document.getElementById("formAsistenciaLlegada").addEventListener("submit", async function (event) {
        event.preventDefault(); 
        
        const idEmpleado = document.getElementById("idEmpleado").value;
        const fecha = document.getElementById("fecha").value;
        const horaEntrada = document.getElementById("horaEntrada").value;

      
     const payload = {
        empleado: {
            idEmpleado: idEmpleado
        },
        fecha: fecha,
        horaEntrada: horaEntrada
    };


        try {
        
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
            document.getElementById("formAsistencia").reset(); 
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error al registrar la asistencia.");
        }
    });
    
    