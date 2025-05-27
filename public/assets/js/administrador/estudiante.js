document.addEventListener('DOMContentLoaded', () => {
  const tablaCuerpo = document.querySelector('#studentsSectionTable tbody');
  const modalEstudiante = document.getElementById('modalEstudianteContainer');
  const modalTitle = document.getElementById('modalEstudianteTitle');
  const formEstudiante = document.getElementById('formEstudiante');
  const btnNuevoEstudiante = document.getElementById('createEstudianteBtn');
  const btnCerrarModal = document.getElementById('modalEstudianteCloseBtn');
  const btnCancelarModal = document.getElementById('cancelEstudianteBtn');

  const deleteModal = document.getElementById('deleteEstudianteModal');
  const btnCerrarDeleteModal = document.getElementById('deleteEstudianteCloseBtn');
  const btnCancelarDelete = document.getElementById('cancelDeleteEstudianteBtn');
  const btnConfirmarDelete = document.getElementById('confirmDeleteEstudianteBtn');

  let estudianteEditandoId = null;
  let estudianteEliminandoId = null;

  const selectCursos = formEstudiante.querySelector('#cursosEst');
  const passwordField = formEstudiante.querySelector('#passwordEst');

  let cursosList = [];
  const carreraSelect = formEstudiante.querySelector('#carreraEst');
  let carrerasList = [];

  async function cargarCarreras() {
    try {
      const response = await fetch('/api/carreras', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar carreras');
      const carreras = await response.json();
      carrerasList = carreras;
      populateCarreraSelect(carreras);
    } catch (error) {
      alert(error.message);
    }
  }

  function populateCarreraSelect(carreras) {
    carreraSelect.innerHTML = '<option value="">Seleccione una carrera</option>';
    carreras.forEach(carrera => {
      const option = document.createElement('option');
      option.value = carrera._id;
      option.textContent = carrera.nombre;
      carreraSelect.appendChild(option);
    });
  }

  async function cargarCursos() {
    try {
      const response = await fetch('/api/cursos', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar cursos');
      const cursos = await response.json();
      cursosList = cursos;
      selectCursos.innerHTML = '';
      cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso._id;
        option.textContent = curso.nombre;
        selectCursos.appendChild(option);
      });
    } catch (error) {
      alert(error.message);
    }
  }

  function abrirModal() {
    modalEstudiante.classList.remove('hidden');
  }

  function cerrarModal() {
    modalEstudiante.classList.add('hidden');
    formEstudiante.reset();
    estudianteEditandoId = null;
  }

  function abrirDeleteModal() {
    deleteModal.classList.remove('hidden');
  }

  function cerrarDeleteModal() {
    deleteModal.classList.add('hidden');
    estudianteEliminandoId = null;
  }

  function agregarFila(estudiante) {
    const fila = document.createElement('tr');
    fila.dataset.id = estudiante._id;

    const cursosTexto = Array.isArray(estudiante.cursosEst)
      ? estudiante.cursosEst.map(curso => curso.nombre).join(', ')
      : '';

    fila.innerHTML = `
      <td>${estudiante.nombre}</td>
      <td>${estudiante.apellido || ''}</td>
      <td>${estudiante.correo}</td>
      <td>${estudiante.edad || ''}</td>
      <td>${estudiante.direccion || ''}</td>
      <td>${estudiante.nombreCarrera || ''}</td>
      <td>${cursosTexto}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;

    fila.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditar(estudiante));
    fila.querySelector('.btn-borrar').addEventListener('click', () => abrirModalEliminar(estudiante._id));

    tablaCuerpo.appendChild(fila);
  }

  async function cargarEstudiantes() {
    try {
      const response = await fetch('/api/estudiantes', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar estudiantes');
      const data = await response.json();
      tablaCuerpo.innerHTML = '';
      data.forEach(estudiante => agregarFila(estudiante));
    } catch (error) {
      alert(error.message);
    }
  }

  btnNuevoEstudiante.addEventListener('click', () => {
    estudianteEditandoId = null;
    modalTitle.textContent = 'Nuevo Estudiante';
    formEstudiante.reset();
    passwordField.required = true;
    passwordField.parentElement.style.display = 'block';
    abrirModal();
  });

  // Toast notification container
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  toastContainer.style.position = 'fixed';
  toastContainer.style.top = '1rem';
  toastContainer.style.right = '1rem';
  toastContainer.style.zIndex = '9999';
  document.body.appendChild(toastContainer);

  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.background = '#4BB543';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.marginTop = '10px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    toast.style.opacity = '0.9';
    toast.style.transition = 'opacity 0.5s ease';

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 500);
    }, duration);
  }

  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelarModal.addEventListener('click', cerrarModal);

  formEstudiante.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación de campos requeridos
    const nombre = formEstudiante.nombreEst.value.trim();
    const apellido = formEstudiante.apellidoEst.value.trim();
    const correo = formEstudiante.correoEst.value.trim();
    const password = formEstudiante.passwordEst.value.trim();

    if (!nombre || !apellido || !correo || (!estudianteEditandoId && !password)) {
      showToast('Nombre, apellidos, correo y password son requeridos.');
      return;
    }

    const formData = new FormData(formEstudiante);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      nombre: data.nombreEst,
      apellido: data.apellidoEst,
      correo: data.correoEst,
      edad: data.edadEst,
      direccion: data.direccionEst,
      password: data.passwordEst && data.passwordEst.trim() !== '' ? data.passwordEst : undefined,
      carreraId: data.carreraEst,
      cursosEst: Array.from(selectCursos.selectedOptions).map(opt => opt.value)
    };

    try {
      let response;
      if (estudianteEditandoId) {
        response = await fetch(`/api/estudiantes/${estudianteEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
      } else {
        response = await fetch('/api/estudiantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
      }
      if (!response.ok) throw new Error('Error al guardar estudiante');
      showToast(estudianteEditandoId ? 'Estudiante actualizado exitosamente' : 'Estudiante creado exitosamente');
      cerrarModal();
      cargarEstudiantes();
    } catch (error) {
      showToast(error.message || 'Error al guardar estudiante');
    }
  });

  function abrirModalEditar(estudiante) {
    estudianteEditandoId = estudiante._id;
    modalTitle.textContent = 'Editar Estudiante';
    formEstudiante.nombreEst.value = estudiante.nombre || '';
    formEstudiante.apellidoEst.value = estudiante.apellido || '';
    formEstudiante.correoEst.value = estudiante.correo || '';
    formEstudiante.passwordEst.value = '';
    formEstudiante.edadEst.value = estudiante.edad || '';
    formEstudiante.direccionEst.value = estudiante.direccion || '';
    formEstudiante.carreraEst.value = estudiante.carreraId || '';

    // Limpiar selección previa
    for (let i = 0; i < selectCursos.options.length; i++) {
      selectCursos.options[i].selected = false;
    }
    // Seleccionar cursos asignados
    if (Array.isArray(estudiante.cursosEst)) {
      for (let j = 0; j < estudiante.cursosEst.length; j++) {
        for (let i = 0; i < selectCursos.options.length; i++) {
          if (selectCursos.options[i].value.toString() === estudiante.cursosEst[j]._id.toString() ||
              selectCursos.options[i].value.toString() === estudiante.cursosEst[j].toString()) {
            selectCursos.options[i].selected = true;
            break;
          }
        }
      }
    }

    passwordField.required = false;
    passwordField.parentElement.style.display = 'none';

    abrirModal();
  }

  function abrirModalEliminar(id) {
    estudianteEliminandoId = id;
    abrirDeleteModal();
  }

  btnCerrarDeleteModal.addEventListener('click', cerrarDeleteModal);
  btnCancelarDelete.addEventListener('click', cerrarDeleteModal);

  btnConfirmarDelete.addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/estudiantes/${estudianteEliminandoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar estudiante');
      alert('Estudiante eliminado exitosamente');
      cerrarDeleteModal();
      cargarEstudiantes();
    } catch (error) {
      alert(error.message);
    }
  });

  cargarCarreras();
  cargarCursos();
  cargarEstudiantes();
});
