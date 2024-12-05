// URL de la API
const apiUrlGetAll = "http://localhost:8080/producto/getall";
const apiUrlEdit = "http://localhost:8080/producto/edit";

// Función para obtener los productos desde la API
function obtenerPreciosDulceria() {
    fetch(apiUrlGetAll)
        .then(response => response.json())
        .then(data => {
            llenarTablaPrecios(data); // Llenar la tabla con los datos obtenidos
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
}

// Función para llenar la tabla con los productos
function llenarTablaPrecios(productos) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Limpiar tabla antes de agregar nuevos datos

    productos.forEach(producto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precioVenta}</td>
            <td>${producto.stockActual}</td>
            <td>
                <button class="btn btn-warning" onclick="editarProducto(${producto.id})">Editar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Llamamos a la función cuando se carga la página
document.addEventListener("DOMContentLoaded", obtenerPreciosDulceria);

// Función para editar el producto
function editarProducto(id) {
    // Obtener el producto por su ID desde la API
    fetch(apiUrlGetAll)
        .then(response => response.json())
        .then(data => {
            const producto = data.find(p => p.id === id);

            if (producto) {
                // Verificar si el id del producto es válido antes de asignarlo al modal
                console.log("Producto encontrado:", producto);

                // Asignar valores al modal
                document.getElementById("productoNombre").value = producto.nombre;
                document.getElementById("productoPrecio").value = producto.precioVenta;
                document.getElementById("productoStock").value = producto.stockActual;
                document.getElementById("productoId").value = producto.id;

                // Deshabilitar los campos nombre y stock
                document.getElementById("productoNombre").disabled = true;
                document.getElementById("productoStock").disabled = true;

                // Mostrar el modal
                $('#exampleModal').modal('show');
            } else {
                console.error("Producto no encontrado con id:", id);
            }
        })
        .catch(error => {
            console.error("Error al obtener el producto:", error);
        });
}

// Función para guardar los cambios del producto
document.getElementById("guardarCambios").addEventListener("click", function() {
    const id = document.getElementById("productoId").value;

    // Verificar si el id no está vacío o inválido
    if (!id || isNaN(id)) {
        console.error("ID no válido o no encontrado:", id);
        alert("El ID del producto es inválido.");
        return; // Detener si el ID es inválido
    }

    const nombre = document.getElementById("productoNombre").value;
    const precio = document.getElementById("productoPrecio").value;
    const stock = document.getElementById("productoStock").value;

    // Crear el objeto con los datos a actualizar
    const productoActualizado = {
        nombre,
        precioVenta: parseFloat(precio), // Convertir el precio a número
        stockActual: parseInt(stock)    // Convertir el stock a entero
    };

    // Verificar la URL antes de hacer la solicitud
    const urlActualizar = `${apiUrlEdit}/${id}`;
    console.log(`URL de la solicitud PUT: ${urlActualizar}`);

    // Realizar la solicitud PUT para actualizar el producto
    fetch(urlActualizar, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productoActualizado)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la actualización: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Producto actualizado:", data);

        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto ha sido actualizado correctamente.',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Recargar la tabla automáticamente después de la alerta
            obtenerPreciosDulceria(); // Actualizar la tabla
            $('#exampleModal').modal('hide'); // Ocultar el modal
        });
    })
    .catch(error => {
        console.error("Error al guardar cambios:", error);

        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto ha sido actualizado correctamente.',
            timer: 1000,
            showConfirmButton: false
        }).then(() => {
            // Recargar la tabla automáticamente después de la alerta
            obtenerPreciosDulceria(); // Actualizar la tabla
            $('#exampleModal').modal('hide'); // Ocultar el modal
        });
    });
});
