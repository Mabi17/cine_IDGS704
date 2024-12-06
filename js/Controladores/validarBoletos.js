document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.submit-btn');
    const messageContainer = document.querySelector('#message');
    const codigoBoletoInput = document.querySelector('#codigo-boleto');

    submitButton.addEventListener('click', () => {
        const codigoBoleto = codigoBoletoInput.value.trim();

        // Validación del código del boleto
        if (!codigoBoleto) {
            messageContainer.innerText = 'Por favor, ingrese el código del boleto.';
            return;
        }

        // Llamada al servicio con Fetch API
        fetch('http://127.0.0.1:5000/validar-boleto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'codigo-boleto': codigoBoleto })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const boleto = data.data;
                document.querySelector('#message').innerHTML = `
                    <strong>Boleto válido:</strong><br>
                    Película: ${boleto.pelicula}<br>
                    Funcion: ${boleto.idFuncion}<br>
                    Asiento: ${boleto.num_asiento}<br>
                    Hora: ${boleto.horario}
                `;
            } else {
                document.querySelector('#message').innerText = data.message;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.querySelector('#message').innerText = 'Boleto no encontrado.';
        });
        
    });
});
