// Llamar a la función al acceder a la página
// document.addEventListener('DOMContentLoaded', obtenerHorarios);
window.onload = function () {
  obtenerHorarios();
};
document.addEventListener("DOMContentLoaded", inicializarValidaciones);

// URL
URL_HORARIOS = "https://cinema-flask.azurewebsites.net/api";
URL_EMPLEADOS = "https://crud-empleado-cine.azurewebsites.net/api/empleados";

// Función para listar los horarios
async function obtenerHorarios() {
  // const endpoint = 'http://127.0.0.1:5000/api/horarios/obtener_horarios_enc';
  const endpoint = URL_HORARIOS + "/horarios/obtener_horarios_enc";

  try {
    const response = await fetch(endpoint);
    const horarios = await response.json();

    llenarTabla(horarios);
  } catch (error) {
    console.error("Error al obtener los horarios:", error);
  }
}

function llenarTabla(horarios) {
  const tbody = document.querySelector("#tabla_horarios tbody");
  tbody.innerHTML = "";

  horarios.forEach((horario, index) => {
    const tr = document.createElement("tr");

    const tdClave = document.createElement("td");
    tdClave.textContent = horario.clave_horario; // Clave del horario
    tr.appendChild(tdClave);

    const tdFechaInicio = document.createElement("td");
    tdFechaInicio.textContent = horario.fecha_inicio; // Fecha de inicio
    tr.appendChild(tdFechaInicio);

    const tdFechaFin = document.createElement("td");
    tdFechaFin.textContent = horario.fecha_fin; // Fecha de fin
    tr.appendChild(tdFechaFin);

    const tdAcciones = document.createElement("td");
    tdAcciones.innerHTML = `
            <button class="btn btn-warning px-4 py-2 shadow-sm" onclick="cargarTablaHorarioModificar(${horario.id_horario_encb})">Actualizar</button>
            <button class="btn btn-danger px-4 py-2 shadow-sm" onclick="confirmarEliminar(${horario.id_horario_encb})">Eliminar</button>
        `;
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr); // Agregamos la fila a la tabla
  });
}

// Para eliminar un horario
function confirmarEliminar(idHorario) {
  console.log(idHorario);
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarHorario(idHorario);
    }
  });
}

async function eliminarHorario(idHorario) {
  try {
    // const response = await fetch(URL_HORARIOS + '/horarios/eliminar_horarios'
    // const response = await fetch('http://127.0.0.1:5000/api/horarios/eliminar_horarios'
    const response = await fetch(URL_HORARIOS + "/horarios/eliminar_horarios", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_horario_encb: idHorario, // Nombre de la clave que espera el backend
      }),
    });

    if (response.ok) {
      const data = await response.json();
      Swal.fire(
        "Eliminado",
        data.message || "El horario ha sido eliminado exitosamente.",
        "success"
      );
      obtenerHorarios(); // Actualiza la tabla de horarios
    } else {
      const errorData = await response.json();
      Swal.fire(
        "Error",
        errorData.error || "No se pudo eliminar el horario.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error al eliminar el horario:", error);
    Swal.fire(
      "Error",
      "Ocurrió un problema al intentar eliminar el horario.",
      "error"
    );
  }
}

// Para agregar nuevos horarios
// Función para cargar la tabla de horarios
async function cargarTablaNuevoHorario() {
  // Agregar la nueva URL_EMPLEADOS para poder consumir los empleados
  // const url = 'http://127.0.0.1:5000/api/empleados/obtener_empleados';
  const url = URL_EMPLEADOS;

  const tablaBody = document.querySelector("#tabla_horarios_agregar tbody");
  tablaBody.innerHTML = ""; // Limpiar tabla

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener empleados");

    const empleados = await response.json();

    empleados.forEach((empleado) => {
      const fila = document.createElement("tr");

      // Crear el campo oculto para guardar el id del empleado
      const inputIdEmpleado = `<input type="hidden" name="id_empleado" value="${empleado.id_empleado}">`;

      // Ahora agregamos el input oculto fuera de las celdas de los turnos
      fila.innerHTML = `
                <td>${empleado.rol}</td>
                <td>${empleado.empleado}</td>
                ${crearCeldasTurnos()}
            `;

      // Agregar el campo oculto con el id del empleado en la fila
      fila.innerHTML = inputIdEmpleado + fila.innerHTML;

      tablaBody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function crearCeldasTurnos() {
  const turnos = ["Mañana", "Tarde", "Descanso"];
  let celdas = "";

  // Crear las celdas con los turnos, cada uno con una lista desplegable
  for (let i = 0; i < 7; i++) {
    const select = document.createElement("select");
    select.classList.add("form-select", "form-select-sm", "form-control");

    // Agregar las opciones de los turnos a la lista
    turnos.forEach((turno) => {
      const option = document.createElement("option");
      option.value = turno;
      option.textContent = turno;
      select.appendChild(option);
    });

    // Agregar el select dentro de una celda <td>
    celdas += `<td>${select.outerHTML}</td>`;
  }

  return celdas;
}

async function agregarHorario() {
  const tablaBody = document.querySelector("#tabla_horarios_agregar tbody");
  const rows = tablaBody.querySelectorAll("tr");
  const detalles = [];

  // Obtener los valores de fecha_inicio y fecha_fin
  const fechaInicio = document.querySelector("#fecha_inicio").value;
  const fechaFin = document.querySelector("#fecha_fin").value;

  // Validar si las fechas están vacías
  if (!fechaInicio || !fechaFin) {
    // Si alguna de las fechas está vacía, mostrar una alerta con SweetAlert
    Swal.fire({
      icon: "warning",
      title: "¡Campos faltantes!",
      text: "Por favor, selecciona las fechas de inicio y fin.",
    });
    return; // Detener la ejecución si las fechas no son válidas
  }

  // Convertir las fechas al formato yyyy-mm-dd
  const fechaInicioFormato = new Date(fechaInicio).toISOString().split("T")[0]; // Formato yyyy-mm-dd
  const fechaFinFormato = new Date(fechaFin).toISOString().split("T")[0]; // Formato yyyy-mm-dd

  // Recorrer las filas de la tabla
  rows.forEach((row) => {
    // Verificar si la fila tiene suficientes celdas
    const cells = row.querySelectorAll("td");
    if (cells.length < 9) {
      console.error("Fila incompleta:", row);
      return; // Si la fila no tiene 9 celdas, la omitimos
    }

    // Obtener los datos de la fila
    const idEmpleado = row.querySelector('input[name="id_empleado"]').value; // Obtener el ID del empleado
    const nombreEmpleado = cells[1].textContent.trim(); // Obtener el nombre del empleado
    const rolEmpleado = cells[0].textContent.trim(); // Obtener el rol del empleado

    const turnos = {
      viernes: cells[2].querySelector("select").value,
      sabado: cells[3].querySelector("select").value,
      domingo: cells[4].querySelector("select").value,
      lunes: cells[5].querySelector("select").value,
      martes: cells[6].querySelector("select").value,
      miercoles: cells[7].querySelector("select").value,
      jueves: cells[8].querySelector("select").value,
    };

    // Crear el objeto para este empleado
    const detalle = {
      id_empleado: parseInt(idEmpleado),
      nombre_empleado: nombreEmpleado,
      rol_empleado: rolEmpleado,
      turnos: turnos,
    };

    // Agregar el objeto a la lista de detalles
    detalles.push(detalle);
  });

  // Crear el JSON con la estructura requerida
  const horario = {
    clave_horario: null,
    detalles: detalles,
    fecha_inicio: fechaInicioFormato,
    fecha_fin: fechaFinFormato,
    id_horario_encb: 0,
  };

  // Enviar el JSON al backend
  try {
    // const response = await fetch('http://127.0.0.1:5000/api/horarios/guardar_horario'
    // const response = await fetch(URL_HORARIOS + '/horarios/guardar_horario'
    const response = await fetch(URL_HORARIOS + "/horarios/guardar_horario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(horario),
    });

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error("Error al agregar horario");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    // Mostrar alerta de éxito con SweetAlert
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "El horario se ha agregado correctamente.",
    });

    obtenerHorarios();
    document.getElementById("vista_horarios").style.display = "block";
    document.getElementById("vista_nuevo_horario").style.display = "none";
  } catch (error) {
    console.error("Error:", error);

    // Mostrar alerta de error con SweetAlert
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un problema al agregar el horario. Intenta nuevamente.",
    });
  }
}

// Para modificar horarios
// Función para cargar los detalles del horario para modificarlo
async function cargarTablaHorarioModificar(idHorarioEncb) {
  document.getElementById("id_horario_encb").value = idHorarioEncb;
  try {
    // Realizar la petición al backend
    // http://127.0.0.1:5000/api/horarios/obtener_horarios_por_id
    const response = await fetch(
      URL_HORARIOS + "/horarios/obtener_horarios_por_id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_horario_encb: idHorarioEncb }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los detalles del horario");
    }

    const data = await response.json();

    // Cargar las fechas
    document.getElementById("fecha_inicio_actualizar").value =
      data.fecha_inicio;
    document.getElementById("fecha_fin_actualizar").value = data.fecha_fin;

    // Generar las filas de la tabla
    const tbody = document
      .getElementById("tabla_horarios_actualizar")
      .querySelector("tbody");
    tbody.innerHTML = ""; // Limpiar contenido previo

    // Crear la tabla con los detalles de los empleados
    data.detalles.forEach((detalle) => {
      const row = document.createElement("tr");

      // Crear columnas
      const rolCol = document.createElement("td");
      rolCol.textContent = detalle.rol_empleado;

      const nombreCol = document.createElement("td");
      nombreCol.textContent = detalle.nombre_empleado;

      // Input oculto para el ID del empleado
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "id_empleado";
      hiddenInput.value = detalle.id_empleado;
      nombreCol.appendChild(hiddenInput);

      // Agregar las columnas al row
      row.appendChild(rolCol);
      row.appendChild(nombreCol);

      // Crear selects dinámicos para los turnos (viernes a jueves)
      const turnos = ["Mañana", "Tarde", "Descanso"];
      const diasSemana = [
        "viernes",
        "sabado",
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
      ];

      diasSemana.forEach((dia) => {
        const turnoCol = document.createElement("td");
        const select = document.createElement("select");

        // Agregar clases al select
        select.classList.add("form-select", "form-select-sm", "form-control");

        // Agregar opciones al select
        turnos.forEach((turno) => {
          const option = document.createElement("option");
          option.value = turno;
          option.textContent = turno;

          // Seleccionar la opción correspondiente
          if (detalle.turnos[dia] === turno) {
            option.selected = true;
          }

          select.appendChild(option);
        });

        turnoCol.appendChild(select);
        row.appendChild(turnoCol);
      });

      // Agregar la fila a la tabla
      tbody.appendChild(row);
    });

    // Mostrar la sección de modificación
    document.getElementById("vista_horarios").style.display = "none";
    document.getElementById("vista_modificar_horario").style.display = "block";
  } catch (error) {
    console.error("Error al cargar el horario:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un problema al cargar el horario. Intenta nuevamente.",
    });
  }
}

async function actualizarHorario() {
  try {
    // Obtener el ID del horario
    const idHorarioEncb = document.getElementById("id_horario_encb").value;

    // Obtener las fechas
    const fechaInicio = document.getElementById(
      "fecha_inicio_actualizar"
    ).value;
    const fechaFin = document.getElementById("fecha_fin_actualizar").value;

    // Obtener las filas de la tabla
    const tbody = document
      .getElementById("tabla_horarios_actualizar")
      .querySelector("tbody");
    const filas = tbody.querySelectorAll("tr");

    const detalles = Array.from(filas).map((fila) => {
      // Extraer datos de cada fila
      const rolEmpleado = fila.cells[0].textContent;
      const nombreEmpleado = fila.cells[1].textContent;
      const idEmpleado = fila.cells[1].querySelector(
        'input[name="id_empleado"]'
      ).value;

      // Extraer los turnos de los selects
      const turnos = {};
      const diasSemana = [
        "viernes",
        "sabado",
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
      ];
      diasSemana.forEach((dia, index) => {
        const select = fila.cells[index + 2].querySelector("select");
        turnos[dia] = select.value;
      });

      return {
        id_empleado: parseInt(idEmpleado, 10),
        nombre_empleado: nombreEmpleado,
        rol_empleado: rolEmpleado,
        turnos: turnos,
      };
    });

    // Construir el JSON para enviar al backend
    const payload = {
      id_horario_encb: parseInt(idHorarioEncb, 10),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      detalles: detalles,
    };

    // Realizar la petición POST
    // 'http://127.0.0.1:5000/api/horarios/guardar_horario'
    const response = await fetch(URL_HORARIOS + "/horarios/guardar_horario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Error al guardar los cambios del horario");
    }

    const result = await response.json();

    Swal.fire({
      icon: "success",
      title: "¡Horario actualizado!",
      text: "Los cambios se han guardado correctamente.",
    });

    // Opcional: Recargar o actualizar la vista
    document.getElementById("vista_modificar_horario").style.display = "none";
    document.getElementById("vista_horarios").style.display = "block";
    obtenerHorarios();
  } catch (error) {
    console.error("Error al guardar los cambios del horario:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un problema al guardar los cambios. Intenta nuevamente.",
    });
  }
}

// Validaciones de fechas
function inicializarValidaciones() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes en formato MM
  const dd = String(hoy.getDate()).padStart(2, "0"); // Día en formato DD
  const fechaMinima = `${yyyy}-${mm}-${dd}`;

  // Configurar validaciones para cada par de inputs
  configurarValidaciones("fecha_inicio", "fecha_fin", fechaMinima);
  configurarValidaciones(
    "fecha_inicio_actualizar",
    "fecha_fin_actualizar",
    fechaMinima
  );
}

function configurarValidaciones(fechaInicioId, fechaFinId, fechaMinima) {
  const fechaInicioInput = document.getElementById(fechaInicioId);
  const fechaFinInput = document.getElementById(fechaFinId);

  // Bloquear días pasados para la fecha de inicio
  fechaInicioInput.setAttribute("min", fechaMinima);

  // Validar que la fecha de inicio sea viernes y calcular fecha de fin
  fechaInicioInput.addEventListener("change", () => {
    const fechaInicioValor = fechaInicioInput.value;
    if (!fechaInicioValor) return; // Si no hay valor, no hacer nada

    const fechaInicio = new Date(fechaInicioValor + "T00:00");

    // Verificar si el día seleccionado es viernes
    if (fechaInicio.getUTCDay() !== 5) {
      Swal.fire({
        icon: "warning",
        title: "La fecha seleccionada no es viernes",
        text: "Selecciona una fecha de inicio que sea viernes.",
      });
      fechaInicioInput.value = "";
      fechaFinInput.value = "";
      return;
    }

    // Calcular la fecha de fin (el siguiente jueves)
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    const yyyy = fechaFin.getFullYear();
    const mm = String(fechaFin.getMonth() + 1).padStart(2, "0");
    const dd = String(fechaFin.getDate()).padStart(2, "0");
    fechaFinInput.value = `${yyyy}-${mm}-${dd}`;
  });
}

// Funciones para ocultar contenido
document
  .getElementById("btnAgregarHorario")
  .addEventListener("click", function () {
    document.getElementById("vista_horarios").style.display = "none";
    document.getElementById("vista_nuevo_horario").style.display = "block";
    document.getElementById("id_horario_encb").value = 0;
    cargarTablaNuevoHorario(); // Llamar a la función para llenar la tabla
  });

document
  .getElementById("btnCancelarAgregarHorario")
  .addEventListener("click", function () {
    document.getElementById("vista_horarios").style.display = "block";
    document.getElementById("vista_nuevo_horario").style.display = "none";
  });

document
  .getElementById("btnCancelarActualizarHorario")
  .addEventListener("click", () => {
    // Ocultar la vista de modificación y mostrar el listado de horarios
    document.getElementById("vista_modificar_horario").style.display = "none";
    document.getElementById("vista_horarios").style.display = "block";
  });
