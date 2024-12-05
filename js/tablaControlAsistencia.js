fetch('https://asistencia-hwewfqa2cbcugqcq.canadacentral-01.azurewebsites.net//controlAsistencia/getAll') 
        .then(response => response.json())
        .then(turnos => {
            const tableBody = document.getElementById("turnos-table-body");
            turnos.forEach(turno => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${turno.empleado.idEmpleado}</td>
                    <td>${turno.fecha}</td>
                    <td>${turno.turno}</td>
                    <td>${turno.horaEntrada}</td>
                    <td>${turno.horaSalida}</td>
                    <td>${turno.estatusAsistencia}</td>
                    <td>${turno.horasTotales}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al obtener los turnos:', error));