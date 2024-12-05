let funcionesCanceladas = [];
let pelis = [];

function cargarDatosFuncionesCanceladas() {
  const url = "http://192.168.1.7:8080/cine_IDGS704/api/funciones/funcionesCanceladas";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      funcionesCanceladas = data;
      const container = document.getElementById("funcionesCanceladasContainer");

      container.innerHTML = "";

      if (data && data.length > 0) {
        data.forEach((funcionCancelada, i) => {
          const pelicula = funcionCancelada.peliculas;
          const motivo = funcionCancelada.motivoCancelacion;
          const detalle = funcionCancelada.detalleFuncionCancelada;
          const empleado = funcionCancelada.empleado.nombreEmpleado;
          const fechaPresentacion = funcionCancelada.programacionFunciones.fechaPelicula;
          const fechaCancelacion = funcionCancelada.fechaCancelacion;
          const foto = pelicula.foto;

          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

          listItem.innerHTML = `
                        <div class="d-flex align-items-center">
                            <img src="${foto}" alt="${pelicula.nombrePelicula}" style="width: 180px; height: 230px; object-fit: cover; margin-right: 15px;">
                            <div>
                                <h5>${pelicula.nombrePelicula}</h5>
                                <p>Motivo: ${motivo}</p>
                                <p>Detalle de Cancelación: ${detalle}</p>
                                <p>Empleado que canceló la función: ${empleado}</p>
                                <p>Fecha de presentación: ${fechaPresentacion}</p>
                                <p>Fecha de cancelación: ${fechaCancelacion}</p>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-info btn-detalles" onclick="SeleccionarFuncion(${i});" data-bs-toggle="modal" data-bs-target="#modalDetalles">Detalles</button>
                            
                        </div>
                    `;
          container.appendChild(listItem);
        });
      } else {
        container.innerHTML = "<p>No hay funciones canceladas disponibles.</p>";
      }
    })
    .catch(error => console.error("Error al cargar los datos:", error));
}
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosFuncionesCanceladas();

  document.getElementById("campoBusqueda").addEventListener("input", buscarPeliculas);
});

function SeleccionarFuncion(i) {
  const funcion = funcionesCanceladas[i];
  document.getElementById("detalleTituloPelicula").value = funcion.peliculas.nombrePelicula;
  const foto = funcion.peliculas.foto;
  const imgElemento = document.getElementById("fotoPelicula");
  if (foto) {
    imgElemento.src = foto;
    imgElemento.alt = funcion.peliculas.nombrePelicula || "Sin nombre";
  }
  document.getElementById("detalleAsientosOcupados").value = funcion.programacionFunciones.asientosOcupados;
  document.getElementById("detalleMotivoPelicula").value = funcion.motivoCancelacion;
  document.getElementById("detalleFechaPresentacion").value = funcion.programacionFunciones.fechaPelicula;
  document.getElementById("detalleFechaCancelacion").value = funcion.fechaCancelacion;
  document.getElementById("detalleSala").value = funcion.salaCancelada;
  document.getElementById("detCancelacion").value = funcion.detalleFuncionCancelada;
  document.getElementById("datalleIdioma").value = funcion.programacionFunciones.idioma;
  document.getElementById("empleadoCancelado").value = funcion.empleado.nombreEmpleado;
  document.getElementById("detalleTipo").value = funcion.programacionFunciones.tipoPelicula;

}

document.getElementById("campoBusqueda").addEventListener("input", buscarPeliculas);

function buscarPeliculas() {
  const term = document.getElementById("campoBusqueda").value.toLowerCase();
  const container = document.getElementById("funcionesCanceladasContainer");

  if (term === "") {
    cargarDatosFuncionesCanceladas();
    return;
  }

  const response = funcionesCanceladas.filter(funcion =>
    funcion.peliculas.nombrePelicula.toLowerCase().includes(term)
  );

  container.innerHTML = "";

  if (response.length > 0) {
    response.forEach((funcionCancelada, i) => {
      const pelicula = funcionCancelada.peliculas;
      const motivo = funcionCancelada.motivoCancelacion;
      const fechaPresentacion = funcionCancelada.programacionFunciones.fechaPelicula;
      const fechaCancelacion = funcionCancelada.fechaCancelacion;
      const foto = pelicula.foto;

      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

      listItem.innerHTML = `
              <div class="d-flex align-items-center">
                  <img src="${foto}" alt="${pelicula.nombrePelicula}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 15px;">
                  <div>
                      <h5>${pelicula.nombrePelicula}</h5>
                      <p>Motivo: ${motivo}</p>
                      <p>Fecha de presentación: ${fechaPresentacion}</p>
                      <p>Fecha de cancelación: ${fechaCancelacion}</p>
                  </div>
              </div>
              <div>
                  <button class="btn btn-info btn-detalles" onclick="SeleccionarFuncion(${i});" data-bs-toggle="modal" data-bs-target="#modalDetalles">Detalles</button>
                  <button class="btn btn-success btn-reactivar" data-id="${funcionCancelada.idFuncion}">Reactivar</button>
              </div>
          `;
      container.appendChild(listItem);
    });
  } else {
    container.innerHTML = "<p>No se encontraron funciones canceladas para la película especificada.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const modalCancelacion = document.getElementById("modalCancelacion");

  modalCancelacion.addEventListener("show.bs.modal", () => {
    cargarPelisSelect();
  });
});

let programacionFuncionesData = [];

function cargarPelisSelect() {
  fetch("http://192.168.1.7:8080/cine_IDGS704/api/funciones/obtener")
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return response.json();
    })
    .then(pelis => {
      programacionFuncionesData = pelis;

      let datosP = "<option value='' disabled selected>Seleccione una película</option>";
      pelis.forEach(programacionFunciones => {
        datosP += `<option value="${programacionFunciones.idProgramacionFuncion}">${programacionFunciones.pelicula.nombrePelicula}</option>`;
      });

      document.getElementById("selectPeliculas").innerHTML = datosP;
      document.getElementById("selectPeliculas").addEventListener("change", actualizarCampos);
    })
    .catch(error => {
      console.error("Error al cargar las películas:", error);
      document.getElementById("selectPeliculas").innerHTML =
        "<option value='' disabled>Error al cargar películas</option>";
    });
}
cargarPelisSelect();


function actualizarCampos() {
  const idFuncionSeleccionada = document.getElementById("selectPeliculas").value;
  const funcionSeleccionada = programacionFuncionesData.find(
    funcion => funcion.idProgramacionFuncion.toString() === idFuncionSeleccionada
  );

  if (funcionSeleccionada) {
    document.getElementById("salaFuncion").value = funcionSeleccionada.salas.nombreSalas || "Sin datos";

    document.getElementById("asientosOcupados").value =
      funcionSeleccionada.asientosOcupados || "Sin datos";
    document.getElementById("tipoPelicula").value =
      funcionSeleccionada.tipoPelicula || "Sin datos";
    document.getElementById("idiomaPelicula").value =
      funcionSeleccionada.idioma || "Sin datos";
    document.getElementById("fechaPresentacionModal").value =
      funcionSeleccionada.fechaPelicula || "Sin datos";
  } else {
    console.warn("No se encontró la función seleccionada.");
  }
}

function limpiar() {
  document.getElementById("selectPeliculas").value = "";
  document.getElementById("salaFuncion").value = "";
  document.getElementById("asientosOcupados").value = "";
  document.getElementById("tipoPelicula").value = "";
  document.getElementById("idiomaPelicula").value = "";
  document.getElementById("fechaPresentacionModal").value = "";
  document.getElementById("motivosCancelacion").value = "";
  document.getElementById("selectEmpleado").value = "";
  document.getElementById("detalleCancelacion").value = "";
}

function cargarEmpleadosSelect() {
  fetch("http://192.168.1.7:8080/cine_IDGS704/api/funciones/empleados")
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener los empleados");
      }
      return response.json();
    })
    .then(empleados => {
      let opciones = "<option value='' disabled selected>Seleccione un empleado</option>";
      empleados.forEach(empleado => {
        opciones += `<option value="${empleado.idEmpleado}">${empleado.nombreEmpleado}</option>`;
      });

      document.getElementById("selectEmpleado").innerHTML = opciones;
    })
    .catch(error => {
      console.error("Error al cargar los empleados:", error);
      document.getElementById("selectEmpleado").innerHTML =
        "<option value='' disabled>Error al cargar empleados</option>";
    });
}

document.addEventListener("DOMContentLoaded", cargarEmpleadosSelect);

function obtenerDatosFormulario() {

  const selectPeliculas = document.getElementById("selectPeliculas");
  const idProgramacionSeleccionada = selectPeliculas.value;
  const idEmpleado = document.getElementById("selectEmpleado").value;

  const motivoCancelacion = document.getElementById("motivosCancelacion").value;
  const detalleCancelacion = document.getElementById("detalleCancelacion").value;

  if (!idProgramacionSeleccionada || !idEmpleado || !motivoCancelacion || !detalleCancelacion) {

    Swal.fire({
      position: "center",
      showConfirmButton: false,
      timer: 1500,
      title: '¡Cuidao mi parce!',
      text: 'Ingrese los datos faltantes.',
      icon: 'info',
    });

    return null;
  }
  return {
    idEmpleado: parseInt(idEmpleado),
    idProgramacionFuncion: parseInt(idProgramacionSeleccionada),
    motivoCancelacion: motivoCancelacion,
    detalleCancelacion: detalleCancelacion
  };
}

function insertarFuncionCancelada() {
  const datos = obtenerDatosFormulario();
  if (!datos) {
    return;
  }

  const params = new URLSearchParams({
    idEmpleado: datos.idEmpleado,
    idProgramacionFuncion: datos.idProgramacionFuncion,
    motivoCancelacion: datos.motivoCancelacion,
    detalleCancelacion: datos.detalleCancelacion
  });

  const ruta = "http://192.168.1.7:8080/cine_IDGS704/api/funciones/agregarFuncionCancelada";
  fetch(ruta,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: params
    })
    .then(response => response.json())
    .then(response => {
      if (response.result) {
        Swal.fire({
          title: "¡Inserción correcta!",
          text: "yei yei bebé",
          position: "top-end",
          icon: "success",
          confirmButtonText: "Aceptar"
        });

      }
      if (response.error) {
        Swal.fire({
          title: "Problemas para insertar",
          text: response.error,
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
      
      limpiar();
      cargarDatosFuncionesCanceladas();
    })
    .catch(error => {
      Swal.fire({
        title: "Error inesperado",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      console.error("Error en la solicitud:", error);
    });
}

// Agregar el evento al botón
document.getElementById("btnInsertarCancelacion").addEventListener("click", insertarFuncionCancelada);


