const funciones = [
  {
    idFuncion: 1,
    horaInicio: "10:50",
    horaFin: "11:59",
    dia: "2024-12-05",
    pelicula: {
      nombrePelicula: "Moana",
    },
    tipoFuncion: "Estreno",
    status: 1,
  },
  {
    idFuncion: 2,
    horaInicio: "12:30",
    horaFin: "14:00",
    dia: "2024-12-05",
    pelicula: {
      nombrePelicula: "Frozen",
    },
    tipoFuncion: "Regular",
    status: 1,
  },
  {
    idFuncion: 3,
    horaInicio: "15:00",
    horaFin: "16:45",
    dia: "2024-12-05",
    pelicula: {
      nombrePelicula: "Toy Story",
    },
    tipoFuncion: "Especial",
    status: 1,
  },
  {
    idFuncion: 4,
    horaInicio: "17:00",
    horaFin: "18:50",
    dia: "2024-12-05",
    pelicula: {
      nombrePelicula: "The Lion King",
    },
    tipoFuncion: "Estreno",
    status: 1,
  },
  {
    idFuncion: 5,
    horaInicio: "19:00",
    horaFin: "20:30",
    dia: "2024-12-05",
    pelicula: {
      nombrePelicula: "Encanto",
    },
    tipoFuncion: "Regular",
    status: 1,
  },
];
const obtenerSalas = async () => {
  try {
    const response = await fetch(
      "https://cinepremier-spring-app-cinepremier.azuremicroservices.io/api/v1/cinemarooms"
    );
    if (!response.ok) {
      throw new Error("Error al obtener salas: " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Hubo un problema al obtener las salas:", error);
    return []; // Retornamos un array vacío en caso de error
  }
};
const obtenerFuncionesConfiguradas = async () => {
  try {
    const response = await fetch("http://74.208.86.20:13050/api/funciones/", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        "Error al obtener funciones configuradas: " + response.statusText
      );
    }
    const data = await response.json();
    return data.body; // Retornamos el array de funciones configuradas
  } catch (error) {
    console.error(
      "Hubo un problema al obtener las funciones configuradas:",
      error
    );
    return []; // Retornamos un array vacío en caso de error
  }
};

const inicializarTablas = async function () {
  try {
    const salas = await obtenerSalas();
    const funcionesConfiguradas = await obtenerFuncionesConfiguradas();

    generarTabla(salas);
    generarTablaConfiguradas(funcionesConfiguradas, salas);
  } catch (error) {
    console.error("Error al inicializar las tablas:", error);
  }
};

// Función para generar la tabla de funciones
const generarTabla = function (salas) {
  let html = "";
  const funcionesFiltradas = funciones.filter(
    (funcion) => funcion.status === 1
  );

  funcionesFiltradas.forEach((funcion) => {
    html += `<tr>
                    <td>${funcion.pelicula.nombrePelicula}</td>
                    <td>${funcion.horaInicio}</td>
                    <td>${funcion.horaFin}</td>
                    <td>${getSelectSalas(funcion.idFuncion, salas)}</td>
                    <td><button type="button" class="btn btn-primary" onclick="setearFuncion(${
                      funcion.idFuncion
                    })">Configurar Funcion</button></td>
                </tr>`;
  });

  document.getElementById("tableData").innerHTML = html;
};

// Función para obtener el select de salas
const getSelectSalas = function (funcionId, salas) {
  let options = "";
  salas.forEach((sala) => {
    options += `<option value=${sala.id}>${sala.name}</option>`;
  });
  const select = `<select class="form-select" name="sala_${funcionId}" id="sala_${funcionId}">
                        <option selected>Seleccione una sala</option>
                        ${options}
                    </select>`;
  return select;
};

// Función para configurar una función
const setearFuncion = function (idFuncion) {
  const idSala = document.getElementById(`sala_${idFuncion}`).value;

  const funcionInfo = { idFuncion, idSala, idFuncionProgramada: 0 };

  fetch("http://74.208.86.20:13050/api/funciones/saveFunction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(funcionInfo),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire(
        "Programado",
        "La proyeeción se ha programado correctamente",
        "success"
      );
      window.location.reload();
      console.log("Datos obtenidos:", data);
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    });
};

// Función para generar la tabla de funciones ya configuradas
const generarTablaConfiguradas = function (data, salas) {
  let html = ""; // Inicializar la variable 'html'

  data.forEach((funcionProgramada) => {
    console.log(funcionProgramada);

    const sala = salas.filter((sala) => sala.id === funcionProgramada.idSala);
    const funcion = funciones.filter(
      (funcion) => funcion.idFuncion === funcionProgramada.idFuncion
    );
    console.log(sala, funcion);

    // Construir el HTML
    html += `<tr>
                    <td>${funcion[0].pelicula.nombrePelicula}</td>
                    <td>${funcion[0].horaInicio}</td>
                    <td>${funcion[0].horaFin}</td>
                    <td>${sala[0].name}</td>
                </tr>`;
  });

  document.getElementById("tableDataAsignadas").innerHTML = html;
};

// Llamada inicial para obtener funciones configuradas
inicializarTablas();
