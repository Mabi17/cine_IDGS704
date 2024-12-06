document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://inventariodulceria-fehwdtavgnbfg4a7.canadacentral-01.azurewebsites.net/productos/api"; // Cambia esta URL si es necesario
    const tablaProductos = document.querySelector("#tablaProductos tbody");

    const obtenerProductos = async () => {
        try {
            const response = await fetch(apiUrl);
            const productos = await response.json();
            console.log("Productos recibidos:", productos);

            if (productos.success) {
                productosCache = productos.data;
                llenarTabla(productosCache);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se encontraron productos: ${productos.message}`,
                });
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al obtener los productos.',
            });
        }
    };

    // Función para llenar la tabla
    const llenarTabla = (productos) => {
        const tabla = document.getElementById("tablaProductos").getElementsByTagName('tbody')[0];
        tabla.innerHTML = "";  // Limpiar la tabla antes de llenarla

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            const celdaId = document.createElement("td");
            celdaId.textContent = producto.idProducto;
            fila.appendChild(celdaId);

            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = producto.nombre;
            fila.appendChild(celdaNombre);

            const celdaCategoria = document.createElement("td");
            celdaCategoria.textContent = producto.categoria;
            fila.appendChild(celdaCategoria);

            const celdaDescripcion = document.createElement("td");
            celdaDescripcion.textContent = producto.descripcion || "No disponible";
            fila.appendChild(celdaDescripcion);

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = "$" + producto.precioVenta;
            fila.appendChild(celdaPrecio);

            const celdaPesoCantidad = document.createElement("td");
            celdaPesoCantidad.textContent = producto.pesoCantidad;
            fila.appendChild(celdaPesoCantidad);

            const celdaStockActual = document.createElement("td");
            celdaStockActual.textContent = producto.stockActual;
            fila.appendChild(celdaStockActual);

            const celdaStockMinimo = document.createElement("td");
            celdaStockMinimo.textContent = producto.stockMinimo;
            fila.appendChild(celdaStockMinimo);

            const celdaFechaCaducidad = document.createElement("td");
            celdaFechaCaducidad.textContent = producto.fechaCaducidad;
            fila.appendChild(celdaFechaCaducidad);

            const celdaAcciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.classList.add("btn", "btn-warning", "btn-sm");
            botonEditar.textContent = "Editar";
            botonEditar.onclick = () => abrirModalEdicion(producto.idProducto);
            celdaAcciones.appendChild(botonEditar);

            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("btn", "btn-danger", "btn-sm");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.onclick = () => eliminarProducto(producto.idProducto);
            celdaAcciones.appendChild(botonEliminar);

            fila.appendChild(celdaAcciones);

            tabla.appendChild(fila);
        });
    };

    // Función para realizar la búsqueda cuando el usuario hace clic en el botón "Buscar"
    document.getElementById("btnBuscar").addEventListener("click", () => {
        const nombre = document.getElementById("nombreBusqueda").value.toLowerCase();  // Convertir a minúsculas para búsqueda insensible a mayúsculas
        const categoria = document.getElementById("categoriaBusqueda").value.toLowerCase();
        const precioMin = parseFloat(document.getElementById("precioMinBusqueda").value) || 0;
        const precioMax = parseFloat(document.getElementById("precioMaxBusqueda").value) || Infinity;

        // Filtrar productos basados en los filtros
        const productosFiltrados = productosCache.filter(producto => {
            const nombreCoincide = producto.nombre.toLowerCase().includes(nombre);
            const categoriaCoincide = categoria ? producto.categoria.toLowerCase() === categoria : true;
            const precioValido = producto.precioVenta >= precioMin && producto.precioVenta <= precioMax;

            return nombreCoincide && categoriaCoincide && precioValido;
        });

        llenarTabla(productosFiltrados);  // Llenamos la tabla con los productos filtrados
    });

    // Función para guardar un producto (solo creación)
    const guardarProducto = async () => {
        const nuevoProducto = {
            idProducto: null,
            nombre: document.getElementById("nombreProducto").value,
            categoria: document.getElementById("categoriaProducto").value,
            descripcion: document.getElementById("descripcionProducto").value,
            precioVenta: parseFloat(document.getElementById("precioVenta").value),
            pesoCantidad: document.getElementById("pesoCantidad").value,
            fechaCaducidad: document.getElementById("fechaCaducidad").value,
            stockActual: parseInt(document.getElementById("stockActual").value),
            stockMinimo: parseInt(document.getElementById("stockMinimo").value),
        };

        if (!nuevoProducto.nombre || nuevoProducto.precioVenta <= 0 || isNaN(nuevoProducto.stockActual)) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, completa todos los campos correctamente.',
            });
            return;
        }

        try {
            console.log("Datos enviados para nuevo producto:", nuevoProducto);

            const response = await fetch(`${apiUrl}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto),
            });

            if (response.ok) {
                obtenerProductos();
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Producto agregado con éxito.',
                });
                limpiarFormulario();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar el producto.',
                });
            }
        } catch (error) {
            console.error("Error al guardar producto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema con la conexión al servidor.',
            });
        }
    };



    // Eliminar producto
    const eliminarProducto = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${apiUrl}/${id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        obtenerProductos();
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: 'Producto eliminado con éxito.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al eliminar el producto.',
                        });
                    }
                } catch (error) {
                    console.error("Error al eliminar producto:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un problema al intentar eliminar el producto.',
                    });
                }
            }
        });
    };


    // Función para editar un producto
    const abrirModalEdicion = async (idProducto) => {
        try {
            // Obtener el producto por su ID desde la API
            const response = await fetch(`${apiUrl}/${idProducto}`);
            const producto = await response.json();

            if (producto.success) {
                const prod = producto.data;

                // Llenar los campos del formulario con los datos del producto
                document.getElementById("idProducto").value = prod.idProducto;  // Asignar el ID del producto
                document.getElementById("nombreProducto").value = prod.nombre;
                document.getElementById("categoriaProducto").value = prod.categoria;
                document.getElementById("descripcionProducto").value = prod.descripcion || "";
                document.getElementById("precioVenta").value = prod.precioVenta;
                document.getElementById("pesoCantidad").value = prod.pesoCantidad;
                document.getElementById("fechaCaducidad").value = prod.fechaCaducidad;
                document.getElementById("stockActual").value = prod.stockActual;
                document.getElementById("stockMinimo").value = prod.stockMinimo;
                document.getElementById("estatus").value = prod.estatus;

                // Cambia el título del modal para editar
                document.getElementById("modalTitulo").textContent = "Editar Producto";
                document.getElementById("precioVenta").disabled = true;

                // Muestra el modal
                new bootstrap.Modal(document.getElementById('agregarProductoModal')).show();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'Producto no encontrado.',
                });
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener el producto.',
            });
        }
    };

    const editarProducto = async () => {
        const idProducto = document.getElementById("idProducto").value;
        const productoEditado = {
            idProducto: idProducto ? parseInt(idProducto) : null,
            nombre: document.getElementById("nombreProducto").value,
            categoria: document.getElementById("categoriaProducto").value,
            descripcion: document.getElementById("descripcionProducto").value,
            precioVenta: parseFloat(document.getElementById("precioVenta").value),
            pesoCantidad: document.getElementById("pesoCantidad").value,
            fechaCaducidad: document.getElementById("fechaCaducidad").value,
            stockActual: parseInt(document.getElementById("stockActual").value),
            stockMinimo: parseInt(document.getElementById("stockMinimo").value),
            estatus: parseInt(document.getElementById("estatus").value)
        };

        if (!productoEditado.nombre || productoEditado.precioVenta <= 0 || isNaN(productoEditado.stockActual)) {
            Swal.fire({
                title: 'Advertencia',
                text: 'Por favor, completa todos los campos correctamente.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        try {
            console.log("Datos enviados para editar producto:", productoEditado);

            const response = await fetch(`${apiUrl}/${idProducto}`, {
                method: "PUT",  // Usamos PUT para editar
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productoEditado),
            });

            if (response.ok) {
                obtenerProductos();
                Swal.fire({
                    title: 'Acción exitosa',
                    text: 'Producto actualizado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
                limpiarFormulario();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar el producto.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } catch (error) {
            console.error("Error al editar producto:", error);
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al editar el producto. Inténtalo de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };



    const limpiarFormulario = () => {
        document.getElementById("idProducto").value = "";
        document.getElementById("nombreProducto").value = "";
        document.getElementById("categoriaProducto").value = "";
        document.getElementById("descripcionProducto").value = "";
        document.getElementById("precioVenta").value = "";
        document.getElementById("pesoCantidad").value = "";
        document.getElementById("fechaCaducidad").value = "";
        document.getElementById("stockActual").value = "";
        document.getElementById("stockMinimo").value = "";

        // Cambia el título del modal para agregar
        document.getElementById("modalTitulo").textContent = "Agregar Producto";
    };

    document.getElementById("guardarProducto").addEventListener("click", () => {
        const idProducto = document.getElementById("idProducto").value;
        if (idProducto) {
            editarProducto();  // Si existe idProducto, editamos el producto
        } else {
            guardarProducto();  // Si no existe idProducto, guardamos un nuevo producto
        }
    });
    document.getElementById("abrirmodal").addEventListener("click", () => {
        limpiarFormulario();
        document.getElementById("precioVenta").disabled = false;
    });

    // Inicializar tabla
    obtenerProductos();
});