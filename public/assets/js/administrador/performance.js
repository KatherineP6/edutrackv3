export async function fetchPerformanceData() {
  try {
    const response = await fetch('/admin/api/top-carreras', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Error al obtener datos de carreras top');
    }
    const data = await response.json();
    renderPerformanceChart(data);
  } catch (error) {
    console.error('Error fetching performance data:', error);
  }
}

export function renderPerformanceChart(data) {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  const labels = data.map(item => item.nombreCarrera);
  const counts = data.map(item => item.numeroEstudiantes);

  if (window.performanceChartInstance) {
    window.performanceChartInstance.destroy();
  }

  window.performanceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Número de Estudiantes',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}
