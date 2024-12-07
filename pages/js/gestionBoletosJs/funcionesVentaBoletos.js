$(document).ready(function () {
    fetchPeliculas();
});

// Función para cargar las películas
function fetchPeliculas() {
    $.ajax({
        url: 'https://cineventaboletos.uc.r.appspot.com/api/peliculas',
        method: 'GET',
        success: function (peliculas) {
            const container = $('#peliculas-container');
            container.empty();

            peliculas.forEach(pelicula => {
                const imagePath = `img/${pelicula.idPelicula}.jpeg`; // Ruta de las imágenes
                const card = `
                    <div class="col-md-4 d-flex align-items-stretch">
                        <div class="card mb-4 shadow" style="color: black;">
                            <img src="${imagePath}" class="card-img-top" alt="${pelicula.titulo}" 
                                style="height: 200px; object-fit: cover;"> <!-- Tamaño fijo para las imágenes -->
                            <div class="card-body">
                                <h5 class="card-title">${pelicula.titulo}</h5>
                                <p class="card-text">${pelicula.descripcion}</p>
                                <button class="btn btn-primary" style="background-color: #EE4946; border-color: #EE4946;" 
                                        onclick="mostrarFunciones(${pelicula.idPelicula}, '${pelicula.titulo}')">
                                    Ver Funciones
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.append(card); // Agrega cada tarjeta al contenedor
            });

            ajustarAlturaDeCards();
        },
        error: function () {
            $('#peliculas-container').html('<p class="text-danger">Error al cargar las películas.</p>');
        }
    });
}

// Función para ajustar la altura de todas las cards
function ajustarAlturaDeCards() {
    const cards = $('.card');
    let maxHeight = 0;

    cards.each(function () {
        const height = $(this).height();
        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    cards.height(maxHeight);
}

// Función para mostrar funciones agrupadas por sala
function mostrarFunciones(idPelicula, titulo) {
    $.ajax({
        url: `https://cineventaboletos.uc.r.appspot.com/api/peliculas/${idPelicula}/funciones`,
        method: 'GET',
        success: function (funciones) {
            const funcionesPorSala = funciones.reduce((acc, funcion) => {
                const salaKey = `${funcion.sala.numeroSala} (${funcion.sala.tipoSala})`;
                if (!acc[salaKey]) {
                    acc[salaKey] = [];
                }
                acc[salaKey].push({
                    idFuncion: funcion.idFuncion,
                    horarioInicio: funcion.horarioInicio
                });
                return acc;
            }, {});

            let modalContent = '';
            for (const [sala, horarios] of Object.entries(funcionesPorSala)) {
                modalContent += `
                    <div class="mb-3">
                        <strong>${sala}</strong>
                        <div class="d-flex flex-wrap gap-3 mt-2">
                            ${horarios
                                .map(horario =>
                                    `<button class="btn" style="background-color: #FFF9C4; color: black; border: 1px solid #CCC;" 
                                        onclick="seleccionarFuncion(${horario.idFuncion}, '${titulo}')">${horario.horarioInicio}</button>`)
                                .join('')}
                        </div>
                    </div>
                `;
            }

            const modalHTML = `
                <div class="modal fade" tabindex="-1" id="funcionModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" style="color: black;">Funciones para: ${titulo}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" style="color: black;">
                                ${modalContent}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHTML);
            const modal = $('#funcionModal');
            modal.modal('show');

            // Remover el modal cuando se cierre
            modal.on('hidden.bs.modal', function () {
                modal.remove();
            });
        },
        error: function () {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar las funciones.',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#EE4946'
            });
        }
    });
}

// Función para seleccionar una función y realizar la compra
function seleccionarFuncion(idFuncion, tituloPelicula) {
    // Cerrar el modal de funciones al seleccionar un horario
    $('#funcionModal').modal('hide');

    $.ajax({
        url: `https://cineventaboletos.uc.r.appspot.com/api/peliculas/funcion/${idFuncion}`,
        method: 'GET',
        success: function (data) {
            const modalCompraHTML = `
                <div class="modal fade" tabindex="-1" id="compraModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" style="color: black;">Comprar Boletos: ${tituloPelicula}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" style="color: black;">
                                <p><strong>Sala:</strong> ${data.sala.numeroSala} (${data.sala.tipoSala})</p>
                                <p><strong>Horario:</strong> ${data.horarioInicio}</p>
                                <form id="compraForm">
                                    <div class="mb-3">
                                        <label class="form-check-label" for="adulto">Boleto Adulto ($80)</label>
                                        <input type="number" id="cantidadAdultos" class="form-control mt-2" placeholder="Cantidad">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-check-label" for="nino">Boleto Niño ($40)</label>
                                        <input type="number" id="cantidadNinos" class="form-control mt-2" placeholder="Cantidad">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" id="confirmarCompra">Confirmar Compra</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            $('body').append(modalCompraHTML);
            const modal = $('#compraModal');
            modal.modal('show');

            $('#confirmarCompra').click(function () {
                const cantidadAdultos = parseInt($('#cantidadAdultos').val()) || 0;
                const cantidadNinos = parseInt($('#cantidadNinos').val()) || 0;

                if (cantidadAdultos === 0 && cantidadNinos === 0) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Debe seleccionar al menos un boleto.',
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#EE4946'
                    });
                    return;
                }

                const compraData = {
                    idFuncion: data.idFuncion,
                    boletos: {
                        adulto: cantidadAdultos,
                        nino: cantidadNinos
                    }
                };

                $.ajax({
                    url: 'https://cineventaboletos.uc.r.appspot.com/api/boletos/compra',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(compraData),
                    success: function (boletos) {
                        modal.modal('hide');
                        modal.on('hidden.bs.modal', function () {
                            modal.remove();
                        });

                        mostrarResumenCompra(data, boletos);
                    },
                    error: function () {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo registrar la compra.',
                            confirmButtonText: 'Cerrar',
                            confirmButtonColor: '#EE4946'
                        });
                    }
                });
            });

            modal.on('hidden.bs.modal', function () {
                modal.remove();
            });
        },
        error: function () {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener la información de la función.',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#EE4946'
            });
        }
    });
}

// Mostrar resumen de la compra
function mostrarResumenCompra(data, boletos) {
    const boletosInfo = boletos
        .map(boleto => `<p><strong>Boleto ${boleto.categoria}:</strong> ${boleto.codigoBoleto}</p>`)
        .join('');

    const resumenHTML = `
        <div class="modal fade" tabindex="-1" id="resumenModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" style="color: black;">Resumen de Compra</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="color: black;">
                        <p><strong>Película:</strong> ${data.pelicula.titulo}</p>
                        <p><strong>Sala:</strong> ${data.sala.numeroSala} (${data.sala.tipoSala})</p>
                        <p><strong>Horario:</strong> ${data.horarioInicio}</p>
                        ${boletosInfo}
                    </div>
                    <a href="reservacionBoletos.html" class="submit-btn">Reservar Asientos</a>
                </div>
            </div>
        </div>
    `;

    $('body').append(resumenHTML);
    const modal = $('#resumenModal');
    modal.modal('show');

    modal.on('hidden.bs.modal', function () {
        modal.remove();
    });
}
