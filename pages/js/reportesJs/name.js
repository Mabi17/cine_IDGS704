
  const dataConfig = [
    {
      id: 'dailyChart',
      title: 'Ventas Diarias',
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      data: [100, 200, 150, 250, 300],
      bgColor: 'rgba(54, 162, 235, 0.5)',
    },
    {
      id: 'weeklyChart',
      title: 'Ventas Semanales',
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [700, 800, 600, 900],
      bgColor: '#b6465f',
    },
    {
      id: 'monthlyChart',
      title: 'Ventas Mensuales',
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      data: [3000, 4000, 3500, 4500, 5000],
      bgColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      id: 'topChart',
      title: 'Productos Más Vendidos',
      labels: ['Palomitas', 'Bebidas', 'Entradas', 'Snacks'],
      data: [1500, 1200, 1800, 900],
      bgColor: ['#01055f', 'rgba(54, 162, 235, 0.5)', '#b5e48c', '#ffb800'],
    },
  ];

  dataConfig.forEach(({ id, title, labels, data, bgColor }) => {
    const ctx = document.getElementById(id).getContext('2d');
    new Chart(ctx, {
      type: id === 'topChart' ? 'pie' : 'bar', // Pie chart for topChart
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor: bgColor,
            borderColor: bgColor,
            borderWidth: 1,
          },
        ],
      },
      options: { responsive: true },
    });
  });

