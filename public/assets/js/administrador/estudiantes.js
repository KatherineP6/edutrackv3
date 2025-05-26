document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalContainer');
  const btnNuevoEstudiante = document.getElementById('createEstudianteBtn');
  const btnCerrarModal = document.getElementById('modalCloseBtn');
  const btnCancelar = document.getElementById('CancelBtn');
  const formEstudiante = document.getElementById('formEstudiante');
  const tablaCuerpo = document.querySelector('#studentsSectionTable tbody');

  
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteModalCloseBtn = document.getElementById('deleteModalCloseBtn');
  const deleteCancelBtn = document.getElementById('deleteCancelBtn');
  const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

  let editandoFila = null;
  let editandoEstudianteId = null;
  let estudianteIdToDelete = null;

  function limpiarErrores() {
    formEstudiante.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    formEstudiante.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  }

  function abrirModal() {
    modal.classList.remove('hidden');
    formEstudiante.reset();
    limpiarErrores();
    editandoFila = null;
    editandoEstudianteId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Estudiante';
  }

  function cerrarModal() {
    modal.classList.add('hidden');
    formEstudiante.reset();
    limpiarErrores();
    editandoFila = null;
    editandoEstudianteId = null;
  }

  function mostrarError(input, mensaje) {
    let errorElem = input.parentElement.querySelector('.error-message');
    if (!errorElem) {
      errorElem = document.createElement('small');
      errorElem.className = 'error-message';
      errorElem.style.color = 'red';
      input.parentElement.appendChild(errorElem);
    }
    errorElem.textContent = mensaje;
    input.classList.add('input-error');
  }

  function limpiarError(input) {
    const errorElem = input.parentElement.querySelector('.error-message');
    if (errorElem) errorElem.textContent = '';
    input.classList.remove('input-error');
  }

  function validarCampo(input) {
    limpiarError(input);
    if (!input.value.trim()) {
      mostrarError(input, 'Este campo es obligatorio');
      return false;
    }
    if (input.type === 'email' && !input.value.includes('@')) {
      mostrarError(input, 'Correo inválido');
      return false;
    }
    if (input.id === 'password' && editandoEstudianteId === null && input.value.length < 6) {
      mostrarError(input, 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  }

  function validarFormulario() {
    limpiarErrores();
    let valido = true;
    formEstudiante.querySelectorAll('input').forEach(input => {
      if (!validarCampo(input)) valido = false;
    });
    return valido;
  }

  async function crearEstudiante(data) {
    try {
      const response = await fetch('/api/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear estudiante');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function actualizarEstudiante(id, data) {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estudiante');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;estudianteIdToDelete
    }
  }

  async function eliminarEstudiante(id) {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar estudiante');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  function agregarFila(estudiante) {
    const fila = document.createElement('tr');
    fila.dataset.id = estudiante._id;
    fila.innerHTML = `
      <td>${estudiante.Nombre}</td>
      <td>${estudiante.Apellidos}</td>
      <td>${estudiante.correo}</td>
      <td>${estudiante.Edad}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;
    tablaCuerpo.appendChild(fila);
  }

  formEstudiante.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nombre = formEstudiante.nombreEst.value;
    const apellidos = formEstudiante.apellidoEst.value;
    const correo = formEstudiante.correoEst.value;
    const edad = formEstudiante.edadEst.value;
    //const password = formEstudiante.password.value;

    const estudianteData = {
      nombre,
      apellidos,
      correo,
      edad,
      //password: password || undefined
    };

    try {
      if (editandoEstudianteId) {
        const result = await actualizarEstudiante(editandoEstudianteId, estudianteData);
        if (editandoFila) {
          editandoFila.cells[0].textContent = nombre;
          editandoFila.cells[1].textContent = apellidos;
          editandoFila.cells[2].textContent = correo;
          editandoFila.cells[3].textContent = edad;
        }
      } else {
        const result = await crearEstudiante(estudianteData);
        agregarFila(result.estudiante || result);
      }
      cerrarModal();
    } catch (error) {
      // Error already handled
    }
  });

    tablaCuerpo.addEventListener('click', e => {
    if (e.target.classList.contains('btn-borrar')) {
      carreraIdToDelete = e.target.closest('tr').dataset.id;
      deleteConfirmModal.classList.remove('hidden');
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formEstudiante.nombreEst.value = fila.cells[0].textContent;
      formEstudiante.apellidoEst.value = fila.cells[1].textContent;
      formEstudiante.correoEst.value = fila.cells[2].textContent;
      formEstudiante.edadEst.value = fila.cells[3].textContent;
      //formEstudiante.password.value = '';
      editandoFila = fila;
      editandoEstudianteId = fila.dataset.id || null;
      document.getElementById('modalTitle').textContent = 'Editar Estudiante';
      modal.classList.remove('hidden');
    }
  });

 // Cerrar modal de confirmación de eliminación
  function closeDeleteModal() {
    deleteConfirmModal.classList.add('hidden');
    estudianteIdToDelete = null;
  }

  deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
  deleteCancelBtn.addEventListener('click', closeDeleteModal);

  // Confirmar eliminación
  deleteConfirmBtn.addEventListener('click', async () => {
    if (!estudianteIdToDelete) return;

    try {
      await eliminarEstudiante(estudianteIdToDelete);
      const fila = tablaCuerpo.querySelector(`tr[data-id="${estudianteIdToDelete}"]`);
      if (fila) fila.remove();
      closeDeleteModal();
    } catch (error) {
      closeDeleteModal();
    }
  });

  /*tablaCuerpo.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-borrar')) {
      const fila = e.target.closest('tr');
      const estudianteId = fila.dataset.id;
      if (estudianteId) {
        try {
          await eliminarEstudiante(estudianteId);
          fila.remove();
        } catch (error) {
          // Error already handled
        }
      } else {
        fila.remove();
      }
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formEstudiante.nombre.value = fila.cells[0].textContent;
      formEstudiante.apellidos.value = fila.cells[1].textContent;
      formEstudiante.email.value = fila.cells[2].textContent;
      formEstudiante.password.value = '';
      editandoFila = fila;
      editandoEstudianteId = fila.dataset.id || null;
      document.getElementById('modalTitle').textContent = 'Editar Estudiante';
      modal.classList.remove('hidden');
    }
  });*/

  formEstudiante.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
  });

  btnNuevoEstudiante.addEventListener('click', abrirModal);
  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

  // Load initial data
  async function cargarEstudiantes() {
    try {
      const response = await fetch('/api/estudiantes', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar estudiantes');
      const data = await response.json();
      data.forEach(estudiante => agregarFila(estudiante));
    } catch (error) {
      alert(error.message);
    }
  }


  cargarEstudiantes();
});
