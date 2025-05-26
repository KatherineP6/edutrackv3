const modalContainer = document.getElementById('modalContainer');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

let currentDialogMode = null;
let currentDialogData = null;
let currentDialogType = null;
let currentDialogConfirmCallback = null;

function openModal(title, contentHtml, confirmCallback, confirmText = 'Confirmar') {
  modalTitle.textContent = title;
  modalBody.innerHTML = contentHtml;
  modalConfirmBtn.textContent = confirmText;
  modalConfirmBtn.disabled = false;
  modalConfirmBtn.style.display = 'inline-block';
  modalCancelBtn.style.display = 'inline-block';
  modalContainer.classList.remove('hidden');
  currentDialogConfirmCallback = confirmCallback;
}

function closeModal() {
  modalContainer.classList.add('hidden');
  currentDialogConfirmCallback = null;
  currentDialogData = null;
  currentDialogMode = null;
  currentDialogType = null;
}

modalCloseBtn.addEventListener('click', closeModal);
modalCancelBtn.addEventListener('click', closeModal);
modalConfirmBtn.addEventListener('click', () => {
  if (currentDialogConfirmCallback) {
    currentDialogConfirmCallback();
  }
});

function getClassroomDialogHtml(data = {}) {
  const teacherOptions = window.teachers ? window.teachers.map(t => {
    const selected = data.docente && (data.docente._id || data.docente.id) === (t._id || t.id) ? 'selected' : '';
    return `<option value="${t._id || t.id}" ${selected}>${t.Nombre} ${t.Apellido}</option>`;
  }).join('') : '';
  const blockOptions = ['Bloque A', 'Bloque B', 'Bloque C', 'Bloque D', 'Bloque E'].map(b => {
    const selected = data.bloque === b ? 'selected' : '';
    return `<option value="${b}" ${selected}>${b}</option>`;
  }).join('');
  return `
    <form id="classroomForm">
      <label>Bloque:<br><select name="bloque" required>
        <option value="">Seleccione un bloque</option>
        ${blockOptions}
      </select></label><br>
      <label>Ubicación:<br><input type="text" name="ubicacion" value="${data.ubicacion || ''}" required></label><br>
      <label>Capacidad:<br><input type="number" name="capacidad" value="${data.capacidad || ''}" required min="15"></label><br>
      <label>Docente:<br><select name="docente" required>
        <option value="">Seleccione un docente</option>
        ${teacherOptions}
      </select></label><br>
    </form>
  `;
}

function getStudentDialogHtml(data = {}) {
  const teacherOptions = window.teachers ? window.teachers.map(t => {
    const selected = data.docente === (t._id || t.id) ? 'selected' : '';
    return `<option value="${t._id || t.id}" ${selected}>${t.Nombre} ${t.Apellido}</option>`;
  }).join('') : '';
  const classroomOptions = window.classrooms ? [{_id: '', Nombre: 'Ninguno'}].concat(window.classrooms).map(c => {
    const selected = data.Salon === (c._id || c.id) ? 'selected' : '';
    return `<option value="${c._id || c.id}" ${selected}>${c.Nombre || c}</option>`;
  }).join('') : '';
  return `
    <form id="studentForm">
      <div style="display:flex; gap:1rem;">
        <label style="flex:1;">Correo:<br><input type="email" name="correo" value="${data.correo || ''}" required></label>
        <label style="flex:1;">Contraseña:<br><input type="password" name="password" value="${data.password || ''}" required></label>
      </div>
      <label>Nombre:<br><input type="text" name="Nombre" value="${data.Nombre || ''}" required></label><br>
      <label>Apellidos:<br><input type="text" name="Apellidos" value="${data.Apellidos || ''}" required></label><br>
      <label>Salón:<br><select name="Salon">
        ${classroomOptions}
      </select></label><br>
    </form>
  `;
}

function getTeacherDialogHtml(data = {}, mode = 'edit') {
  return `
    <form id="teacherForm">
      <label>Nombre:<br><input type="text" name="Nombre" value="${data.Nombre || ''}" required></label><br>
      <label>Apellido:<br><input type="text" name="Apellido" value="${data.Apellido || ''}" required></label><br>
      <label>Correo:<br><input type="email" name="correo" value="${data.correo || ''}" required></label><br>
      <label>Grado Académico:<br><input type="text" name="GradoAcademico" value="${data.GradoAcademico || ''}" required></label><br>
      ${mode === 'create' ? `<label>Contraseña:<br><input type="password" name="password" required></label><br>` : ''}
    </form>
  `;
}
