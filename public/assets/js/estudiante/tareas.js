const tareasContainer = document.getElementById('tareasContainer');

async function fetchAndRenderTareas() {
  try {
    const response = await fetch('/estudiante/tareas', { credentials: 'include' });
    if (!response.ok) throw new Error('Error fetching tareas');
    const tareas = await response.json();
    renderTareas(tareas);
  } catch (error) {
    console.error('Error fetching tareas:', error);
    alert('Error al cargar las tareas');
  }
}

function renderTareas(tareas) {
  tareasContainer.innerHTML = '';
  if (tareas.length === 0) {
    tareasContainer.innerHTML = '<p>No tienes tareas asignadas.</p>';
    return;
  }
  tareas.forEach(tarea => {
    const div = document.createElement('div');
    div.className = 'tarea-card';
    div.innerHTML = '<h3>' + (tarea.titulo || '') + '</h3>' +
                    '<p>' + (tarea.descripcion || '') + '</p>' +
                    '<p><strong>Fecha de entrega:</strong> ' + (new Date(tarea.fechaEntrega).toLocaleDateString()) + '</p>';
    tareasContainer.appendChild(div);
  });
}

// Initialize tareas on DOMContentLoaded or call fetchAndRenderTareas() as needed
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderTareas();
});
