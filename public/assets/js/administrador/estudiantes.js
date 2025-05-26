let students = [];

async function fetchStudents() {
  try {
    const response = await fetch('/api/public/estudiantes');
    if (!response.ok) throw new Error('Error fetching students');
    students = await response.json();
    renderAllSectionTables();
  } catch (error) {
    console.error(error);
    alert('Error al cargar los estudiantes');
  }
}

// Student section handlers
const studentsColumns = [
  { header: 'Nombre', accessor: 'Nombre' },
  { header: 'Apellidos', accessor: 'Apellidos' },
  { header: 'correo', accessor: 'correo' },
  { header: 'Salon', accessor: 'Salon' }
];

async function createStudent() {
  openStudentDialog('create');
}

async function editStudent(id) {
  const student = students.find(s => (s._id || s.id) === id);
  if (student) {
    openStudentDialog('edit', student);
  }
}

async function deleteStudent(id) {
  if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) return;
  try {
    const response = await fetch(`/api/estudiantes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error eliminando estudiante');
    students = students.filter(s => (s._id || s.id) !== id);
    renderAllSectionTables();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar el estudiante');
  }
}

// Render all section tables
function renderAllSectionTables() {
  renderSectionTable(students, '#studentsSectionTable tbody', studentsColumns, {
    edit: editStudent,
    delete: deleteStudent
  });
}

// Utility to render tables for classrooms, students, teachers
function renderSectionTable(data, tableBodySelector, columns, actionsHandlers) {
  const tbody = document.querySelector(tableBodySelector);
  tbody.innerHTML = '';

  if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = columns.length + 1; // +1 for actions column
    td.textContent = 'No hay datos disponibles';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  data.forEach(item => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      let value = item[col.accessor];
      if (col.accessor.includes('.')) {
        const keys = col.accessor.split('.');
        value = keys.reduce((obj, key) => (obj ? obj[key] : ''), item);
      }
      td.textContent = value || '';
      tr.appendChild(td);
    });

    const actionsTd = document.createElement('td');
    actionsTd.style.display = 'flex';
    actionsTd.style.gap = '0.5rem';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => actionsHandlers.edit(item._id || item.id));
    actionsTd.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => actionsHandlers.delete(item._id || item.id));
    actionsTd.appendChild(deleteBtn);

    tr.appendChild(actionsTd);
    tbody.appendChild(tr);
  });
}
