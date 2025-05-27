document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalContainer');
  const btnNuevaCarrera = document.getElementById('createCarreraBtn');
  const btnCerrarModal = document.getElementById('modalCloseBtn');
  const btnCancelar = document.getElementById('CancelBtn');
  const formCarrera = document.getElementById('formCarrera');
  const tablaCuerpo = document.querySelector('#classroomsSectionTable tbody');

  // Delete confirmation modal elements
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteModalCloseBtn = document.getElementById('deleteModalCloseBtn');
  const deleteCancelBtn = document.getElementById('deleteCancelBtn');
  const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

  let editandoFila = null;
  let editandoCarreraId = null;
  let carreraIdToDelete = null;

  function limpiarErrores() {
    formCarrera.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    formCarrera.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  }

  function abrirModal() {
    modal.classList.remove('hidden');
    formCarrera.reset();
    limpiarErrores();
    editandoFila = null;
    editandoCarreraId = null;
    document.getElementById('modalTitle').textContent = 'Nueva Carrera';
  }

  function cerrarModal() {
    modal.classList.add('hidden');
    formCarrera.reset();
    limpiarErrores();
    editandoFila = null;
    editandoCarreraId = null;
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
    if (input.type === 'number' && (isNaN(input.value) || input.value < 1)) {
      mostrarError(input, 'Número inválido');
      return false;
    }
    return true;
  }

  function validarFormulario() {
    limpiarErrores();
    let valido = true;
    formCarrera.querySelectorAll('input, textarea').forEach(input => {
      if (!validarCampo(input)) valido = false;
    });
    return valido;
  }

  async function crearCarrera(data) {
    try {
      const response = await fetch('/api/carreras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear carrera');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function actualizarCarrera(id, data) {
    try {
      const response = await fetch(`/api/carreras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar carrera');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function eliminarCarrera(id) {
    try {
      const response = await fetch(`/api/carreras/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar carrera');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  function agregarFila(carrera) {
    const fila = document.createElement('tr');
    fila.dataset.id = carrera._id;
    fila.innerHTML = `
      <td>${carrera.nombre}</td>
      <td>${carrera.descripcion || ''}</td>
      <td>${carrera.duracionSem}</td>
      <td>${carrera.precio.toFixed(2)}</td>
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
    tablaCuerpo.appendChild(fila);
  }

  formCarrera.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nombre = formCarrera.nombre.value;
    const descripcion = formCarrera.descripcion.value;
    const duracionSem = parseInt(formCarrera.duracionSem.value, 10);
    const precio = parseFloat(formCarrera.precio.value);

    const carreraData = {
      nombre,
      descripcion,
      duracionSem,
      precio
    };

    try {
      if (editandoCarreraId) {
        const result = await actualizarCarrera(editandoCarreraId, carreraData);
        if (editandoFila) {
          editandoFila.cells[0].textContent = nombre;
          editandoFila.cells[1].textContent = descripcion;
          editandoFila.cells[2].textContent = duracionSem;
          editandoFila.cells[3].textContent = precio.toFixed(2);
        }
      } else {
        const result = await crearCarrera(carreraData);
        agregarFila(result.carrera || result);
      }
      cerrarModal();
    } catch (error) {
      // Error already handled
    }
  });

  // Manejar eventos de edición y eliminación con modal de confirmación
  tablaCuerpo.addEventListener('click', e => {
    if (e.target.classList.contains('btn-borrar')) {
      carreraIdToDelete = e.target.closest('tr').dataset.id;
      deleteConfirmModal.classList.remove('hidden');
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formCarrera.nombre.value = fila.cells[0].textContent;
      formCarrera.descripcion.value = fila.cells[1].textContent;
      formCarrera.duracionSem.value = fila.cells[2].textContent;
      formCarrera.precio.value = fila.cells[3].textContent;
      editandoFila = fila;
      editandoCarreraId = fila.dataset.id || null;
      document.getElementById('modalTitle').textContent = 'Editar Carrera';
      modal.classList.remove('hidden');
    }
  });

  // Cerrar modal de confirmación de eliminación
  function closeDeleteModal() {
    deleteConfirmModal.classList.add('hidden');
    carreraIdToDelete = null;
  }

  deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
  deleteCancelBtn.addEventListener('click', closeDeleteModal);

  // Confirmar eliminación
  deleteConfirmBtn.addEventListener('click', async () => {
    if (!carreraIdToDelete) return;

    try {
      await eliminarCarrera(carreraIdToDelete);
      const fila = tablaCuerpo.querySelector(`tr[data-id="${carreraIdToDelete}"]`);
      if (fila) fila.remove();
      closeDeleteModal();
    } catch (error) {
      closeDeleteModal();
    }
  });

  formCarrera.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
  });

  btnNuevaCarrera.addEventListener('click', abrirModal);
  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

  // Load initial data
  async function cargarCarreras() {
    try {
      const response = await fetch('/api/carreras', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar carreras');
      const data = await response.json();
      data.forEach(carrera => agregarFila(carrera));
    } catch (error) {
      alert(error.message);
    }
  }

  cargarCarreras();
});
