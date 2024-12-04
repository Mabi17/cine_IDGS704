let data = [];
let sits = null;
let maxSeats = null;
let idFuncion = null;
let fechaCompra = null;
let bodyRequest = [];


function toggleSeatSelection(seatId) {
  const seat = document.getElementById(seatId);
  seat.classList.toggle("seleccionado");
  seat.classList.toggle("no-seleccionado");

  if (getSelectedSeats().length > maxSeats) {
    deselectSeat(getSelectedSeats()[0]);
  }
}

function confirmSelection() {
  var body = [];
  var idx = 0;
  const selectedSeats = getSelectedSeats();
  selectedSeats.forEach(seat => {
    let element = {};
    element.num_asiento = +seat.id.replace("sit", "");
    element.idFuncion = idFuncion;
    element.fechaCompra = new Date(fechaCompra).toISOString();
    element.codigoBoleto = data[idx].codigoBoleto;
    body.push(element);
    idx = idx + 1;
  });
  bodyRequest = body;
  modalConfirmacion();
}

function modalConfirmacion() {
  const modal = document.getElementById("myModal");
  modal.style.display = "flex";

  const modalBody = document.querySelector("#myModal .modal-body p");
  const btn = document.getElementById("modCreateReser");

  if (getSelectedSeats().length == maxSeats) {
    modalBody.innerHTML = getMessage();
    btn.hidden = false;
  } else {
    btn.hidden = true;
    modalBody.innerHTML = getMessageSlotsEmpty()
  }

}

function getMessage() {
  return "<b>Pelicula:</b> " + getPelicula()
    + "<br> <b>Fecha:</b> " + getFecha()
    + "<br> <b>Horario:</b> " + getHorario()
    + "<br> <b>Duracion:</b> " + getDuracion()
    + "<br> <b>Asientos:</b> " + getAsientos()
}
function getMessageSlotsEmpty() {
  return "Hace falta seleccionar todos tus asientos"
}

function getPelicula() {
  return data[0].funcion.pelicula.titulo;
}

function getFecha() {
  return data[0].funcion.fechaProyeccion;
}

function getDuracion() {
  return data[0].funcion.pelicula.duracion + " min";
}

function getHorario() {
  return data[0].funcion.horarioInicio + " hrs";
}

function getAsientos() {
  let selectedSeatsArray = Array.from(getSelectedSeats()).map(sit => sit.id.replace("sit", "A"));
  let str = selectedSeatsArray.join(", ");
  return str;
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function getSelectedSeats() {
  return document.querySelectorAll(".asiento.seleccionado:not(.ocupado):not(.no-seleccionado)");
}

function deselectSeat(seat) {
  seat.classList.replace("seleccionado", "no-seleccionado");
}

function createInstance(data) {
  idFuncion = data[0].funcion.idFuncion;
  maxSeats = data.length;
  fechaCompra = data[0].fechaCompra;
}

async function getFunctionsReservations(id = idFuncion) {
  return makeRequest("http://162.214.153.239:5011/api/reservas/get_reservas_funciones", "POST", { id_funcion: id });
}
async function getInstanceData() {
  return makeRequest("https://cineventaboletos.uc.r.appspot.com/api/boletos/ultimos");
}
async function createReservation() {
  return makeRequest("http://162.214.153.239:5011/api/reservas/create_reserva", "POST", bodyRequest);
}
async function makeRequest(url, method = 'GET', data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Hubo un problema con la petición:', error);
    throw error;
  }
}