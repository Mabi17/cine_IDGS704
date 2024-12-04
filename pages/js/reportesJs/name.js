
  // Función para obtener datos desde la API
  async function fetchData(apiEndpoint) {
    try {
      const response = await fetch(apiEndpoint); // Llama a la API
      return await response.json(); // Convierte la respuesta a JSON
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

  // Función para crear gráficos con Chart.js
  function createChart(canvasId, chartType, labels, data, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels, // Etiquetas (e.g., días, productos)
        datasets: [{
          label: title,
          data: data, // Datos para graficar
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: title }
        }
      }
    });
  }

  // Función para inicializar los gráficos
  async function init() {
    // Obtener datos de la API
    const ventasDia = await fetchData('http://127.0.0.1:5000/ventas_por_dia');
    const ventasSemana = await fetchData('http://127.0.0.1:5000/ventas_por_semana');
    const ventasMes = await fetchData('http://127.0.0.1:5000/ventas_por_mes');
    const ventasAnio = await fetchData('http://127.0.0.1:5000/ventas_por_anio');
    const productosMasVendidos = await fetchData('http://127.0.0.1:5000/productos_mas_vendidos');
    
    // Graficar Ventas Diarias
    createChart(
      'ventasDia',
      'line', // Tipo de gráfico: línea
      ventasDia.map(d => d.fecha), // Etiquetas (fechas)
      ventasDia.map(d => d.total), // Datos (totales)
      'Ventas Diarias' // Título
    );
    // Graficar Ventas Semanal
    createChart(
      'ventasSemana',
      'line', // Tipo de gráfico: línea
      ventasSemana.map(d => d.fecha), // Etiquetas (fechas)
      ventasSemana.map(d => d.total), // Datos (totales)
      'Ventas Semanal' // Título
    );
    // Graficar Ventas Mensual
    createChart(
      'ventasMes',
      'radar', // Tipo de gráfico: línea
      ventasMes.map(d => d.fecha), // Etiquetas (fechas)
      ventasMes.map(d => d.total), // Datos (totales)
      'Ventas Mensual' // Título
    );
    // Graficar Ventas por año
    createChart(
      'ventasAnio',
      'polarArea', // Tipo de gráfico: línea
      ventasAnio.map(d => d.fecha), // Etiquetas (fechas)
      ventasAnio.map(d => d.total), // Datos (totales)
      'Venta Anual' // Título
    );

    // Graficar Productos Más Vendidos
    createChart(
      'ventasTop',
      'bar', // Tipo de gráfico: barras
      productosMasVendidos.map(p => p.producto), // Etiquetas (productos)
      productosMasVendidos.map(p => p.cantidad), // Datos (cantidades)
      'Top Productos Vendidos' // Título
    );
  }

  // Inicializar las gráficas al cargar la página
  document.addEventListener('DOMContentLoaded', init);

/**
 * 
 */
fetch('http://localhost:5000/total_ventas')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentas').innerText = '$' + data.total_ventas;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentas').innerText = 'Error al cargar el total.';
});

fetch('http://localhost:5000/total_ventas_semana')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentasSemana').innerText = '$' + data.total_ventas_semana;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentasSemana').innerText = 'Error al cargar el total.';
});
fetch('http://localhost:5000/total_ventas_mes')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentasMes').innerText = '$' + data.total_ventas_mes;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentasMes').innerText = 'Error al cargar el total.';
});
fetch('http://localhost:5000/total_ventas_anio')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentasAnio').innerText = '$' + data.total_ventas_anio;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentasAnio').innerText = 'Error al cargar el total.';
});