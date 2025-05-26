let teachers = [];

async function fetchTeachers() {
  try {
    const response = await fetch('/api/docentes');
    if (!response.ok) throw new Error('Error fetching teachers');
    teachers = await response.json();
    renderAllSectionTables();
  } catch (error) {
    console.error(error);
    alert('Error al cargar los docentes');
  }
}

// Teacher section handlers
const teachersColumns = [
  { header: 'Nombre', accessor: 'Nombre' },
  { header: 'Apellido', accessor: 'Apellido' },
  { header: 'correo', accessor: 'correo' },
  { header: 'GradoAcademico', accessor: 'GradoAcademico' }
];

async function createTeacher() {
  openTeacherDialog('create');
}

async function editTeacher(id) {
  const teacher = teachers.find(t => (t._id || t.id) === id);
  if (teacher) {
    openTeacherDialog('edit', teacher);
  }
}

async function deleteTeacher(id) {
  if (!confirm('¿Está seguro de que desea eliminar este docente?')) return;
  try {
    const response = await fetch(`/api/docentes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error eliminando docente');
    teachers = teachers.filter(t => (t._id || t.id) !== id);
    renderAllSectionTables();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar el docente');
  }
}

// Render all section tables
function renderAllSectionTables() {
  renderSectionTable(teachers, '#teachersSectionTable tbody', teachersColumns, {
    edit: editTeacher,
    delete: deleteTeacher
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
