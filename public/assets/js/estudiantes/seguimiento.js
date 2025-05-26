const rendimientoChartCtx = document.getElementById('rendimientoChart').getContext('2d');
const asistenciaChartCtx = document.getElementById('asistenciaChart').getContext('2d');
let rendimientoChart;
let asistenciaChart;

async function fetchAndRenderSeguimiento() {
  try {
    const response = await fetch('/estudiante/seguimiento', { credentials: 'include' });
    if (!response.ok) throw new Error('Error fetching seguimiento');
    const data = await response.json();
    renderSeguimiento(data);
  } catch (error) {
    console.error('Error fetching seguimiento:', error);
    alert('Error al cargar el seguimiento académico');
  }
}

function renderSeguimiento(data) {
  if (rendimientoChart) {
    rendimientoChart.destroy();
  }
  if (asistenciaChart) {
    asistenciaChart.destroy();
  }
  rendimientoChart = new Chart(rendimientoChartCtx, {
    type: 'pie',
    data: {
      labels: data.rendimiento.labels,
      datasets: [{
        data: data.rendimiento.data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false
    }
  });

  asistenciaChart = new Chart(asistenciaChartCtx, {
    type: 'pie',
    data: {
      labels: data.asistencia.labels,
      datasets: [{
        data: data.asistencia.data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ]
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false
    }
  });
}

// Initialize seguimiento on DOMContentLoaded or call fetchAndRenderSeguimiento() as needed
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderSeguimiento();
});
