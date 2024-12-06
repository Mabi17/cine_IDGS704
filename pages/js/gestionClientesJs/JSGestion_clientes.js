function loadClients() {
    fetch('http://162.214.153.239:5010/api/clientes/get_clients')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('clientTableBody');
            tableBody.innerHTML = '';

            data.forEach(client => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.nombre}</td>
                    <td>${client.colonia}</td>
                    <td>${client.calle}</td>
                    <td>${client.correo}</td>
                    <td>
                        <button class="btn btn-VerDetallates" data-toggle="modal" data-target="#detailsModal"
                                onclick="showDetails('${client.nombre}','${client.colonia}','${client.calle}','${client.correo}')">
                            Ver Detalles
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar los clientes:', error);
        });
}

window.onload = loadClients;

function showDetails(nombre, colonia, calle, correo) {
    // Asignar valores a los elementos del modal
    document.getElementById('clientName').innerText = nombre;
    document.getElementById('clientType').innerText = colonia;
    document.getElementById('clientEmail').innerText = correo;
    document.getElementById('clientStreet').innerText = calle;
    // Si tienes más detalles para asignar, hazlo aquí
    // Si la fecha de registro está en los datos de cliente, también asigna ese valor
    document.getElementById('clientRegistrationDate').innerText = 'Fecha de registro'; // Puedes cambiar esto por un valor real si lo tienes
}