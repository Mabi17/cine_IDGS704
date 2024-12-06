
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

  function createChart1(canvasId, chartType, productData, labels, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
  
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels, // Los nombres de los productos
        datasets: [{
          label: title,
          data: productData, // Las cantidades vendidas de cada producto
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
    const ventasProductos = await fetchData('http://127.0.0.1:5000/ventas_por_dia');
    const producto_top = await fetchData('http://localhost:5000/producto_vendido');
    const ventasSemana = await fetchData('http://localhost:5000/suma_total_ventas');

    

    const ventaIds = ventasDia.ventas.map(v => `Venta ${v.id}`);
    const ventaTotales = ventasDia.ventas.map(v => v.total);

    const ventaSemana = ventasDia.ventas_sema.map(v => v.id);
    const ventasS = ventasDia.ventas_sema.map(v =>  v.total );

    const ventaMes = ventasDia.ventas_mes.map(v => v.id);
    const ventasMess = ventasDia.ventas_mes.map(v =>  v.total );

    const ventaAnio = ventasDia.ventas_anio.map(v => v.id);
    const ventasAnio = ventasDia.ventas_anio.map(v =>  v.total );

    const productosNombre = ventasProductos.productos.map(v =>  v.nombre );
    const productos = producto_top.productos;  // Lista de todos los productos y cantidades
    const productoTop = productos.map(v => v.cantidad);  // Extraer las cantidades de ventas
    const nombresProductos = productos.map(v => v.producto);
    // Graficar Ventas Diarias (individuales)
    
    // Graficar Ventas Diarias
    createChart(
      'ventasDia',       // ID del canvas
      'line',             // Tipo de gráfico: barras
      ventaIds,          // Etiquetas: IDs de ventas
      ventaTotales,      // Datos: Totales individuales
      'Ventas del día' // Título
    );
    createChart(
      'ventasSemana',       // ID del canvas
      'bar',
      ventaSemana,             // Tipo de gráfico: barras
      ventasS,          // Etiquetas: IDs de ventas
            // Datos: Totales individuales
      'Ventas de la semana' // Título
    );
    createChart(
      'ventasMes',       // ID del canvas
      'bar',
      ventaMes,             // Tipo de gráfico: barras
      ventasMess,          // Etiquetas: IDs de ventas
            // Datos: Totales individuales
      'Ventas del Mes' // Título
    );
    createChart(
      'ventasAnio',
      'scatter', // Tipo de gráfico: línea
      ventaAnio, // Etiquetas (fechas)
      ventasAnio, // Datos (totales)
      'Venta Anual' // Título
    );

    createChart(
      'ventasProductos',
      'line', // Tipo de gráfico: línea
       
       productosNombre,
        ventaTotales,
      'Ventas de productos' // Título
    );
    // Graficar Ventas Mensual
    createChart1(
      'ventasTop',
      'bar', // Tipo de gráfico: barra
      productoTop,
      nombresProductos,  
      'Productos más vendidos' // Título
    );
    // Graficar Ventas por año
    

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
fetch('http://162.214.153.239:5000/suma_total_ventas')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentas').innerText = '$ ' + data.suma_total;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentas').innerText = 'Error al cargar el total.';
});

fetch('http://162.214.153.239:5000/suma_total_ventas')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentasSemana').innerText = '$ ' + data.suma_total * 5;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentasSemana').innerText = 'Error al cargar el total.';
});
fetch('http://162.214.153.239:5000/suma_total_ventas')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentasMes').innerText = '$ ' + data.suma_total * 32;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentasMes').innerText = 'Error al cargar el total.';
});
fetch('http://162.214.153.239:5000/suma_total_ventas')
.then(response => response.json())
.then(data => {
    // Obtenemos el total de ventas de la respuesta y lo mostramos en la tarjeta
    document.getElementById('totalVentasAnio').innerText = '$ ' + data.suma_total * 370;
})
.catch(error => {
    console.error('Error al obtener el total de ventas:', error);
    document.getElementById('totalVentasAnio').innerText = 'Error al cargar el total.';
});

// imprimir 

function printChart() {
  const canvas = document.getElementById('ventasDia');
  const canvas1 = document.getElementById('ventasSemana');
  const canvas2 = document.getElementById('ventasMes');
  const canvas3 = document.getElementById('ventasAnio');
  const canvas4 = document.getElementById('ventasTop');
  // Obtener el contenido del canvas como imagen
  const dataURL = canvas.toDataURL();
  const dataURL1 = canvas1.toDataURL();
  const dataURL2 = canvas2.toDataURL();
  const dataURL3 = canvas3.toDataURL();
  const dataURL4 = canvas4.toDataURL();
  

  // Crear una nueva ventana para imprimir
  const printWindow = window.open('_', '_');
  printWindow.document.write('<h3>Reporte de ventas</h3>'); // Título opcional
  printWindow.document.write(`<img src="${dataURL}" style="width: 100%; max-width: 600px;">`);
  printWindow.document.write(`<img src="${dataURL1}" style="width: 100%; max-width: 600px;">`); 
  printWindow.document.write(`<img src="${dataURL2}" style="width: 100%; max-width: 600px;">`);  // Insertar la imagen
  printWindow.document.write(`<img src="${dataURL3}" style="width: 100%; max-width: 600px;">`); 
  printWindow.document.write(`<img src="${dataURL4}" style="width: 100%; max-width: 600px;">`); 
  printWindow.document.write('</body></html>');

  // Cerrar el flujo de escritura e imprimir
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500); // Esperar un poco para asegurarse de que todo se cargue
};

function printDay (){
  const grafica = document.getElementById('ventasDia');
  const dataDia = grafica.toDataURL();
  const printWindow = window.open('_', '_');
  printWindow.document.write('<h2>REPORTE DE VENTAS POR DÍA</h2>');
  printWindow.document.write(`<img src="${dataDia}" style="width: 100%; max-width: 600px;">`);
  printWindow.document.write('</body></html>');
   // Cerrar el flujo de escritura e imprimir
   printWindow.document.close();
   printWindow.focus();
   setTimeout(() => {
     printWindow.print();
     printWindow.close();
   }, 500); // Esperar un poco para asegurarse de que todo se cargue
};

function printWeek (){
  const grafica = document.getElementById('ventasSemana');
  const dataDia = grafica.toDataURL();
  const printWindow = window.open('_', '_');
  printWindow.document.write('<h2>REPORTE DE VENTAS POR SEMANA</h2>');
  printWindow.document.write(`<img src="${dataDia}" style="width: 100%; max-width: 600px;">`);
  printWindow.document.write('</body></html>');
   // Cerrar el flujo de escritura e imprimir
   printWindow.document.close();
   printWindow.focus();
   setTimeout(() => {
     printWindow.print();
     printWindow.close();
   }, 500); // Esperar un poco para asegurarse de que todo se cargue
};
function printMonth (){
  const grafica = document.getElementById('ventasMes');
  const dataDia = grafica.toDataURL();
  const printWindow = window.open('_', '_');
  printWindow.document.write('<h2>REPORTE DE VENTAS POR MES</h2>');
  printWindow.document.write(`<img src="${dataDia}" style="width: 100%; max-width: 600px;">`);
  printWindow.document.write('</body></html>');
   // Cerrar el flujo de escritura e imprimir
   printWindow.document.close();
   printWindow.focus();
   setTimeout(() => {
     printWindow.print();
     printWindow.close();
   }, 500); // Esperar un poco para asegurarse de que todo se cargue
};
function printYear(){
  const grafica = document.getElementById('ventasAnio');
  const dataDia = grafica.toDataURL();
  const printWindow = window.open('_', '_');
  printWindow.document.write('<h2>REPORTE DE VENTAS POR AÑO</h2>');
  printWindow.document.write(`<img src="${dataDia}" style="width: 100%; max-width: 600px;">`);
  printWindow.document.write('</body></html>');
   // Cerrar el flujo de escritura e imprimir
   printWindow.document.close();
   printWindow.focus();
   setTimeout(() => {
     printWindow.print();
     printWindow.close();
   }, 500); // Esperar un poco para asegurarse de que todo se cargue
};
