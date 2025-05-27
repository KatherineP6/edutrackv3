document.addEventListener('DOMContentLoaded', () => {
  const tablaCuerpo = document.querySelector('#teachersSectionTable tbody');
  const modalDocente = document.getElementById('modalDocenteContainer');
  const modalTitle = document.getElementById('modalDocenteTitle');
  const formDocente = document.getElementById('formDocente');
  const btnNuevoDocente = document.getElementById('createDocenteBtn');
  const btnCerrarModal = document.getElementById('modalDocenteCloseBtn');
  const btnCancelarModal = document.getElementById('cancelDocenteBtn');

  const deleteModal = document.getElementById('deleteDocenteModal');
  const btnCerrarDeleteModal = document.getElementById('deleteDocenteCloseBtn');
  const btnCancelarDelete = document.getElementById('cancelDeleteDocenteBtn');
  const btnConfirmarDelete = document.getElementById('confirmDeleteDocenteBtn');

  let docenteEditandoId = null;
  let docenteEliminandoId = null;

  const selectCursos = formDocente.querySelector('#cursosAsignados');
  const passwordField = formDocente.querySelector('#passwordDoc');

  async function cargarCursos() {
    try {
      const response = await fetch('/api/cursos', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar cursos');
      const cursos = await response.json();
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
    modalDocente.classList.remove('hidden');
  }

  function cerrarModal() {
    modalDocente.classList.add('hidden');
    formDocente.reset();
    docenteEditandoId = null;
  }

  function abrirDeleteModal() {
    deleteModal.classList.remove('hidden');
  }

  function cerrarDeleteModal() {
    deleteModal.classList.add('hidden');
    docenteEliminandoId = null;
  }

  function agregarFila(docente) {
    const fila = document.createElement('tr');
    fila.dataset.id = docente._id;

    // cursosAsignados is now array of objects {_id, nombre}
    const cursosTexto = Array.isArray(docente.cursosAsignados)
      ? docente.cursosAsignados.map(curso => curso.nombre).join(', ')
      : '';

    fila.innerHTML = `
      <td>${docente.nombre}</td>
      <td>${docente.apellido || ''}</td>
      <td>${docente.correo}</td>
      <td>${docente.edad || ''}</td>
      <td>${docente.telefono || ''}</td>
      <td>${docente.estado}</td>
      <td>${docente.gradoAcademico || ''}</td>
      <td>${cursosTexto}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-editar" title="Editar" style="margin-right: 5px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 3L13 4.793 14.793 3 13 1.207 11.207 3zM12 5.207L10.793 4 3 11.793V13h1.207L12 5.207z"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-danger btn-borrar" title="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </td>
    `;

    fila.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditar(docente));
    fila.querySelector('.btn-borrar').addEventListener('click', () => abrirModalEliminar(docente._id));

    tablaCuerpo.appendChild(fila);
  }

  async function cargarDocentes() {
    try {
      const response = await fetch('/api/docentes', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar docentes');
      const data = await response.json();
      tablaCuerpo.innerHTML = '';
      data.forEach(docente => agregarFila(docente));
    } catch (error) {
      alert(error.message);
    }
  }

  btnNuevoDocente.addEventListener('click', () => {
    docenteEditandoId = null;
    modalTitle.textContent = 'Nuevo Docente';
    formDocente.reset();
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

  formDocente.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formDocente);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      nombre: data.nombreDoc,
      apellido: data.apellidoDoc,
      correo: data.correoDoc,
      edad: data.edadDoc,
      telefono: data.telefonoDoc,
      gradoAcademico: data.gradoAcademico,
      estado: data.estado === 'true' || data.estado === true || data.estado === 'on' ? true : false,
      cursosAsignados: Array.from(selectCursos.selectedOptions).map(opt => opt.value)
    };

    if (data.passwordDoc && data.passwordDoc.trim() !== '') {
      payload.password = data.passwordDoc;
    }

    try {
      let response;
      if (docenteEditandoId) {
        response = await fetch(`/api/docentes/${docenteEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
      } else {
        response = await fetch('/api/docentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
      }
      if (!response.ok) throw new Error('Error al guardar docente');
      // Reemplazar alert por toast
      showToast(docenteEditandoId ? 'Docente actualizado exitosamente' : 'Docente creado exitosamente');
      cerrarModal();
      cargarDocentes();
    } catch (error) {
      // Reemplazar alert por toast
      showToast(error.message || 'Error al guardar docente');
    }
  });

  function abrirModalEditar(docente) {
    docenteEditandoId = docente._id;
    modalTitle.textContent = 'Editar Docente';
    formDocente.nombreDoc.value = docente.nombre || '';
    formDocente.apellidoDoc.value = docente.apellido || '';
    formDocente.correoDoc.value = docente.correo || '';
    formDocente.passwordDoc.value = '';
    formDocente.edadDoc.value = docente.edad || '';
    formDocente.telefonoDoc.value = docente.telefono || '';
    formDocente.gradoAcademico.value = docente.gradoAcademico || '';

    // Limpiar selección previa
    for (let i = 0; i < selectCursos.options.length; i++) {
      selectCursos.options[i].selected = false;
    }
    // Seleccionar cursos asignados
    if (Array.isArray(docente.cursosAsignados)) {
     // docente.cursosAsignados.forEach(cursoId => {
      for (let j = 0; j < docente.cursosAsignados.length; j++) {
        for (let i = 0; i < selectCursos.options.length; i++) {
          // Convert both to string for safe comparison
          if (selectCursos.options[i].value.toString() === docente.cursosAsignados[j]._id.toString()) {
            selectCursos.options[i].selected = true;
            break;
          }
        }
      }//});
    }

    passwordField.required = false;
    passwordField.parentElement.style.display = 'none';

    abrirModal();
  }

  function abrirModalEliminar(id) {
    docenteEliminandoId = id;
    abrirDeleteModal();
  }

  btnCerrarDeleteModal.addEventListener('click', cerrarDeleteModal);
  btnCancelarDelete.addEventListener('click', cerrarDeleteModal);

  btnConfirmarDelete.addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/docentes/${docenteEliminandoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar docente');
      alert('Docente eliminado exitosamente');
      cerrarDeleteModal();
      cargarDocentes();
    } catch (error) {
      alert(error.message);
    }
  });

  cargarCursos();
  cargarDocentes();
});
/**
 * JavaScript for Docente menu and interactions
 * 
 * This script handles sidebar toggle, menu active state, and other UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const logoutButton = document.getElementById('logoutButton');

  // Toggle sidebar visibility
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('hidden');
  });

  // Close sidebar
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // Close sidebar when clicking outside
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.add('hidden');
  });

  // Logout button click handler (optional)
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.location.href = '/logout';
    });
  }
});
