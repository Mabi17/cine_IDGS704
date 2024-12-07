// INICIO CREAR NUEVO ROL
document.getElementById("btnguardar").addEventListener("click", function () {
    const nombre = document.getElementById("roleName").value;
    const descripcion = document.getElementById("roleDescription").value;

    // Obtener las acciones seleccionadas
    const acciones = {
        Crear: document.getElementById("permissionCreate").checked,
        Editar: document.getElementById("permissionEdit").checked,
        Eliminar: document.getElementById("permissionDelete").checked,
        Ver: document.getElementById("permissionView").checked
    };

    // Obtener los módulos seleccionados
    const modulos = {
        Boletos: document.getElementById("moduleTickets").checked,
        Salas: document.getElementById("moduleRooms").checked,
        Funciones: document.getElementById("moduleFunctions").checked,
        Empleados: document.getElementById("moduleEmployees").checked,
        Dulceria: document.getElementById("moduleCandyShop").checked,
        Reportes: document.getElementById("moduleReports").checked
    };

    // Construir el cuerpo de la solicitud
    const nuevoRol = {
        nombre: nombre,
        descripcion: descripcion,
        modulos: JSON.stringify({ acciones, modulos }), // Convertimos ambos en JSON
        activo: true // Por defecto, el rol se crea como activo
    };

    // Enviar la solicitud al backend
    fetch("https://proyectoarqcinepremiere-cinearqproyecto.azuremicroservices.io/ControllerRoles/crearRol", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoRol)
    })
        .then(response => {
            if (!response.ok) {
                // Lanzar un error con el texto de la respuesta
                return response.text().then(errMessage => { throw new Error(errMessage); });
            }
            return response.text();
        })
        .then(data => {
            butterup.toast({
                title: 'Rol creado',
                message: data, // Mostrar el mensaje de éxito del backend
                type: 'success',
                icon: true,
                dismissable: true,
            });
            setTimeout(() => location.reload(), 2000); // Recargar después de 2 segundos
        })
        .catch(error => {
            // Mostrar el error en una alerta de Butterup
            butterup.toast({
                title: 'Error al crear el rol',
                message: error.message, // Mensaje detallado del error
                type: 'danger',
                icon: true,
                dismissable: true,
            });
            console.error("Error al crear el rol:", error);
        });
});
// FIN CREAR NUEVO ROL


//INICIO EDITAR ROL
document.querySelectorAll("#editar").forEach(button => {
    button.addEventListener("click", function () {
        const row = this.closest("tr"); // Fila del rol
        const id = row.children[0].innerText;
        const nombre = row.children[1].innerText;
        const descripcion = row.children[2].innerText;
        const permisos = row.children[3].innerText.split(", ");

        // Prellenar el formulario con los datos existentes
        document.getElementById("roleName").value = nombre;
        document.getElementById("roleDescription").value = descripcion;
        document.getElementById("permissionCreate").checked = permisos.includes("Crear");
        document.getElementById("permissionEdit").checked = permisos.includes("Editar");
        document.getElementById("permissionDelete").checked = permisos.includes("Eliminar");
        document.getElementById("permissionView").checked = permisos.includes("Visualizar");

        // Reutilizamos el botón guardar para actualizar el rol
        const guardarButton = document.getElementById("guardar");
        guardarButton.textContent = "Actualizar";
        guardarButton.onclick = function () {
            const updatedRol = {
                id: parseInt(id),
                nombre: document.getElementById("roleName").value,
                descripcion: document.getElementById("roleDescription").value,
                modulos: JSON.stringify({
                    Crear: document.getElementById("permissionCreate").checked,
                    Editar: document.getElementById("permissionEdit").checked,
                    Eliminar: document.getElementById("permissionDelete").checked,
                    Ver: document.getElementById("permissionView").checked
                }),
                activo: true // Mantenemos el rol activo al editar
            };

            fetch("https://proyectoarqcinepremiere-cinearqproyecto.azuremicroservices.io/ControllerRoles/editarRol", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedRol)
            })
                .then(response => {
                    if (response.ok) {
                        alert("Rol actualizado exitosamente");
                        location.reload(); // Recargar la página
                    } else {
                        throw new Error("Error al actualizar el rol");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Ocurrió un error al actualizar el rol.");
                });
        };
    });
});
// FIN EDITAR UN ROL

//INICIO DE CARGAR LA TABLA 
// Función para cargar los roles y llenar la tabla
function cargarRoles() {
    fetch("https://proyectoarqcinepremiere-cinearqproyecto.azuremicroservices.io/ControllerRoles/getAllRoles")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los roles");
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            const tablaRoles = document.getElementById("rolesTable");
            tablaRoles.innerHTML = ""; // Limpiar la tabla antes de llenarla

            // Iterar sobre los roles y generar filas
            data.forEach(rol => {
                let modulosTexto = ""; // Para mostrar los módulos
                let accionesTexto = ""; // Para mostrar las acciones
                const estadoTexto = rol.activo ? "Activo" : "Inactivo"; // Determinar estado

                // Procesar el campo 'modulos'
                try {
                    const modulos = JSON.parse(rol.modulos);

                    if (Array.isArray(modulos)) {
                        // Caso: modulos es una lista de objetos
                        modulosTexto = modulos
                            .map(m => `${m.microservicio} (${m.permisos.join(", ")})`)
                            .join("<br>");
                    } else if (typeof modulos === "object") {
                        // Caso: modulos es un objeto con 'modulos' y 'acciones'
                        modulosTexto = Object.keys(modulos.modulos || {})
                            .filter(key => modulos.modulos[key])
                            .join(", ");
                        accionesTexto = Object.keys(modulos.acciones || {})
                            .filter(key => modulos.acciones[key])
                            .join(", ");
                    }
                } catch (e) {
                    console.error("Error procesando los módulos:", e);
                }

                // Crear fila
                const fila = `
                    <tr>
                        <td>${rol.id}</td>
                        <td>${rol.nombre}</td>
                        <td>${rol.descripcion}</td>
                        <td>${modulosTexto}</td>
                        <td>${accionesTexto}</td>
                        <td>${estadoTexto}</td>
                        <td>
                            <button class="btn btn-sm btn-primary editar-btn" data-id="${rol.id}">Editar</button>
                            <button class="btn btn-sm btn-danger eliminar-btn" data-id="${rol.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
                tablaRoles.insertAdjacentHTML("beforeend", fila);
            });

            // Asociar eventos a los botones de editar y eliminar
            asociarEventosBotones();
        })
        .catch(error => {
            console.error("Error al cargar los roles:", error);
            butterup.toast({
                title: 'Error',
                message: 'No se pudieron cargar los roles.',
                type: 'danger',
                icon: true,
                dismissable: true,
            });
        });
}

// Llamar a la función al cargar la página
window.onload = cargarRoles;
// FIN CARGAR LA TABLA


function asociarEventosBotones() {
    // Botón editar
    document.querySelectorAll(".editar-btn").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;

            // Solicitud POST para obtener el rol
            fetch("https://proyectoarqcinepremiere-cinearqproyecto.azuremicroservices.io/ControllerRoles/getRol", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: parseInt(id) })
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al obtener el rol");
                    return response.json();
                })
                .then(rol => {
                    // Prellenar campos básicos
                    document.getElementById("editarId").value = rol.id;
                    document.getElementById("editarNombre").value = rol.nombre;
                    document.getElementById("editarDescripcion").value = rol.descripcion;

                    const modulos = JSON.parse(rol.modulos);

                    // Prellenar permisos
                    const permisos = modulos.acciones || {};
                    document.getElementById("editarCrear").checked = permisos.Crear || false;
                    document.getElementById("editarEditar").checked = permisos.Editar || false;
                    document.getElementById("editarEliminar").checked = permisos.Eliminar || false;
                    document.getElementById("editarVer").checked = permisos.Ver || false;

                    // Prellenar módulos
                    const modulosExistentes = modulos.modulos || {};
                    document.getElementById("editarBoletos").checked = modulosExistentes.Boletos || false;
                    document.getElementById("editarSalas").checked = modulosExistentes.Salas || false;
                    document.getElementById("editarFunciones").checked = modulosExistentes.Funciones || false;
                    document.getElementById("editarEmpleados").checked = modulosExistentes.Empleados || false;
                    document.getElementById("editarDulceria").checked = modulosExistentes.Dulceria || false;
                    document.getElementById("editarReportes").checked = modulosExistentes.Reportes || false;

                    // Mostrar el modal
                    const modal = new bootstrap.Modal(document.getElementById("editarModal"));
                    modal.show();
                })
                .catch(error => {
                    console.error("Error al cargar el rol para edición:", error);
                    butterup.toast({
                        title: 'Error',
                        message: 'No se pudo cargar el rol para edición.',
                        type: 'danger',
                        icon: true,
                        dismissable: true,
                    });
                });
        });
    });

    // Botón eliminar
    document.querySelectorAll(".eliminar-btn").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;

            fetch("https://proyectoarqcinepremiere-cinearqproyecto.azuremicroservices.io/ControllerRoles/eliminarRol", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: parseInt(id) })
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al eliminar el rol");
                    return response.text();
                })
                .then(data => {
                    butterup.toast({
                        title: 'Rol eliminado',
                        message: 'El rol fue eliminado correctamente.',
                        type: 'success',
                        icon: true,
                        dismissable: true,
                    });
                    cargarRoles(); // Recargar los roles
                })
                .catch(error => {
                    console.error("Error al eliminar el rol:", error);
                    butterup.toast({
                        title: 'Error',
                        message: 'No se pudo eliminar el rol.',
                        type: 'danger',
                        icon: true,
                        dismissable: true,
                    });
                });
        });
    });
}

// Guardar cambios en el rol editado
document.getElementById("guardarCambios").addEventListener("click", function () {
    const id = document.getElementById("editarId").value;
    const nombre = document.getElementById("editarNombre").value;
    const descripcion = document.getElementById("editarDescripcion").value;

    const acciones = {
        Crear: document.getElementById("editarCrear").checked,
        Editar: document.getElementById("editarEditar").checked,
        Eliminar: document.getElementById("editarEliminar").checked,
        Ver: document.getElementById("editarVer").checked
    };

    const modulos = {
        Boletos: document.getElementById("editarBoletos").checked,
        Salas: document.getElementById("editarSalas").checked,
        Funciones: document.getElementById("editarFunciones").checked,
        Empleados: document.getElementById("editarEmpleados").checked,
        Dulceria: document.getElementById("editarDulceria").checked,
        Reportes: document.getElementById("editarReportes").checked
    };

    const updatedRol = {
        id: parseInt(id),
        nombre: nombre,
        descripcion: descripcion,
        modulos: JSON.stringify({ acciones, modulos }),
        activo: true
    };

    fetch("https://proyectoarqcinepremiere-cinearqproyecto.azuremicroservices.io/ControllerRoles/editarRol", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedRol)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar el rol");
            return response.text();
        })
        .then(data => {
            butterup.toast({
                title: 'Rol actualizado',
                message: 'El rol fue actualizado correctamente.',
                type: 'success',
                icon: true,
                dismissable: true,
            });
            const modal = new bootstrap.Modal(document.getElementById("editarModal"));
            modal.hide();
            cargarRoles(); // Recargar la tabla
        })
        .catch(error => {
            console.error("Error al actualizar el rol:", error);
            butterup.toast({
                title: 'Error',
                message: 'No se pudo actualizar el rol.',
                type: 'danger',
                icon: true,
                dismissable: true,
            });
        });
});

document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
    button.addEventListener('click', () => {
        const modalElement = document.getElementById('editarModal');
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.hide();
    });
});
