document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalContainer');
  const btnNuevoDocente = document.getElementById('createDocenteBtn');
  const btnCerrarModal = document.getElementById('modalCloseBtn');
  const btnCancelar = document.getElementById('CancelBtn');
  const formDocente = document.getElementById('formDocente');
  const tablaCuerpo = document.querySelector('#docentesSectionTable tbody');

  let editandoFila = null;
  let editandoDocenteId = null;

  function limpiarErrores() {
    formDocente.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    formDocente.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  }

  function abrirModal() {
    modal.classList.remove('hidden');
    formDocente.reset();
    limpiarErrores();
    editandoFila = null;
    editandoDocenteId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Docente';
  }

  function cerrarModal() {
    modal.classList.add('hidden');
    formDocente.reset();
    limpiarErrores();
    editandoFila = null;
    editandoDocenteId = null;
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
    if (input.id === 'password' && editandoDocenteId === null && input.value.length < 6) {
      mostrarError(input, 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  }

  function validarFormulario() {
    limpiarErrores();
    let valido = true;
    formDocente.querySelectorAll('input').forEach(input => {
      if (!validarCampo(input)) valido = false;
    });
    return valido;
  }

  async function crearDocente(data) {
    try {
      const response = await fetch('/api/docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear docente');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function actualizarDocente(id, data) {
    try {
      const response = await fetch(`/api/docentes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar docente');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function eliminarDocente(id) {
    try {
      const response = await fetch(`/api/docentes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar docente');
      }
      return await response.json();
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  function agregarFila(docente) {
    const fila = document.createElement('tr');
    fila.dataset.id = docente._id;
    fila.innerHTML = `
      <td>${docente.nombre}</td>
      <td>${docente.apellido}</td>
      <td>${docente.email}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-borrar">Borrar</button>
      </td>
    `;
    tablaCuerpo.appendChild(fila);
  }

  formDocente.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nombre = formDocente.nombre.value;
    const apellido = formDocente.apellido.value;
    const email = formDocente.email.value;
    const password = formDocente.password.value;

    const docenteData = {
      nombre,
      apellido,
      email,
      password: password || undefined
    };

    try {
      if (editandoDocenteId) {
        const result = await actualizarDocente(editandoDocenteId, docenteData);
        if (editandoFila) {
          editandoFila.cells[0].textContent = nombre;
          editandoFila.cells[1].textContent = apellido;
          editandoFila.cells[2].textContent = email;
        }
      } else {
        const result = await crearDocente(docenteData);
        agregarFila(result.docente || result);
      }
      cerrarModal();
    } catch (error) {
      // Error already handled
    }
  });

  tablaCuerpo.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-borrar')) {
      const fila = e.target.closest('tr');
      const docenteId = fila.dataset.id;
      if (docenteId) {
        try {
          await eliminarDocente(docenteId);
          fila.remove();
        } catch (error) {
          // Error already handled
        }
      } else {
        fila.remove();
      }
    } else if (e.target.classList.contains('btn-editar')) {
      const fila = e.target.closest('tr');
      formDocente.nombre.value = fila.cells[0].textContent;
      formDocente.apellido.value = fila.cells[1].textContent;
      formDocente.email.value = fila.cells[2].textContent;
      formDocente.password.value = '';
      editandoFila = fila;
      editandoDocenteId = fila.dataset.id || null;
      document.getElementById('modalTitle').textContent = 'Editar Docente';
      modal.classList.remove('hidden');
    }
  });

  formDocente.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
  });

  btnNuevoDocente.addEventListener('click', abrirModal);
  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

  // Load initial data
  async function cargarDocentes() {
    try {
      const response = await fetch('/api/docentes', { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar docentes');
      const data = await response.json();
      data.forEach(docente => agregarFila(docente));
    } catch (error) {
      alert(error.message);
    }
  }

  cargarDocentes();
});
