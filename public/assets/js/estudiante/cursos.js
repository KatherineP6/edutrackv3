const cursosContainer = document.getElementById('cursosContainer');

async function fetchAndRenderCursos() {
  try {
    const response = await fetch('/estudiante/cursos', { credentials: 'include' });
    if (!response.ok) throw new Error('Error fetching cursos');
    const cursos = await response.json();
    renderCursos(cursos);
  } catch (error) {
    console.error('Error fetching cursos:', error);
    alert('Error al cargar los cursos');
  }
}

function renderCursos(cursos) {
  cursosContainer.innerHTML = '';
  if (cursos.length === 0) {
    cursosContainer.innerHTML = '<p>No estás inscrito en ningún curso.</p>';
    return;
  }
  cursos.forEach(curso => {
    const div = document.createElement('div');
    div.className = 'curso-card';
    div.innerHTML = '<h3>' + (curso.Nombre || '') + '</h3>' +
                    '<p><strong>Bloque:</strong> ' + (curso.bloque || '') + '</p>' +
                    '<p><strong>Ubicación:</strong> ' + (curso.ubicacion || '') + '</p>' +
                    '<p><strong>Docente:</strong> ' + (curso.docente ? curso.docente.Nombre + ' ' + curso.docente.Apellido : '') + '</p>';
    cursosContainer.appendChild(div);
  });
}

// Initialize cursos on DOMContentLoaded or call fetchAndRenderCursos() as needed
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderCursos();
});
