const asistenciaTableBody = document.querySelector('#asistenciaTable tbody');

async function fetchAndRenderAsistencia() {
  try {
    const response = await fetch('/estudiante/asistencia', { credentials: 'include' });
    if (!response.ok) throw new Error('Error fetching asistencia');
    const asistencias = await response.json();
    renderAsistencia(asistencias);
  } catch (error) {
    console.error('Error fetching asistencia:', error);
    alert('Error al cargar la asistencia');
  }
}

function renderAsistencia(asistencias) {
  asistenciaTableBody.innerHTML = '';
  if (asistencias.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'No hay registros de asistencia.';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    asistenciaTableBody.appendChild(tr);
    return;
  }
  asistencias.forEach(asistencia => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + (new Date(asistencia.fecha).toLocaleDateString()) + '</td>' +
                   '<td>' + (asistencia.cursoNombre || 'Desconocido') + '</td>' +
                   '<td>' + (asistencia.estado || 'Desconocido') + '</td>';
    asistenciaTableBody.appendChild(tr);
  });
}

// Initialize asistencia on DOMContentLoaded or call fetchAndRenderAsistencia() as needed
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderAsistencia();
});
